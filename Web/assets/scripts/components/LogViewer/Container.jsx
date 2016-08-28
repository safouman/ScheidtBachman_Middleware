import  React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import LogViewer from './LogViewer';
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
        width: '90%',
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
                  <LogViewer/>
                </Paper>
            </div>)
    }

}

export default LogViewerContainer;