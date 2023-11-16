import React from 'react';
import { Form, Select, Input, Button, Radio, Alert } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

const { Option } = Select;

class Step1 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current: 0,
            form: React.createRef(),
            nextStep: props.nextStep
        }
    }

    onFinish = (values) => {
        // Handle form submission if needed
        console.log('Received values:', 1);
        console.log('Step 1 Form Values:', 1);
        this.state.nextStep();

    };

    render(){
        return (
            <div>
                <Form style={{ maxWidth: '500px', margin: '40px auto 0' }} onSubmit={this.onFinish}>
                    <FormItem name="note" label="Note">
                        <Alert closable message="Note" style={{ marginBottom: '24px' }} />
                    </FormItem>
                    {/* Display data using plain text as in Vue */}
                    <Button type="primary" htmlType='submit'> Submit </Button>
                </Form>
            </div>
        );
    }
}

export default Step1;


