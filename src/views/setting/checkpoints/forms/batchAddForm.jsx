import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
class BatchAddForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, gimbalpointList } = this.props;
    const { getFieldDecorator } = form;
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
        title="批量添加"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="名称:">
            {getFieldDecorator("name", {
            })(<Input placeholder="自动生成" disabled />)}
          </Form.Item>
          <Form.Item label="速度:">
            {getFieldDecorator("velocity", {
              rules: [{ required: true, message: "请输入速度!" }],
            })(<Input placeholder="速度" />)}
          </Form.Item>
          <Form.Item label="开始位置:">
            {getFieldDecorator("start", {
              rules: [{ required: true, message: "请输入开始位置!" }],
            })(<Input placeholder="开始位置" />)}
          </Form.Item>
          <Form.Item label="结束位置:">
            {getFieldDecorator("end", {
              rules: [{ required: true, message: "请输入结束位置!" }],
            })(<Input placeholder="结束位置" />)}
          </Form.Item>
          <Form.Item label="间隔:">
            {getFieldDecorator("interval", {
              rules: [{ required: true, message: "请输入间隔!" }],
            })(<Input placeholder="间隔" />)}
          </Form.Item>
          <Form.Item label="云台点位:">
            {getFieldDecorator("gimbal_points", {
            })(
              <Select mode="multiple" placeholder="请选择云台点位">
                {gimbalpointList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {"预置点：" + item.preset_index}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "BatchAddForm" })(BatchAddForm);
