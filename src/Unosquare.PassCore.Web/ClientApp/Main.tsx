import { Grid, Typography, CircularProgress } from '@mui/material';
import * as React from 'react';
import { EntryPoint } from './Components/EntryPoint';
import { loadReCaptcha } from './Components/GoogleReCaptcha';
import { GlobalContextProvider } from './Provider/GlobalContextProvider';
import { SnackbarContextProvider } from './Provider/SnackbarContextProvider';
import { resolveAppSettings } from './Utils/AppSettings';

export const Main: React.FunctionComponent<any> = () => {
    const [settings, setSettings] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadSettings = async () => {
            try {
                const appSettings = await resolveAppSettings();
                setSettings(appSettings);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load app settings:', error);
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    React.useEffect(() => {
        if (settings && settings.recaptcha) {
            if (settings.recaptcha.siteKey !== '') {
                loadReCaptcha();
            }
        }
    }, [settings]);

    if (isLoading) {
        return (
            <Grid container alignItems="center" direction="column" justifyContent="center" sx={{ minHeight: '100vh' }}>
                <Grid item key="title">
                    <Typography variant="h3" align="center">
                        Loading Passcore...
                    </Typography>
                </Grid>
                <Grid item>
                    <CircularProgress />
                </Grid>
            </Grid>
        );
    }

    document.getElementById('title').innerHTML = settings.applicationTitle;

    return (
        <GlobalContextProvider settings={settings}>
            <SnackbarContextProvider>
                <EntryPoint />
            </SnackbarContextProvider>
        </GlobalContextProvider>
    );
};
