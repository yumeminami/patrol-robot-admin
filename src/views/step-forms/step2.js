import React, { useState } from 'react';
import { Form, Alert, Button } from 'antd';

class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            form: React.createRef(),
            nextStep: props.nextStep,
            prevStep: props.prevStep,
            loading: false
        }
    }

    onFinish = (values) => {
        // Handle form submission if needed
        console.log('Step 2 Form Values:', values);
        this.state.loading = true;
        setTimeout(() => {
            this.state.loading = false;
            this.state.nextStep();
        }, 1500);
    }

    render() {
        return (
            <div>
                <Form style={{ maxWidth: '500px', margin: '40px auto 0' }} onSubmit={this.onFinish}>
                    {/* Display data using plain text as in Vue */}
                    <Form.Item name="payment" label="Payment" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} className="stepFormText">
                        ant-design@alipay.com
                    </Form.Item>
                    {/* Add the rest of your form fields here */}
                    <Form.Item wrapperCol={{ span: 17, offset: 7 }}>
                        <Button loading={this.loading} type="primary" >
                            Submit
                        </Button>
                        <Button style={{ marginLeft: '8px' }} onClick={this.prevStep}>
                            Previous Step
                        </Button>
                    </Form.Item>
                </Form>
            </div>)
    }
}

export default Step2;

