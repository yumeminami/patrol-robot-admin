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
import { checkpointsList, deleteItem, editItem, addItem } from "@/api/checkpoints";
import { gimbalpointList } from "@/api/gimbalpoints";
import EditForm from "./forms/editForm"
import AddTaskForm from "./forms/addForm"
const { Column } = Table;
const { Panel } = Collapse;
class TaskComponent extends Component {
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
    gimbalpointList: [],
  };
  fetchData = () => {
    this.setState({ loading: true });
    checkpointsList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      console.log(response)
      const list = response.list;
      const total = response.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
  };
  fetchGimbalpointData = () => {
    gimbalpointList({ all: true }).then((response) => {
      const gimbalpointList = response.list;
      console.log(gimbalpointList)
      if (this._isMounted) {
        this.setState({ gimbalpointList });
      }
    });
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
    this.fetchGimbalpointData();
    console.log(this.state.gimbalpointList)
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

  handleAdd = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  handleAddOk = () => {
    const { form } = this.addformRef.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      this.setState({ addModalLoading: true, });
      values.velocity = parseFloat(values.velocity)
      values.position = parseFloat(values.position)
      console.log(values)
      // this.setState({ addModalVisible: false, addModalLoading: false });
      addItem(values).then((response) => {
        form.resetFields();
        console.log(response)
        if (response.code === 200) {
          this.setState({ addModalVisible: false, addModalLoading: false });
          message.success("编辑成功")
        } else {
          this.setState({ addModalVisible: false });
          message.error("编辑失败")
        }
        this.fetchData()
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  };

  handleAddCancel = _ => {
    this.setState({
      addModalVisible: false,
    });
  };

  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }

  handleDownload = (type) => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error("至少选择一项进行导出");
      return;
    }
    this.setState({
      loading: true,
    });
    import("@/lib/Export2Excel").then((excel) => {
      const tHeader = ["Id", "点位名称", "机器人ID", "速度 mm/s", "位置 mm", "云台点位"];
      const filterVal = ["id", "name", "robot_id", "velocity", "position", "gimbal_points"];
      const list = this.state.selectedRows;
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
    const title = (
      <span>
        <Button type='primary' onClick={this.handleAdd}>添加巡检点</Button>
        <Divider type="vertical" />
        {this.state.seleted ? <Button type='danger' onClick={this.handleBatchDelete}>删除巡检点</Button> : null}
      </span>
    )

    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="点位名称:">
                <Input style={{ width: 180 }} onChange={this.filterNameChange} />
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
                  onClick={this.handleDownload.bind(null)}
                >
                  导出已选择项
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
            <Column title="点位ID" dataIndex="id" key="id" width={200} align="center" sorter={(a, b) => a.id - b.id} />
            <Column title="点位名称" dataIndex="name" key="name" width={200} align="center" />
            <Column title="机器人ID" dataIndex="robot_id" key="robot_id" width={195} align="center" />
            <Column title="速度 mm/s" dataIndex="velocity" key="velocity" width={195} align="center" />
            <Column title="位置 mm" dataIndex="position" key="position" width={195} align="center" />
            <Column title="操作" key="action" width={195} align="center" render={(text, row) => (
              <span>
                <Button type="primary" shape="circle" icon="edit" title="编辑" onClick={this.handleEdit.bind(null, row)} />
                <Divider type="vertical" />
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
        <EditForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editformRef = formRef}
          visible={this.state.editModalVisible}
          confirmLoading={this.state.editModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          gimbalpointList={this.state.gimbalpointList}
        />
        <AddTaskForm
          wrappedComponentRef={formRef => this.addformRef = formRef}
          visible={this.state.addModalVisible}
          confirmLoading={this.state.addModalLoading}
          onCancel={this.handleAddCancel}
          onOk={this.handleAddOk}
          gimbalpointList={this.state.gimbalpointList}
        />
      </div>
    );
  }
}

export default TaskComponent;
