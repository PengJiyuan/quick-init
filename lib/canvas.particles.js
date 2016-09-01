/*
 *Project: canvas.particles.js
 *Author: PJY
 *Date: 2016.08.30
 *LICENSE: MIT
 */

var canvas = document.getElementById("my"),
	ctx = canvas.getContext("2d"),
	width = document.body.clientWidth,
	height = document.body.clientHeight,
	distance = 150,//点之间距离小于这个值就连线
	lineColor = "rgba(255, 255, 255, 0.5)",
	points = [],//储存点信息的数组
	movePoints = {};//储存鼠标坐标点信息的数组

canvas.width = width;
canvas.height = height;

//随机生成n个坐标信息并储存到数组里备用
for(let i = 0; i < 80; i++) {
	points.push(getPointData(5));
}

//生成随机的坐标信息
function getPointData(radius) {

	var x = Math.ceil(Math.random()*width),
		y = Math.ceil(Math.random()*height),
		r = +(Math.random()*radius + 8).toFixed(4),
		rateX = +(Math.random()*2-1).toFixed(4),
		rateY = +(Math.random()*2-1).toFixed(4);

	return {
		x: x,//坐标x
		y: y,//坐标y
		r: r,//半径
		rateX: rateX,//X轴方向的位移率
		rateY: rateY//Y轴方向的位移率
	}

}

//获取鼠标处坐标的信息
function getPosition(ev) {
	var ev = window.event;
	var x, y;
  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return {x: x, y: y};
}

//事件绑定组件
function addEvent(element, type, handler){
  if (element.addEventListener){
      element.addEventListener(type, handler, false);
  } else if (element.attachEvent){
      element.attachEvent("on" + type, handler);
  } else {
      element["on" + type] = handler;
  }
}

//当鼠标移动的时候获取坐标信息，储存到数组内
addEvent(canvas, "mousemove", function(e) {
	var ev = window.event || e;
	movePoints = getPosition(ev);
});

//画点，画完后对坐标进行位移，以供下次重绘使用
function drawPoints() {
	points.forEach(function(item, i) {
		ctx.beginPath();
		ctx.arc(item.x, item.y, item.r, 0, Math.PI*2, false);
		//圆半径越大，透明度越小，反之亦然
		ctx.fillStyle = "rgba(255, 255, 255, "+ (item.r-8)/4 +")";
		ctx.fill();
		if(item.x > 0 && item.x < width && item.y > 0 && item.y < height) {
			item.x += item.rateX*2;
			item.y += item.rateY*2;
		} else {
			points.splice(i, 1);
			points.push(getPointData(5));
		}
	});
}

//两点之间距离
function dis(x1, y1, x2, y2) {
	var disX = Math.abs(x1 - x2),
		disY = Math.abs(y1 - y2);

	return Math.sqrt(disX * disX + disY * disY);
}

//判断两点之间距离小于distance，就画线
function drawLines() {
	//对圆心坐标进行两两判断
	for(let i = 0, len = points.length;i < len;i++) {
		for(let j = len - 1; j >= 0; j--) {
			let x1 = points[i].x,
				y1 = points[i].y,
				x2 = points[j].x,
				y2 = points[j].y,
				disPoint = dis(x1, y1, x2, y2);

			if(disPoint <= distance) {
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.strokeStyle = lineColor;
				//两点之间距离越大，线越细，反之亦然
				ctx.lineWidth = 1 - disPoint/distance;
				ctx.stroke();
			}
		}
		//鼠标处坐标与其他圆心坐标的距离，小于distance就画线
		let x1 = movePoints.x,
			y1 = movePoints.y,
			x2 = points[i].x,
			y2 = points[i].y;

		var d = dis(x1, y1, x2, y2);
		if(d <= distance) {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.strokeStyle = lineColor;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

}

//让点动起来
(function move() {
	//擦除画布，进行重绘
	ctx.clearRect(0, 0, width, height);
	drawPoints();
	drawLines();
	window.requestAnimationFrame(move);
}());