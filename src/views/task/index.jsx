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
import { taskList, deleteItem, editItem, addItem } from "@/api/task";
import EditForm from "./forms/editForm"
import AddFrom from "./step-forms/addForm"
const { Column } = Table;
const { Panel } = Collapse;
class TaskComponent extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
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
    taskList(this.state.listQuery).then((response) => {
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
    this.setState({
      currentRowData: Object.assign({}, row),
      editModalVisible: true,
    });
  };

  handleBatchStop = () => {
    const ids = this.state.selectedRowKeys
    const stopPromises = ids.map(id => editItem({ id, status: 3 }));

    Promise.all(stopPromises)
      .then(responses => {
        message.success("停止成功");
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
          seleted: false,
        });
        this.fetchData();
      })
      .catch(error => {
        message.error("停止失败，请重试");
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
    if (this.state.selectedRowKeys.length === 0) {
      message.error("至少选择一项进行导出");
      return;
    }
    this.setState({
      loading: true,
    });
    import("@/lib/Export2Excel").then((excel) => {
      const tHeader = ["Id", "名称", "类型(0:自动任务,1:常规任务)", "状态(1:执行中,2:待命中,3:已停止)", "机器人ID", "执行时间(多个时间用逗号隔开)", "执行频率"];
      const filterVal = ["id", "", "type", "status", "robot_id", "execution_times", "execution_frequency"];
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

  handleAdd = () => {
    this.setState({
      addModalVisible: true,
    });
  }

  render() {

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const title = (
      <span>
        <Button type='primary' onClick={this.handleAdd}>添加任务</Button>
        {this.state.seleted ? <Divider type="vertical" /> : null}
        {this.state.seleted ? <Button type='danger' onClick={this.handleBatchDelete}>删除任务</Button> : null}
        {this.state.seleted ? <Divider type="vertical" /> : null}
        {this.state.seleted ? <Button type='danger' onClick={this.handleBatchStop}>停止任务</Button> : null}
      </span>
    )

    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="任务名称:">
                <Input onChange={this.filterNameChange} />
              </Form.Item>
              <Form.Item label="任务状态:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value={1}>执行中</Select.Option>
                  <Select.Option value={2}>待命中</Select.Option>
                  <Select.Option value={3}>已停止</Select.Option>
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
            <Column title="任务ID" dataIndex="id" key="id" width={200} align="center" sorter={(a, b) => a.id - b.id} />
            <Column title="任务名称" dataIndex="name" key="name" width={200} align="center" />
            <Column title="任务类型" dataIndex="type" key="type" width={120} align="center" render={(type) => {
              let task_type =
                type === 1 ? "常规任务" : type === 0 ? "自动任务" : "";
              return (
                <Tag color="blue" key={type}>
                  {task_type}
                </Tag>
              );
            }} />
            <Column title="机器人ID" dataIndex="robot_id" key="robot_id" width={120} align="center" />
            <Column title="任务状态" dataIndex="status" key="status" width={195} align="center" render={(status) => {
              let color =
                status === 1 ? "green" : status === 2 ? "blue" : status === 3 ? "red" : "";
              let task_status =
                status === 1 ? "执行中" : status === 2 ? "待命中" : status === 3 ? "已停止" : "";
              return (
                <Tag color={color} key={status}>
                  {task_status}
                </Tag>
              );
            }} />
            <Column
              title="执行时间"
              dataIndex="execution_times"
              key="execution_times"
              width={195}
              align="center"
              render={(execution_times) => {
                const formattedTimes = execution_times.map((time) =>
                  time.slice(0, 5)
                );
                return formattedTimes.join(", ");
              }}
            />
            <Column title="执行频率" dataIndex="execution_frequency" key="execution_frequency" width={195} align="center" />
            <Column title="操作" key="action" width={195} align="center" render={(text, row) => (
              <span>
                <Button type="primary" shape="circle" icon="edit" title="编辑" onClick={this.handleEdit.bind(null, row)} />
                <Divider type="vertical" />
                <Button type="primary" shape="circle" icon="delete" title="删除" onClick={this.handleDelete.bind(null, row)} />
              </span>
            )} />
          </Table>
          <br></br>
          <Button type="primary">
            打开引导
          </Button>
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
        <AddFrom
          visible={this.state.addModalVisible}
          onCancel={() => { this.fetchData(); this.setState({ addModalVisible: false }) }}
        />
      </div>
    );
  }
}

export default TaskComponent;
