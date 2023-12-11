import React from 'react';
import { Form, Select, Input, Button, Radio, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { algorithmList } from "@/api/algorithms";
import { robotList } from "@/api/robot";
import { checkpointsList } from "@/api/checkpoints";
import { gimbalpointList } from "@/api/gimbalpoints";

const { Option } = Select;
class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _isMounted: false, 
            listQuery: {
                pageNumber: 1,
                pageSize: 10,
            },
            current: 0,
            form: null,
            nextStep: props.nextStep,
            updateFormData: props.updateFormData,
            algorithmList: [],
            robotList: [],
            checkpointsList: [],
            gimbalpointsList: [],
            selectedCheckpoints: [],
        }
    }

    componentDidMount() {
        this.setState({ _isMounted: true });
        this.fectchRobotList();
        this.fectchAlgorithmList();
        this.fectchCheckpointsList();
        this.fectchGimbalpointsList();
    }

    fectchRobotList = () => {
        // To disabled submit button at the beginning.
        robotList(this.state.listQuery).then((response) => {
            const robotList = response.list;
            this.setState({ robotList: robotList });
        });
    }

    fectchAlgorithmList = () => {
        // To disabled submit button at the beginning.
        algorithmList({ all: true }).then((response) => {
            const algorithmListlist = response.list;
            this.setState({ algorithmList: algorithmListlist });
        });
    }

    fectchCheckpointsList = () => {
        // To disabled submit button at the beginning.
        checkpointsList({ all: true }).then((response) => {
            const checkpointsList = response.list;
            this.setState({ checkpointsList: checkpointsList });
        });
    }

    fectchGimbalpointsList = () => {
        // To disabled submit button at the beginning.
        gimbalpointList({ all: true }).then((response) => {
            const gimbalpointsList = response.list;
            this.setState({ gimbalpointsList: gimbalpointsList });
        });
    }


    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const name = this.props.form.getFieldValue('name');
                const vision_algorithms = this.props.form.getFieldValue('algorithm');
                const robot_id = this.props.form.getFieldValue('robot');
                const type = this.props.form.getFieldValue('type');

                let checkpoint_ids;
                let velocity;
                let start_position;
                let end_position;
                let gimbal_point;

                if (type === 1) {
                    checkpoint_ids = this.state.selectedCheckpoints;
                    velocity = 0;
                    start_position = 0;
                    end_position = 0;
                    gimbal_point = 0;
                } else {
                    checkpoint_ids = [];
                    velocity = parseFloat(this.props.form.getFieldValue('velocity'));
                    start_position = parseFloat(this.props.form.getFieldValue('start_position'));
                    end_position = parseFloat(this.props.form.getFieldValue('end_position'));
                    gimbal_point = this.props.form.getFieldValue('gimbalpoint');
                }

                const data = {
                    name: name,
                    robot_id: robot_id,
                    type: type,
                    vision_algorithms: vision_algorithms,
                    checkpoint_ids: checkpoint_ids,
                    velocity: velocity,
                    start_position: start_position,
                    end_position: end_position,
                    gimbal_point: gimbal_point,
                }
                this.state.updateFormData(data);
                this.state.nextStep();
            } else {
                console.log('Errors: ', err);
            }

        });

    };

    CustomFormItem = ({ name, label, rules, initialValue, children }) => (
        <FormItem label={label}>
            {this.props.form.getFieldDecorator(name, { rules, initialValue })(children)}
        </FormItem>
    );


    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedCheckpoints: selectedRows.map(row => row.id) });
        },
        getCheckboxProps: record => ({
            // 这个函数用于设置复选框的属性
            // 例如：disabled: record.isDisabled,
        }),
    };

    render() {
        const CustomFormItem = this.CustomFormItem;
        const taskTypes = [
            { value: 1, label: '常规任务' },
            { value: 0, label: '自动任务' },
        ];
        const taskType = this.props.form.getFieldValue('type');
        return (
            <div>
                <Form style={{ maxWidth: '500px', margin: '40px auto 0' }} onSubmit={this.onSubmit}>
                    <CustomFormItem
                        name="name"
                        label="任务名称"
                        rules={[{ required: true, message: '请输入任务名称' }]}
                    >
                        <Input placeholder="请输入任务名称" />
                    </CustomFormItem>

                    <CustomFormItem
                        name="robot"
                        label="机器人选择"
                        rules={[{ required: true, message: '请选择机器人' }]}
                    >
                        <Select>
                            {this.state.robotList.map((robot, index) => (
                                <Option key={index} value={robot.id}>
                                    {robot.name}
                                </Option>
                            ))}
                        </Select>
                    </CustomFormItem>

                    <CustomFormItem
                        name="type"
                        label="任务类型"
                        rules={[{ required: true, message: '请选择任务类型' }]}
                        initialValue={1}
                    >
                        <Radio.Group>
                            {taskTypes.map((type) => (
                                <Radio key={type.value} value={type.value}>
                                    {type.label}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </CustomFormItem>

                    <CustomFormItem
                        name="algorithm"
                        label="视觉算法"
                        rules={[{ required: true, message: '请选择算法' }]}
                    >
                        <Select mode="multiple">
                            {this.state.algorithmList
                                .filter(algorithm => {
                                    // 获取任务类型的值
                                    const taskType = this.props.form.getFieldValue('type');
                                    return taskType === 0 ? algorithm.type === 1 : algorithm.type === 0;
                                })
                                .map((algorithm, index) => (
                                    <Option key={index} value={algorithm.id}>
                                        {algorithm.name}
                                    </Option>
                                ))}
                        </Select>
                    </CustomFormItem>
                    {taskType === 1 ? (
                        <CustomFormItem
                            name="checkpoints"
                            label="巡检点"
                        >
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
                                        title: '位置',
                                        dataIndex: 'position',
                                        key: 'position',
                                    },
                                ]}
                                dataSource={this.state.checkpointsList}
                                pagination={{
                                    pageSize: 5,
                                }}
                            />
                        </CustomFormItem>
                    ) : (
                        <>
                            {/* taskType 不等于 1 时展示速度和位置 */}
                            <CustomFormItem
                                name="velocity"
                                label="速度"
                                rules={[{ required: true, message: '请输入速度' }]}
                            >
                                <Input placeholder="请输入速度" />
                            </CustomFormItem>
                            <CustomFormItem
                                name="start_position"
                                label="开始位置"
                                rules={[{ required: true, message: '请输入位置' }]}
                            >
                                <Input placeholder="请输入位置" />
                            </CustomFormItem>
                            <CustomFormItem
                                name="end_position"
                                label="结束位置"
                                rules={[{ required: true, message: '请输入位置' }]}
                            >
                                <Input placeholder="请输入位置" />
                            </CustomFormItem>

                            <CustomFormItem
                                name="gimbalpoint"
                                label="云台点"
                                rules={[{ required: true, message: '请选择云台点' }]}
                            >
                                <Select>
                                    {this.state.gimbalpointsList.map((gimbalpoint, index) => (
                                        <Option key={index} value={gimbalpoint.id}>
                                            {"预置点：" + gimbalpoint.preset_index}
                                        </Option>
                                    ))}
                                </Select>
                            </CustomFormItem>
                        </>
                    )}

                    <Button type="primary" htmlType='submit'> Next </Button>
                </Form>
            </div>
        );
    }
}

export default Form.create({ name: 'step1' })(Step1);

