import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import StepForm from "./step-form";
moment.locale("zh-cn");
class AddForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      form,
      confirmLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const final = false
    return (
      <Modal
        title="添加任务"
        visible={visible}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        // onOk={onOk}
        footer={null}
      >
        <StepForm key={visible}></StepForm>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddForm" })(AddForm);
