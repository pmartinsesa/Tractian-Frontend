import './header.css';

import { Layout } from 'antd';
import React from 'react';

const {Header} = Layout;

// eslint-disable-next-line import/no-anonymous-default-export
export default props =>
    <React.Fragment>
        <Header className="site-layout-background" style={{ padding: 0 }} />
    </React.Fragment>

