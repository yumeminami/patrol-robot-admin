import React from 'react';
import { Button, Result } from 'antd';

class Step4 extends React.Component {
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
                    status="error"
                    title="任务创建失败"
                    subTitle="任务信息填写出现错误"
                />,
            </div>
        );
    }
}

export default Step4;