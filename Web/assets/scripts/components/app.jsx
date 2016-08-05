import React, {Component} from 'react';
import Header from './header'
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

export default class App extends Component {
  handle(){
      console.log("btn clickc")
  }

    render() {
    return (
         <MuiThemeProvider muiTheme={muiTheme}>
           <div>

               <Header/>
                <div>
                {this.props.children}
                </div>
             </div>
           </MuiThemeProvider>
    );
  }
}
