import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router"

const styles = {
  container: {

    textAlign: 'center',
    paddingTop: 200,
  },raisedButton:{
         margin: 12,
    }}
export default ()=>{
    return(<div style={styles.container}>
        <h1>xync </h1>
         <Link to="configdevices"><RaisedButton label="Configure Devices" primary={true} style={styles.raisedButton} /></Link>
         <Link to="logviewer"><RaisedButton label="Check Log" primary={true} style={styles.raisedButton} /></Link>
    </div>);
}