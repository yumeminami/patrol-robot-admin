import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
class EditForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const { getFieldDecorator } = form;
    const { id, name, velocity, position } = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="名称:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称!" }],
              initialValue: name,
            })(<Input placeholder="名称" />)}
          </Form.Item>
          <Form.Item label="速度:">
            {getFieldDecorator("velocity", {
              rules: [{ required: true, message: "请输入速度!" }],
              initialValue: velocity,
            })(<Input placeholder="速度" />)}
          </Form.Item>
          <Form.Item label="位置:">
            {getFieldDecorator("position", {
              rules: [{ required: true, message: "请输入位置!" }],
              initialValue: position,
            })(<Input placeholder="位置" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditForm" })(EditForm);
