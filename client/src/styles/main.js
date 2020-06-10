//TODO: add some fancy transition when opening a new page, currently updating page feels unnatural

// The purpose of this file is to integrate all styles in one place and reuse classes in various components
import { createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

// Below components need to be imported to correctly overwrite styles with classes in useStyle
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';

// Custom palette - colors should be defined here and referenced in classes
const color1 = '#1A1A1D'; // black
const color2 = '#950740'; // dark purple
const color3 = '#F0F0F0'; // light grey
const color4 = '#6e6e6e'; // lighter black
const colorHoverLighter = 'rgba(255, 255, 255, 0.075)';
const colorHoverDarker = 'rgba(0, 0, 0, 0.075)';

// Overwrite colors with custom color palette
export const theme = createMuiTheme({
    palette: {
        primary: {
            light: color3,
            main: color1,
            dark: color2,
        },
        secondary: {
            main: color2,
        },
        text: {
            primary: color1,
            secondary: color4,
        },
    },
});

// Misc const used in styles
const drawerWidth = 300;

export const useStyles = makeStyles(theme => ({
    // Display and size
    main: {
        backgroundColor: color3,
        minWidth: '100%',
        minHeight: '100%',
    },
    flexSpaceBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
    },
    width100: {
        width: '100px',
    },
    spacingRight: {
        marginRight: theme.spacing(2),
    },
    height200: {
        height: '200px',
    },
    square200: {
        height: '200px',
        width: '200px',
        margin: '10px auto',
    },
    bottom20: {
        marginBottom: '20px',
    },
    padding2: {
        padding: theme.spacing(2),
    },
    padding4: {
        padding: theme.spacing(4),
    },
    padding5: {
        padding: theme.spacing(5),
    },
    margin2: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    margin4: {
        marginTop: theme.spacing(4),
        marginBottop: theme.spacing(4),
    },

    // Containers
    bgDark: {
        backgroundColor: color1,
    },
    bgColor: {
        backgroundColor: color2,
    },
    bgLight: {
        backgroundColor: color3,
    },
    bgHoverDarker: {
        backgroundColor: colorHoverDarker,
    },
    bgHoverLighter: {
        backgroundColor: colorHoverLighter,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        color: color3,
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: `${drawerWidth}px`,
    },
    formPaper: {
        padding: theme.spacing(2),
        color: color1,
        width: '33%',
        minWidth: '400px',
        marginTop: '3%',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            marginLeft: `${drawerWidth}px`,
        },
    },
    vertMargin: {
        marginBottom: '10px',
    },

    // Texts
    textColorLight: {
        color: color3,
    },
    textColorDark: {
        color: color1,
    },
    textColor: {
        color: color2,
    },
    noDecoration: {
        textDecoration: 'none',
    },
    center: {
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    halfTransp: {
        opacity: '0.5',
    },

    // Hidden
    hideMdUp: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    hideSmDown: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },

    // Misc
    loading: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5%',
        fontSize: '10em',
        color: color1,
    },
}));
