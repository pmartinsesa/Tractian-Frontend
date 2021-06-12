import 'antd/dist/antd.css';

import { Button, Form, Modal, Select, Space } from 'antd';
import React from 'react';

export const FilterModal = (props) => {
    const title = 'Selecione o Filtro';  
    const {Item} = Form;
    const { Option } = Select; 

    const companies = [];
    companies.push(<Option key={0}>General</Option>)
    for (let i = 0; i < props.companies.length; i++) {
        companies.push(<Option key={props.companies[i].id}>{props.companies[i].name}</Option>);
    }

    const save = (filter) => {
        props.callbackParent({statusText: 'OK', filter: filter.company});
    };
    
    const cancel = () => {
        props.callbackParent({statusText: 'Cancel', filter: "0"});
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
                    onFinish={save}
                >
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