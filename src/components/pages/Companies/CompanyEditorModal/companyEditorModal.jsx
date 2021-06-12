import 'antd/dist/antd.css';

import { Button, Form, Input, Modal, Space } from 'antd';
import React from 'react';

import { create, update } from '../api/companyProxy';

export const EditorModal = (props) => {
    const title = props.isCreated ? 'Nova Empresa' : 'Altere a Empresa';  
    const {Item} = Form;

    const save = (companyName) => {
        if (props.isCreated)
        {
            const company = {
                name: companyName.name,
                units: [],
                users: []
            }

            create(company)
                .then(res => {
                    props.callbackParent(res.data.message);
                });
        }
        else
        {
            const newCompany = {
                ...props.oldCompany,
                name: companyName.name
            };
            
            update(newCompany)
                .then(res => {
                    props.callbackParent(res.data.message);
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
                footer={[
                ]}
                >
                <Form
                    initialValues={{
                        name: props.oldCompany.name
                    }}
                    onFinish={save}
                >
                    <Item 
                        name="name"
                        label="Nome da Empresa"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: 'O Nome da Empresa é Obrigatório',
                            }
                        ]}
                    >
                        <Input/>
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