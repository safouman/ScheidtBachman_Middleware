LOG_DIR = "../Middleware/Logs/"
UPLOAD_FOLDER = '../Uploads'
CONFIG_FILE='../Middleware/'
from werkzeug.serving import run_simple
from flask.ext.cors import CORS, cross_origin
from flask_webpack import Webpack
from flask import send_from_directory
from flask import Flask, render_template, jsonify, abort, request, g, url_for
import json
import os
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
import api.api
from werkzeug.utils import secure_filename

webpack = Webpack()

def create_app():
    """
    Create a Flask application using the app factory pattern.
    :return: Flask app
    """
    app = Flask(__name__)

    settings = {
        'DEBUG': True,
        'WEBPACK_MANIFEST_PATH': './build/manifest.json',
        'SECRET_KEY': 'the quick brown fox jumps over the lazy dog',
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///db.sqlite',
        'SQLALCHEMY_COMMIT_ON_TEARDOWN': True,
        'UPLOAD_FOLDER':UPLOAD_FOLDER,
        'ALLOWED_EXTENSIONS': set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','zip','log'])

    }

    app.config.update(settings)
    CORS(app)
    webpack.init_app(app)

    return app


# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


# extensions

app = create_app()
db = SQLAlchemy(app)
auth = HTTPBasicAuth()
CORS(app)


# user model for auth
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self):
        s = Serializer(app.config['SECRET_KEY'])
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)

        except BadSignature:
            return None  # invalid token
        user = User.query.get(data['id'])
        return user


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


@app.errorhandler(400)
def custom400(error):
    response = jsonify({'message': error.description})
    response.status_code = 400
    return response

@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/signup', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)  # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400, 'user already in use')  # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'username': user.username}), 201, {'Location': url_for('get_user', id=user.id, _external=True)}


@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})


@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({'token': token.decode('ascii'),})


@app.route('/api/list_usb', methods=['GET'])
@auth.login_required
def get_usb():
    usb = api.api.list_usb()
    return (usb)


@app.route('/api/read_device', methods=['POST'])
@auth.login_required
def get_read():
    path = request.json.get('path')
    Subsystem = request.json.get('Subsystem')
    test = api.api.read_thread(path, Subsystem)
    return jsonify(test=test)


@app.route('/api/send_ack', methods=['POST'])
@auth.login_required
def send_ack():
    path = request.json.get('path')
    Subsystem = request.json.get('Subsystem')
    ack = request.json.get('ack')
    try:
        baudrate = int(float(request.json.get('baudrate')))
    except:
        baudrate = 9600
    response = app.usb.send_ack(path, baudrate, Subsystem, ack)
    return jsonify(ack=response)


@app.route('/api/save_config', methods=['POST'])
@auth.login_required
def save_config():
    config = request.json.get('config')
    result = api.api.save_config(config)
    response = jsonify({'result': result})

    return response


@app.route('/api/fetch_log', methods=['POST'])
def fetch_log():
    name = request.json.get('name')

    data = api.api.LogtoJSON(name)
    return jsonify(data)


@app.route('/api/log_names', methods=['GET'])
def log_names():
    data = api.api.getLogNames()
    return jsonify(data)

@app.route('/api/middlware_names', methods=['GET'])
def middleware_names():
    data = api.api.getmiddlwareNames()
    return jsonify(data)
@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        print filename
        name = api.api.downloadLog(filename)
        print name

        return send_from_directory(LOG_DIR, name, mimetype='application/zip', as_attachment=True)

    except Exception as e:
        return str(e)


@app.route('/api/download', methods=['GET'])
def download_file2():
    filename = request.json.get('name')

    if filename is None:
        abort(404)
    else:
        return download_file(filename)

    # Route that will process the file upload
@app.route('/upload', methods=['POST'])
@cross_origin()
def upload():

        # Get the name of the uploaded file
        #print (request.files)
        file = request.files['file']

        # Check if the file is one of the allowed types/extensions
        if file and allowed_file(file.filename):
            # Make the filename safe, remove unsupported chars
            filename = secure_filename(file.filename)
            # Move the file form the temporal folder to
            # the upload folder we setup
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # Redirect the user to the uploaded_file route, which
            # will basicaly show on the browser the uploaded file

            return "success"

@app.route('/api/get_config', methods=['GET'])
def getconfig():
    with open(CONFIG_FILE+'Device_config.json') as data_file:
        configfile = json.load(data_file)
    return jsonify(configfile)

@app.route('/api/middleware_status', methods=['GET'])
def Middleware_status():
   return jsonify(api.api.Middleware_status())



@app.route('/api/start_middleware', methods=['GET'])
def start_middleware():

   return jsonify(api.api.start_middleware())

@app.route('/api/kill_middleware', methods=['GET'])
def kill_middleware():

   return jsonify(api.api.kill_middleware())
# Please use a pro
# per wsgi server such as gunicorn, I am only using this to keep
# the demo app as simple as possible.
if __name__ == '__main__':

    if not os.path.exists('db.sqlite'):
        db.create_all()

    run_simple('localhost', 5000, app, use_reloader=True, use_debugger=True)
