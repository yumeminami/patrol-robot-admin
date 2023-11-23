import React from 'react';
import Text from 'antd/lib/typography/Text';
import { Form, Select, Input, Button, Radio, Alert, Table, DatePicker, List, Row, Col, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { addItem } from "@/api/task";
import { sensorList } from "@/api/sensor";


const { Option } = Select;
class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _isMounted: false, // 这个变量是用来标志当前组件是否挂载
            listQuery: {
                pageNumber: 1,
                pageSize: 10,
            },
            formData: props.formData,
            successPage: props.successPage,
            failPage: props.failPage,
            prevStep: props.prevStep,
            sensorList: [],
            time: null,
            times: [],
            format: 'HH:mm',
            frequencyNum: null,
            frequencyUnit: "DAY",

        }
    }

    componentDidMount() {
        this.setState({ _isMounted: true });
        this.fetchSensorList();
    }


    onSubmit = (e) => {
        e.preventDefault();
        let execution_frequency = this.state.frequencyNum + " " + this.state.frequencyUnit;
        const data = {
            sensors: this.state.sensorList,
            execution_times: this.state.times,
            execution_frequency: execution_frequency
        }
        const formData = { ...this.state.formData, ...data };
        console.log(formData);
        addItem(formData).then(response => {
            if (response.code === 200) {
                this.state.successPage();
            }
            else {
                console.log(response);
                this.state.failPage();
            }
        });

    };

    fetchSensorList = () => {
        sensorList({ all: true }).then(response => {
            const sensorList = response.list;
            sensorList.map((item) => {
                item.upper_limit = 100;
                item.lower_limit = 0;
            });
            this.setState({ sensorList: sensorList });
        });
        console.log(this.state.sensorList);
    }

    CustomFormItem = ({ name, label, rules, initialValue, children }) => (
        <FormItem label={label}>
            {this.props.form.getFieldDecorator(name, { rules, initialValue })(children)}
        </FormItem>
    );

    handleInputChange = (index, key) => (event) => {
        const { value } = event.target;
        console.log(`Updating sensor ${index}, key ${key}, value ${value}`);  // 添加这一行
        const { sensorList } = this.state;
        sensorList[index][key] = parseFloat(value);
        this.setState({ sensorList });
    };

    handleTimeChange = (value) => {
        if (value) {
            console.log(value.format("HH:mm"));
            this.setState({ time: value.format("HH:mm") });
        }
    }

    handleButtonClick = () => {
        if (this.state.time) {
            this.setState({
                times: [...this.state.times, this.state.time],
            });
        }
        this.setState({ time: null });
    }


    render() {
        const CustomFormItem = this.CustomFormItem;
        const { handleTimeChange, handleButtonClick } = this;
        return (
            <div>
                <Form style={{ maxWidth: '500px', margin: '40px auto 0' }} onSubmit={this.onSubmit}>
                    <Row>
                        传感器告警设置:
                    </Row>
                    <br></br>
                    <Table
                        rowKey="id"
                        rowSelection={this.rowSelection}
                        columns={[
                            {
                                title: 'ID',
                                dataIndex: 'id',
                                key: 'id',
                            },
                            {
                                title: '名称',
                                dataIndex: 'name',
                                key: 'name',
                            },
                            {
                                title: "单位",
                                dataIndex: 'unit',
                                key: 'unit',
                            },
                            {
                                title: '上限',
                                dataIndex: 'upper_limit',
                                key: 'upper_limit',
                                render: (text, record, index) => (
                                    <Input
                                        placeholder="输入框1"
                                        defaultValue={100}
                                        onChange={this.handleInputChange(index, 'upper_limit')}
                                    />
                                ),
                            },
                            {
                                title: '下限',
                                dataIndex: 'lower_limit',
                                key: 'lower_limit',
                                render: (text, record, index) => (
                                    <Input
                                        placeholder="输入框2"
                                        defaultValue={0}
                                        onChange={this.handleInputChange(index, 'lower_limit')}
                                    />
                                ),
                            },
                        ]}
                        dataSource={this.state.sensorList}
                        pagination={{
                            pageSize: 5,
                        }}
                    />
                    <Divider type="horizontal" />
                    <Text >执行时间： </Text>
                    <DatePicker mode='time' showTime format="HH:mm" onChange={handleTimeChange} />
                    <Divider type="vertical" />
                    <Button type="primary" onClick={handleButtonClick}>确认</Button>
                    <Divider type="horizontal" />
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="已选择的时间"
                        value={this.state.times}
                        onChange={(value) => { this.setState({ times: value }) }}
                    >
                        {this.state.times.map(time => (
                            <Select.Option key={time} value={time}>{time}</Select.Option>
                        ))}
                    </Select>
                    <br />
                    <br />
                    <Row>
                        执行频率:
                    </Row>
                    <br></br>
                    <Row>
                        <Col span={20}>
                            <Input placeholder="请输入执行频率" required={true} onChange={(e) => { this.setState({ frequencyNum: e.target.value }) }} />
                        </Col>
                        <Col span={4}>
                            <Select style={{ width: "100%" }} defaultValue={"DAY"} onChange={(value) => { this.setState({ frequencyUnit: value }) }}>
                                <Select.Option key={1} value={"DAY"}>天</Select.Option>
                                <Select.Option key={2} value={"WEEK"}>周</Select.Option>
                                <Select.Option key={3} value={"MONTH"}>月</Select.Option>
                                <Select.Option key={4} value={"YEAR"}>年</Select.Option>
                            </Select>
                        </Col>
                    </Row>

                    <br></br>
                    <Button type="primary" htmlType='submit'> Next </Button>
                    <Button style={{ marginLeft: '8px' }} onClick={this.state.prevStep}>
                        Previous Step
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Form.create({ name: 'step2' })(Step2);

