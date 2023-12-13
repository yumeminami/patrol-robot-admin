import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
import moment from "moment";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // 引入样式
import "moment/locale/zh-cn";
import { getItem } from "@/api/taskLog";
moment.locale("zh-cn");
class EditForm extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      item: {},
      img_url: "",
    };
  }
  componentDidMount() {
    this._isMounted = true;
    // this.fetchData();
    console.log(this.props.currentRowData);
  }
  componentWillUnmount() {
    this._isMounted = false;
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
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const { getFieldDecorator } = form;
    const { id, status, patrol_images, patrol_videos, execution_date } = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    const statusOptions = {
      "0": "完成",
      "1": "执行",
      "2": "失败",
    };

    return (
      <Modal
        title="任务详情"
        visible={visible}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        footer={null}
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
              <Input disabled />
            )}
          </Form.Item>

          <Form.Item label="执行时间:">
            {getFieldDecorator("execution_date", {
              initialValue: execution_date
            })(<Input disabled />)}
          </Form.Item>
          {
            patrol_images && patrol_images.length > 0 && <Form.Item label="巡检图片:">
              {patrol_images.map((item, index) => (
                <div key={index} onClick={() => this.setState({ isOpen: true, img_url: item })}>
                  <img
                    src={item}
                    alt="巡检图片"
                    style={{ maxWidth: "100%", cursor: "pointer", marginBottom: 10 }}
                  />
                </div>
              ))}
            </Form.Item>
          }
          {
            patrol_videos && patrol_videos.length > 0 && <Form.Item label="巡检视频:">
              {patrol_videos.map((item, index) => (
                <div key={index}>
                  <video
                    controls
                    style={{ maxWidth: "100%", cursor: "pointer" }}
                  >
                    <source src={item} type="video/mp4" />
                  </video>
                </div>
              ))}
            </Form.Item>
          }
        </Form>
        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.img_url}
            onCloseRequest={this.closeLightbox}
          />
        )}
      </Modal>
    );
  }
}

export default Form.create({ name: "EditForm" })(EditForm);
