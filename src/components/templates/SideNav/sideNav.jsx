import './sideNav.css';
import 'antd/dist/antd.css';

import { ApartmentOutlined, ControlFilled, HomeOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { Component } from 'react';

import RouterLink from './RouterLinks/routerLink';

const { Sider } = Layout;
let key;

export default class SideNav extends Component {
    
    componentDidMount() {
        const activyPath = window.location.href.split('/')[3];

        switch(activyPath) {
            case 'home':
                key = "1";
                break;
            case 'companies':
                key = "2";
                break;
            case 'units':
                key = "3";
                break;
            case 'actives':
                key = "4";
                break;
            case 'users':
                key = "5";
                break;           
            default:
                key = "1";
                break;
        }
    }
    
    state = {
        collapsed: this.props.collapsed    
    };
    
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };
    
    render() {
        this.componentDidMount();
        const { collapsed } = this.state;
      
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <Menu theme="dark" defaultSelectedKeys={key} mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined />} defaultChecked>
                        <RouterLink link="home" name="Home"/>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<ShopOutlined />}>
                        <RouterLink link="companies" name="Empresas"/>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ApartmentOutlined/>}>
                        <RouterLink link="units" name="Unidades"/>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ControlFilled />}>
                        <RouterLink link="actives" name="Ativos"/>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<UserOutlined />}>
                        <RouterLink link="users" name="Usuários"/>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    };
}