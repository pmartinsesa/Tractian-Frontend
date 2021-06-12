import './users.css';

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Layout, Space, Table, Tooltip, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { getAll, update } from '../Companies/api/companyProxy';
import { deleteUser, getAllUser, getById } from './api/userProxy';
import { EditorModal } from './UsersEditorModal/userEditorModal';
import { FilterModal } from './UsersFilterModal/userFilterModal';


let visible = false;

export default class Users extends Component {
    
    columns = [{
        title: 'Ações',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle" align="start">
                <Tooltip title="Apagar Usuário">
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
                <Tooltip title="Editar Usuário">
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
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Sobrenome',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Empresa',
            dataIndex: 'companyName',
            key: 'companyName',
        },
    ];
    
    state = {
        lines: [],
        users: [],
        columns: this.columns,
        modal: visible,
        filterModal: visible,
        isCreated: true,
        companies: [],
        oldUser: {
            firstName: '',
            lastName: '',
            email: '',
            company: [],
        }
    }

    async componentDidMount () {
        await getAll()
            .then(res => {
                const companies = res.data.elements;
                this.setState({companies});
            });
        
        await getAllUser()
            .then(res => {
                const lines = res.data.elements;
                this.setState({users: lines});
                
                this.setState({lines});
            });
    }

    delete(user) {
        let company = this.state.companies.filter(company => company.id === user.company)[0];
        company.users = company.users.filter(userComponet => userComponet !== user.id);

        update(company)
            .then(res => {
                console.log(res);
            })
        
        deleteUser(user)
           .then(res => {
               this.refresh(res.data.message);
           });
    }

    update(user) {
        this.setState({isCreated: false});
        this.setState({modal: true});
        getById(user.id)
            .then(res => {
                this.setState({oldUser: res.data.elements[0]})
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
        this.setState({oldUser: {
            firstName: '',
            lastName: '',
            email: '',
            company: [],
        }})
    }

    showFilterModal() {
        this.setState({filterModal: true});    
    }

    filter(filterOptions) {
        let newLines = [];
        
        this.setState({filterModal: false});
        const filter = filterOptions.filter;
        console.log(filter);
        if (filterOptions.filter !== "0")
        {
            newLines = this.state.users.filter(user => user.company === filter);
            this.setState({lines: newLines});
        }
        else if (filterOptions.statusText !== 'Cancel') 
        {
            newLines = this.state.users
            this.setState({lines: newLines});
        }
    }

    render() {
        return (
            <Layout>
                <div className="site-button-primary">
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={e => this.showModal()}>
                            Adicionar
                        </Button>

                        <Button icon={<SearchOutlined />} onClick={e => this.showFilterModal()}>
                            Filtrar
                        </Button>
                    </Space>
                </div>
                <EditorModal
                    oldUser={this.state.oldUser} 
                    isCreated={this.state.isCreated} 
                    visible={this.state.modal} 
                    callbackParent={(status) => this.refresh(status)}
                    companies={this.state.companies}
                />
                <FilterModal
                    visible={this.state.filterModal} 
                    callbackParent={(filterOptions) => this.filter(filterOptions)}
                    companies={this.state.companies}
                />
                <Table dataSource={this.state.lines} columns={this.state.columns} />
            </Layout>            
        )
    };
}
