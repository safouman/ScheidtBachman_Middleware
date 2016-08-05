
from werkzeug.serving import run_simple

from flask_webpack import Webpack

from flask import Flask , render_template , jsonify, abort, request, g, url_for
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
import api.usb

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
        'SQLALCHEMY_COMMIT_ON_TEARDOWN': True
    }

    app.config.update(settings)
    CORS(app)
    webpack.init_app(app)

    return app

# extensions

app = create_app()
db = SQLAlchemy(app)
auth = HTTPBasicAuth()

#user model for auth
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
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


@app.route('/')
def index():
    return render_template('index.jinja2')


@app.route('/api/signup', methods = ['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400) # missing arguments
    if User.query.filter_by(username = username).first() is not None:
        abort(400,'user already in use') # existing user
    user = User(username = username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({ 'username': user.username }), 201, {'Location': url_for('get_user', id = user.id, _external = True)}



@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})

@app.route('/api/token' )
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})

@app.route('/api/list_usb', methods=['GET'])
@auth.login_required
def get_usb():
    usb= api.usb.list_usb()
    return jsonify(results=usb)

@app.route('/api/read_device', methods=['POST'])
@auth.login_required
def get_read():
    path=request.json.get('path')
    Subsystem=request.json.get('Subsystem')
    test= api.usb.read_thread(path, Subsystem)
    return jsonify(test=test)

@app.route('/api/send_ack', methods=['POST'])
@auth.login_required
def send_ack():
    path=request.json.get('path')
    Subsystem = request.json.get('Subsystem')
    ack = request.json.get('ack')
    try:
        baudrate=int(float(request.json.get('baudrate')))
    except:
        baudrate=9600
    response= app.api.usb.send_ack(path, baudrate, Subsystem, ack)
    return jsonify(ack=response)

@app.route('/api/save_config', methods=['POST'])
@auth.login_required
def save_config():
    config=request.json.get('config')
    result= app.api.usb.save_config(config)
    response = jsonify({'result': result})

    return response

# Please use a proper wsgi server such as gunicorn, I am only using this to keep
# the demo app as simple as possible.
if __name__ == '__main__':



        if not os.path.exists('db.sqlite'):
            db.create_all()

        run_simple('localhost', 5000, app, use_reloader=True, use_debugger=True)
