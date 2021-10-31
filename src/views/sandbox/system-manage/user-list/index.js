import React, { useState, useEffect } from "react";
import { Button, Table, Space, Modal, Form, Input, Switch, Dropdown, Menu, message, Select } from "antd";
import { DownOutlined, DeleteOutlined, AppstoreAddOutlined } from "@ant-design/icons";

import { getUsers, createUser, updateUser, deleteUser } from "@/assets/api/index";

const { Option } = Select;

export default function UserList() {
	const [modalVisible, setModalViaible] = useState(false);
	const [modalTitle, setModalTitle] = useState("新增用户");
	const [menuItem, setMenuItem] = useState(null);
	const [editType, setEditType] = useState(0);
	const [users, setUsers] = useState([]);

	let inputUser = {};

	useEffect(() => {
		fetchUsers();
	}, []);

	const [form] = Form.useForm();

	const fetchUsers = () => {
		getUsers().then(res => {
			console.log("res: ", res)
			let data = res.data;
			if (data.success) {
				const { users } = data.body;

				users.forEach((item) => {
					item.key = item.id
				})

				// console.log("users: ", users)
				setUsers(users);
			}
		});
	};

	const submit = () => {
		if (!editType) {
			// 添加根菜单
			let params = {
				nickname: inputUser.nickname,
				telphone: inputUser.telphone,
				identity: inputUser.identity,
				password: inputUser.password,
				visible: inputUser.visible,
				disabled: inputUser.disabled
			};

			createUser(params).then(res => {
				let data = res.data;

				if (data.success) {
					fetchUsers();
					message.success("创建成功");
				} else {
					message.error("创建失败");
				}
			});
		}

		if (editType === 1) {
			// 编辑菜单
			let params = {
				id: menuItem.id,
				nickname: inputUser.nickname,
				telphone: inputValue.telphone,
				visible: inputUser.visible,
				disabled: inputUser.disabled
			};

			updateUser(params).then(res => {
				let data = res.data;

				if (data.success) {
					fetchUsers();
					message.success("更新成功");
				} else {
					message.error("更新失败");
				}
			});
		}
		setModalViaible(false);
	};

	const cancel = () => {
		setModalViaible(false);
	};

	const changeVisible = value => {
		console.log("changeVisible: ", value);
	};

	const addUser = (item, type) => {
		let modalTitleMap = { 0: "新增用户", 1: "编辑用户" };

		console.log("item: ", item);

		setModalViaible(true);
		setModalTitle(modalTitleMap[type]);
		setMenuItem(item);
		setEditType(type);
	};

	const delUser = item => {
		console.log("currentMenu: ", item);

		let params = {
			id: item.id
		};

		deleteUser(params).then(res => {
			let data = res.data;

			if (data.success) {
				message.success("删除成功");
				fetchUsers();
			} else {
				message.error("删除失败");
			}
		});
	};

	const inputValue = (e, type) => {
		switch (type) {
			case 0:
				inputUser.nickname = e.target.value;
				break;
			case 1:
				inputUser.telphone = e.target.value;
				break;
			case 2:
				inputUser.password = e.target.value;
				break;
			case 4:
				inputUser.visible = e ? 1 : 0;
				break;
			case 5:
				inputUser.disabled = e ? 1 : 0;
				break;
			default:
				break;
		}

		console.log("menuI: ", inputUser, e);
	};

	const selectIdentity = (value) => {
		inputUser.identity = value;
	}

	const updateForm = () => {
		if (menuItem) {
			form.setFieldsValue(menuItem);
		} else {
			form.resetFields();
		}
	};

	useEffect(() => {
		updateForm();
	}, [menuItem]); // 副作用依赖menuItem,当更新完数据后拿到最新的值更新表单

	const columns = [
		{
			title: "主键",
			align: "center",
			dataIndex: "id"
		},
		{
			title: "用户昵称",
			align: "center",
			dataIndex: "nickname"
		},
		{
			title: "手机号",
			align: "center",
			dataIndex: "telphone"
		},
		{
			title: "用户身份",
			align: "center",
			dataIndex: "identity"
		},
		{
			title: "操作",
			key: "action",
			align: "center",
			render: (text, record, index) => (
				<Space size="middle">
					<Button type="primary" danger icon={<DeleteOutlined />} onClick={() => delUser(record)}>
						删除
					</Button>
					<Dropdown overlay={renderDropDownMenu(record)} trigger={["click"]} arrow>
						<Button type="primary">
							更多操作
							<DownOutlined />
						</Button>
					</Dropdown>
				</Space>
			)
		}
	];

	const data = users;

	const renderDropDownMenu = row => {
		return (
			<Menu>
				<Menu.Item key="0">
					<Button type="text" icon={<AppstoreAddOutlined />} onClick={() => addUser(row, 1)}>
					编辑用户
					</Button>
				</Menu.Item>
			</Menu>
		);
	};

	const selection = (
		<Select style={{ width: "100%" }} placeholder="请选择身份" allowClear onChange={selectIdentity}>
			<Option value="普通用户">普通用户</Option>
			<Option value="管理员">管理员</Option>
			<Option value="超级管理员">超级管理员</Option>
		</Select>
	);

	const renderForm = () => {
		console.log("menuItem: ", menuItem);

		return (
			<Form
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={menuItem}
				autoComplete="off"
			>
				<Form.Item label="用户昵称" name="nickname" rules={[{ required: true, message: "请输入用户昵称!" }]}>
					<Input allowClear onChange={e => inputValue(e, 0)} />
				</Form.Item>

				<Form.Item label="手机号" name="telphone" rules={[{ required: true, message: "请输入用户手机号!" }]}>
					<Input allowClear onChange={e => inputValue(e, 1)} />
				</Form.Item>

				<Form.Item label="身份" name="identity" rules={[{ required: true, message: "请选择用户身份!" }]}>
					{ selection }
				</Form.Item>

				<Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入用户密码!" }]}>
					<Input allowClear type="password" onChange={e => inputValue(e, 2)} />
				</Form.Item>

				<Form.Item label="是否禁用" valuePropName="checked" name="disabled">
					<Switch onChange={e => inputValue(e, 5)} />
				</Form.Item>
			</Form>
		);
	};

	const modal = (
		<Modal
			title={modalTitle}
			centered
			cancelText="取消"
			okText="提交"
			visible={modalVisible}
			onOk={submit}
			onCancel={cancel}
		>
			{renderForm()}
		</Modal>
	);

	return (
		<div>
			<Button onClick={() => addUser(null, 0)}>新增用户</Button>
			<Table columns={columns} dataSource={data} size="middle" />
			{modal}
		</div>
	);
}
