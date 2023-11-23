import React from 'react';
import { Button, Result } from 'antd';

class Step3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finish: props.finish,
            formData: props.formData,
        }
    }

    onSubmit = () => {
        console.log('Step 3 Form Values:', this.state.formData);
        this.state.finish();

    };

    render() {
        return (
            <div style={{ maxWidth: '500px', margin: '40px auto 0', textAlign: 'center' }}>
                <Result
                    status="success"
                    title="任务创建成功"
                    subTitle="机器人将会在指定的时间点执行任务，请耐心等候"
                />,
            </div>
        );
    }
}

export default Step3;