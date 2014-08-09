function Garden(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.gravity = 0.5;
	this.seeds = [];
	this.seedBounce = -0.3;
	this.floor = 0;
	this.growProcLimit = 3;
	this.seedsBeingProcessed = 0;
	this.stopped = false;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.floor = canvas[1].height - 50;
		Garden.canvas = canvas[1];
		Garden.context = canvas[1].getContext("2d");
		Garden.canvasBg = canvas[0];
		Garden.contextBg = canvas[0].getContext("2d");
		_this.cx = canvas[1].width / 2;
		_this.cy = canvas[1].height / 2;
		Garden.context.webkitImageSmoothingEnabled = true;

		require(["/js/classes/Vectors/Vector.js","/js/classes/Particles/Particle.js"], function(Vectors) {
			_this.configure();
			_this.main();
		});
	}

	this.stop = function(){
		_this.stopped = true;
		_this.seeds = null;
		Garden.plants = null;
	}

	this.reset = function(){
		Garden.plants = [];
		Garden.canvasBg = null;
		Garden.contextBg = null;
		Garden.maxBranchDepth = 3;
		Garden.initialLineWIdth = 2;
		Garden.currentImageData = null;
		Garden.posNeg = [-1,1];
	}

	this.resize = function(){
		_this.floor = Garden.canvas.height - 50;
		_this.cx = Garden.canvas.width / 2;
		_this.cy = Garden.canvas.height / 2;
		_this.drawFLoor();
		Garden.plants = [];
	}

	this.configure = function(){
		_this.erase();
		_this.drawFLoor();
		_this.createSeed();
		_this.bindEvents();
	}

	this.bindEvents = function(){
		Garden.canvas.onselectstart = function () { return false; }
		Garden.canvas.addEventListener("click", function(e){
			e.preventDefault();
			var mouseX = (e.pageX  - Garden.canvas.offsetParent.offsetLeft);
			var mouseY = (e.pageY  - Garden.canvas.offsetParent.offsetTop);
			_this.createSeed(mouseX, mouseY);
		});
	}

	this.createSeed = function(x,y){
		var seed = new Seed();
		var randomX = x || Math.random()*(Garden.canvas.width - (Garden.canvas.width / 3)) + (Garden.canvas.width / 3);
		var randomY = y || Math.random()*(Garden.canvas.height-200) + 100;
		var seedSpeed = 3;
		var seedRadious = 2;
		var randomDirection = Math.random() * Math.PI * 2;
		var randomFLoor = Math.random() * 40 + (_this.floor+5);
		seed.create(randomX, randomY, randomFLoor, seedSpeed, randomDirection, _this.gravity, seedRadious);
		_this.seeds.push(seed);
	}

	this.drawSeeds = function(){
		for(var x = 0; x < _this.seeds.length ; x++){
			if(!_this.seeds[x].stopped){
				_this.seeds[x].particle.update();
				_this.wrapSeed(_this.seeds[x]);
			}else{
				if(!_this.seeds[x].readyToGrow && _this.seedsBeingProcessed < _this.growProcLimit){
					_this.seedsBeingProcessed++;
					_this.seeds[x].readyToGrow = true;
				}

				if(_this.seeds[x].readyToGrow){
					_this.seeds[x].alpha -= 0.09;
					_this.seeds[x].color = "rgba(0,0,0,"+_this.seeds[x].alpha+")";
					if(_this.seeds[x].alpha <= 0){
						var plant = new Plant();
						var plantX = _this.seeds[x].particle.position.getX();
						var plantY = _this.seeds[x].particle.position.getY();
						var scaleFactor = Math.random() * Garden.canvas.height/1.3 + 100;
						var plantIndex = Garden.plants.length;
						plant.create(plantX, plantY, scaleFactor, Garden.initialLineWIdth, 270, 0,plantIndex);
						Garden.plants.push(plant);

						_this.seedsBeingProcessed--;
						_this.seeds.splice(x,1);
						continue;
					}
				}
			}
			_this.seeds[x].draw(Garden.context);
		}
	}

	this.drawPLants = function(){
		for(var x=0;x< Garden.plants.length;x++){
			var plant = Garden.plants[x];

			//if(!plant.finished){
				plant.draw(Garden.context, Garden.contextBg);
			//}
			
		}
		Garden.context.stroke();
	}

	this.wrapSeed = function(seed){
		if(seed.particle.position.getY() + seed.radious > seed.floor){
			if(seed.particle.velocity.getY() < 0.5){
				seed.stopped = true;
				return;
			}

			seed.particle.position.setY(seed.floor - seed.radious);
			seed.particle.velocity.setY(seed.particle.velocity.getY() * _this.seedBounce);
			seed.particle.velocity.setX(seed.particle.velocity.getX() * 0.3);

		} else if(seed.particle.position.getX() + seed.radious > Garden.canvas.width){
			seed.particle.position.setX(Garden.canvas.width - seed.radious);
			seed.particle.velocity.setX(seed.particle.velocity.getX() * -1);
		}else if(seed.particle.position.getX() - seed.radious < 0){
			seed.particle.position.setX(0 + seed.radious);
			seed.particle.velocity.setX(seed.particle.velocity.getX() * -1);
		}
	}

	this.drawFLoor = function(){
		Garden.contextBg.fillStyle = "#002200";
		Garden.contextBg.fillRect(0, Garden.canvas.height-50, Garden.canvas.width, 50 );
	}
	
	this.erase = function(){
		Garden.canvas.width = Garden.canvas.width;
		/*Garden.context.fillStyle = "#000000";
		Garden.context.fillRect(0, 0, Garden.canvas.width, Garden.canvas.height);*/
	}

	this.main = function(){
		_this.erase();
		_this.drawSeeds();
		_this.drawPLants();
		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}
}

