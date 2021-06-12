import './actives.css';

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Layout, Space, Table, Tooltip, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { deleteActive, getAllActive, getById } from './api/activeProxy';
import { getAllUnit, updateUnit } from '../Units/api/unitProxy';
import { getAll } from '../Companies/api/companyProxy';
import { EditorModal } from './ActivesEditorModal/activeEditorModal';
import { FilterModal } from './ActivesFilterModal/activeFilterModal';


let visible = false;

export default class Actives extends Component {
    
    columns = [{
        title: 'Ações',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle" align="start">
                <Tooltip title="Apagar Ativo">
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
                <Tooltip title="Editar Ativo">
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
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Modelo',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Responsável',
            dataIndex: 'responsible',
            key: 'responsible',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Nível de Saúde',
            dataIndex: 'healthLevel',
            key: 'healthLevel',
        },
        {
            title: 'Unidade',
            dataIndex: 'unitName',
            key: 'unitName',
        },
       ];
    
    state = {
        lines: [],
        actives: [],
        columns: this.columns,
        modal: visible,
        filterModal: visible,
        isCreated: true,
        units: [],
        companies: [],
        oldActive: {
            description: '',
            healthLevel: '',
            model: '',
            name: '',
            responsible: '',
            status: '',
            unit: [],
        }
    }

    async componentDidMount () {
        await getAllUnit()
            .then(res => {
                const units = res.data.elements;
                this.setState({units});
            });

        await getAll()
            .then(res => {
                const companies = res.data.elements;
                this.setState({companies});
            });
        
        await getAllActive()
            .then(res => {
                const lines = res.data.elements;
                this.setState({actives: lines});
            
                this.setState({lines});
            });
    }

    delete(active) {
        let unit = this.state.units.filter(unit => unit.id === active.unit)[0];
        unit.actives = unit.actives.filter(activeComponet => activeComponet !== active.id);

        updateUnit(unit)
            .then(res => {
                console.log(res);
            })
        
        deleteActive(active)
           .then(res => {
               this.refresh(res.data.message);
           });
    }

    update(active) {
        this.setState({isCreated: false});
        this.setState({modal: true});
        getById(active.id)
            .then(res => {
                this.setState({oldActive: res.data.elements[0]})
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
        this.setState({oldActive: {
            description: '',
            healthLevel: '',
            model: '',
            name: '',
            responsible: '',
            status: '',
            unit: ''
        }})
    }

    showFilterModal() {
        this.setState({filterModal: true});    
    }

    filter(filterOptions) {
        let newLines = [];
        

        this.setState({filterModal: false});
        const filter = filterOptions.filter;
        if (filter.unit !== "0")
        {
            newLines = this.state.actives.filter(active => active.unit === filter.unit);
            this.setState({lines: newLines});
        }
        else if (filter.company !== "0")
        {
            let filterByThisUnits = this.state.units.filter(unit => unit.company === filter.company);
            filterByThisUnits.forEach(unit => {
                newLines = newLines.concat(this.state.actives.filter(active => active.unit === unit.id));
            })
            
            this.setState({lines: newLines});
        }
        else if (filterOptions.statusText !== 'Cancel') 
        {
            newLines = this.state.actives
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
                    oldActive={this.state.oldActive} 
                    isCreated={this.state.isCreated} 
                    visible={this.state.modal} 
                    callbackParent={(status) => this.refresh(status)}
                    units={this.state.units}
                />
                <FilterModal
                    visible={this.state.filterModal} 
                    callbackParent={(filterOptions) => this.filter(filterOptions)}
                    units={this.state.units}
                    companies={this.state.companies}
                />
                <Table dataSource={this.state.lines} columns={this.state.columns} />
            </Layout>            
        )
    };
}
