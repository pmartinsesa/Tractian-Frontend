import 'antd/dist/antd.css';

import { Button, Form, Input, Modal, Select, Slider, Space } from 'antd';
import React from 'react';

import { updateUnit } from '../../Units/api/unitProxy';
import { create, updateActive } from '../api/activeProxy';


export const EditorModal = (props) => {
    const title = props.isCreated ? 'Novo Ativo' : 'Alterar Ativo';  
    const {Item} = Form;
    const { Option } = Select;

    const units = [];

    const status = [
        <Option key={'Em Operação'}>Em Operação</Option>,
        <Option key={'Em Alerta'}>Em Alerta</Option>,
        <Option key={'Em Parada'}>Em Parada</Option>
    ];

    for (let i = 0; i < props.units.length; i++) {
        units.push(<Option key={props.units[i].id}>{props.units[i].name}</Option>);
    }

    const save = (active) => {
        if (props.isCreated)
        {           
            const newUnit = props.units.filter(unit => unit.id === active.unit);

            const newActive = {
                name: active.name,
                description: active.description,
                healthLevel: active.healthLevel.toString(),
                model: active.model,
                responsible: active.responsible,
                status: active.status,
                unit: active.unit,
                unitName: newUnit[0].name,
            }

            create(newActive)
                .then(res => {
                    const createdActive = res.data.element;
                    
                    let updatedUnit = {
                        ...newUnit[0],
                    };

                    updatedUnit.actives.push(createdActive.id);
                    updateUnit(updatedUnit)
                        .then(res => {
                            console.log(res.data.message);
                        })
                    
                    props.callbackParent(res.data.message);        
                });        
        }
        else
        {
            const newUnit = props.units.filter(unit => unit.id === active.unit);
            const newActive = {
                ...props.oldActive,
                name: active.name,
                description: active.description,
                healthLevel: active.healthLevel.toString(),
                model: active.model,
                responsible: active.responsible,
                status: active.status,
                unit: active.unit,
                unitName: newUnit[0].name,
            };

            if (active.unit !== props.oldActive.unit)
            {
                const oldUnit = props.units.filter(unit => unit.id === props.oldActive.unit);

                let updatedUnit = {
                    ...newUnit[0]
                };

                let updatedOldUnit = {
                    ...oldUnit[0]
                };

                updatedOldUnit.actives = updatedOldUnit.actives.filter(active => active !== newActive.id);

                updateUnit(updatedOldUnit)
                        .then(res => {
                            console.log(res);
                        })
            
                updatedUnit.actives.push(newActive.id);
                updateUnit(updatedUnit)
                    .then(res => {
                        console.log(res.data.message);
                    })
            }

            updateActive(newActive)
                .then(res => {
                    props.callbackParent(res.data);  
                })
        }
    };
    
    const cancel = () => {
        props.callbackParent({statusText: 'cancel'});
    }       

    return (
        <React.Fragment>
            <Modal
                title={title}
                visible={props.visible}
                onCancel={cancel}
                footer={[]}
            >
                <Form
                    initialValues={{
                        name: props.oldActive.name
                    }}
                    onFinish={save}
                >
                    <Item 
                        name="name"
                        label="Nome"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Nome do Ativo é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>

                    <Item 
                        name="description"
                        label="Descrição"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'A Descrição do Ativo é Obrigatória',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>

                    <Item 
                        name="model"
                        label="Modelo"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Modelo do Ativo é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>

                    <Item 
                        name="responsible"
                        label="Responsável"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Responsável do Ativo é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>

                    <Item 
                        label="Status"
                        name="status"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'Status do Ativo',
                            }
                        ]}
                    >
                        <Select>
                            {status}
                        </Select>
                    </Item>

                    <Item 
                        label="Nível de Saúde"
                        name="healthLevel"
                        rules={[
                            {
                                required: true,
                                message: 'Selecione o Nível de Saúde',
                            }
                        ]}
                    >
                       <Slider />
                     
                    </Item>

                    <Item 
                        label="Unidade"
                        name="unit"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'Selecione a Unidade',
                            }
                        ]}
                    >
                        <Select>
                            {units}
                        </Select>
                    </Item>

                    <Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Salvar</Button>
                            <Button onClick={cancel}>Cancelar</Button>
                        </Space>
                    </Item>
                </Form>
            </Modal>
        </React.Fragment>
    )
}