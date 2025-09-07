import * as React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { SnackbarContext } from './GlobalContext';

interface ISnackbarProvdierProps {
    children: any;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

export const SnackbarContextProvider: React.FunctionComponent<ISnackbarProvdierProps> = ({
    children,
}: ISnackbarProvdierProps) => {
    const [snackbar, setSnackbar] = React.useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    const [providerValue] = React.useState({
        sendMessage: async (messageText: string, messageType: AlertColor = 'success') => {
            setSnackbar({
                open: true,
                message: messageText,
                severity: messageType
            });
        },
    });

    const handleClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={providerValue}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
