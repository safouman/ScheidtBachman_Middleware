import React, {Component} from 'react';
import  {connect} from 'react-redux';
import * as actions from '../../actions'
import Dropzone from 'react-dropzone';
import Checkbox from 'material-ui/Checkbox';
const styles = {
    container: {

        textAlign: 'center',
        paddingTop: 100,
    }, checkbox: {
        marginTop: 50,
        width: 200,

    },
}
class SimpleUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            files: []
        };
    }

    handleTouchTap() {
        this.setState({
            open: true,
        });
    };

    componentWillMount() {

    }


    onDrop(files) {
        console.log('Received files: ', files);
        this.props.uploadFile(files)
    }
CheckSend(){

}
    render() {
        return (
            <div style={styles.container}>
                <center>
                    <Dropzone onDrop={this.onDrop.bind(this)} multiple={false}>
                        <div><p style={ {textAlign: 'center', paddingTop: 70}}>Drop files here, or click to select files
                            to upload.</p></div>
                    </Dropzone>

                    <Checkbox style={
                        styles.checkbox

                    }
                              label="Check The Box If The Middleware Will Handle     Sending The Output"
                              onCheck={this.CheckSend.bind(this)}
                    />
                </center>

            </div>
        )
    }
}
function mapStateToProps(state) {
    return {

        confirmed_devices: state.config.confirmed_devices,
        selected_devices: state.config.selected_devices,
        config_state: state.config.config,
        errorMessage: state.config.config_error,
        upload: state.config.upload

    }
}
export default connect(mapStateToProps, actions)(SimpleUpload);