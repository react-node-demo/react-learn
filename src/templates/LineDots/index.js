/* eslint-disable no-unused-expressions */
import React from "react";
import { useEffect } from "react";
import "./index.css";

import TweenLite from "gsap";

var points, width, height;

// 粒子
function Particle() {
	this.x = 0; //粒子现在的x坐标
	this.y = 0;
	this.originX = 0; //粒子原始的x坐标
	this.originY = 0;
	this.radius = 0; //粒子的半径
	this.color = 0; //粒子颜色
	this.closest = []; //本粒子相离最近的五个粒子
	this.active = 0; //粒子状态
	this.circleActive = 0; //绘制出圆球的状态
	this.draw = function (ctx) {
		//画出粒子球
		if (!this.active) return;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "rgba(156,217,249," + this.active + ")";
		ctx.fill();
	};
	this.drawLine = function (ctx) {
		//画出粒子间的线
		if (!this.active) return;
		for (var i in this.closest) {
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.closest[i].x, this.closest[i].y);
			ctx.strokeStyle = "rgba(156,217,249," + this.active + ")";
			ctx.stroke();
		}
	};
}

// 粒子系统
function System(canvas) {
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.largeHeader;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.points = [];
	this.target = {
		//鼠标的位置
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	this.animateHeader = true;

	canvas.width = this.width;
	canvas.height = this.height;
}

System.prototype.initHeader = function () {
	//初始化点线
	points = this.points;
	width = this.width;
	height = this.height;
	//定义一定数量的点
	for (var x = 0; x < width; x = x + width / 20) {
		for (var y = 0; y < height; y = y + height / 20) {
			var px = x + (Math.random() * width) / 20;
			var py = y + (Math.random() * height) / 20;
			var p = new Particle();
			p.x = px;
			p.y = py;
			p.originX = px;
			p.originY = py;
			points.push(p);
		}
	}

	// 找到每个点旁边最近的五个点
	for (let i = 0; i < points.length; i++) {
		let closest = [];
		let p1 = points[i];
		for (let j = 0; j < points.length; j++) {
			let p2 = points[j];
			if (!(p1 === p2)) {
				let placed = false;
				for (let k = 0; k < 5; k++) {
					if (!placed) {
						if (closest[k] === undefined) {
							closest[k] = p2;
							placed = true;
						}
					}
				}

				for (let k = 0; k < 5; k++) {
					if (!placed) {
						if (this._getDistance(p1, p2) < this._getDistance(p1, closest[k])) {
							closest[k] = p2;
							placed = true;
						}
					}
				}
			}
		}
		p1.closest = closest;
	}

	// 为每个粒子添加圆的属性
	for (let i in points) {
		points[i].color = "rgba(255,255,255,0.3)";
		points[i].radius = 2 + Math.random() * 2;
	}
};

System.prototype.initAnimation = function () {
	this._animate();
	for (var i in this.points) {
		this._shiftPoint(this.points[i]);
	}
};
System.prototype._animate = function () {
	var points = this.points;
	var target = this.target;
	if (this.animateHeader) {
		//清屏、渲染重复
		this.ctx.clearRect(0, 0, this.width, this.height);
		for (var i in points) {
			if (Math.abs(this._getDistance(target, points[i])) < 4000) {
				points[i].active = 0.3;
				points[i].circleActive = 0.6;
			} else if (Math.abs(this._getDistance(target, points[i])) < 20000) {
				points[i].active = 0.1;
				points[i].circleActive = 0.3;
			} else if (Math.abs(this._getDistance(target, points[i])) < 40000) {
				points[i].active = 0.02;
				points[i].circleActive = 0.1;
			} else {
				points[i].active = 0;
				points[i].circleActive = 0;
			}

			points[i].drawLine(this.ctx);
			points[i].draw(this.ctx);
		}
	}
	requestAnimationFrame(this._animate.bind(this));
};

System.prototype._getDistance = function (p1, p2) {
	return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
};

System.prototype._shiftPoint = function (p) {
	//改变对象属性
	var _this = this;
	TweenLite.to(p, 1 + 1 * Math.random(), {
		x: p.originX - 50 + Math.random() * 100,
		y: p.originY - 50 + Math.random() * 100,
		onComplete: function () {
			_this._shiftPoint(p);
		}
	});
};

System.prototype.addListeners = function () {
	if (!("ontouchstart" in window)) {
		window.addEventListener("mousemove", this._mouseMove.bind(this));
	}
	window.addEventListener("scroll", this._scrollCheck.bind(this));
	window.addEventListener("resize", this._resize.bind(this));
};

System.prototype._mouseMove = function (e) {
	let posx = 0,
		posy = 0;

	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	this.target.x = posx;
	this.target.y = posy;
};

System.prototype._scrollCheck = function () {
	if (document.body.scrollTop > height) this.animateHeader = false;
	else this.animateHeader = true;
};

System.prototype._resize = function () {
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

function init() {
	let canvas = document.getElementById("line-dots");
	let system = new System(canvas);
	system.initHeader();
	system.initAnimation();
	system.addListeners();
}

export default function LineDots() {
	useEffect(() => {
		init();
	}, []);
	return (
		<div className="canvas">
			<canvas id="line-dots"></canvas>
		</div>
	);
}
