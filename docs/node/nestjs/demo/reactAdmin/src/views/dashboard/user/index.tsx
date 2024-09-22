import type { GetProps, TableProps } from 'antd';
import { Button, Form, Input, message, Modal, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { SearchOutlined } from '@ant-design/icons';
import api from '../../../api';
import './index.scss';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

type ColumnsType<T extends object> = TableProps<T>['columns'];

interface DataType {
    id: number;
    name: string;
    age: number;
    tags: string[];
}
interface TableParams {
    pageSize?: number;
    current?: number;
    total?: number;
}

const User: React.FC = () => {
    const theme = useSelector(state => state.theme.value)

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name', dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        { title: 'Age', dataIndex: 'age' },
        {
            title: 'Tags', dataIndex: 'tags',
            render: (tags: string[]) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        return (
                            <Tag color={color} key={tag.id} >
                                {tag.tags.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '操作',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" onClick={() => deleteUser(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        current: 1,
        pageSize: 10,
    });
    const [keyWord, setKeyWord] = useState<string>('');

    useEffect(() => {
        getUsersPage()
    }, [tableParams.current, tableParams.pageSize])

    const getUsersPage = () => {
        setLoading(true);
        api.get(`v1/user?keyWord=${keyWord}&page=${tableParams.current}&pageSize=${tableParams.pageSize}`)
            .then(res => {
                setData(res.data || [])
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    total: res.total,
                });
            })
    }


    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState<Values>();
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const onCreate = (values: Values) => {
        setFormValues(values);
        api.post(`v1/user`, values)
            .then(res => {
                messageApi.open({
                    type: 'success',
                    content: `创建用户 { name: '${res.name}', age: '${res.age}' } 成功`,
                });
                setOpen(false);
                getUsersPage();
            })
    };

    const deleteUser = (e: any) => {
        console.log(e);

        api.delete(`v1/user/${e.id}`)
            .then(res => {
                message.success('删除成功');
                getUsersPage();
            })
    }

    return (
        <>
            <header className='header'>
                <Input placeholder="input search text" style={{ width: 200, marginRight: 10 }}
                    onChange={(e) => setKeyWord(e.target.value)} />
                <Button type="primary" shape="circle" icon={<SearchOutlined />}
                    onClick={() => getUsersPage()} />

                <Button type="primary" style={{ marginLeft: 10 }} onClick={() => setOpen(true)} >新增</Button>
            </header>

            <Table
                rowKey={(item) => item.id}
                columns={columns}
                dataSource={data}
                pagination={tableParams}
                loading={loading}
            />

            {contextHolder}

            <Modal
                open={open}
                title="新增用户"
                okText="Create"
                cancelText="Cancel"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => setOpen(false)}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="horizontal"
                        form={form}
                        name="form_in_modal"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        clearOnDestroy
                        onFinish={(values) => onCreate(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item name="name" label="用户名"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="age" label="年龄"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Modal>
        </ >
    );
};

export default User;