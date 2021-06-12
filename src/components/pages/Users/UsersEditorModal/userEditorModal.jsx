import 'antd/dist/antd.css';

import { Button, Form, Input, Modal, Select, Space } from 'antd';
import React from 'react';

import { create, updateUser } from '../api/userProxy';
import {update} from '../../Companies/api/companyProxy'

export const EditorModal = (props) => {
    const title = props.isCreated ? 'Novo Usuário' : 'Altere o Usuário';  
    const {Item} = Form;
    const { Option } = Select;

    const companies = [];
    for (let i = 0; i < props.companies.length; i++) {
        companies.push(<Option key={props.companies[i].id}>{props.companies[i].name}</Option>);
    }

    const save = (user) => {
        if (props.isCreated)
        {           
            const newCompany = props.companies.filter(company => company.id === user.company);

            const newUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                company: user.company,
                companyName: newCompany[0].name,

            }

            create(newUser)
                .then(res => {
                    const createdUser = res.data.element;

                    let updatedCompany = {
                        ...newCompany[0],
                    };

                    updatedCompany.users.push(createdUser.id);
                    update(updatedCompany)
                        .then(res => {
                            console.log(res.data.message);
                        })
                    
                    props.callbackParent(res.data.message);        
                });        
        }
        else
        {
            const newCompany = props.companies.filter(company => company.id === user.company);


            const newUser = {
                ...props.oldUser,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                company: user.company,
                companyName: newCompany[0].name
            };

            if (user.company !== props.oldUser.company)
            {
                const oldCompany = props.companies.filter(company => company.id === props.oldUser.company);

                let updatedCompany = {
                    ...newCompany[0]
                };

                let updatedOldCompany = {
                    ...oldCompany[0]
                };

                updatedOldCompany.users = updatedOldCompany.users.filter(user => user !== newUser.id);

                update(updatedOldCompany)
                        .then(res => {
                            console.log(res);
                        })
            
                updatedCompany.users.push(newUser.id);
                update(updatedCompany)
                    .then(res => {
                        console.log(res.data.message);
                    })

            }

            updateUser(newUser)
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
                        firstName: props.oldUser.firstName
                    }}
                    onFinish={save}
                >
                    <Item 
                        name="firstName"
                        label="Nome"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Nome é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>
                    <Item 
                        name="lastName"
                        label="Sobrenome"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Sobrenome é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
                    </Item>
                    <Item 
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: 'O Email é Obrigatório',
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