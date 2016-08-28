import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router"

import  {connect} from 'react-redux';
import * as actions from '../actions'

const styles = {
  container: {

    textAlign: 'center',
    paddingTop: 200,
  },raisedButton:{
         margin: 12,
    }}

export default class Welcome extends React.Component {
    ifauthenticated(){
         if (this.props.authenticated) {
             return       <Link to="signup"><RaisedButton label="Add User" primary={true} style={styles.raisedButton} /></Link>
         }

    }
    render() {
        return (<div style={styles.container}>
            <h1><strong>Welcome</strong></h1>
            <Link to="configdevices"><RaisedButton label="Configure Devices" primary={true}
                                                   style={styles.raisedButton}/></Link>
            <Link to="logviewer"><RaisedButton label="Check Log" primary={true} style={styles.raisedButton}/></Link>
            {this.ifauthenticated()}
        </div>);
    }
}
function mapStateToProps(state) {
    return {
        authenticated: state.auth.authenticated
    };
}
export default connect(mapStateToProps, actions)(Welcome);