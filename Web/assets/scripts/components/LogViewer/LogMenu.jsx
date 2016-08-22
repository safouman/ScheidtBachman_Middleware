import  React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';

import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';


const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 0',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};
class LogMenu extends Component {


  render() {

    return (
        <div>
          <Paper style={style.paper}>
            <Menu>
              <MenuItem primaryText="Preview Log" leftIcon={<RemoveRedEye />}/>
              <MenuItem primaryText="Terminal" leftIcon={<PersonAdd />}/>
              <MenuItem primaryText="Configure Devices" leftIcon={<ContentLink />}/>
              <MenuItem primaryText="Make a copy" leftIcon={<ContentCopy />}/>
              <MenuItem primaryText="Download" leftIcon={<Download />}/>

            </Menu>
          </Paper>

        </div>
    );
  }
}
export default LogMenu;