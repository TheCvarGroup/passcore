import './vendor';

import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Main } from './Main';

const theme = createTheme({
    palette: {
        error: {
            main: '#f44336',
        },
        primary: {
            main: '#304FF3',
        },
        secondary: {
            main: '#fff',
        },
        text: {
            primary: '#191919',
            secondary: '#000',
        },
    },
    zIndex: {
        appBar: 1201,
    },
});

const passcoreTheme = responsiveFontSizes(theme);

const container = document.getElementById('rootNode');
const root = createRoot(container!);

root.render(
    <ThemeProvider theme={passcoreTheme}>
        <Main />
    </ThemeProvider>
);
