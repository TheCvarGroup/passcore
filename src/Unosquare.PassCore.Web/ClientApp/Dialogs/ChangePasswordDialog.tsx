import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import * as React from 'react';
import { GlobalContext } from '../Provider/GlobalContext';

interface IChangePasswordDialogProps {
    open: boolean;
    onClose: any;
}

export const ChangePasswordDialog: React.FunctionComponent<IChangePasswordDialogProps> = ({
    open,
    onClose,
}: IChangePasswordDialogProps) => {
    const { successAlertBody, successAlertTitle } = React.useContext(GlobalContext).alerts;
    return (
        <Dialog open={open} disableEscapeKeyDown={true}>
            <DialogTitle>{successAlertTitle}</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">{successAlertBody}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    style={{
                        margin: '10px 0 0 75%',
                        width: '25%',
                    }}
                >
                    Ok
                </Button>
            </DialogContent>
        </Dialog>
    );
};
