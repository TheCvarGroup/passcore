import { LinearProgress } from '@mui/material';
import * as React from 'react';
import * as zxcvbn from 'zxcvbn';

const measureStrength = (password: string): number =>
    Math.min(
        // @ts-expect-error
        zxcvbn.default(password).guesses_log10 * 10,
        100,
    );

interface IStrengthBarProps {
    newPassword: string;
}

export const PasswordStrengthBar: React.FunctionComponent<IStrengthBarProps> = ({ newPassword }: IStrengthBarProps) => {
    const getProgressColor = (strength: number) => {
        if (strength < 33) return '#ff5722';
        if (strength < 66) return '#ffc107';
        return '#4caf50';
    };

    const newStrength = measureStrength(newPassword);
    const progressColor = getProgressColor(newStrength);

    return (
        <LinearProgress
            variant="determinate"
            value={newStrength}
            sx={{
                color: '#000000',
                display: 'flex',
                flexGrow: 1,
                '& .MuiLinearProgress-bar': {
                    backgroundColor: progressColor,
                },
            }}
        />
    );
};
