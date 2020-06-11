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

    return (
        <Container maxWidth="lg">
            {!data || data.length === 0 ?
                <Loading /> : (
                    <Grid container spacing={2}>
                        <Grid item xs={12} className={classes.padding2}>
                            <Typography variant="h5">
                                Ultracool dashboard with some data
                            </Typography>
                            <Typography variant="subtitle2">
                                ...well, at least the beginning of an ultracool dashboard :3
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Grid item xs={12} className={`${classes.margin2}`}>
                                <Card className={`${classes.flexCenter} ${classes.padding2} ${classes.margin2}`}>
                                    <RaceBarChart
                                        data={data.map(row => ({
                                            date: new Date(`${row.year.key}-${row.month.key}-01`),
                                            name: row.division.text,
                                            category: row.division.text,
                                            value: row.sales.value / 1000,
                                        }))}
                                        size={{ width: 800, height: 250 }}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card className={`${classes.flexCenter} ${classes.padding2} ${classes.margin2}`}>
                                    <VerticalBarChart
                                        data={data.sort((a, b) => a.month.key - b.month.key)
                                            .map(row => ({
                                                category: row.month.text,
                                                value: row.sales.value
                                            }))}
                                        size={{ width: 500, height: 250 }}
                                        resize="responsive"
                                    />

                                </Card>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card className={`${classes.flexCenter} ${classes.padding5} ${classes.margin2}`}>
                                <HorizontalBarChart
                                    data={data.sort((a, b) =>
                                        a.country.text < b.country.text ? -1
                                            : (a.country.text > b.country.text ? 1 : 0))
                                        .map(row => ({ category: row.country.text, value: row.qty.value }))}
                                    size={{ width: 500, height: 500 }}
                                    resize="responsive"
                                />
                            </Card>
                        </Grid>
                    </Grid>
                )}
        </Container>
    )
};

export default Dashboard;
