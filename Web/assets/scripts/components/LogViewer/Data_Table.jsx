import  React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as actions from '../../actions';
import Griddle from 'griddle-react';
import {connect} from 'react-redux';
import {Grid, PageHeader, Alert, Table} from 'react-bootstrap';
import {BootstrapPager, GriddleBootstrap} from 'griddle-react-bootstrap';
var LevelNameComponent = React.createClass({
    render: function () {
        if (this.props.data == 'INFO') {
            return <div style={ styles.info}>{this.props.data} </div>
        }
        else if (this.props.data == 'ERROR') {
            return <div style={ styles.error}>{this.props.data} </div>
        } else if (this.props.data == 'WARN') {
            return <div style={ styles.warning}>{this.props.data} </div>
        } else {
            return <div>{this.props.data} </div>
        }

    }
});
const styles = {
    container: {
        margin: 'auto',
        height: '100%',
        width: '50%',
        textAlign: 'center',
        paddingTop: 100,

    },
    Button: {
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
    table: {
        margin: 'auto',
        width: '90%',
        textAlign: 'center',
        paddingTop: 15,

    },
    info: {

        backgroundColor: '#5cb85c',

        display: 'inline',
        padding: '.2em .6em .3em',
        fontSize: '75%',
        fontWeight: 'bold',
        lineHeight: 1,
        color: '#fff',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        borderRadius: '.25em'
// }

    },
    error: {
        backgroundColor: '#D50000',
        display: 'inline',
        padding: '.2em .6em .3em',
        fontSize: '75%',
        fontWeight: 'bold',
        lineHeight: 1,
        color: '#fff',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        borderRadius: '.25em'

    },
    warning: {
        backgroundColor: '#CDDC39',
        display: 'inline',
        padding: '.2em .6em .3em',
        fontSize: '75%',
        fontWeight: 'bold',
        lineHeight: 1,
        color: '#fff',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        borderRadius: '.25em'

    }
}

var customColumnMetadata = [
    {
        "columnName": "TimeStamp",
        "order": 1,
        "locked": false,
        "visible": true
    }
    ,
    {
        "columnName": "LevelName",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Level",
        "customComponent": LevelNameComponent,

    }, {
        "columnName": "Message",
        "order": 3,
        "locked": false,
        "visible": true
    },
    {
        "columnName": "Source",
        "order": 4,
        "locked": false,
        "visible": true
    }, {
        "columnName": "Function Name",
        "order": 5,
        "locked": false,
        "visible": true,
        "displayName": "Function"
    },
];

class LogTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        };


    }

    componentDidMount() {
        this.props.fetchLog()
    }

    render() {


        return (
                <div style={styles.table}>

                <GriddleBootstrap
                    hover={true}
                    striped={true}
                    bordered={false}
                    condensed={false}
                    showFilter={true}
                    showSettings={true}
                    columnMetadata={customColumnMetadata}
                    results={this.props.logdata}
                />
                <br/>

            </div>
        )
    }

}
function mapStateToProps(state) {
    return {

        logdata: state.log.logdata,
    }
}
export default  connect(mapStateToProps, actions)(LogTable);


