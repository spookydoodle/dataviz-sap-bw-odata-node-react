import React from 'react';
import { useStyles } from '../styles/main';
import { Loading } from '../components/Loading';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import HorizontalBarChart from '../components/charts/HorizontalBarChart'
import VerticalBarChart from '../components/charts/VerticalBarChart'
import RaceBarChart from '../components/charts/RaceBarChart'
import moment from 'moment';

// TODO: create a file with dimension names mapping
const Dashboard = ({ data }) => {
    const classes = useStyles();
    const container = {
        height: "100vh",
        width: "100%",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
    return (
        <div style={container}>
            <a href="http://35.204.1.238:80">
                <Typography variant="h1">
                    Click to see some viz
                </Typography>
            </a>
        </div>
    )
};

export default Dashboard;
