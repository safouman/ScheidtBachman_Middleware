import React, {Component} from 'react';
import  {connect} from 'react-redux';
import * as actions from '../../actions'
import Checkbox from 'material-ui/Checkbox';
import MultiuploadItem from  './MultiuploadItem';
const styles = {
    container: {

        textAlign: 'center',

    }, raisedButton: {
        marginLeft: 10,
        marginRight: 10,

    },
}


class MultipleUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {

        this.props.middlwareNames()

    }


    render() {

        if (this.props.confirmed_devices.length > 0) {
            return (
                <div style={styles.container}>
                    <p style={{marginTop:20,marginBottom:25}}><strong>Check The Box If The Middleware Will Handle Sending The Output</strong></p>
                    {this.props.confirmed_devices.map((row, index) => (
                        <MultiuploadItem row={row}/>

                    ))}

                </div>
            )
        } else {
            return <div><h3>No Devices Confirmed Not Much To Do Here..</h3></div>
        }
    }
}


function mapStateToProps(state) {
    return {

        confirmed_devices: state.config.confirmed_devices,
        selected_devices: state.config.selected_devices,
        config_state: state.config.config,
        errorMessage: state.config.config_error,
        middleware_names: state.config.middleware_names,
        middlware_error: state.config.middleware_names_error

    }
}
export default connect(mapStateToProps, actions)(MultipleUpload);