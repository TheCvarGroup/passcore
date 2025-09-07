import { FormGroup, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as React from 'react';
import { GlobalContext } from '../Provider/GlobalContext';
import { IChangePasswordFormInitialModel, IChangePasswordFormProps } from '../types/Components';
import { PasswordGenerator } from './PasswordGenerator';
import { PasswordStrengthBar } from './PasswordStrengthBar';
import { ReCaptcha } from './ReCaptcha';

const defaultState: IChangePasswordFormInitialModel = {
    CurrentPassword: '',
    NewPassword: '',
    NewPasswordVerify: '',
    Recaptcha: '',
    Username: new URLSearchParams(window.location.search).get('userName') || '',
};

export const ChangePasswordForm: React.FunctionComponent<IChangePasswordFormProps> = ({
    submitData,
    toSubmitData,
    parentRef,
    onValidated,
    shouldReset,
    changeResetState,
    setReCaptchaToken,
    ReCaptchaToken,
}: IChangePasswordFormProps) => {
    const [fields, setFields] = React.useState({ ...defaultState });
    const [showPasswords, setShowPasswords] = React.useState({
        current: false,
        new: false,
        verify: false
    });
    
    const handleChange = (field: string, value: string) => {
        setFields(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'verify') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const { changePasswordForm, errorsPasswordForm, usePasswordGeneration, useEmail, showPasswordMeter, recaptcha } =
        React.useContext(GlobalContext);

    const {
        currentPasswordHelpblock,
        currentPasswordLabel,
        newPasswordHelpblock,
        newPasswordLabel,
        newPasswordVerifyHelpblock,
        newPasswordVerifyLabel,
        usernameDefaultDomainHelperBlock,
        usernameHelpblock,
        usernameLabel,
    } = changePasswordForm;

    const { fieldRequired, passwordMatch, usernameEmailPattern, usernamePattern } = errorsPasswordForm;

    const userNameValidations = ['required', useEmail ? 'isUserEmail' : 'isUserName'];
    const userNameErrorMessages = [fieldRequired, useEmail ? usernameEmailPattern : usernamePattern];
    const userNameHelperText = useEmail ? usernameHelpblock : usernameDefaultDomainHelperBlock;

    React.useEffect(() => {
        if (submitData) {
            toSubmitData(fields);
        }
    }, [submitData]);

    React.useEffect(() => {
        if (parentRef.current !== null && parentRef.current.isFormValid !== null) {
            parentRef.current.isFormValid().then((response: any) => {
                let validated = response;
                if (recaptcha.siteKey && recaptcha.siteKey !== '') {
                    validated = validated && ReCaptchaToken !== '';
                }
                onValidated(!validated);
            });
        }
    });

    React.useEffect(() => {
        if (shouldReset) {
            setFields({ ...defaultState });
            changeResetState(false);
        }
    }, [shouldReset]);

    const setGenerated = (password: any) => {
        setFields(prev => ({
            ...prev,
            NewPassword: password,
            NewPasswordVerify: password,
        }));
    };

    return (
        <FormGroup row={false} style={{ width: '80%', margin: '15px 0 0 10%' }}>
            <TextField
                autoFocus={true}
                inputProps={{
                    tabIndex: 1,
                }}
                id="Username"
                label={usernameLabel}
                helperText={userNameHelperText}
                name="Username"
                onChange={(e) => handleChange('Username', e.target.value)}
                value={fields.Username}
                sx={{
                    height: '20px',
                    margin: '15px 0 50px 0',
                }}
                fullWidth={true}
                required
            />
            <TextField
                inputProps={{
                    tabIndex: 2,
                }}
                label={currentPasswordLabel}
                helperText={currentPasswordHelpblock}
                id="CurrentPassword"
                name="CurrentPassword"
                onChange={(e) => handleChange('CurrentPassword', e.target.value)}
                type={showPasswords.current ? 'text' : 'password'}
                value={fields.CurrentPassword}
                sx={{
                    height: '20px',
                    marginBottom: '50px',
                }}
                fullWidth={true}
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle current password visibility"
                                onClick={() => togglePasswordVisibility('current')}
                                edge="end"
                            >
                                {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {usePasswordGeneration ? (
                <PasswordGenerator value={fields.NewPassword} setValue={setGenerated} />
            ) : (
                <>
                    <TextField
                        inputProps={{
                            tabIndex: 3,
                        }}
                        label={newPasswordLabel}
                        id="NewPassword"
                        name="NewPassword"
                        onChange={(e) => handleChange('NewPassword', e.target.value)}
                        type={showPasswords.new ? 'text' : 'password'}
                        value={fields.NewPassword}
                        sx={{
                            height: '20px',
                            marginBottom: '30px',
                        }}
                        fullWidth={true}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle new password visibility"
                                        onClick={() => togglePasswordVisibility('new')}
                                        edge="end"
                                    >
                                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {showPasswordMeter && <PasswordStrengthBar newPassword={fields.NewPassword} />}
                    <div
                        dangerouslySetInnerHTML={{ __html: newPasswordHelpblock }}
                        style={{ font: '12px Roboto,Helvetica, Arial, sans-serif', marginBottom: '15px' }}
                    />
                    <TextField
                        inputProps={{
                            tabIndex: 4,
                        }}
                        label={newPasswordVerifyLabel}
                        helperText={newPasswordVerifyHelpblock}
                        id="NewPasswordVerify"
                        name="NewPasswordVerify"
                        onChange={(e) => handleChange('NewPasswordVerify', e.target.value)}
                        type={showPasswords.verify ? 'text' : 'password'}
                        value={fields.NewPasswordVerify}
                        sx={{
                            height: '20px',
                            marginBottom: '50px',
                        }}
                        fullWidth={true}
                        required
                        error={fields.NewPasswordVerify !== '' && fields.NewPasswordVerify !== fields.NewPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password verification visibility"
                                        onClick={() => togglePasswordVisibility('verify')}
                                        edge="end"
                                    >
                                        {showPasswords.verify ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </>
            )}

            {recaptcha.siteKey && recaptcha.siteKey !== '' && (
                <ReCaptcha setToken={setReCaptchaToken} shouldReset={false} />
            )}
        </FormGroup>
    );
};
