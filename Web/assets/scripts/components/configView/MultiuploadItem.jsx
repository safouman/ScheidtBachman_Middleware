import React, {Component} from 'react';
import  {connect} from 'react-redux';
import * as actions from '../../actions'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';
import Dropzone from 'react-dropzone';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import lodash from'lodash'
const styles = {
    container: {

        textAlign: 'center',

    }, raisedButton: {

        marginLeft: 35,
        marginRight: 35,
        marginBottom:50,
        marginTop:20,



    }, checkbox: {
        marginTop: 35 ,

        width: 12,

    },
}


class MultiuploadItem extends Component {
    constructor(props) {
        super(props);

        this.state = {checked: false,};
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    handleChange(event, index, value) {
        this.setState({value, checked: false})
        var i = _.findKey(this.props.confirmed_devices, {'Name': this.props.row.Name})
        this.props.setMiddleware(this.props.confirmed_devices, this.props.middleware_names[value], i)
        console.log(this.props.confirmed_devices[i])
    };

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

    showMiddlewares() {

        if (this.props.middleware_names) {
            if (this.props.middleware_names.length > 0) {
                return (   <SelectField
                    style={{marginBottom:30}}
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    hintStyle={{backgroundColor: '#ffffff', zIndex: 1, pointerEvents: 'none', width: '85%'}}
                    hintText="Existing Middlewares"
                    autoWidth={true}
                    errorText={this.handle_Selected_Middleware()}
                    errorStyle={{color: '#26C6DA',fontSize:15,fontWeight:'bold'}}   >
                    {this.renderfileList()}
                </SelectField>)
            }
        }
    }

    onDrop(files) {
        var i = _.findKey(this.props.confirmed_devices, {'Name': this.props.row.Name})
        console.log('Received files: ', files);
        this.props.uploadFile(files)
        this.props.setMiddleware(this.props.confirmed_devices, files[0].name, i)
        this.props.middlwareNames()
    }

    handleCheck(e, isInputChecked) {
        var i = _.findKey(this.props.confirmed_devices, {'Name': this.props.row.Name})
        if (isInputChecked) {
            this.props.CheckSend(this.props.confirmed_devices, i)
            this.setState({checked: true})
        }
        else {
            this.props.UnCheckSend(this.props.confirmed_devices, i)
            this.setState({checked: false})
        }
    }

    handle_Selected_Middleware() {
        var i = _.findKey(this.props.confirmed_devices, {'Name': this.props.row.Name})
        if (this.props.confirmed_devices[i].Process != "") {

            return ('Currently Selected: ' + this.props.confirmed_devices[i].Process)
        }
        else {
            return ('Currently Selected:None')
        }
    }

    render() {

        var i = _.findKey(this.props.confirmed_devices, {'Name': this.props.row.Name})


        return ( <div style={styles.container}>

            <Dropzone style={{display: 'none'}} ref="dropzone" onDrop={this.onDrop.bind(this)}/>
            <div style={{display: 'inline-flex', margin: 20}}>

                <Checkbox style={styles.checkbox}
                          label={this.props.row.Name}
                          onCheck={this.handleCheck.bind(this)}
                          checked={ this.props.confirmed_devices[i].Send}

                />
                <RaisedButton id="upload"
                              icon={<FileFileUpload/> }
                              onClick={this.onOpenClick.bind(this)}
                              primary={true}
                              style={styles.raisedButton}

                />

                {this.showMiddlewares()}
            </div>

        </div> )
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
export default connect(mapStateToProps, actions)(MultiuploadItem);