/**
 * Created by safwen on 6/9/16.
 */
import {connect} from 'react-redux';
import  React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import * as actions from '../../actions';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import Checkbox from 'material-ui/Checkbox';
import loadash from 'lodash'
const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
        display: 'inline-block',
        width: '100px'
    },
    Button: {
        marginRight: 16,
    },
    toggle: {
        marginBottom: 16,
    },

};


class deviceProperties extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            Output: false,
            label: 'Confirm',
            process: '',
            Baudrate: 9600,
            errorText: '',
            disabled: false,
            ack: '',
            Name: ''


        }
    };

    componentWillMount() {


        if (this.props.confirmed_devices.length) {
            var i = _.findKey(this.props.confirmed_devices, {'ID': this.props.index})
            console.log(i, 'xxxxxxxxx')
            if (typeof i != 'undefined') {
                if ((this.props.confirmed_devices.length > 0) && (this.props.confirmed_devices[i].confirmed == true)) {
                    this.setState({label: 'Unconfirm',disabled:true})
                    console.log(this.state.label, 'label')
                }
                if ((this.props.confirmed_devices.length > 0) && (this.props.confirmed_devices[i].Output == true)) {
                    this.setState({Output: true})
                }
            }
        }
    }

    handleACK(e) {
        this.setState({ack: e.target.value})
        console.log("ack", this.state.ack)
    }


    handleRemove() {

        this.props.unselect_device(this.props.index);
        this.handleFormSubmit(true)

    };

    handleChange(e) {

        if (!isNaN(e.target.value)) {
            this.setState({errorText: ''})
            this.setState({Baudrate: e.target.value})
        }
        else {
            this.setState({errorText: 'Only numbers allowed'})
        }

    }

    handleNameChange(e) {
        this.setState({Name: e.target.value})

    }

    handleFormSubmit(x = false) {

        var i = this.props.confirmed_devices.map(function (d) {
            return d['Name'];
        }).indexOf(this.props.row.Name)


        if (x == true) {


            this.props.unconfirm_device(i);
        } else {
            this.handleClear()


            if ((this.state.label == 'Confirm') && (this.state.errorText == '')) {

                const confirmed_device = {
                    ID: this.props.index,
                    ProductID: this.props.row.ProductID,
                    VendorID: this.props.row.VendorID,
                    Name: this.props.row.Name,
                    Path: this.props.row.Path,
                    Output: this.state.Output,
                    Baudrate: this.state.Baudrate,
                    Process: this.state.process,
                    Subsystem: this.props.row.Subsystem,
                    Send: false,
                    confirmed: true,


                }

                if (this.state.Name != '') {
                    confirmed_device['Name'] = this.state.Name
                }
                console.log(confirmed_device)
                this.props.confirm_device(confirmed_device);
                this.setState({label: 'Unconfirm', disabled: true});
                this.setState({expanded: false});


            }

            else {

                this.props.unconfirm_device(i);
                this.setState({label: 'Confirm', disabled: false});
            }
        }
    };

    CheckedOutput(e, isInputChecked) {
        console.log(isInputChecked)
        if (isInputChecked) {
            this.setState({Output: true})
        } else {
            this.setState({Output: false})
        }
    }

    handleExpandChange() {

        if (this.state.expanded === false) {
            this.setState({expanded: true});
        }
        else {
            this.setState({expanded: false});
        }

    };

    handleIO(event) {
        this.setState({IO: event.target.value});

    };

    handleClear() {
        this.props.clear()
    }

    renderTestDevice() {

        // if (this.state.IO == 'input') {
        if (this.props.read_data && this.props.read_data['id'] == this.props.index) {
            console.log("yey", this.props.read_data['id'] == this.props.index)
            return (
                <div >

                    <br/>
                    <RaisedButton style={styles.Button} label="Read From Device" primary={true}
                                  onClick={this.handleRead.bind(this)}/>
                    <RaisedButton style={styles.Button} label="Clear" primary={true}
                                  onClick={this.handleClear.bind(this)}/>

                    <br/>
                    <label><strong>Response:</strong></label> <TextField name="response" style={{width: 250}}
                                                                         value={this.props.read_data['data']}
                                                                         readOnly/>

                </div>

            );
        }
        else {
            return (
                <div>

                    <br/>
                    <RaisedButton style={styles.Button} label="Read From Device" primary={true}
                                  onClick={this.handleRead.bind(this)}/>
                    <br/>
                    <label><strong>Response:</strong></label> <TextField name="response" value="" readOnly/>

                </div>


            );
        }

        // }
        // else {
        //     if (this.state.IO == 'output') {
        //            if (this.props.ack && this.props.ack['id'] == this.props.index){
        //         return (
        //             <div>
        //
        //                 <label><strong>ACK:</strong></label> <TextField id="ACK" value={this.state.ack} onChange={this.handleACK.bind(this)}/>
        //                 <br/>
        //                 <label><strong>Response:</strong></label> <TextField id="response" value={this.props.ack['data']} readOnly/>
        //
        //                 <RaisedButton style={styles.Button} label="Send ACK" onClick={this.handleSendAck.bind(this)} primary={true}/>
        //                 <RaisedButton style={styles.Button} label="Clear" primary={true}
        //                               onClick={this.handleClear.bind(this)}/>
        //             </div>
        //         )
        //     }


        // else{
        //     return(
        //
        //          <div>
        //
        //             <label><strong>ACK:</strong></label> <TextField id="ACK" value={this.state.ack} onChange={this.handleACK.bind(this)}/>
        //             <br/>
        //             <label><strong>Response:</strong></label> <TextField id="response" value="" readOnly/>
        //
        //             <RaisedButton style={styles.Button} label="Send ACK" onClick={this.handleSendAck.bind(this)} primary={true}/>
        //         </div>
        //     );
        // }}
    }


    handleRead() {

        this.props.read_device(this.props.index, this.props.row.Path, this.props.row.Subsystem)


    };

    handleSendAck() {
        this.props.send_ack(this.props.row.Path, this.state.Baudrate, this.props.row.Subsystem, this.state.ack, this.props.index)

    };

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <div>
                    <TextField id="1" disabled={true} errorText={this.props.errorMessage}/>
                </div>
            )
        }
    };

    render() {


        return (
            <div>
                <Card expanded={this.state.expanded}>
                    <CardHeader
                        title={this.props.row.Name}
                        onClick={this.handleExpandChange
                            .bind(this)}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />

                    <CardText expandable={true}>

                        <div>
                            <div ><label><strong>Device Name:</strong>
                            </label><TextField defaultValue={this.props.row.Name}
                                               id="name"
                                               onChange={this.handleNameChange.bind(this)}
                                               disabled={this.state.disabled}/></div>

                            <div ><label><strong>ProductID:</strong></label>
                                <TextField value={this.props.row.ProductID} id="productid" readOnly/>

                            </div>

                            <div ><label><strong>VendorID:</strong></label>
                                <TextField value={this.props.row.VendorID} id="vendorid" readOnly/></div>

                            <div ><label><strong>Path:</strong></label> <TextField value={this.props.row.Path}
                                                                                   id="path"/></div>

                            <div style={{marginLeft: 500,}}><Checkbox checked={this.state.Output}
                                                                      onCheck={this.CheckedOutput.bind(this)}
                                                                      label="Is This The Output??"
                                                                      disabled={this.state.disabled}/></div>

                            <div ><label><strong>Baudrate:</strong> </label>

                                <TextField
                                    hintText="Baudrate"
                                    disabled={this.state.disabled}

                                    type="text"
                                    onChange={this.handleChange.bind(this)}
                                    errorText={this.state.errorText}
                                />

                            </div>


                            <div >


                                {this.renderTestDevice()}

                            </div>


                        </div>
                        <CardActions className="text-center" expandable={true}>

                            <RaisedButton label={this.state.label} onClick={this.handleFormSubmit.bind(this)}
                                          primary={true}/>
                            <RaisedButton label="Remove" primary={true} onClick={this.handleRemove.bind(this)}/>

                        </CardActions>.


                    </CardText>


                </Card>

                <Divider/>
            </div>
        );


    }
}

function mapStateToProps(state) {

    return {
        errorMessage: state.config.config_error,
        read_data: state.config.read_data,
        selected_devices: state.config.selected_devices,
        confirmed_devices: state.config.confirmed_devices,
        ack: state.config.ack,


    }
}

export default connect(mapStateToProps, actions)(deviceProperties);