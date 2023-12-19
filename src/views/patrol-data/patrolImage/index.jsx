import React, { Component } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Select,
  Card,
  Input,
  Divider,
} from "antd";
import { imageList, deleteItem } from "@/api/image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import JSZip from 'jszip';
const { Column } = Table;
const { Panel } = Collapse;
class PatrolImageComponent extends Component {
  _isMounted = false;
  state = {
    list: [],
    loading: false,
    total: 0,
    listQuery: {
      pageNumber: 1,
      pageSize: 10,
    },
    addModalVisible: false,
    addModalLoading: false,
    editModalVisible: false,
    editModalLoading: false,
    currentRowData: {
    },
    selectedRows: [],
    selectedRowKeys: [],
    seleted: false,
    filename: "excel-file",
    autoWidth: true,
    bookType: "xlsx",
    isOpen: false,
    img_url: "",
    all_data: [],
  };
  fetchData = () => {
    this.setState({ loading: true });
    imageList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      console.log(response)
      const list = response.list;
      const total = response.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
  };
  fetchAllData = () => {
    this.setState({ loading: true });
    imageList({ all: true }).then((response) => {
      this.setState({ loading: false });
      console.log(response)
      const all_data = response.list;
      if (this._isMounted) {
        this.setState({ all_data });
      }
    });
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
    this.fetchAllData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  filterTaskLogIdChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        task_log_id: parseInt(value),
      }
    }));
  };
  filterPositionChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        position: parseInt(value),
      }
    }));
  };
  filterAlarmChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        alarm: value,
      }
    }));
  };

  changePage = (pageNumber, pageSize) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          pageNumber,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  changePageSize = (current, pageSize) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          pageNumber: 1,
          pageSize,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  handleDelete = (row) => {
    deleteItem({ id: row.id }).then(res => {
      res.code === 200 ? message.success("删除成功") : message.error("删除失败")
      this.fetchData();
    }).catch(e => {
      message.error("删除失败")
    })
  }
  handleBatchDelete = () => {
    const ids = this.state.selectedRowKeys
    const deletePromises = ids.map(id => deleteItem({ id }));

    Promise.all(deletePromises)
      .then(responses => {
        message.success("删除成功");
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
          seleted: false,
        });
        this.fetchData();
      })
      .catch(error => {
        message.error("删除失败，请重试");
      });
  }

  handleExport = async () => {
    const datas = this.state.selectedRows;
    const urls = datas.map(data => data.image_url);

    const zip = new JSZip();
    const key = "download";

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];

      // 在URL后面添加一个随机参数来禁止缓存
      url += (url.includes('?') ? '&' : '?') + 'noCache=' + new Date().getTime();

      const response = await fetch(url);
      const blob = await response.blob();

      let filename = url.split('/').pop();
      if (!filename.endsWith('.jpg')) {
        filename += '.jpg';
      }

      zip.file(filename, blob, { binary: true });
      message.loading({ content: `${i + 1}/${urls.length}`, key });
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    setTimeout(() => {
      message.success({ content: 'Download success!', key, duration: 2 });
    }, 1000);
  }


  handleExportAll = async () => {
    const datas = this.state.all_data;
    const urls = datas.map(data => data.image_url);

    const zip = new JSZip();

    const key = "download"

    message.loading({ content: 'Loading...', key });

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];
      url += (url.includes('?') ? '&' : '?') + 'noCache=' + new Date().getTime();
      const response = await fetch(url);
      const blob = await response.blob();

      let filename = url.split('/').pop();
      if (!filename.endsWith('.jpg')) {
        filename += '.jpg';
      }
      zip.file(filename, blob, { binary: true });
      message.loading({ content: `${i + 1}/${urls.length}`, key });
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    setTimeout(() => {
      message.success({ content: 'Download success!', key, duration: 2 });
    }, 1000);

  }


  handleCancel = _ => {
    this.setState({
      editModalVisible: false,
    });
  };

  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }

  filenameChange = (e) => {
    this.setState({
      filename: e.target.value,
    });
  };
  autoWidthChange = (e) => {
    this.setState({
      autoWidth: e.target.value,
    });
  };
  bookTypeChange = (value) => {
    this.setState({
      bookType: value,
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
    this.setState({ seleted: selectedRowKeys.length > 0 })
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  };

  openImageLightbox = () => {
    this.setState({ isOpen: true });
  };

  closeLightbox = () => {
    this.setState({ isOpen: false });
  };

  setImgUrl = (img_url) => {
    this.setState({ img_url });
  }

  clearImgUrl = () => {
    this.setState({ img_url: "" });
  }

  render() {

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const title = (
      <span>
        {this.state.seleted ? <div>
          <Button type='primary' onClick={this.handleExport} >导出所选</Button>
          <Divider type="vertical" />
          <Button type='primary' onClick={this.handleExportAll}>导出全部</Button>
          <Divider type="vertical" />
          <Button type='danger' onClick={this.handleBatchDelete}>删除图片</Button>
        </div> : null}
      </span>
    )

    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="任务日志ID:">
                <Input onChange={this.filterTaskLogIdChange} />
              </Form.Item>
              <Form.Item label="图片位置:">
                <Input onChange={this.filterPositionChange} />
              </Form.Item>
              <Form.Item label="异常状态:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterAlarmChange}>
                  <Select.Option value={true}>异常</Select.Option>
                  <Select.Option value={false}>正常</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon="search" onClick={this.fetchData}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <br />

        <Card title={title}>
          <Table
            bordered
            rowKey={(record) => record.id}
            dataSource={this.state.list}
            loading={this.state.loading}
            pagination={false}
            rowSelection={rowSelection}
          >
            <Column title="ID" dataIndex="id" key="id" width={200} align="center" sorter={(a, b) => a.id - b.id} />
            <Column title="任务日志ID" dataIndex="task_log_id" key="task_log_id" width={120} align="center" />
            <Column title="位置（mm）" dataIndex="position" key="position" width={120} align="center" />
            <Column title="巡检图片" dataIndex="image_url" key="image_url" width={195} align="center" render={(image_url) => {
              return (
                image_url ? <img
                  src={image_url}
                  alt="IMG"
                  style={{ width: '50px', height: '50px' }} // Adjust dimensions as needed
                  onClick={() => {
                    // 显示图片预览
                    this.setImgUrl(image_url)
                    this.openImageLightbox()
                  }}
                  onMouseEnter={() => {
                    // 改变鼠标样式
                    document.body.style.cursor = "pointer"
                  }}
                  onMouseLeave={() => {
                    // 改变鼠标样式
                    document.body.style.cursor = "auto"
                  }}
                /> : ""
              )
            }} />
            <Column title="是否报警" dataIndex="alarm" key="alarm" width={195} align="center" sorter={(a, b) => a.alarm - b.alarm} render={(alarm) => {
              let color =
                alarm === true ? "red" : alarm === false ? "green" : "";
              let alarm_status =
                alarm === true ? "异常" : alarm === false ? "正常" : "";
              return (
                <Tag color={color} key={alarm}>
                  {alarm_status}
                </Tag>
              );
            }} />
            <Column title="拍摄时间" dataIndex="created_at" key="created_at" width={195} align="center" sorter={(a, b) => a.created_at - b.created_at} />
            <Column title="操作" key="action" width={195} align="center" render={(text, row) => (
              <span>
                <Button type="primary" shape="circle" icon="delete" title="删除" onClick={this.handleDelete.bind(null, row)} />
              </span>
            )} />
          </Table>
        </Card>
        <br />
        <Pagination
          total={this.state.total}
          pageSizeOptions={["10", "20", "40"]}
          showTotal={(total) => `共${total}条数据`}
          onChange={this.changePage}
          current={this.state.listQuery.pageNumber}
          onShowSizeChange={this.changePageSize}
          showSizeChanger
          showQuickJumper
          hideOnSinglePage={true}
        />
        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.img_url}
            onCloseRequest={this.closeLightbox}
          />
        )}
      </div>
    );
  }
}

export default PatrolImageComponent;
