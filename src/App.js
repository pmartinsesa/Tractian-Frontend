import './App.css';
import 'font-awesome/css/font-awesome.min.css';

import Layout from 'antd/lib/layout/layout';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import MyHeader from './components/templates/Header/header';
import SideNav from './components/templates/SideNav/sideNav';
import Footer from './components/templates/Footer/footer';
import Routes from './routes/routes';

function App() {
  return (
    <BrowserRouter>
      <Layout className="ant-layout-has-sider" style={{ minHeight: "100vh" }}>
        <SideNav collapsed={false}/>
        <Layout className="site-layout">
          <MyHeader />
          <div className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}>
            <Routes />
          </div>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
