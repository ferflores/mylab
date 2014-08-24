function MyBlog(){

	var _this = null;
	this.firstLoaded = false;

	this.init = function(){
		if(_this == null){
			_this = this;
		}

		_this.getPageNumber();
		_this.loadPosts();
		_this.bindMainEvents();
		_this.bindWindowEvents();
	}

	this.bindWindowEvents = function(){
		if(window.onresize == null){
			window.onresize = function(event) {
	  			_this.resize();
			};
		}
	}

	this.bindMainEvents = function(){
		$("#upArrow").on("mouseover",function(){
			$(this).animate({ width: "40"}, "fast");
		});
		$("#downArrow").on("mouseover",function(){
			$(this).animate({ width: "40"}, "fast");
		});
		$("#upArrow").on("mouseout",function(){
			$(this).animate({ width: "30"}, "fast");
		});
		$("#downArrow").on("mouseout",function(){
			$(this).animate({ width: "30"}, "fast");
		});

		$("#downArrow").on("click", function(){
			_this.getNextPage();
		});
		$("#upArrow").on("click", function(){
			_this.getPrevPage();
		});
	}

	this.bindPostsEvents = function(){

		$(".post-title").on("mouseover", function(){
			_this.hoverPost(this);
		});

		$(".preview-img").on("mouseover", function(){
			_this.hoverPost(this);
		});

		$(".post-title").on("mouseout", function(){
			_this.mouseOutPost(this);
		});

		$(".preview-img").on("mouseout", function(){
			_this.mouseOutPost(this);
		});

		$(".post-title").on("click", function(){
			_this.showPost($(this).closest(".post").attr("data-id"));
		});

		$(".preview-img").on("click", function(){
			_this.showPost($(this).closest(".post").attr("data-id"));
		});
	}

	this.bindSinglePostEvents = function(){
		$(".fbshare").on("click",function(){
			FBShareOp(MyBlog.currentPost.title, MyBlog.currentPost.content
				, "http://ferflores.net"+ MyBlog.currentPost.img
				,"http://www.ferflores.net/?exp="+MyBlog.currentPost.id);
		});

		$("#canvasTitleText").removeClass("zoomIn");
		$("#canvasTitleText").addClass("zoomOut");
		setTimeout(function(){
			$("#canvasTitleText").html(MyBlog.currentPost.content);

			$("#canvasTitleText").removeClass("zoomOut");
			$("#canvasTitleText").addClass("zoomIn");
		}, 1000);
	}

	this.resize = function(){

		$.each($(".canvasElement"), function(i, e){
			e.width = $(e).parent().width();
			e.height = $(e).parent().height();

		});

		MyBlog.currentObject.resize();
	}

	this.loadPosts = function(localPage){
		var pageNumber = MyBlog.pageNumber;

		$("#postsGrid").empty();

		var requestData = {
			p: pageNumber
		}

		if(!pageNumber){
			$("#upArrowDiv").hide();
		}

		if(localPage == null){
			var ajaxConfig = {
				URL:"/getPosts",
				data: requestData,
				async:true,
				callBack: _this.buildPosts,
				requestCallBack: _this.requestPostsCallBack
			}

			new AjaxRequest().request(ajaxConfig);
		}else{
			_this.buildPostsLocal(localPage);
		}
	}

	this.loadPostById = function(postId){
		var requestData = {
			exp: postId
		}

		var ajaxConfig = {
			URL:"/getPost",
			data: requestData,
			async:true,
			callBack: _this.buildPost,
			requestCallBack: null//_this.requestPostCallBack
		}
			new AjaxRequest().request(ajaxConfig);
	}

	this.buildPost = function(postData){
		var parsedPost = JSON.parse(postData);

		var post = {
				id: parsedPost.id,
				scriptUrl: parsedPost.scriptUrl,
				scriptClass: parsedPost.scriptClass,
				title: parsedPost.title,
				content: parsedPost.content,
				img: parsedPost.img
			}

		MyBlog.postElements.push(post);
		_this.showPost(parsedPost.id);
	}

	this.buildPosts = function(data){
		$("#postsGrid").empty();
		var parsedData = JSON.parse(data);

		var pageData = {
			pageNumber:MyBlog.pageNumber,
			noBack:parsedData.noBack,
			lastPost:parsedData.lastPost,
			posts:parsedData.posts
		}

		MyBlog.postPages.push(pageData);

		parsedData.noBack ? $("#upArrowDiv").hide() : $("#upArrowDiv").show();
		parsedData.lastPost ? $("#downArrowDiv").hide() : $("#downArrowDiv").show();

		_this.buildPostsHtml(parsedData.posts);

		if(!_this.firstLoaded){
			var exp = getParameterByName("exp");
			if(exp != null && isNumber(exp) && exp > 0){
				_this.loadPostById(exp);
			}else{
				_this.firstLoaded = true;
				_this.showPost(MyBlog.postElements[0].id);
			}
		}
	}

	this.buildPostsLocal = function(data){
		$("#postsGrid").empty();
		data.noBack ? $("#upArrowDiv").hide() : $("#upArrowDiv").show();
		data.lastPost ? $("#downArrowDiv").hide() : $("#downArrowDiv").show();
		_this.buildPostsHtml(data.posts);
	}

	this.buildPostsHtml = function(data){
		$.each(data, function(i,e){
			var html = "<div class='post' style='display:none' data-id='"+e.id+"'";
			html+=" data-script-url='"+e.scriptUrl+"' data-script-class='"+e.scriptClass+"'>";
			html += "<div class='post-title'> "+ e.title +"</div>";
			html += "<div>";
			html += "<img class='preview-img' src='"+ e.img +"'>";
			html += "</div>";
			html += "</div>";

			$("#postsGrid").append(html);

			if(!_this.postIsLoaded(e.id)){
				var post = {
					id: e.id,
					scriptUrl: e.scriptUrl,
					scriptClass: e.scriptClass,
					title: e.title,
					content: e.content,
					img: e.img
				}

				MyBlog.postElements.push(post);
			}

		});

		$.each($(".post"), function(i,e){
			$(e).fadeIn("slow");
		})


		_this.bindPostsEvents();
	}

	this.postIsLoaded = function(postId){
		var found = false;
		$.each(MyBlog.postElements, function(i,e){
			if(e.id == postId){
				found = true;
				return false;
			}
		});

		return found;
	}

	this.hoverPost = function(elm){
		var parent = $(elm).closest(".post");

		$(parent).css("backgroundColor","rgba(0,0,0,0.5");
	}

	this.mouseOutPost = function(elm){
		var parent = $(elm).closest(".post");

		$(parent).css("backgroundColor","rgba(0,0,0,0");
	}

	this.getPageNumber = function(){
		var pageNumberVal = getParameterByName("p");

		var pageNumber = pageNumberVal.length > 0 ? pageNumberVal : "1";
		pageNumber = isNumber(pageNumber) ? parseInt(pageNumber) : 1;

		pageNumber = pageNumber < 1 ? 1 : pageNumber;

		MyBlog.pageNumber = pageNumber;
	}

	this.getNextPage = function(){
		MyBlog.pageNumber++;
		$("#postsGrid").empty();
		var localPage = _this.getLocalPage(MyBlog.pageNumber);
		_this.loadPosts(localPage);
	}

	this.getLocalPage = function(page){
		var data = null;
		$.each(MyBlog.postPages, function(i,e){
			if(e.pageNumber == page){
				data = e;
				return false;
			}
		});

		return data;
	}

	this.getPrevPage = function(){
		if(MyBlog.pageNumber>0){
			MyBlog.pageNumber--;
			var localPage = _this.getLocalPage(MyBlog.pageNumber);
			_this.loadPosts(localPage);
		}
	}

	this.requestPostsCallBack = function(){
		$("#postsGrid").append("<div id='postsLoading'>"+
			"<img id='postsLoadingImg' src='/img/loader.gif'></div>");
	}

	this.runScript = function(post){
		var canvases = [];
        var canvasRef = $(".canvasMain");
        var canvasBg = $(".canvasBg");

        var prevWidth = canvasRef.width;
        var prevHeight = canvasRef.height;

        $(".canvasMain").remove();
        $(".canvasBg").remove();

        $("#canvasArea").append("<canvas id='canvasBg' class='canvasBg canvasElement'>"+
        	"</canvas> <canvas id='canvasMain' class='canvasMain canvasElement'></canvas>");

        canvasRef = $(".canvasMain")[0];
        canvasBg = $(".canvasBg")[0];

        canvasRef.width = $("#canvasArea").width();
        canvasRef.height = $("#canvasArea").height();
        canvasBg.width = $("#canvasArea").width();
        canvasBg.height = $("#canvasArea").height();

        canvases.push(canvasBg);
        canvases.push(canvasMain);

        var scriptClass = new window[post.scriptClass]();
        MyBlog.currentObject = scriptClass;
        scriptClass.run(canvases);
	}

	this.showPost = function(postId){
		_this.bindSinglePostEvents();

		$("#directLink").attr("href","http://www.ferflores.net/?exp="+postId);

		var post = null;
		if(MyBlog.currentObject != null){
			MyBlog.currentObject.stop();
			MyBlog.currentObject.reset();
			delete MyBlog.currentObject;
			MyBlog.currentObject = null;
		}
		$.each(MyBlog.postElements, function(i,e){
			if(e.id == postId){
				post = e;
				MyBlog.currentPost = e;
				return false;
			}
		});

		if(post != null){
			if(typeof window[post.scriptClass] != "undefined"){
				_this.runScript(post);
			}else{
				$.getScript(post.scriptUrl, function( data, textStatus, jqxhr ) {
					_this.runScript(post);
			}).fail(function( jqxhr, settings, exception ) {
   				console.log( "Triggered ajaxError handler." );
				});
			}
		}
	}
}

MyBlog.postElements = [];
MyBlog.postPages = [];
MyBlog.pageNumber = 1;
MyBlog.currentObject = null;
MyBlog.currentPost = null;

function Common(){}