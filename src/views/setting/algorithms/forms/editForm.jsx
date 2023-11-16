import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal } from "antd";
import moment from "moment";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // 引入样式
import "moment/locale/zh-cn";
moment.locale("zh-cn");
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  openImageLightbox = () => {
    this.setState({ isOpen: true });
  };

  closeLightbox = () => {
    this.setState({ isOpen: false });
  };


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
    const { id, status, time, img_url, video_url, name, type, sensitivity } = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    const statusOptions = {
      "0": "未处理",
      "1": "已处理",
    };
    return (
      <Modal
        title="异常详情"
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
          <Form.Item label="算法名称:">
            {getFieldDecorator("name", {
              initialValue: name,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="算法类型:">
            {getFieldDecorator("type", {
              initialValue: type === 0 ? "图片检测" : "视频检测",
            })(<Input disabled />)}

          </Form.Item>
          <Form.Item label="敏感度:">
            {getFieldDecorator("sensitivity", {
              initialValue: sensitivity,
            })(<Input placeholder="敏感度" />)}
          </Form.Item>
        </Form>

      </Modal>
    );
  }
}

export default Form.create({ name: "EditForm" })(EditForm);
