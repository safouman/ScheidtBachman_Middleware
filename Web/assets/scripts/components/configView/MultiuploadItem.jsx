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

const styles = {
    container: {

        textAlign: 'center',

    }, raisedButton: {
        marginTop: 20,
        marginLeft: 35,
        marginRight: 10,


    }, checkbox: {
        marginTop: 20,
        width: 12,

    },
}


class MultiuploadItem extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    handleChange(event, index, value) {
        this.setState({value})
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

                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    hintStyle={{backgroundColor: '#ffffff', zIndex: 1, pointerEvents: 'none', width: '85%'}}
                    hintText="Existing Middlewares"
                    autoWidth={true}>
                    {this.renderfileList()}
                </SelectField>)
            }
        }
    }

    onDrop(files) {
        console.log('Received files: ', files);
        this.props.uploadFile(files)
        this.props.middlwareNames()
    }

    render() {
        console.log(this.props.confirmed_devices, 'confirmed devices')
        return ( <div style={styles.container}>

            <Dropzone style={{display: 'none'}} ref="dropzone" onDrop={this.onDrop.bind(this)}/>
            <div style={{display: '-webkit-inline-box'}}>

                <Checkbox style={
                    styles.checkbox

                }
                          label={this.props.row.Name}
                />
                <RaisedButton id="upload"
                              icon={<FileFileUpload/> }
                              onClick={this.onOpenClick.bind(this)}
                              primary={true}
                              style={styles.raisedButton}/>

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