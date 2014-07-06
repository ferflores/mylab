function MyBlog(){

	var _this = null;

	this.init = function(){
		if(_this == null){
			_this = this;
		}

		_this.config();
		_this.loadPosts();
	}

	this.config = function(){
		/**
		 * Provides requestAnimationFrame in a cross browser way.
		 * @author paulirish / http://paulirish.com/
		 */
		 
		if ( !window.requestAnimationFrame ) {
		 
			window.requestAnimationFrame = ( function() {
		 
				return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
		 
					window.setTimeout( callback, 1000 / 60 );
		 
				};
		 
			} )();
 
		}

		_this.bindEvents();
	}

	this.bindWindowEvents = function(){
		/*if(window.onresize == null){
			window.onresize = function(event) {
	  			_this.resize();
			};
		}*/
	}

	this.bindEvents = function(){
		$("#upArrow").on("mouseover",function(){
			$(this).animate({ width: "50"}, "fast");
		});
		$("#downArrow").on("mouseover",function(){
			$(this).animate({ width: "50"}, "fast");
		});
		$("#upArrow").on("mouseout",function(){
			$(this).animate({ width: "30"}, "fast");
		});
		$("#downArrow").on("mouseout",function(){
			$(this).animate({ width: "30"}, "fast");
		});
	}

	this.resize = function(){

		var canvasElements = MyBlog.postElements;
		$.each(canvasElements, function(i, e){
			/*var height = $(window).width() * $(e).attr("data-window-scale-ratio");
			$(e).height(height);

			var width = $(e).height() / $(e).attr("data-scale-ratio");
			$(e).width(width-300);*/
			$(e).width($(e).parent().width());
			$(e).height($(e).width() * $(e).attr("data-scale-ratio"));

		});

	}

	this.loadPosts = function(){
		var pageNumberVal = getParameterByName("p");

		var pageNumber = pageNumberVal.length > 0 ? pageNumberVal : "0";
		pageNumber = isNumber(pageNumber) ? parseInt(pageNumber) : 0;

		var requestData = {
			pageNumber:pageNumber
		}

		var ajaxConfig = {
			URL:"/getPosts",
			data: requestData,
			async:true,
			callBack: _this.buildPosts
		}

		new AjaxRequest().request(ajaxConfig);

	}

	this.buildPosts = function(data){
		var posts = JSON.parse(data);
	}
}

MyBlog.postElements = [];

function Common(){}