import './units.css';

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Layout, Space, Table, Tooltip, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { deleteActive } from '../Actives/api/activeProxy';
import { getAll, update } from '../Companies/api/companyProxy';
import { deleteUnit, getAllUnit, getById } from './api/unitProxy';
import { EditorModal } from './UnitsEditorModal/unitEditorModal';
import { FilterModal } from './UnitsFilterModal/unitFilterModal';


let visible = false;

export default class Units extends Component {
    
    columns = [{
        title: 'Ações',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle" align="start">
                <Tooltip title="Apagar Unidade">
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
                <Tooltip title="Editar Unidade">
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
            title: 'Empresa',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: 'Ativos',
            dataIndex: 'activesNumber',
            key: 'activesNumber',
    }];
    
    state = {
        lines: [],
        units: [],
        columns: this.columns,
        modal: visible,
        filterModal: visible,
        isCreated: true,
        companies: [],
        oldUnit: {
            name: '',
            company: [],
            actives: []
        }
    }

    async componentDidMount () {
        await getAll()
            .then(res => {
                const companies = res.data.elements;
                this.setState({companies});
            });
        
        await getAllUnit()
            .then(res => {
                const lines = res.data.elements;
                this.setState({units: lines});
                
                lines.forEach((line, index) => {
                    line.activesNumber = line.actives.length;
                });
                this.setState({lines});
            });
    }

    delete(unit) {
        let company = this.state.companies.filter(company => company.id === unit.company)[0];
        company.units = company.units.filter(unitComponet => unitComponet !== unit.id);

        update(company)
            .then(res => {
                console.log(res);
            })
        
        unit.actives.forEach(active => {
            deleteActive({id: active})
                .then(res => {
                    console.log(res);
                });
        })


        deleteUnit(unit)
           .then(res => {
               this.refresh(res.data.message);
           });
    }

    update(unit) {
        this.setState({isCreated: false});
        this.setState({modal: true});
        getById(unit.id)
            .then(res => {
                this.setState({oldUnit: res.data.elements[0]})
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
        this.setState({oldUnit: {
            name: '',
            company: [],
            actives: []
        }})
    }

    showFilterModal() {
        this.setState({filterModal: true});    
    }

    filter(filterOptions) {
        let newLines = [];
        
        this.setState({filterModal: false});
        const filter = filterOptions.filter;
        if (filterOptions.filter !== "0")
        {
            newLines = this.state.units.filter(unit => unit.company === filter);
            newLines.forEach((line) => {
                line.activesNumber = line.actives.length;
            });
            
            this.setState({lines: newLines});
        }
        else if (filterOptions.statusText !== 'Cancel') 
        {
            newLines = this.state.units
            newLines.forEach((line) => {
                line.activesNumber = line.actives.length;
            });

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
                    oldUnit={this.state.oldUnit} 
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
