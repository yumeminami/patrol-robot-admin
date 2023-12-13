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
} from "antd";
import { taskLogList, deleteItem, getItem } from "@/api/taskLog";
import EditForm from "./forms/editForm"
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
  };
  fetchData = () => {
    this.setState({ loading: true });
    taskLogList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      console.log(response)
      const list = response.list;
      const total = response.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
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
    getItem(row.id).then((res) => {
      console.log(res.data)
      this.setState({
        currentRowData: res.data,
        editModalVisible: true,
      });
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
    if (this.state.selectedRowKeys.length === 0) {
      message.error("至少选择一项进行导出");
      return;
    }
    this.setState({
      loading: true,
    });
    import("@/lib/Export2Excel").then((excel) => {
      const tHeader = ["Id", "任务ID", "任务类型（0：自动任务，1：常规任务）", "机器人ID", "执行时间", "任务状态（0：完成，1：失败）"];
      const filterVal = ["id", "task_id", "type", "robot_id", "execution_date", "status"];
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
        {this.state.seleted ? <Button type='danger' onClick={this.handleBatchDelete}>删除记录</Button> : null}
      </span>
    )

    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="任务状态:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value={0}>完成</Select.Option>
                  <Select.Option value={1}>失败</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="任务类型:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterTypeChange}>
                  <Select.Option value={0}>自动任务</Select.Option>
                  <Select.Option value={1}>常规任务</Select.Option>
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
            <Column title="ID" dataIndex="id" key="id" width={200} align="center" sorter={(a, b) => a.id - b.id} />
            <Column title="任务ID" dataIndex="task_id" key="task_id" width={100} align="center" />
            <Column title="任务类型" dataIndex="type" key="type" width={100} align="center" render={(type) => {
              let task_type =
                type === 1 ? "常规任务" : type === 0 ? "自动任务" : "";
              return (
                <Tag color="blue" key={type}>
                  {task_type}
                </Tag>
              );
            }} />
            <Column title="机器人ID" dataIndex="robot_id" key="robot_id" width={100} align="center" />
            <Column title="执行时间" dataIndex="execution_date" key="execution_date" width={150} align="center" />
            <Column title="任务状态" dataIndex="status" key="status" width={195} align="center" render={(status) => {
              let color =
                status === 0 ? "green" : status === 1 ? "blue" : status === 2 ? "red" : "";
              let task_status =
                status === 0 ? "完成" : status === 1 ? "执行" : status === 2 ? "失败" : ""
              return (
                <Tag color={color} key={status}>
                  {task_status}
                </Tag>
              );
            }} />
            <Column title="操作" key="action" width={195} align="center" render={(text, row) => (
              <span>
                <Button type="primary" shape="circle" icon="ellipsis" title="详情" onClick={this.handleEdit.bind(null, row)} />
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
        />
      </div>
    );
  }
}

export default TaskComponent;
