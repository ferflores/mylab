function MyBlog(){

	var _this = null;

	this.init = function(){
		if(_this == null){
			_this = this;
		}

		_this.config();
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
	}
	
	this.bindWindowEvents = function(){
		/*if(window.onresize == null){
			window.onresize = function(event) {
	  			_this.resize();
			};
		}*/
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
}

MyBlog.postElements = [];

function Common(){}