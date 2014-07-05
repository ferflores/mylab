function TestClass(){
	var size = 0;
	var maxDepth = 0;
	var _this = null;
	var canvasRef = null;
	var canvasContext = null;

	this.run = function(canvas, canvasWidth, canvasHeight){
		/*var newGuid = Common.guid();
		var canvasHtml = Common.generateCanvas(newGuid, canvasWidth, canvasHeight);
		/*$(canvasDiv).append(canvasHtml);*/
		_this = this;
		canvasRef = canvas;
		canvasContext = canvasRef.getContext("2d");
		MyBlog.postElements.push(canvas);
		size = $(canvas).height() * 0.5;

		_this.draw();

		$(canvas).on("click",
			function(event){
						maxDepth += 1;
						_this.draw();
						
				}
			);
	}

	this.draw = function(){
		//canvasRef.clear();
		canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
		canvasContext.save();
		canvasContext.translate(canvasRef.width*0.5,canvasRef.height*0.6);
		canvasContext.scale(size,size);
		_this.drawTriangle(maxDepth);
		canvasContext.restore();
	}

	this.drawTriangle = function(depth){
		var angle = -Math.PI/2;

		if(depth===0){
			canvasContext.beginPath();
			canvasContext.moveTo(Math.cos(angle), Math.sin(angle));
			angle += Math.PI * 2 / 3;
			canvasContext.lineTo(Math.cos(angle), Math.sin(angle));
			angle += Math.PI * 2 / 3;
			canvasContext.lineTo(Math.cos(angle), Math.sin(angle));
			canvasContext.fill();
		}else{
			canvasContext.save();
			canvasContext.translate(Math.cos(angle)*0.5, Math.sin(angle)*0.5);
			canvasContext.scale(0.5,0.5);
			_this.drawTriangle(depth-1);
			canvasContext.restore();

			angle += Math.PI * 2 / 3;
			canvasContext.save();
			canvasContext.translate(Math.cos(angle)*0.5, Math.sin(angle) * 0.5);
			canvasContext.scale(0.5,0.5);
			_this.drawTriangle(depth-1);
			canvasContext.restore();

			angle += Math.PI * 2 / 3;
			canvasContext.save();
			canvasContext.translate(Math.cos(angle)*0.5, Math.sin(angle) * 0.5);
			canvasContext.scale(0.5,0.5);
			_this.drawTriangle(depth-1);
			canvasContext.restore();
		}
	}
}