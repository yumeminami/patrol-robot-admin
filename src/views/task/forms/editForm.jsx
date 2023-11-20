import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal } from "antd";
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
    const { id, name, execution_times, status, type } = currentRowData;
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
          {/* <Form.Item label="类型:">
            {getFieldDecorator("type", {
              initialValue: type,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value={0}>自动任务</Select.Option>
                <Select.Option value={1}>常规任务</Select.Option>
              </Select>
            )}
          </Form.Item> */}
          <Form.Item label="状态:">
            {getFieldDecorator("status", {
              initialValue: status,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value={1}>执行中</Select.Option>
                <Select.Option value={2}>待命中</Select.Option>
                <Select.Option value={3}>已停止</Select.Option>
              </Select>
            )}
          </Form.Item>

          {/* <Form.Item label="时间:">
            {getFieldDecorator("execution_times", {
              rules: [{ type: 'object', required: true, message: '请选择时间!' }],
              initialValue: moment("HH:mm"),
            })(<DatePicker showTime format="HH:mm" />)}
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditForm" })(EditForm);
