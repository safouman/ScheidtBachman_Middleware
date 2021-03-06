/**
 * Created by safwen on 6/7/16.
 */
import DeviceProps from './deviceprops'
import Devicelist from './devicelist'
import React from 'react';
import {
    Step,
    Stepper,
    StepButton,
    StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SimpleUpload from'./simpleUpload';
import MultipleUpload from'./MultipleUpload';
import Snackbar from 'material-ui/Snackbar';
/**
 * A basic vertical non-linear implementation
 */

const styles = {
    errorStyle: {
        color: '#26C6DA',
        fontSize: '120%'
    }, container: {

        textAlign: 'center',
        paddingTop: 100,
    }
}
class configstepper extends React.Component {

    state = {
        stepIndex: 0,
        active: false,
        radio: 'one'

    };

componentWillMount(){
    this.props.clear()
}
    renderAlert() {
        if (this.props.config_state) {
            return (
                <div className="text-center">
                    <TextField id="e" errorStyle={styles.errorStyle} errorText={this.props.config_state.data} readOnly/>
                </div>);
        }
        else if (this.props.errorMessage) {
            return (
                <div className="text-center">
                    <TextField id="e" errorText={this.props.errorMessage} readOnly/>
                </div>);
        }
    }

    handleNext() {
        const {stepIndex} = this.state;
        if (stepIndex < 3) {
            this.setState({stepIndex: stepIndex + 1, active: false});
        }
        console.log(stepIndex)
    };

    handlePrev() {

        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    renderSelected() {

        if ((typeof this.props.selected_devices != 'undefined')) {
            if (this.props.selected_devices.length > 0) {

                return (
                    this.props.selected_devices.map((row, index) => (
                        <DeviceProps key={index} row={row} index={index}/>

                    )))

            }
            else {
                return ( <div style={{textAlign: 'center'}}><h3>No device selected</h3></div>)
            }
        }


    }


    renderStepActions(step) {

        return (
            <div style={{marginTop: '100px'}}>

                {step > 0 && (
                    <RaisedButton
                        label="Save Configuration"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        primary={true}
                        onClick={this.handleSaveConfig.bind(this)}
                    />
                )}
            </div>
        );
    }



    handleSaveConfig() {

        var destination = false
        var process_missing = true
        for (let item in this.props.confirmed_devices) {
            if (this.props.confirmed_devices[item].Process != "") {
                process_missing = false
            }
            if (this.props.confirmed_devices[item].Output == (true)) {

                destination = true
            }

        }
        if (this.props.confirmed_devices.length == 0) {
            this.props.configError("No Devices Are Confirmed Nothing To Save..")

        }
        else if (destination == false) {
            this.props.configError("You Need To Select an Output Device ")

        }
        else if (process_missing == true) {
            this.props.configError("Each Device Must Have a Process ")

        }

        else
        {
            this.props.saveConfig(this.props.confirmed_devices)
        }
    }

    handleRadio(event, value) {
    this.props.clear()
        this.setState({radio: value})

    }

    renderUpload() {
        if (this.state.radio == 'multiple') {
            return (<div style={styles.container}><MultipleUpload/></div>)
        } else {
            if ((this.state.radio == 'one')) {
                return (<div style={styles.container}><SimpleUpload/></div>)
            }
        }
    }

    handleRequestClose() {
        this.props.resetStatus()
    };

    render() {

        const {stepIndex} = this.state;

        return (
            <div style={{paddingTop: 75, width: 1000, height: 1400, margin: 'auto'}} className="pad">
                <Stepper
                    activeStep={stepIndex}
                    linear={false}
                    orientation="vertical"
                >
                    <Step active={this.state.active}>
                        <StepButton onClick={() => {
                            this.setState({stepIndex: 0})
                            if (this.state.active == false) {
                                this.setState({active: true});
                            } else {
                                this.setState({active: false})
                            }
                        }}>
                            Select Devices
                        </StepButton>
                        <StepContent >
                            <Devicelist next={this.handleNext.bind(this) }/>
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 1, active: false})}>
                            Configure Devices

                        </StepButton>
                        <StepContent >
                            {this.renderSelected()}

                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 2, active: false})}>
                            Select Middleware

                        </StepButton>
                        <StepContent >
                            <div>
                                <center>
                                    <RadioButtonGroup ref="rad" name="Select middleware" defaultSelected="one"
                                                      onChange={this.handleRadio.bind(this)}>

                                        <RadioButton
                                            value="one"
                                            label="One middlware for all devices"
                                            style={{display: 'inline-block', width: '300px'}}
                                        />
                                        <RadioButton
                                            value="multiple"
                                            label="Middlware per device"

                                            style={{display: 'inline-block', width: '300px'}}
                                        />

                                    </RadioButtonGroup>

                                </center>
                                <div >
                                    {this.renderUpload()}
                                    <center>{this.renderStepActions(2)}</center>
                                    <div> {this.renderAlert()}</div>
                                </div>

                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
                <Snackbar
                    open={this.props.status}
                    message="Upload Completed"
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose.bind(this)}
                />
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {

        confirmed_devices: state.config.confirmed_devices,
        selected_devices: state.config.selected_devices,
        config_state: state.config.config,
        errorMessage: state.config.config_error,
        status: state.config.status


    }
}
export default connect(mapStateToProps, actions)(configstepper);