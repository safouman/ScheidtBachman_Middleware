import React, {Component} from 'react';
import {AppBar, MenuItem, FlatButton, Menu, Paper} from 'material-ui';
import {Link} from 'react-router';
import  {connect} from 'react-redux';
import * as actions from '../actions'


const styles= {
    link:{
        backgroundColor: 'transparent',
        color: 'white'

    },
    paper:{
        display: 'inline-block',
        margin: '16px 32px 16px 0',
    }
};


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle() {
        this.setState({open: !this.state.open});
        console.log("open")
    }

    renderSignBtn() {

        if (this.props.authenticated) {
            //show links to sign out
            return (

                <Link to="/signout"><FlatButton label=" Sign Out" style={styles.link}/></Link>
            );
        } else {

            return (

                <Link to="/signin"> <FlatButton label=" Sign In" style={styles.link}/></Link>

            );
        }
    }

    handleClose() {
        this.setState({open: false});
    }

    render() {
        return (

            <div>


                <AppBar title="Scheidt & Bachmann" iconElementRight={
                    <div>
                        <Link to="/"> <FlatButton label=" Home" style={styles.link}/></Link>
                        {this.renderSignBtn()}
                    </div>
                } onLeftIconButtonTouchTap={this.handleToggle.bind(this)}>

                </AppBar>

            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        authenticated: state.auth.authenticated
    };
}
export default connect(mapStateToProps, actions)(Header);