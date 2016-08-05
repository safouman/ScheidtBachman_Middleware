import  React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';

const styles = {
    container: {
        height: '100%',
        textAlign: 'center',
        paddingTop: 100,
    },
    raisedButton: {
        margin: 12,
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
    }
}
class LogViewerContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "view logs",
        };
    }

    handleChange  (value) {
        this.setState({
            value: value,
        });
    };

    render() {

        return (
            <div style={styles.container}>
                <Paper style={styles.paper} zDepth={2}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                    >
                        <Tab label="View Logs" value="view logs">
                            <div>
                              s
                            </div>
                        </Tab>
                        <Tab label="Download Logs" value="Download Logs">
                            <div>
                                <h2 style={styles.headline}>Controllable Tab B</h2>
                                will be able to download logs
                            </div>
                        </Tab>
                    </Tabs>
                </Paper>    
            </div>)
    }

}

export default LogViewerContainer;