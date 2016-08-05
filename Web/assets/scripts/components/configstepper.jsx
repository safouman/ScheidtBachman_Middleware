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
import * as actions from '../actions';
import TextField from 'material-ui/TextField';
/**
 * A basic vertical non-linear implementation
 */
class configstepper extends React.Component {

  state = {
    stepIndex: 0,
      active:false
  };
  renderAlert(){
        if(this.props.config_state){
            return(
             <div><center>
                     <TextField  id= "e"  value={this.props.config_state.data}  readOnly /></center>
                </div>);
        }
    else if(this.props.errorMessage){
            return(
             <div><center>
                     <TextField  id= "e"   errorText={this.props.errorMessage} readOnly /></center>
                </div>);
        }
    }
  handleNext (){
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1,active:false});
    }
    console.log(stepIndex)
  };

  handlePrev (){
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  renderSelected(){
         if(this.props.selected_devices){
           return(
                    this.props.selected_devices.map( (row, index) => (
                      <DeviceProps key={index} row={row} index={index}  />

                    )))}
                else {return(
         <div>No device selected</div>);}
  };

  renderStepActions(step) {

    return (
      <div style={{margin: '12px 0'}}>

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

  handleSaveConfig(){
    if(this.props.confirmed_devices.length>0){
  this.props.saveConfig(this.props.confirmed_devices)}
    else{
      this.props.configError("Please Confirm Selected Devices ")
    }
  }
  render() {
    const {stepIndex} = this.state;
   
    return (
      <div style={{width: 1000, height: 1400, margin: 'auto'}} className="pad">
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          <Step active={this.state.active} >
            <StepButton onClick={() => {this.setState({stepIndex: 0})
            if (this.state.active==false){this.setState({active: true});}else{this.setState({active: false}) } }}>
              Select Devices
            </StepButton>
            <StepContent >
              <Devicelist next={this.handleNext.bind(this) }/>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 1,active:false})}>
              Configure Devices
       
            </StepButton>
            <StepContent >
              {this.renderSelected()}
              <center>{this.renderStepActions(1)}</center>
                 <div> {this.renderAlert()}</div>
            </StepContent>
          </Step>
         
        </Stepper>
      </div>
    );
  }
}
function mapStateToProps(state){
    return {
      
      confirmed_devices: state.config.confirmed_devices,
      selected_devices:state.config.selected_devices,
      config_state:state.config.config,
      errorMessage: state.config.config_error,
    
    }
}
export default connect(mapStateToProps,actions)(configstepper);