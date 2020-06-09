import React from 'react';
import { useStyles } from '../styles/main';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loading = () => {
    const classes = useStyles();

    return (
        <Container className={classes.loading}>
            <CircularProgress color="secondary" />
        </Container>
    );
};

export const Empty = () => {
    const classes = useStyles();

    return (
        <Container className={classes.loading}>
            <i className="optin monster icon" href="/" />
            <Typography variant="h5">Oops... No sprints found. Lazy, lazy...</Typography>
        </Container>
    );
};
