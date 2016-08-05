import React, {Component} from 'react';
import { AppBar,Drawer, MenuItem, FlatButton} from 'material-ui';
import {Link} from 'react-router';
import  {connect} from 'react-redux';
import * as actions from '../actions'


 const style = {
            backgroundColor: 'transparent',
            color: 'white'

        };

class Header extends Component{
     

    renderSignBtn() {

        if(this.props.authenticated){
            //show links to sign out
            return (

                    <Link to="/signout"><FlatButton  label=" Sign Out" style={style}/></Link>
               );
        } else{

        return (

            <Link to="/signin" > <FlatButton  label=" Sign In" style={style}/></Link>

        );
    }}

    render(){
        return(

            <div>

                 <AppBar title="Scheidt & Bachmann"  iconElementRight={
                 <div>
                 <Link to="/"> <FlatButton label=" Home" style={style}/></Link>
                 <Link to="/config"> <FlatButton label=" Config" style={style}/></Link>
                  {this.renderSignBtn()}
                 </div>
                 }>

                 </AppBar>
    
            </div>

        );
    }
}

function mapStateToProps(state){
    return{
        authenticated: state.auth.authenticated
    };
}
export default connect(mapStateToProps, actions)(Header);