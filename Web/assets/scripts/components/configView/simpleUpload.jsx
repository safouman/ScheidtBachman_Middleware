import React, {Component} from 'react';
import  {connect} from 'react-redux';
import * as actions from '../../actions'
import Dropzone from 'react-dropzone';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
const styles = {
    container: {

        textAlign: 'center',

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
            files: [],
            checked: false,
            file_name: "",

        };
    }

    handleTouchTap() {
        this.setState({
            open: true,
        });
    };

    componentWillMount() {
        this.props.middlwareNames()
    }


    onDrop(files) {
        console.log('Received files: ', files[0].name);
        this.setState({file_name: files[0].name})
        this.props.uploadFile(files)
        this.props.setMiddleware_All(this.props.confirmed_devices, files[0].name)
        this.props.middlwareNames()
        //this.setState({value: this.props.middleware_names.indexOf(this.props.confirmed_devices[0].Process)})

        //  console.log("value",this.props.middleware_names.indexOf(this.props.confirmed_devices[0].Process))

    }


    checkSend(e, isInputChecked) {
        if (isInputChecked) {

            this.props.CheckSendALL(this.props.confirmed_devices)

        }
        else {
            this.props.UnCheckSendALL(this.props.confirmed_devices)
        }
        console.log("checksend", this.props.checksend)
    }

    renderfileList() {
        //    render menu with list
        let menuItems = [];
        //
        for (let i in this.props.middleware_names) {

            let itemIndex = i;
            let item = (
                <MenuItem
                    value={itemIndex}
                    key={`key-${i}`}
                    primaryText={this.props.middleware_names[i]}/>


            );

            menuItems.push(item)
        }


        return menuItems;

        //     //add actons when selectede
    }

    handleChange(event, index, value) {
        this.setState({value})
        this.props.setMiddleware_All(this.props.confirmed_devices, this.props.middleware_names[value])
    };

    handle_Selected_Middleware() {
        if (this.props.confirmed_devices[0].Process != "") {

            return ('Currently Selected: ' + this.props.confirmed_devices[0].Process)
        }
        else {
            return ('Currently Selected:None')
        }
    }

    showMiddlewares() {

        if (this.props.middleware_names) {
            if (this.props.middleware_names.length > 0) {
                return (   <SelectField
                    style={{marginBottom: 35}}
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    hintStyle={{backgroundColor: '#ffffff', zIndex: 1, pointerEvents: 'none', width: '85%'}}
                    hintText="Existing Middlewares"
                    autoWidth={true}
                    errorText={this.handle_Selected_Middleware()}
                    errorStyle={{color: '#26C6DA',fontSize:15,fontWeight:'bold'}}>

                    {this.renderfileList()}
                </SelectField>)
            }
        }
    }

    render() {

        if (this.props.confirmed_devices.length > 0) {
            return (
                <div style={styles.container}>
                    <center>
                        {this.showMiddlewares()}

                        <Dropzone onDrop={this.onDrop.bind(this)} multiple={false}>
                            <div><p style={ {textAlign: 'center', paddingTop: 70}}>Drop files here, or click to
                                select files
                                to upload.</p></div>
                        </Dropzone>

                        <Checkbox style={styles.checkbox}
                                  label="Check The Box If The Middleware Will Handle     Sending The Output"
                                  onCheck={this.checkSend.bind(this)}
                                  checked={this.props.checksend}
                        />
                    </center>

                </div>
            )
        } else {
            return <div style={{textAlign: 'center'}}><h3>No Devices Confirmed Not Much To Do Here..</h3></div>
        }
    }
}

function mapStateToProps(state) {
    return {

        confirmed_devices: state.config.confirmed_devices,

        config_state: state.config.config,
        errorMessage: state.config.config_error,
        upload: state.config.upload,
        checksend: state.config.checksend,
        middleware_names: state.config.middleware_names,
        middlware_error: state.config.middleware_names_error

    }
}

export default connect(mapStateToProps, actions)(SimpleUpload)
