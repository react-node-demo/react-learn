import styled, { css } from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	display: flex;
`;

export const TabItem = styled.div`
	padding: 6px 12px;
	cursor: pointer;

	${props => {
		if (props.type) {
			if (props.type === "primary") {
				css`
					background-color: #1890ff;
					color: #fff;
				`;
			}

			if (props.type === "text") {
				css`
					border-color: transparent;
					color: #000000d9;
				`;
			}

			if (props.type === "link") {
				css`
					border-color: transparent;
					color: #40a9ff;
				`;
			}
		}
	}}
`;

export const TabText = styled(TabItem)`
	padding: 0;
	font-size: 14px;
	font-weight: 400;
`;

export const TabLine = styled(TabItem)`
	padding: 0;
	width: 100%;
	height: 2px;
	border-radius: 1px;
`;
