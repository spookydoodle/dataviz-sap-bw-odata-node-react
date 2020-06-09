import React from 'react';
import { useStyles } from '../styles/main';
import { Loading } from '../components/Loading';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import HorizontalBarChart from '../components/charts/HorizontalBarChart'
import VerticalBarChart from '../components/charts/VerticalBarChart'
import RaceBarChart from '../components/charts/RaceBarChart'
import moment from 'moment';

// TODO: create a file with dimension names mapping
const Dashboard = ({ data }) => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg">
            {!data || data.length === 0 ?
                <Loading /> : (
                    <Grid container>
                        <Grid item xs={12}>
                            <RaceBarChart
                                data={data.map(row => ({
                                    date: new Date(`${row.year.key}-${row.month.key}-01`),
                                    name: row.division.text,
                                    category: row.division.text,
                                    value: row.sales.value / 1000,
                                }))}
                                size={{ width: 800, height: 400 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <HorizontalBarChart
                                data={data.sort((a, b) => 
                                    a.country.text < b.country.text ? -1 
                                    : (a.country.text > b.country.text ? 1 : 0))
                                    .map(row => ({ category: row.country.text, value: row.qty.value }))}
                                size={{ width: 500, height: 500 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <VerticalBarChart
                                data={data.sort((a, b) => a.month.key - b.month.key)
                                    .map(row => ({
                                        category: row.month.text,
                                        value: row.sales.value
                                    }))}
                                size={{ width: 500, height: 500 }}
                            />
                        </Grid>
                    </Grid>
                )}
        </Container>
    )
};

export default Dashboard;
