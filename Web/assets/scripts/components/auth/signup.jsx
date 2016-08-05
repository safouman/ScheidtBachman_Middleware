import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import {Paper , RaisedButton, TextField} from 'material-ui';


const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
    paper:{

        marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '50%',
    textAlign: 'center',
    display: 'inline-block',

    }



};
class Signup extends  Component {
    handleFormSubmit(formProps){
        // call action creator to sign up user !
        
      this.props.signupUser(formProps)  
        
    }
    renderAlert(){
        if(this.props.errorMessage){
            return(
                <div>
                     <TextField  id=    "1" disabled={true} errorText= {this.props.errorMessage}/>
                </div>
            )
        }
    }
    render(){
        
        const {handleSubmit ,fields:{username,password,passwordConfirm }}=this.props;

        return(
               <div style={styles.container}>
                <Paper style={styles.paper}>
                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <div className="text-center">
                            <h2>Add New User</h2>
                            <div className="col-md-12">
                                <TextField {...username}
                                    hintText="Username"
                                    floatingLabelText="Username"
                                    type="username"
                                    errorText={username.touched && username.error}
                                />
                            </div>
                            <div className="col-md-12">
                                <TextField {...password}
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    type="password"
                                    errorText={password.touched && password.error}

                                />
                            </div>
                            <div className="col-md-12">
                                <TextField {...passwordConfirm}
                                    hintText="Confirm Password"
                                    floatingLabelText="Confirm Password"
                                    type="password"
                                    errorText={passwordConfirm.touched && passwordConfirm.error}

                                />
                            </div>
                            <RaisedButton type="submit" style={{"marginTop": 50}} label="Add User"
                           />
                            {this.renderAlert()}
                        </div>
                    </form>

                </Paper>

            </div>
        );
    }
}
function validate(formProps) {
    const errors = {};

    if(formProps.password !== formProps.passwordConfirm){
        errors.password='Password must match';
    }
   if (!formProps.username){
       errors.username='Please enter a username';
   }
    if (!formProps.password){
       errors.password='Please enter a password';
   }
     if (!formProps.passwordConfirm){
       errors.password='Please enter a password confirmation';
   }
    return errors;

}
function mapStateToProps(state) {
    return{errorMessage: state.auth.error}
    
}
export default reduxForm({
    form:'signup',
    fields: ['username', 'password','passwordConfirm'],
    validate
},mapStateToProps,actions)(Signup);