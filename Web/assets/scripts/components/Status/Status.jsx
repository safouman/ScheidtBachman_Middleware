import  React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Snackbar from 'material-ui/Snackbar';
const styles = {
    container: {
        height: '100%',
        textAlign: 'center',
        paddingTop: 100,
    },
    raisedButton: {
        margin: 20,

    },
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    paper: {

        height: '100%',
        width: '90%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    refresh: {
        margin: 40,

        display: 'inline-block',
        position: 'relative',
    }
}
class StatusContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            disabled: true,
            err: ''
        };
    }

    componentDidMount() {
        this.props.getMiddlewareStatus()
        this.props.getConfig()
        this.setState({value: JSON.stringify(this.props.configfile, null, 2),})

    }

    handleChange(event) {
        this.setState({err: ''})
        console.log(event.target.value)
        this.setState({value: event.target.value})

    }

    handleModify() {

        this.setState({disabled: false})
    }

    handleSave() {

        try {

            var newconfig = JSON.parse(this.state.value)
            this.props.saveConfig(newconfig)
            this.setState({disabled: true})
        } catch (err) {
            this.setState({err: err.message})
        }
    }

    renderButtons() {

        if (this.state.disabled == true) {
            return (<div><RaisedButton label="Modify config" primary={true} style={styles.raisedButton}
                                       onClick={this.handleModify.bind(this)}/>
                <RaisedButton label="save config" primary={true} style={styles.raisedButton}
                              onClick={this.handleSave.bind(this)}/>
            </div>)
        } else {
            return (<div>

                <RaisedButton label="Reset Config" primary={true} style={styles.raisedButton}
                              onClick={this.handleReset.bind(this)}/>
                <RaisedButton label="save config" primary={true} style={styles.raisedButton}
                              onClick={this.handleSave.bind(this)}/>
            </div>)
        }
    }

    handleReset() {
        this.setState({value: JSON.stringify(this.props.configfile, null, 2)})
    }

    showstatus() {
        if (this.props.middleware_status.status == 'Running') {
            return (<div>
                    <div style={{marginTop: 150, float: 'center'}}>

                        <h4 ><strong>
                            PID:</strong> {this.props.middleware_status.pid}</h4>
                        <h4 ><strong>
                            Status:</strong> {this.props.middleware_status.status}</h4>
                    </div>
                    <center>
                        <RefreshIndicator
                            size={60}
                            left={20}
                            top={1}

                            status="loading"
                            style={styles.refresh}
                        /></center>
                    <div>
                        <RaisedButton label="Kill Process" primary={true} style={styles.raisedButton}
                                      onClick={this.handlekill.bind(this)}/>
                        <RaisedButton label="Refresh Status" primary={true} style={styles.raisedButton}
                                      onClick={this.handleStatus.bind(this)}/>
                    </div>
                </div>
            )
        } else {

            return (<div>
                    <div style={{marginTop: 150, float: 'center', marginBottom: '30 %'}}>

                        <h4 ><strong>
                            PID:</strong> {this.props.middleware_status.pid}</h4>
                        <h4 ><strong>
                            Status:</strong> {this.props.middleware_status.status}</h4>
                    </div>
                    <div>
                        <RaisedButton label="Start Middleware" primary={true} style={styles.raisedButton}
                                      onClick={this.handlestart.bind(this)}/>
                        <RaisedButton label="Refresh Status" primary={true} style={styles.raisedButton}
                                      onClick={this.handleStatus.bind(this)}/>
                    </div>
                </div>
            )
        }
    }

    handlekill() {

        this.props.killMiddleware()
        this.props.getMiddlewareStatus()
    }

    handlestart() {
        this.props.startMiddleware()
        this.props.getMiddlewareStatus()
    }

    handleStatus() {
        this.props.getMiddlewareStatus()
    }

    handleRequestClose() {
        this.props.resetStatus()
    };

    render() {

        return (
            <div style={styles.container}>
                <Paper style={styles.paper} zDepth={2}>


                    <div style={{float: 'right', width: '50%',}}>
                        <h3 ><strong>Middelware Status</strong></h3>

                        {this.showstatus()}
                    </div>


                    <div style={{float: 'left', width: '50%'}}>

                        <h3><strong>Current Configuration</strong></h3>
                        <TextField
                            style={{width: '50%', textAlign: 'center',}}
                            value={this.state.value}


                            multiLine={true}
                            rows={2}
                            onChange={this.handleChange.bind(this)}
                            disabled={this.state.disabled}
                            errorText={this.state.err}
                        /><br/>

                        <div>
                            {this.renderButtons()}

                        </div>
                    </div>
                </Paper>
                <Snackbar
                    open={this.props.status}
                    message={this.props.message}
                    autoHideDuration={5000}
                    onRequestClose={this.handleRequestClose.bind(this)}
                />
            </div>)
    }

}

function mapStateToProps(state) {
    return {
        status: state.config.status,
        configfile: state.config.configfile,
        middleware_status: state.config.middleware_status,
        message: state.config.message,
    }
}
export default  connect(mapStateToProps, actions)(StatusContainer);

