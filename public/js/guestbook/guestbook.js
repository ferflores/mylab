function GuestBook(){
	_this = null;
	var mousePressed = false;
	var color = "";
	var eraserActive = false;
	var drawDivHeightRatio = 0.472440944881889;

	this.init = function(draw){
		_this = this;
		_this.resize();
		_this.config();
		_this.bindWindowEvents();
		if(draw){
			_this.bindEvents();
		}
	}
    
    this.config = function(){
    	$(function(){
    	$("#color").colpick({
			colorScheme:'dark',
			layout:'rgbhex',
			color:'ff8800',
			submit:1,
			onChange:function(hsb,hex,rgb,el) {
				$(el).css('background-color', '#'+hex);
				color = _this.rgb2hex($(el).css('background-color'));
				_this.setEraserEnabled(false);
			},
			onSubmit:function(hsb,hex,rgb,el) {
				$(el).css('background-color', '#'+hex);
				color = _this.rgb2hex($(el).css('background-color'));
				$(el).colpickHide();
				_this.setEraserEnabled(false);
			}
		})
		.css('background-color', '#ff8800');
		});

    	color = '#ff8800';

    }

    this.bindEvents = function(){
    
		$("#signs").on("mousedown", function(){
		  mousePressed = true;
		});
		$("#signs").on("mouseup", function(){
		  mousePressed = false;
		});
		$("#signs").on("mouseleave", function(){
		  mousePressed = false;
		});

		$(".drawable").on("click", function(){
		  _this.draw(this);
		});

		$(".drawable").on("mousemove",function(event){
			event.preventDefault(); 

		  if(mousePressed){
		  	_this.draw(this);
		  }
		});

		$(".drawable").on("touchmove",function(event){
			event.preventDefault(); 

		  	_this.draw(this);
		});

		$("#eraser").parent().on("click", function(){
    		_this.setEraserEnabled(!eraserActive);
    	});

    	$("#showSendForm").on("click", function(){
    		$("#saveSignTable").animate({
              height: "toggle"
            },1000);

           	$(this).fadeOut();
    	});

    	$("#postSign").on("click", function(){
    		var name = $("#txtName").val();
    		var comment = $("#txtComment").val();
    		if(name.length < 1){
    			$("#txtName").css("background-color","red");
    		}else{
    			$(".loader").css("display","inline");
    			$(this).unbind("click");
    			_this.saveSign(name, comment);
    		}
    	})
    }

    this.draw = function(elm){
    	if(!eraserActive){
		  $(elm).css("background-color",color);
		  var currentOpacity = $(elm).css("opacity");
		  var newOpacity = parseFloat(currentOpacity);
		  newOpacity+=.06;
		  $(elm).css("opacity",newOpacity);
		}else{
		  var currentOpacity = $(elm).css("opacity");
		  var newOpacity = parseFloat(currentOpacity);
		  newOpacity-=.06;
		  $(elm).css("opacity",newOpacity);
		}
    }

   	this.bindWindowEvents = function(){
		window.onresize = function(event) {
  			_this.resize();
		};
	}

	this.resize = function(){
		$("#signs").height($("#signs").width() * drawDivHeightRatio);
		$(".signPreview").height($($(".signPreview")[0]).width() * 0.666666667);
	}

	this.rgb2hex = function (rgb) {
	    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	    function hex(x) {
	        return ("0" + parseInt(x).toString(16)).slice(-2);
	    }
	    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}

	this.setEraserEnabled = function(enabled){
		if(enabled){
			eraserActive = true;
    		$("#eraser").parent().css("background-color","grey");
		}else{
			eraserActive = false;
			$("#eraser").parent().css("background-color","black");
    		$(this).css("background-color","black");
		}
	}

	this.saveSign = function(name, comment){
		var data = {name:name, comment:comment, data:_this.getDrawData()}
		$.ajax({
            type: "POST",
            url: "/postSign/",
            data: {signData:JSON.stringify(data)},
            contentType: 'application/json; charset=utf-8'
          }).done(function(response) {
            $("#loadingCommentsImg").remove();
            $(".loader").css("display","none");
            localStorage['signed'] = true;
            window.location.assign("/guestbookread");
          }).fail(function( jqXHR, textStatus ) {
            console.log(textStatus);
          });
	}

	this.getDrawData = function(){
		var squares = $(".drawable");
		var data = [];
		$.each(squares, function(i, e){
			if(parseFloat($(e).css("opacity")) > 0.0){
				data.push({index:i, opacity:$(e).css("opacity"), color:_this.rgb2hex($(e).css("background-color"))})
			}
		});

		return data;
	}

	this.drawAllSigns = function(signs, container){
		var html = "";
		for(var y=0;y<signs.length;y++){
			var tooltip = "name: "+signs[y].name.replace(/\+/g," ")+"<br> comment: "+signs[y].comment.replace(/\+/g," ");
			html += "<div class='signPreview' data-scale-ratio='0.666666667' title='"+tooltip+"'>";
			for(var x = 0; x<200; x++){
				var boxSearch = jQuery.grep(signs[y].data, function( n, i ) { return ( n.index == x );})
				if(boxSearch.length > 0){
					html+= "<div class='drawable' style='background-color:"+boxSearch[0].color
					+";opacity:"+ boxSearch[0].opacity +"'></div>";
				}else{
					html+= "<div class='drawable'></div>"
				}
			}
			html +="</div>"
		}

		$("#"+container).append(html);
		$(".signPreview").tooltip({
			track:true,
			content: function () {
              return $(this).prop('title');
          }
		});

	}
}