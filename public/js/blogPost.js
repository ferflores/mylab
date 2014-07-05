function blogPost(ref) {
	var _this = this;
	var domRef = ref;

    this.configure = function(){

      domRef.find(".canvasClass").hide();
      var html = domRef.find(".post-content-text").html();
      domRef.find(".post-content-text").empty();
      domRef.find(".post-content-text").append($("<div/>").html(html).text());

      if(domRef.attr("data-type") == "script"){

        domRef.find(".post-play-button").css("visibility","visible");

        domRef.find(".post-image").on("click",
            function(e){
              domRef.find(".post-image").unbind("click");
              domRef.find(".post-play-button").remove();
              domRef.find(".post-loader").css("visibility","visible");
              _this.loadScript();
            }
        );

      }else{
        domRef.find(".post-play-button").remove();
        domRef.find(".post-loader").remove();
      }

      _this.bindEvents();
    }

    this.bindEvents = function(){
		domRef.find(".write-comments").on("click",function(){
			domRef.find(".comment-form").css("display","inline");
		});

		domRef.find(".post-comment").on("click",function(){
			_this.postComment();
		});

		domRef.find(".view-comments").on("click",function(){
			_this.loadComments();
			domRef.find(".view-comments").unbind("click");
		});

		domRef.find(".fbshare").on("click",function(){
			FBShareOp(domRef.find(".post-title").text(), _this.cutText($.trim(domRef.find(".post-content").text())+"...", 100)
				, "http://ferflores.net"+domRef.attr("data-img-src")
				,"http://www.ferflores.net/viewPost/?postId="+domRef.attr("data-post-id"));
		});
     }

    this.loadScript = function(thisReference){
      $.getScript(domRef.attr("data-script-url"), function(){
        var postCanvasWidth = domRef.find(".post-image-in").parent().width();
        var postCanvasHeight = domRef.find(".post-image-in").height();

        domRef.find(".canvasClass").show();

        var canvasRef = domRef.find(".canvasClass")[0];

        canvasRef.width = postCanvasWidth;
        canvasRef.height = postCanvasHeight;

        domRef.find(".canvasClass").attr("data-initial-window-height",$(window).height());
        domRef.find(".canvasClass").attr("data-initial-window-width",$(window).width());
        domRef.find(".canvasClass").attr("data-window-scale-ratio",$(window).height()/$(window).width());

        domRef.find(".canvasClass").attr("data-initial-height",postCanvasHeight);
        domRef.find(".canvasClass").attr("data-initial-width",postCanvasWidth);
        domRef.find(".canvasClass").attr("data-scale-ratio",postCanvasHeight/postCanvasWidth);

        domRef.find(".post-loader").remove();
        domRef.find(".post-image-in").remove();
        var scriptClass = new window[domRef.attr("data-script-class")]();
        scriptClass.run(canvasRef, postCanvasWidth, postCanvasHeight);
        MyBlog.postElements.push(canvasRef);
      });
    }

    this.postComment = function (){
      var name = domRef.find(".txt-name").val();
      var comment = domRef.find(".txt-comment").val();

      if(name.length<1){
        domRef.find(".txt-name").css("background-color","red");
      }else if(comment.length<1){
        domRef.find(".txt-comment").css("background-color","red");
      }else{

        domRef.find(".loading-form").append("<img src='"+domRef.attr("data-loading-img")+"' style='width:2rem; margin-left:.5rem'>");
        domRef.find(".post-comment").unbind("click");

        $.ajax({
          type: "GET",
          url: domRef.attr("data-post-comment-url"),
          data: { name: name, comment: comment, postId:domRef.attr("data-post-id") }
        }).done(function(msg) {
          _this.commentPosted();
        }).fail(function( jqXHR, textStatus ) {
          console.log(textStatus);
        });
      }
    }

    this.commentPosted = function(){
      domRef.find(".comment-form").animate({
        opacity: 0,
        height: "0rem"
      }, 500, function() {
        domRef.find(".write-comments").remove();
        domRef.find(".comment-form").remove();
      });
      _this.loadComments();
      domRef.find(".view-comments").empty();
      domRef.find(".view-comments").append("<a href='javascript:void(0);'>View comments("+(parseInt(domRef.attr("data-comments-count"))+1)+")</a>");
    }

    this.loadComments = function(){
      domRef.find(".comments-options").append("<img id='loadingCommentsImg' src='"+domRef.attr("data-loading-img")+"' style='width:2rem; margin-left:.5rem'>");
      domRef.find(".comments-div").empty();
      $.ajax({
        type: "GET",
        url: domRef.attr("data-load-comments-url"),
        data: { postId: domRef.attr("data-post-id") }
      }).done(function(response) {
        $("#loadingCommentsImg").remove();
        console.log(response);
        _this.displayComments(response);
      }).fail(function( jqXHR, textStatus ) {
        console.log(textStatus);
      });
    }

    this.displayComments = function(comments){
      if(comments.length>0){
        domRef.find(".comments-div").css("display","inherit");

        for(var x=0;x<comments.length;x++){
          var html = "<div class='comment'><span class='comment-title'>"+comments[x].name+" - "+comments[x].date+":</span><br>";
          html += "<span class='comment-content'>"+comments[x].comment+"</span><br></div>";
          domRef.find(".comments-div").append(html);
        }
        domRef.find(".comments-div").animate({
          height: "toggle"
        },1);
        domRef.find(".comments-div").animate({
          height: "toggle"
        },1000);
      }
    }

    this.cutText = function(text, characters){
    	return text.substring(0,characters);
    }
}