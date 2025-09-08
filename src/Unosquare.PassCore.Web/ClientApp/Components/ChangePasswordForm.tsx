import { FormGroup, TextField } from '@mui/material';
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
    onValidated,
    shouldReset,
    changeResetState,
    setReCaptchaToken,
    ReCaptchaToken,
}: IChangePasswordFormProps) => {
    const [fields, setFields] = React.useState({ ...defaultState });
    const [showPassword, setShowPassword] = React.useState(false);
    
    const handleChange = (field: string, value: string) => {
        setFields(prev => ({ ...prev, [field]: value }));
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
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

    // Form validation logic
    const isFormValid = () => {
        const hasCurrentPassword = fields.CurrentPassword && fields.CurrentPassword.trim() !== '';
        const hasNewPassword = fields.NewPassword && fields.NewPassword.trim() !== '';
        const hasVerifyPassword = fields.NewPasswordVerify && fields.NewPasswordVerify.trim() !== '';
        const passwordsMatch = fields.NewPassword === fields.NewPasswordVerify;
        const recaptchaValid = !recaptcha.siteKey || recaptcha.siteKey === '' || ReCaptchaToken !== '';
        
        return hasCurrentPassword && hasNewPassword && hasVerifyPassword && passwordsMatch && recaptchaValid;
    };

    React.useEffect(() => {
        const validated = isFormValid();
        onValidated(!validated);
    }, [fields.CurrentPassword, fields.NewPassword, fields.NewPasswordVerify, ReCaptchaToken]);

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
        <FormGroup row={false} style={{ width: '80%', margin: '15px 0 0 10%', gap: '10px' }}>
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
                    marginTop: '10px',
                    marginBottom: '5px',
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
                type={showPassword ? 'text' : 'password'}
                value={fields.CurrentPassword}
                sx={{
                    marginBottom: '5px',
                }}
                fullWidth={true}
                required
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
                        type={showPassword ? 'text' : 'password'}
                        value={fields.NewPassword}
                        sx={{
                            marginBottom: '30px',
                        }}
                        fullWidth={true}
                        required
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
                        type={showPassword ? 'text' : 'password'}
                        value={fields.NewPasswordVerify}
                        sx={{
                            marginBottom: '30px',
                        }}
                        fullWidth={true}
                        required
                        error={fields.NewPasswordVerify !== '' && fields.NewPasswordVerify !== fields.NewPassword}
                    />
                </>
            )}

            {recaptcha.siteKey && recaptcha.siteKey !== '' && (
                <ReCaptcha setToken={setReCaptchaToken} shouldReset={false} />
            )}

            {/* Checkbox to toggle password visibility */}
            <label style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontSize: '14px', marginTop: '-20px' }}>
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={handleTogglePassword}
                />{' '}
                Show Passwords
            </label>
        </FormGroup>
    );
};
