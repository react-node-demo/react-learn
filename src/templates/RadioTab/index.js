import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Wrapper, TabItem, TabText, TabLine } from "./style";

export default function RadioTab(props) {
	const [currentIndex, setCurrentIndex] = useState(-1);

	const changeTab = (item, index) => {
		setCurrentIndex(index);
		props.changeTab(item, index);
	};

	useEffect(() => {
		setCurrentIndex(props.activeIndex);
	}, [props.activeIndex]);

	return (
		<Wrapper>
			{props.list.map((tabItem, index) => (
				<TabItem key={index} onClick={() => changeTab(tabItem, index)}>
					<TabText style={{ color: currentIndex === index ? props.activeColor : "" }}>
						{tabItem.label}
					</TabText>
					<TabLine style={{ backgroundColor: currentIndex === index ? props.activeColor : "" }}></TabLine>
				</TabItem>
			))}
		</Wrapper>
	);
}

RadioTab.propTypes = {
	changeTab: PropTypes.func,
	list: PropTypes.array.isRequired,
	activeColor: PropTypes.string,
	activeSize: PropTypes.string
};

RadioTab.defaultProps = {
	activeSize: "14px",
	activeIndex: 0
};
