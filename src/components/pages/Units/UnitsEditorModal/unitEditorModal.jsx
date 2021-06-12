import 'antd/dist/antd.css';

import { Button, Form, Input, Modal, Select, Space } from 'antd';
import React from 'react';

import { create, updateUnit } from '../api/unitProxy';
import {update} from '../../Companies/api/companyProxy'

export const EditorModal = (props) => {
    const title = props.isCreated ? 'Nova Unidade' : 'Altere a Unidade';  
    const {Item} = Form;
    const { Option } = Select;

    const companies = [];
    for (let i = 0; i < props.companies.length; i++) {
        companies.push(<Option key={props.companies[i].id}>{props.companies[i].name}</Option>);
    }

    const save = (unit) => {
        if (props.isCreated)
        {           
            const newCompany = props.companies.filter(company => company.id === unit.company);

            const newUnit = {
                name: unit.name,
                company: unit.company,
                companyName: newCompany[0].name,
                actives: [],
            }

            create(newUnit)
                .then(res => {
                    const createdUnit = res.data.element;
                    
                    let updatedCompany = {
                        ...newCompany[0],
                    };

                    updatedCompany.units.push(createdUnit.id);
                    update(updatedCompany)
                        .then(res => {
                            console.log(res.data.message);
                        })
                    
                    props.callbackParent(res.data.message);        
                });        
        }
        else
        {
            const newCompany = props.companies.filter(company => company.id === unit.company);

            const newUnit = {
                ...props.oldUnit,
                name: unit.name,
                company: unit.company,
                companyName: newCompany[0].name
            };

            if (unit.company !== props.oldUnit.company)
            {
                const oldCompany = props.companies.filter(company => company.id === props.oldUnit.company);

                let updatedCompany = {
                    ...newCompany[0]
                };

                let updatedOldCompany = {
                    ...oldCompany[0]
                };

                updatedOldCompany.units = updatedOldCompany.units.filter(unit => unit !== newUnit.id);
           
                update(updatedOldCompany)
                        .then(res => {
                            console.log(res);
                        })
            
                updatedCompany.units.push(newUnit.id);
                update(updatedCompany)
                    .then(res => {
                        console.log(res.data.message);
                    })
            }

            updateUnit(newUnit)
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
                        name: props.oldUnit.name
                    }}
                    onFinish={save}
                >
                    <Item 
                        name="name"
                        label="Nome da Unidade"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Nome da Unidade é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>

                    <Item 
                        label="Empresa"
                        name="company"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'Selecione a Empresa',
                            }
                        ]}
                    >
                        <Select>
                            {companies}
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