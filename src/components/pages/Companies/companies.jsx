import './companies.css';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Space, Table, Tooltip, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { deleteUnit } from '../Units/api/unitProxy';
import { deleteUser } from '../Users/api/userProxy';
import { deleteCompany, getAll, getById } from './api/companyProxy';
import { EditorModal } from './CompanyEditorModal/companyEditorModal';

let visible = false;

export default class Companies extends Component {
    
    columns = [{
        title: 'Ações',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle" align="start">
                <Tooltip title="Apagar Empresa">
                    <Popconfirm
                        placement="right"
                        title={'Deseja Realmente Excluir? '}
                        onConfirm={(e) => this.delete(record)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Button 
                            type="danger" 
                            icon={<DeleteOutlined />} 
                        />        
                    </Popconfirm>        
                </Tooltip>
                <Tooltip title="Editar Empresa">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={(e) => this.update(record)} 
                    />
                </Tooltip>
            </Space>
            ),
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Unidades',
            dataIndex: 'unitsNumber',
            key: 'unitsNumber',
        },
        {
            title: 'Usuários',
            dataIndex: 'usersNumber',
            key: 'usersusersNumber',
    }];
    
    state = {
        lines: [],
        columns: this.columns,
        modal: visible,
        isCreated: true,
        oldCompany: {
            name: '',
            units: [],
            users: []
        }
    }

    componentDidMount () {
        getAll()
            .then(res => {
                const lines = res.data.elements;
                lines.forEach(line => {
                    line.usersNumber = line.users.length;
                    line.unitsNumber = line.units.length;
                });
                this.setState({lines});
            });
    }

    delete(company) {
        company.units.forEach(unit => {
            deleteUnit({id: unit})
                .then(res => {
                    console.log(res);
                });
        })

        company.users.forEach(unit => {
            deleteUser({id: unit})
                .then(res => {
                    console.log(res);
                });
        })

        deleteCompany(company)
            .then(res => {
                this.refresh(res.data.message);
            });
    }

    update(company) {
        this.setState({isCreated: false});
        this.setState({modal: true});
        getById(company.id)
            .then(res => {
                this.setState({oldCompany: res.data.elements[0]})
            });
    }   

    refresh(status) {
        this.setState({modal: false});
        if (status === "Created" || status === "OK") {
            this.componentDidMount();
            status = undefined;
        }
    }

    showModal() {
        this.setState({isCreated: true});
        this.setState({modal: true});
        this.setState({oldCompany: {
            name: '',
            units: [],
            users: []
        }})
    }

    render() {
        return (
            <Layout>
                <div className="site-button-primary">
                    <Button type="primary" icon={<PlusOutlined />} onClick={e => this.showModal()}>
                        Adicionar
                    </Button>
                </div>
                <EditorModal
                    oldCompany={this.state.oldCompany} 
                    isCreated={this.state.isCreated} 
                    visible={this.state.modal} 
                    callbackParent={(status) => this.refresh(status)}
                />
                <Table dataSource={this.state.lines} columns={this.state.columns} />
            </Layout>            
        )
    };
}
