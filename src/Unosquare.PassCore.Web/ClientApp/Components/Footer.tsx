import { Grid, Typography } from '@mui/material';
import * as React from 'react';
import mitLogo from '../assets/images/License_icon-mit.svg.png';
import uslogo from '../assets/images/logo.png';
import osiLogo from '../assets/images/osi.png';
import passcoreLogo from '../assets/images/passcore-logo.png';

export const Footer: React.FunctionComponent<any> = () => (
    <div
        style={{
            marginTop: '40px',
            width: '650px',
        }}
    >
        <Grid alignItems="center" container direction="row" justifyContent="space-between">
            <Grid item xs={8}>
                <img src={passcoreLogo} style={{ marginLeft: '15px', maxWidth: '125px' }} />
            </Grid>
            <Grid item xs={4}>
                <img src={osiLogo} style={{ margin: '0 10px 0 40px', maxHeight: '30px' }} />
                <img src={mitLogo} style={{ marginRight: '10px', maxHeight: '30px' }} />
                <img src={uslogo} style={{ maxHeight: '30px' }} />
            </Grid>
        </Grid>
        <Grid alignItems="center" container direction="column" justifyContent="space-evenly">
            <Typography align="center" variant="caption">
                Powered by PassCore v5.0.0 - Open Source Initiative and MIT Licensed
            </Typography>
            <Typography align="center" variant="caption">
                Copyright © 2016-2025 Unosquare
            </Typography>
        </Grid>
    </div>
);
