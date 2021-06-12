import 'antd/dist/antd.css';

import { Button, Form, Modal, Select, Space } from 'antd';
import React from 'react';

export const FilterModal = (props) => {

    const title = 'Selecione o Filtro';  
    const {Item} = Form;
    const { Option } = Select; 
    const initialUnit = [];

    const [units, setUnits] = React.useState(initialUnit);

    React.useEffect(() => {
        setUnits(props.units);
    }, [props.units]);

    const companies = [];
    companies.push(<Option key={0}>General</Option>)
    for (let i = 0; i < props.companies.length; i++) {
        companies.push(<Option key={props.companies[i].id}>{props.companies[i].name}</Option>);
    }


    const setUnitFilter = (company) => {
        let filterUnit = []
        if (company !== '0') {
            filterUnit = props.units.filter(unit => unit.company === company);
            setUnits(null)
        }
        else {
            filterUnit = props.units;
        }
       setUnits(filterUnit);
    }    

    const save = (active) => {
        if (active.company === undefined)
            active.company = '0';

        if (active.unit === undefined)
            active.unit = '0';

        if (active.company === '0')
            props.callbackParent({statusText: 'OK', filter: active});
        else
        {
            const filterOptionOfUnits = units.filter(unit => unit.id === active.unit)
            
            if(filterOptionOfUnits.length === 0 && active.unit !== '0')
            {
                error();
            }
            else
            {
                props.callbackParent({statusText: 'OK', filter: active});
            }
        }
    };
    
    const cancel = () => {
        props.callbackParent({statusText: 'Cancel', filter: {company: "0", unit: "0"}});
    }      

    function error() {
        Modal.error({
          title: 'Erro',
          content: `Essa unidade não pertence a empresa`,
        });
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
                                message: 'Selecione a Empresa',
                            }
                        ]}
                    >
                        <Select onChange={setUnitFilter}>
                            {companies}
                        </Select>
                    </Item>
                    <Item 
                        label="Unidade"
                        name="unit"
                        rules={[
                            {
                                type: 'string',
                                message: 'Selecione a Unidade',
                            }
                        ]}
                    >
                        <Select allowClear>
                            {units.map((unit) => (
                                <Option key={unit.id}>{unit.name}</Option>
                            ))}
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