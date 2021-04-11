import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Grid, withTheme } from '@material-ui/core/';
import { SuspenseImg } from "../utils/SuspenseImg";
import bg from '../img/bg.jpg';
import bgSm from '../img/bg-sm.jpg';


const useStyles = makeStyles((theme) =>
    createStyles({
        bg: {
            minHeight: "100vh",
            minWidth: "100vw",
            backgroundColor: "#000",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -100,
        },
        screen: {
            position: "fixed",
            height: "100vh",
            width: "100%",
            zIndex: -50,
            backgroundColor: "#000",
            transformStyle: "preserve-3d",
            overflow: "hidden",
            border: "none",
            "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            },
        },
        bgImg: {
            backgroundColor: "#000",
            objectFit: "cover",
            height: "100vh",
            width: "100%",
            color: "white",
        },
        blur: {
            filter: "blur(25px)",
            overflow: "hidden",
        },
        blurOff: {
            filter: "blur(25px)",
            animation: `$no-filter .15s linear forwards`,
        },
        "@keyframes no-transform": {
            "100%": {
                opacity: 1,
                transform: "none",
            },
        },
        "@keyframes no-filter": {
            "100%": {
                filter: "none",
            },
        },
        container: {
            fontFamily: "Open Sans",
            textAlign: "center",
            width: "90%",
            margin: "0 auto",
            '& div, p': {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "10em",
            }
        },
        glassMorphic: {
            textAlign: "center",
            padding: ".5em",
            // backgroundColor: "rgba(255, 255, 255)",
            background: "linear-gradient(145deg, rgba(255, 255, 255, .25) 0%, rgba(255, 255, 255, .1) 100%)",
            backdropFilter: "blur(4px)",
            border: "solid rgba(255, 255, 255, .18) 1.2px",
            borderRadius: "10px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            color: "white",
            marginBottom: "1em",
        },
        title: {
            color: "#E1E5F2",
            fontWeight: "bold",
            width: "50%",
            minWidth: "100%",
            marginTop: "2em",
            marginBottom: "1em",
        },
        noUnderline: {
            textDecoration: "none",
        },
        linkUnderlineAnim: {
            position: "relative",
            color: "#E1E5F2",
            transition: "color .4s ease-out",
            fontWeight: "bold",
            margin: ".2em auto",
            "&::after": {
                content: "''",
                borderRadius: "1em",
                borderTop: `.1em solid #E1E5F2`,
                position: "absolute",
                right: "100%",
                bottom: "-.2em",
                left: 0,
                transition:
                    "right .4s cubic-bezier(0, .5, 0, 1), border-color .4s ease-out",
            },
            "&:hover": {
                color: "#E85D75",
            },
            "&:hover::after": {
                borderColor: "#E85D75",
                animation: "$anchor-underline 2s cubic-bezier(0, .5, 0, 1) infinite",
            },
        },
        "@keyframes anchor-underline": {
            "0%, 10%": {
                left: "0%",
                right: "100%",
            },
            "40%, 60%": {
                left: "0%",
                right: "0%",
            },
            "90%, 100%": {
                left: "100%",
                right: "0%",
            },
        },
    })
);

// TODO: create a file with dimension names mapping
const Dashboard = ({ data }) => {
    const classes = useStyles();

    return (
        <div className={classes.bg}>
            <div className={classes.screen}>
                <SuspenseImg
                    alt="background"
                    img={{
                        img: bg,
                        className: `${classes.bgImg} ${classes.blurOff}`,
                    }}
                    fallback={{
                        img: bgSm,
                        className: `${classes.bgImg} ${classes.blur}`,
                    }}
                />
            </div>



            <Grid container justify="space-evenly" className={classes.container}>
                    <Typography color="inherit" variant="h3" className={clsx(classes.title)}>
                        Click to see example viz setup
                    </Typography>
                    <Grid item xs={10} sm={5} className={classes.glassMorphic}>
                        <a href="https://github.com/spookydoodle/dataviz-sap-bw-odata-node-react" target="_blank" rel="noopener noreferrer" className={classes.noUnderline}>
                            <Typography color="inherit" variant="h5" className={classes.linkUnderlineAnim}>
                            🔭 Git repo backend 
                        </Typography>
                        </a>
                    </Grid>
                    <Grid item xs={10} sm={5} container direction="column" className={classes.glassMorphic}>
                        <a href="https://dataviz.spookydoodle.com" target="_blank" rel="noopener noreferrer" className={classes.noUnderline}>
                            <Typography color="inherit" variant="h5" className={classes.linkUnderlineAnim}>
                                💖 Dashboard
                        </Typography>
                        </a>
                        <a href="https://github.com/spookydoodle/dataviz" target="_blank" rel="noopener noreferrer" className={classes.noUnderline}>
                            <Typography color="inherit" variant="h5" className={classes.linkUnderlineAnim}>
                                📊 Git repo front-end
                        </Typography>
                        </a>
                </Grid>
            </Grid>
        </div>
    )
};

export default Dashboard;
