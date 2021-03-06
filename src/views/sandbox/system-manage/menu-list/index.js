import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'

import { Button, Table, Space, Modal, Form, Input, Switch, Dropdown, Menu, Tag, message } from "antd";
import { DownOutlined, DeleteOutlined, AppstoreAddOutlined, EditOutlined } from "@ant-design/icons";

import { updateMenus, delMenu, editMenu } from '@/redux/actions/menus'

import { createMenu, updateMenu, deleteMenu } from "@/assets/api/index";
import { generateMenuTree, generateUUID } from "@/assets/utils/index";

function MenuList(props) {
	const [modalVisible, setModalViaible] = useState(false);
	const [modalTitle, setModalTitle] = useState("新增根菜单");
	const [menuItem, setMenuItem] = useState(null);
	const [editType, setEditType] = useState(0);
	const [menus, setMenus] = useState(props.menus);
	
	const [form] = Form.useForm();

	let inputMenu = {};

	useEffect(() => {
		props.menus.forEach((item) => {
			item.key = item.id
		})
		
		setMenus(generateMenuTree(props.menus))
	}, [props.menus]);


	const submit = () => {
		if (!editType) {
			// 添加根菜单
			let params = {
				id: generateUUID(16),
				parentId: 0,
				name: inputMenu.name,
				icon: inputMenu.icon,
				path: inputMenu.path,
				component: inputMenu.component,
				visible: inputMenu.visible,
				disabled: inputMenu.disabled
			};

			createMenu(params).then(res => {
				let data = res.data;

				if (data.success) {
					message.success("创建成功");
					props.updateMenus([...menus, params])
				} else {
					message.error("创建失败");
				}
			});
		}

		if (editType === 1) {
			// 添加子菜单
			let params = {
				id: generateUUID(16),
				parentId: menuItem.id,
				name: inputMenu.name,
				icon: inputMenu.icon,
				path: inputMenu.path,
				component: inputMenu.component,
				visible: inputMenu.visible,
				disabled: inputMenu.disabled
			};

			createMenu(params).then(res => {
				let data = res.data;

				if (data.success) {
					message.success("创建成功");
					props.updateMenus([...menus, params])
				} else {
					message.error("创建失败");
				}
			});
		}

		if (editType === 2) {
			// 编辑菜单
			let params = {
				id: menuItem.id,
				parentId: menuItem.parentId,
				name: inputMenu.name,
				icon: inputMenu.icon,
				path: inputMenu.path,
				component: inputMenu.component,
				visible: inputMenu.visible,
				disabled: inputMenu.disabled
			};

			updateMenu(params).then(res => {
				let data = res.data;

				if (data.success) {
					message.success("更新成功");
					props.editMenu([...menus, params])
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

	const addMenu = (item, type) => {
		let modalTitleMap = { 0: "新增根菜单", 1: "新增子菜单", 2: "编辑菜单" };

		console.log("item: ", item);

		setModalViaible(true);
		setModalTitle(modalTitleMap[type]);
		setMenuItem(item);
		setEditType(type);
	};

	const delMenu = item => {
		console.log("currentMenu: ", item);

		let params = {
			id: item.id
		};

		deleteMenu(params).then(res => {
			let data = res.data;

			if (data.success) {
				message.success("删除成功");
				props.delMenu(item);
			} else {
				message.error("删除失败");
			}
		});
	};

	const inputValue = (e, type) => {
		switch (type) {
			case 0:
				inputMenu.name = e.target.value;
				break;
			case 1:
				inputMenu.path = e.target.value;
				break;
			case 2:
				inputMenu.component = e.target.value;
				break;
			case 3:
				inputMenu.icon = e.target.value;
				break;
			case 4:
				inputMenu.visible = e ? 1 : 0;
				break;
			case 5:
				inputMenu.disabled = e ? 1 : 0;
				break;
			default:
				break;
		}

		console.log("menuI: ", inputMenu, e);
	};

	useEffect(() => {
		const updateForm = () => {
			if (menuItem) {
				form.setFieldsValue(menuItem);
			} else {
				form.resetFields();
			}
		};
		
		updateForm();
	}, [menuItem, form]); // 副作用依赖menuItem,当更新完数据后拿到最新的值更新表单

	const columns = [
		{
			title: "主键",
			align: "center",
			dataIndex: "id"
		},
		{
			title: "菜单名称",
			align: "center",
			dataIndex: "name"
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
			render: (checked, record, index) => {
				return <Switch key={checked} defaultChecked={checked} onChange={changeVisible}></Switch>;
			}
		},
		{
			title: "状态",
			dataIndex: "disabled",
			align: "center",
			render: disabled => {
				let color = disabled ? "green" : "rgba(144,147,153, 0.5)";
				let tagText = disabled ? "开启" : "禁用";

				return <Tag color={color}>{tagText}</Tag>;
			}
		},
		{
			title: "操作",
			key: "action",
			align: "center",
			render: (text, record, index) => (
				<Space size="middle">
					<Button type="primary" danger icon={<DeleteOutlined />} onClick={() => delMenu(record)}>
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

	const data = menus;

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
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={menuItem}
				autoComplete="off"
			>
				<Form.Item label="菜单名称" name="name" rules={[{ required: true, message: "请输入菜单名称!" }]}>
					<Input allowClear onChange={e => inputValue(e, 0)} />
				</Form.Item>

				<Form.Item label="路径" name="path" rules={[{ required: true, message: "请输入菜单路径!" }]}>
					<Input allowClear onChange={e => inputValue(e, 1)} />
				</Form.Item>

				<Form.Item label="组件" name="component">
					<Input allowClear onChange={e => inputValue(e, 2)} />
				</Form.Item>

				<Form.Item label="icon" name="icon">
					<Input allowClear onChange={e => inputValue(e, 3)} />
				</Form.Item>

				<Form.Item label="是否隐藏" valuePropName="checked" name="visible">
					<Switch onChange={e => inputValue(e, 4)} />
				</Form.Item>

				<Form.Item label="是否启动" valuePropName="checked" name="disabled">
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
			<Button onClick={() => addMenu(null, 0)}>新增根菜单</Button>
			<Table columns={columns} dataSource={data} size="middle" />
			{modal}
		</div>
	);
}

export default connect(
	state => ({
		menus: state.MenusReducer.menus
	}),
	{
		updateMenus: updateMenus,
		delMenu: delMenu,
		editMenu: editMenu
	}
)(MenuList)