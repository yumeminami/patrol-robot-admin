import React, { Component } from "react";
import { useState } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Input,
  Collapse,
  Pagination,
  Divider,
  message,
  Select,
  Card,
  Icon,
  Radio
} from "antd";
import { algorithmList, deleteItem, editItem, addItem } from "@/api/algorithms";
import EditForm from "./forms/editForm"
const { Column } = Table;
const { Panel } = Collapse;
class VisionAlgorihtmComponent extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    allData: [],
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
  };
  fetchData = () => {
    this.setState({ loading: true });
    algorithmList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      const list = response.list;
      const total = response.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });

    algorithmList({ all: true }).then((response) => {
      this.setState({ loading: false });
      console.log(response)
      const allData = response.list;
      if (this._isMounted) {
        this.setState({ allData });
      }
      console.log(this.state.allData)
    }
    );
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  filterNameChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        name: value,
      }
    }));
  };
  filterStatusChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        status: value,
      }
    }));
  };
  filterTypeChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        type: value,
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

  getAllData = () => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          all: true,
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
  handleEdit = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editModalVisible: true,
    });
  };


  handleOk = () => {
    const { form } = this.editformRef.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      this.setState({ editModalLoading: true, });
      editItem(values).then((response) => {
        form.resetFields();
        console.log(response)
        if (response.code === 200) {
          this.setState({ editModalVisible: false, editModalLoading: false });
          message.success("编辑成功")
        } else {
          this.setState({ editModalLoading: false });
          message.error("编辑失败")
        }
        this.fetchData()
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  };

  handleCancel = _ => {
    this.setState({
      editModalVisible: false,
    });
  };

  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }

  handleDownload = (type) => {
    if (this.state.selectedRowKeys.length === 0 && type === "selected") {
      message.error("至少选择一项进行导出");
      return;
    }
    this.setState({
      loading: true,
    });
    import("@/lib/Export2Excel").then((excel) => {
      const tHeader = ["Id", "算法名称", "算法类型(0: 图片检测, 1: 视频检测)", "算法灵敏度"];
      const filterVal = ["id", "name", "type", "sensitivity"];
      const list = type === "all" ? this.state.allData : this.state.selectedRows;
      const data = this.formatJson(filterVal, list);
      excel.export_json_to_excel({
        header: tHeader,
        data,
        filename: this.state.filename,
        autoWidth: this.state.autoWidth,
        bookType: this.state.bookType,
      });
      this.setState({
        selectedRowKeys: [],
        seleted: false,
        loading: false,
      });
    });
  };

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

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="算法名称:">
                <Input onChange={this.filterNameChange} />
              </Form.Item>
              <Form.Item label="算法类型:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterTypeChange}>
                  <Select.Option value={0}>图片</Select.Option>
                  <Select.Option value={1}>视频</Select.Option>
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
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="导出选项" key="1">
            <Form layout="inline">
              <Form.Item label="文件名:">
                <Input
                  style={{ width: "250px" }}
                  prefix={
                    <Icon type="file" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="请输入文件名(默认excel-file)"
                  onChange={this.filenameChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon="file-excel"
                  onClick={this.handleDownload.bind(null, "all")}
                >
                  全部导出
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon="file-excel"
                  onClick={this.handleDownload.bind(null, "selected")}
                >
                  导出已选择项
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <br />

        <Card >
          <Table
            bordered
            rowKey={(record) => record.id}
            dataSource={this.state.list}
            loading={this.state.loading}
            pagination={false}
            rowSelection={rowSelection}
          >
            <Column title="ID" dataIndex="id" key="id" width={100} align="center" sorter={(a, b) => a.id - b.id} />
            <Column title="算法名称" dataIndex="name" key="name" width={200} align="center" />
            <Column title="异常类型" dataIndex="type" key="type" width={100} align="center" render={(type) => {
              let color = "green";
              let algorithm_type =
                type === 1 ? "视频检测" : type === 0 ? "图片检测" : "";
              return (
                <Tag color={color} key={algorithm_type}>
                  {algorithm_type}
                </Tag>
              );
            }} />
            <Column title="算法灵敏度" dataIndex="sensitivity" key="sensitivity" width={200} align="center" />
            <Column title="操作" key="action" width={195} align="center" render={(text, row) => (
              <span>
                <Button type="primary" shape="circle" icon="ellipsis" title="详情" onClick={this.handleEdit.bind(null, row)} />
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
        <EditForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editformRef = formRef}
          visible={this.state.editModalVisible}
          confirmLoading={this.state.editModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </div>
    );
  }
}

export default VisionAlgorihtmComponent;