Garden.plants = [];
Garden.context = null;
Garden.canvas = null;
Garden.canvasBg = null;
Garden.contextBg = null;
Garden.maxBranchDepth = 3;
Garden.initialLineWIdth = 2;
Garden.currentImageData = null;
Garden.posNeg = [-1,1];

function Seed(){
	this.particle = null;
	this.radious = 0;
	this.stopped = false;
	this.floor = 0;
	this.readyToGrow = false;
	this.alpha = 1;
	this.color = "rgba(80,135,67,1)";

	this.create = function(x, y, floor, speed, direction, gravity, radious){
		this.particle = Particle.create(x,y,speed, direction, gravity);
		this.radious = radious;
		this.floor = floor;
	}

	this.draw = function(context){
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.particle.position.getX(), 
			this.particle.position.getY(),this.radious,0,Math.PI*2,false);
		context.fill();
	}
}

function Plant(){
	this.x = 0;
	this.y = 0;
	this.height = 0;
	this.direction = 270;
	this.branches = [];
	this.color = "#1D5E2A";
	this.depth = 0;
	this.growingLength = 0;
	this.currentY = 0;
	this.width = 0;
	this.finished = false;
	this.plantIndex = 0;

	this.create = function(x,y, scaleFactor, width, direction, depth, plantIndex){
		this.x = x;
		this.y = y;
		this.depth = depth;
		this.width = width;
		this.plantIndex = plantIndex;

		this.height = Math.random()*scaleFactor + 20;
		this.direction = direction || 270;

		if(depth < Garden.maxBranchDepth){
			var numberOfBranches = Math.random()*4+1;
			for(var x=0;x< numberOfBranches; x++){
				var plant = new Plant();
				var branchHeight = Math.random() *this.height + 10;
				var dir = this.direction + (Math.random() * 45 * Garden.posNeg[Math.round(Math.random()*1)]);
				var randomRatio = Math.random() * this.height;
				var branchX = Math.cos(this.direction * Math.PI / 180) * (randomRatio) + this.x;
				var branchY = Math.sin(this.direction * Math.PI / 180) * (randomRatio) + this.y;
				plant.create(branchX, branchY, scaleFactor / 3, this.width -1 < 1 ? 1 : this.width - 1 ,dir, this.depth+1, plantIndex);
				this.branches.push(plant);
			}
		}
	}

	this.draw = function(context, contextBg){

		context.strokeStyle = this.color;
		/*context.shadowColor = '#FFFF00';
      	context.shadowBlur = 5;
      	context.shadowOffsetX = 0;
      	context.shadowOffsetY = 0;*/


		var yPoint = this.currentY = Math.sin(this.direction * Math.PI / 180) * this.growingLength + this.y;
		var xPoint = Math.cos(this.direction * Math.PI / 180) * this.growingLength + this.x;

		context.moveTo(this.x, this.y);
		context.lineTo(xPoint, yPoint);

		for(var y = 0; y< this.branches.length;y++){
			if(this.currentY<this.branches[y].y){
				this.branches[y].draw(context, contextBg);
			}
		}

		if(this.growingLength < this.height){
			this.growingLength+=2;
		}else{ 
			if(this.depth == Garden.maxBranchDepth){
				//this.root.finished = true;
				Garden.plants[this.plantIndex].finished = true;
				//Garden.currentImageData = Garden.context.getImageData(0,0,)
			}
		}
	}
}
