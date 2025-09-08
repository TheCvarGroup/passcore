import * as React from 'react';
import { ChangePassword } from './ChangePassword';
import { ClientAppBar } from './ClientAppBar';

export const EntryPoint: React.FunctionComponent<any> = () => (
    <React.Fragment>
        <ClientAppBar />
        <main
            style={{
                marginLeft: 'calc((100% - 650px)/2)',
            }}
        >
            <ChangePassword />
        </main>
    </React.Fragment>
);
