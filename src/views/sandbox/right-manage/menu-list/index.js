import React, { useState, useEffect } from "react";
import { Button, Table, Space, Modal, Form, Input, Switch, Dropdown, Menu, Tag } from "antd";
import { DownOutlined, DeleteOutlined, AppstoreAddOutlined, EditOutlined } from "@ant-design/icons";

export default function MenuList() {
	const [modalVisible, setModalViaible] = useState(false);
	const [modalTitle, setModalTitle] = useState("新增根菜单");
	const [menuItem, setMenuItem] = useState(null);

	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const changeVisible = value => {
		console.log("changeVisible: ", value);
	};

	const addMenu = (item, type) => {
		let modalTitleMap = { 0: "新增根菜单", 1: "新增子菜单", 2: "编辑菜单" };

		console.log("item: ", item);

		setModalViaible(true);
		setModalTitle(modalTitleMap[type]);
		setMenuItem(item);
	};

	const columns = [
		{
			title: "主键",
			align: "center",
			dataIndex: "id"
		},
		{
			title: "菜单名称",
			align: "center",
			dataIndex: "menuName"
		},
		{
			title: "路径",
			dataIndex: "path"
		},
		{
			title: "组件",
			align: "center",
			dataIndex: "component"
		},
		{
			title: "隐藏",
			align: "center",
			dataIndex: "visible",
			render: (text, record, index) => {
				debugger;
				return <Switch defaultChecked={text} onChange={changeVisible}></Switch>;
			}
		},
		{
			title: "状态",
			dataIndex: "status",
			align: "center",
			render: text => {
				let color = text ? "green" : "rgba(144,147,153, 0.5)";
				let tagText = text ? "启动" : "停止";

				return <Tag color={color}>{tagText}</Tag>;
			}
		},
		{
			title: "操作",
			key: "action",
			align: "center",
			render: (text, record, index) => (
				<Space size="middle">
					<Button type="primary" danger icon={<DeleteOutlined />}>
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

	const data = [
		{
			key: "1",
			id: "1",
			name: "系统管理",
			path: "/system-manage",
			component: "SystemMenu",
			visible: 0,
			status: 0
		},
		{
			key: "2",
			id: "2",
			name: "菜单管理",
			path: "/system-manage/menu-manage",
			component: "MenuManage",
			visible: 0,
			status: 1
		},
		{
			key: "3",
			id: "3",
			name: "角色管理",
			path: "/system-manage/role-manage",
			component: "RoleManage",
			visible: 0,
			status: 1
		}
	];

	const renderDropDownMenu = row => {
		return (
			<Menu>
				<Menu.Item key="0">
					<Button type="text" icon={<AppstoreAddOutlined />} onClick={() => addMenu(row, 1)}>
						添加子菜单
					</Button>
				</Menu.Item>
				<Menu.Item key="1">
					<Button type="text" icon={<EditOutlined />} onClick={() => addMenu(row, 2)}>
						编辑菜单
					</Button>
				</Menu.Item>
			</Menu>
		);
	};

	const renderForm = () => {
		console.log("menuItem: ", menuItem);
		return (
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				onFinish={onFinish}
				initialValues={menuItem}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item label="菜单名称" name="name" rules={[{ required: true, message: "请输入菜单名称!" }]}>
					<Input />
				</Form.Item>

				<Form.Item label="路径" name="path" rules={[{ required: true, message: "请输入菜单路径!" }]}>
					<Input />
				</Form.Item>

				<Form.Item label="组件" name="component">
					<Input />
				</Form.Item>

				<Form.Item label="是否隐藏" valuePropName="checked">
					<Switch />
				</Form.Item>

				<Form.Item label="是否启动" valuePropName="checked">
					<Switch />
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
			onOk={() => {
				setModalViaible(false);
			}}
			onCancel={() => {
				setModalViaible(false);
			}}
		>
			{renderForm()}
		</Modal>
	);

	return (
		<div>
			<Button onClick={() => addMenu(null, 0)}>新增根菜单</Button>
			<Table columns={columns} dataSource={data} size="middle" />
			{modal}
		</div>
	);
}
