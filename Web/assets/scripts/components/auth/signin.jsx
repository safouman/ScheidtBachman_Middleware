import  React from 'react';
import {Paper , RaisedButton, TextField} from 'material-ui';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {reduxForm } from 'redux-form';
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



class Signin extends React.Component{
    
    
    auth(){
        
       this.props.authenticate(true)

    }
    renderAlert(){
        if(this.props.errorMessage){
            return(
             <div>
                     <TextField  id= "2" disabled={true} errorText= {this.props.errorMessage}/>
                </div>);
        }
    }
    handleFormSubmit({username,password}){
        this.props.signinUser({username,password});
    }
    render(){
     const{ handleSubmit, fields:{username,password}}= this.props;
        return(
              <div style={styles.container} >
                 
                <Paper style={styles.paper}>
                    <form role='form' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <div className="text-center">


                            <div className="col-md-12">
                                <TextField {...username}
                                    hintText="Username"
                                    floatingLabelText="Username"
                                    type="username"

                                />
                            </div>



                            <div className="col-md-12">
                                <TextField {...password}
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    type="password"

                                />

                            </div>

                           <div> {this.renderAlert()}</div>

                            <RaisedButton   type="submit" style={{"marginTop": 50}} label="Sign In"/>

                        </div> 
                    </form>
                </Paper>
                    
            </div>
        );
    }
    
}
function mapStateToProps(state){
    return {errorMessage : state.auth.error};
}
export default  reduxForm({
    form:'signin',
    fields:['username', 'password']
},mapStateToProps, actions)(Signin);