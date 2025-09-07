import { IconButton, InputAdornment, TextField, CircularProgress } from '@mui/material';
import { FileCopy, Visibility, VisibilityOff } from '@mui/icons-material';
import * as React from 'react';
import { SnackbarContext } from '../Provider/GlobalContext';
import { IPasswordGenProps } from '../types/Components';
import { fetchRequest } from '../Utils/FetchRequest';

export const PasswordGenerator: React.FunctionComponent<IPasswordGenProps> = ({
    value,
    setValue,
}: IPasswordGenProps) => {
    const { sendMessage } = React.useContext(SnackbarContext);
    const [visibility, setVisibility] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);

    const onMouseDownVisibility = () => setVisibility(true);
    const onMouseUpVisibility = () => setVisibility(false);

    const copyPassword = () => {
        navigator.clipboard.writeText(value);
        sendMessage('Password copied');
    };

    const retrievePassword = () => {
        fetchRequest('api/password/generated', 'GET').then((response: any) => {
            if (response && response.password) {
                setValue(response.password);
                setLoading(false);
            }
        });
    };

    React.useEffect(() => {
        retrievePassword();
    }, []);

    return isLoading ? (
        <div style={{ paddingTop: '30px' }}>
            <CircularProgress />
        </div>
    ) : (
        <TextField
            id="generatedPassword"
            disabled={true}
            label="New Password"
            value={value}
            type={visibility ? 'text' : 'Password'}
            sx={{
                height: '20px',
                margin: '30px 0 30px 0',
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                            onMouseDown={onMouseDownVisibility}
                            onMouseUp={onMouseUpVisibility}
                            tabIndex={-1}
                        >
                            {visibility ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        <IconButton aria-label="Copy password to clipboard" onClick={copyPassword} tabIndex={-1}>
                            <FileCopy />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
