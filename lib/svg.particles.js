/*
 *Project: svg.particles.js
 *Author: PJY
 *Date: 2016.08.30
 *LICENSE: MIT
 */

var width = document.body.clientWidth,//获取屏幕宽度
	height = document.body.clientHeight,//获取屏幕高度
	ns = "http://www.w3.org/2000/svg",//待用明明空间
	distance = 300,//点之间距离上限（判断是否连线）
	lineColor = "rgba(255, 255, 255, 0.5)",//线的颜色
	points = [];//存放点的信息的数组

//我们所有的点的信息（包括圆心，半径，移动轨迹）都随机生成，放到数组里边备用。
for(let i = 0; i < 20; i++) {
	points.push(getPointData(1));
}

//随机生成点的信息
function getPointData(radius) {

	var x = Math.ceil(Math.random()*width),
		y = Math.ceil(Math.random()*height),
		r = +(Math.random()*radius + 2).toFixed(4),
		rateX = +(Math.random()*2-1).toFixed(4),
		rateY = +(Math.random()*2-1).toFixed(4);

	return {
		x: x,
		y: y,
		r: r,
		rateX: rateX,
		rateY: rateY
	}

}

function drawPoints() {
	var rootSvg = document.getElementById("my");

	points.forEach(function(item) {

		let circle = document.createElementNS(ns, "circle");
		circle.setAttribute("cx", item.x);
		circle.setAttribute("cy", item.y);
		circle.setAttribute("r", item.r);
		//透明度的设置，点越大，透明度越小，反之亦然
		circle.setAttribute("fill", "rgba(255, 255, 255, "+ (item.r-2)/1 +")");
		rootSvg.appendChild(circle);
		
	});
}

function line(x1, y1, x2, y2, strokeWidth, color) {
	var rootSvg = document.getElementById("my");
	let line = document.createElementNS(ns, "line");
		line.setAttribute("x1", x1);
		line.setAttribute("x2", x2);
		line.setAttribute("y1", y1);
		line.setAttribute("y2", y2);
		line.setAttribute("stroke-width", strokeWidth);
		line.setAttribute("stroke", color);
	rootSvg.appendChild(line);
}

function dis(x1, y1, x2, y2) {
	var disX = Math.abs(x1 - x2),
		disY = Math.abs(y1 - y2);

	return Math.sqrt(disX * disX + disY * disY);
}

function drawLines() {

	for(let i = 0, len = points.length;i < len;i++) {
		for(let j = len - 1; j >= 0; j--) {
			let x1 = points[i].x,
				y1 = points[i].y,
				x2 = points[j].x,
				y2 = points[j].y,
				disPoint = dis(x1, y1, x2, y2);

			if(disPoint <= distance) {
				//线的宽度设置为：距离越长，线越细，反之越粗
				line(x1, y1, x2, y2, 1 - disPoint/distance, lineColor);
			}
		}
	}

}

function move() {
	//在重绘之前先清除所有的svg元素（不推荐，仅供演示用）
	var child = document.getElementById("my");
	//如果没有svg根元素，直接添加，有的话就清除
	if(child) {
		child.parentNode.removeChild(child);
	}
	//添加svg根元素
	newSvg = document.createElementNS(ns, "svg");
	newSvg.setAttribute("width", "100%");
	newSvg.setAttribute("height", "100%");
	newSvg.setAttribute("id", "my");
	document.body.appendChild(newSvg);
	//对点信息数组进行操作，利用我们随机生成的移动数据对点的圆心进行变换
	points.forEach(function(item, i) {
		if(item.x > 0 && item.x < width && item.y > 0 && item.y < height) {
			item.x += item.rateX*2;
			item.y += item.rateY*2;
		} else {//如果点已经移出去屏幕了，从数组里边移除这个点，同时新增加一个点。
			points.splice(i, 1);
			points.push(getPointData(1));
		}
	});
	drawPoints();
	drawLines();
	//move
	window.requestAnimationFrame(move);

}
move();