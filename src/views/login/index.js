import React, { useState, useEffect } from "react";

import { Input, Button, message, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { loginWithPassword, registerWithPassword } from "@/assets/api/login";

import LineDots from "@/templates/LineDots/index";
import RadioTab from "@/templates/RadioTab";
import "./index.css";

const { Option } = Select;

export default function Login(props) {
	const [nickname, setNickname] = useState("");
	const [telphone, setTelphone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPwd, setConfirmPwd] = useState("");
	const [userIdentity, setUserIdentity] = useState(-1);
	const [loginType, setLoginType] = useState(0);

	const radioTabs = [
		{
			label: "用户登录"
		},
		{
			label: "用户注册"
		}
	];

	const selection = (
		<Select style={{ width: "100%" }} placeholder="请选择身份" onChange={value => onInput(value, 3)}>
			<Option value="普通用户">普通用户</Option>
			<Option value="管理员">管理员</Option>
			<Option value="超级管理员">超级管理员</Option>
		</Select>
	);

	const onInput = (e, type) => {
		switch (type) {
			case -1:
				setNickname(e.target.value);
				break;
			case 0:
				setTelphone(e.target.value);
				break;
			case 1:
				setPassword(e.target.value);
				break;
			case 2:
				setConfirmPwd(e.target.value);
				break;
			case 3:
				setUserIdentity(e);
				break;
			default:
				break;
		}
	};

	const login = type => {
		if (!telphone || !password) {
			return message.error("请输入用户名或密码");
		}

		let params = {
			telphone: telphone,
			password: password
		};

		loginWithPassword(params).then(res => {
			console.log("登录：", res);
			let data = res.data;

			if (data.success) {
				const { token, refresh_token, expiresTime } = data.body;

				localStorage.setItem("token", token);
				localStorage.setItem("refresh_token", refresh_token);
				localStorage.setItem("expiresTime", expiresTime + new Date().getTime());

				props.history.push({
					pathname: "/"
				});
			}
		});

		console.log(telphone, password);
	};

	const register = () => {
		console.log(telphone, password);

		const phoneMatch = /^1[3-9]\d{9}$/;
		if (!nickname) {
			return message.error("请输入昵称");
		}

		if (!telphone) {
			return message.error("请输入手机号");
		}

		if (!phoneMatch.test(telphone)) {
			return message.error("手机号格式错误");
		}

		if (!password) {
			return message.error("请输入密码");
		}

		if (!confirmPwd) {
			return message.error("请输入确认密码");
		}

		if (confirmPwd !== password) {
			return message.error("两次输入密码不一致");
		}

		if (userIdentity === -1) {
			return message.error("请选择用户身份");
		}

		let params = {
			nickname: nickname,
			telphone: telphone,
			password: password,
			identity: userIdentity
		};

		registerWithPassword(params).then(res => {
			let data = res.data;

			console.log("注册data: ", data);

			if (data.success) {
				message.success("注册成功");
			}
		});
	};

	const changeTab = (item, index) => {
		setLoginType(index);
	};

	return (
		<div className="login flex-center">
			<LineDots></LineDots>
			<div className="form flex-column sub-axis-center">
				<RadioTab changeTab={changeTab} list={radioTabs} activeColor="#1876ff"></RadioTab>
				{loginType ? (
					<Input
						className="form-input"
						placeholder="昵称"
						type="text"
						onChange={e => onInput(e, -1)}
						prefix={<UserOutlined />}
					/>
				) : null}
				<Input
					className="form-input"
					placeholder="手机号"
					type="tel"
					maxLength={11}
					onChange={e => onInput(e, 0)}
					prefix={<UserOutlined />}
				/>
				<Input
					className="form-input"
					placeholder="密码"
					type="password"
					onChange={e => onInput(e, 1)}
					prefix={<LockOutlined />}
				/>
				{password && loginType ? (
					<Input
						className="form-input"
						placeholder="确认密码"
						type="password"
						onChange={e => onInput(e, 2)}
						prefix={<LockOutlined />}
					/>
				) : null}

				{loginType ? selection : null}

				<div className="form-footer flex-row main-axis-center">
					{loginType ? (
						<Button
							className="form-button"
							style={{
								backgroundColor:
									!nickname || !telphone || !password || !userIdentity ? "transparent" : "#1890ff"
							}}
							type="primary"
							onClick={register}
						>
							注册
						</Button>
					) : (
						<Button
							className="form-button"
							style={{
								backgroundColor: !telphone || !password ? "transparent" : "#1890ff"
							}}
							type="primary"
							onClick={login}
						>
							登录
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
