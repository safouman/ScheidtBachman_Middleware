import  React, {Component} from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import  LogTable from './Data_Table'
import * as actions from '../../actions';
import {connect} from 'react-redux';
import SelectField from 'material-ui/SelectField';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
const styles = {
    customWidth: {
        margin: 'auto',
        width: 150,
    },
    container: {
        margin: 'auto',
        height: '100%',
        width: '50%',
        textAlign: 'center',
        paddingTop: 100,

    },
    raisedButton: {
        margin: 12,
        marginRight: 16
    },
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    paper: {

        height: '100%',
        width: '75%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    Button: {
        margin: 12,
        marginRight: 16
    },
}
var products = [
    {
        id: 1,
        name: "Product1",
        price: 120
    }, {
        id: 2,
        name: "Product2",
        price: 80
    }, {
        id: 3,
        name: "Product3",
        price: 207
    }, {
        id: 4,
        name: "Product4",
        price: 100
    }, {
        id: 5,
        name: "Product5",
        price: 150
    }, {
        id: 6,
        name: "Product1",
        price: 160
    }
];

class LogViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            openMenuu: false,
            selected_item:''
        };
    }

    componentWillMount() {

        this.props.logNames()

    }

    renderfileList() {
        //get file list


        //    render menu with list
        let menuItems = [];
        //

        for (let i in this.props.lognames) {
            let itemIndex = i;
            let item = (
                <MenuItem
                    value={itemIndex}
                    key={`key-${i}`}
                    primaryText={this.props.lognames[i]}/>


            );

            menuItems.push(item)
        }


        return menuItems;}


        //     //add actons when selectede


    handleChange(event, index, value) {
        this.setState({value})
        console.log(this.state.value)
        this.props.fetchLog(this.props.lognames[value])
    };

    handleReload() {
        console.log("button clicked", this.props.lognames[this.state.value])
        this.props.fetchLog(this.props.lognames[this.state.value])

    }

    handleDownload(event,index,value){

    console.log(index.props.value)
        if (index.props.value=='CURRENT'){
        this.props.downloadLog(this.props.lognames[this.state.value])
    }else{
         this.props.downloadLog(index.props.value)

        }}

    handleOpenMenuu() {
        console.log(this.state.openMenuu)
        this.setState({
            openMenuu: true,
        });
    }

    handlecloseMenu() {
        this.setState({openMenuu: false})
    }

    render() {

        return (

            <div>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle text="Log File"/>
                        <FontIcon className="muidocs-icon-custom-sort"/>
                        <ToolbarSeparator />


                        <SelectField value={this.state.value } onChange={this.handleChange.bind(this)}
                                     autoWidth={true}>
                            {this.renderfileList()}
                        </SelectField>

                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarTitle text="Options"/>
                        <FontIcon className="muidocs-icon-custom-sort"/>
                        <ToolbarSeparator />
                        <RaisedButton id="refresh" label="Refresh Data" primary={true} style={styles.Button}
                                      onClick={this.handleReload.bind(this)}/>


                        <IconMenu onRequestChange={this.handlecloseMenu.bind(this)}
                                  iconButtonElement={ <RaisedButton id="iconmenu" icon={<FileFileDownload/>}
                                                                    label="Export"
                                                                    style={styles.Button}
                                                                    onClick={this.handleOpenMenuu.bind(this)}
                                                                    primary={true}/>}
                                  open={this.state.openMenuu}
                                  onItemTouchTap={this.handleDownload.bind(this)}

                        >
                            <MenuItem value="CURRENT" primaryText="Download Current Log"/>
                            <MenuItem value="TRANSACTION" primaryText="Download Transaction Logs"/>
                            <MenuItem value="ALL    " primaryText="Download All Logs"/>

                        </IconMenu>


                    </ToolbarGroup>
                </Toolbar>


                <LogTable/>
                <br/>

            </div>
        )
    }
}


function mapStateToProps(state) {
    return {

        logdata: state.log.logdata,
        lognames: state.log.lognames,
    }
}
export default  connect(mapStateToProps, actions)(LogViewer);