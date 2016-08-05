
import  React , {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  container: {

    textAlign: 'center',
    paddingTop: 200,
  },   raisedButton:{
         margin: 12,
    },
}

class Devicelist extends Component{


 constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      fixedFooter: false,
      stripedRows: false,
      showRowHover: true,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: false,
      deselectOnClickaway: false,
      showCheckboxes: true,
       selectedRows: []
    };
  }
  componentWillMount(){
        this.props.fetchDevice();
        this.props.flush_data()
      
      
    }
  handleToggle(event, toggled) {
    this.setState({
      [event.target.name]: toggled
    });
  };


   handleRowSelect(newArray){


            var result = newArray.slice(0);
            if (result == 'none') {
                result = [];
            }
            this.setState({selectedRows: result})
        }
    configDevices(){
         var selected_devices = {devices:[]}
           for (let i in this.state.selectedRows) {
            selected_devices.devices.push(this.props.devices[this.state.selectedRows[i]])
        }
    console.log("configDevices",selected_devices);
        this.props.select_devices(selected_devices);
        
        this.props.next();
    }


reloadDevices(){
    this.props.fetchDevice();
    console.log("Reloading   devices")

};
    handleSelection(key){


        this.configDevices(selected_devices)
        }
  handleChange(event){
    this.setState({height: event.target.value});
  };

    renderDevices(){
        if(this.props.devices){
        return(<div>
                 <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          width={70}
             onRowSelection={this.handleRowSelect.bind(this)}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>

            </TableRow>
              <TableRow>
                  <TableHeaderColumn tooltip="number">ID</TableHeaderColumn>
                  <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                  <TableHeaderColumn tooltip="Product ID">Product ID</TableHeaderColumn>
                  <TableHeaderColumn tooltip="Vendor ID">Vendor ID</TableHeaderColumn>
                   <TableHeaderColumn tooltip="Subsystem">Subsystem</TableHeaderColumn>
                   <TableHeaderColumn tooltip="Path">Path</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
              ref='currentTable'
          >
            {this.props.devices.map( (row, index) => (
                <TableRow key={index} selected={this.state.selectedRows.indexOf(index) !== -1}>
                    <TableRowColumn >{index}</TableRowColumn>
                    <TableRowColumn >{row.Name}</TableRowColumn>
                    <TableRowColumn>{row.ProductID}</TableRowColumn>
                    <TableRowColumn>{row.VendorID}</TableRowColumn>
                    <TableRowColumn>{row.Subsystem}</TableRowColumn>
                    <TableRowColumn>{row.Path}</TableRowColumn>
              </TableRow>
              ))}


          </TableBody>
        </Table>
            </div>
        );}
        else{ return <div>No devices found</div>}
    }
  render() {

    return (
     <div >
         {this.renderDevices()}
         <RaisedButton label="Reload Devices" primary={true} style={styles.raisedButton} onClick={this.reloadDevices.bind(this)}/>
         <RaisedButton label="Configure Selected Devices" primary={true} style={styles.raisedButton} onClick={this.configDevices.bind(this)}/>

     </div>
    );
  }
}








function mapStateToProps(state){
    return {
        
         devices:state.auth.devices,
         selected_devices:state.config.selected_devices}
}
export default connect(mapStateToProps,actions)(Devicelist)

