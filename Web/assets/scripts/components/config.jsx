import  React , {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router";

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
    raisedButton:{
         margin: 12,
    },
};

class Config extends Component{
 render () {

    return (

          <div >
            
            <div  style={styles.container}>

              <h1>Hello</h1>

              <Link to="configdevices"><RaisedButton label="Configure Devices" primary={true} style={styles.raisedButton} /></Link>
              <Link to="signup"><RaisedButton label="Add User" primary={true} style={styles.raisedButton} /></Link>
            

          </div>
          </div>
    );
} ;}

export default Config;