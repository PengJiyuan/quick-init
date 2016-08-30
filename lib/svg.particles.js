/*
 *Project: svg.particles.js
 *Author: PJY
 *Date: 2016.08.30
 *LICENSE: MIT
 */

var width = document.body.clientWidth,
	height = document.body.clientHeight,
	ns = "http://www.w3.org/2000/svg",
	distance = 300,
	lineColor = "rgba(255, 255, 255, 0.5)",
	points = [];

for(let i = 0; i < 20; i++) {
	points.push(getPointData(1));
}

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
				line(x1, y1, x2, y2, 1 - disPoint/distance, lineColor);
			}
		}
	}

}

function move() {
	var child = document.getElementById("my");
	if(child) {
		child.parentNode.removeChild(child);
	}

	newSvg = document.createElementNS(ns, "svg");
	newSvg.setAttribute("width", "100%");
	newSvg.setAttribute("height", "100%");
	newSvg.setAttribute("id", "my");
	document.body.appendChild(newSvg);

	points.forEach(function(item, i) {
		if(item.x > 0 && item.x < width && item.y > 0 && item.y < height) {
			item.x += item.rateX*2;
			item.y += item.rateY*2;
		} else {
			points.splice(i, 1);
			points.push(getPointData(1));
		}
	});
	drawPoints();
	drawLines();
	window.requestAnimationFrame(move);

}
move();