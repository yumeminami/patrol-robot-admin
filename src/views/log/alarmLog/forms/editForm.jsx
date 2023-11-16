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
    this.setState({ isOpen: false});
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
    const { id, status, time, img_url, video_url } = currentRowData;
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
          <Form.Item label="状态:">
            {getFieldDecorator("status", {
              initialValue: statusOptions[status],
            })(
              <Select style={{ width: 120 }}>
                {Object.keys(statusOptions).map((value) => (
                  <Select.Option key={value} value={value}>
                    {statusOptions[value]}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="发生时间:">
            {getFieldDecorator("time", {
              initialValue: time
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="异常图片:">
            {img_url ? (
              <div onClick={this.openImageLightbox}>
                <img
                  src={img_url}
                  alt="异常图片"
                  style={{ maxWidth: "100%", cursor: "pointer" }}
                />
              </div>
            ) : null}
          </Form.Item>
          <Form.Item label="异常视频:">
            {video_url ? (
              <video
                controls
                style={{ maxWidth: "100%", cursor: "pointer" }}
              >
                <source src={video_url} type="video/mp4" />
              </video>
            ) : null}
          </Form.Item>
        </Form>
        {this.state.isOpen && (
          <Lightbox
            mainSrc={img_url}
            onCloseRequest={this.closeLightbox}
          />
        )}
      </Modal>
    );
  }
}

export default Form.create({ name: "EditForm" })(EditForm);
