import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {Link} from 'react-router';

const styles = {
  container: {

    textAlign: 'center',
    paddingTop: 200,
  }, }

class Signout extends Component{
    componentWillMount(){
        this.props.signoutUser();
    }

    render(){
        return( <div style={styles.container}>

            <h1>You are logged out</h1>
            <h2>Click <Link to="/signin">here </Link> to Sign In </h2>

        </div>);
    }
}

export default connect(null,actions)(Signout)