<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<title>Fernando Flores V Lab</title>
		<link rel="stylesheet" href="{{ asset ("/css/newLab.minified.css") }}" />
		<link rel="stylesheet" href="{{ asset ("/css/animate.css") }}" />
		<script src="{{ asset("/js/vendor/jquery1.11.js") }}"></script>
		<script src="{{ asset("/js/common.js") }}"></script>
		<script src="{{ asset("/js/myblog.js") }}"></script>
		<script src="{{ asset("/js/vendor/require.js") }}"></script>
	</head>
	<body>
		
		  <div id="fb-root"></div>
		  <script type="application/javascript">
			  window.fbAsyncInit = function() {
			    FB.init({
			      appId      : '659077450833080',                            
			      status     : true,                                 
			      xfbml      : true                                  
			    });

			  };

			  (function(d, s, id){
			     var js, fjs = d.getElementsByTagName(s)[0];
			     if (d.getElementById(id)) {return;}
			     js = d.createElement(s); js.id = id;
			     js.src = "//connect.facebook.net/en_US/all.js";
			     fjs.parentNode.insertBefore(js, fjs);
			   }(document, 'script', 'facebook-jssdk'));

			function FBShareOp(titlep, descriptionp, imagep, share_urlp){
			  var product_name = titlep;
			  var description = descriptionp;
			  var share_image = imagep;
			  var share_url = share_urlp; 
			  var share_capt = "Fernando Flores V Lab";
			    FB.ui({
			        method: 'feed',
			        name: product_name,
			        link: share_url,
			        picture: share_image,
			        caption: share_capt,
			        description: description

			    }, function(response) {
			        if(response && response.post_id){}
			        else{}
			    });

			}

		</script>
		<!--*********************************************************************-->
		<div id="main" class="roundedDiv">
		</div>

		<div id="leftBarBg">
			
		</div>
		<div id="leftBar" class="roundedDiv">
			<h2 class="page-title">Fernando Flores V</h2>
			<div id="posts">
				<div id="upArrowDiv">
					<img id="upArrow" class="arrow" src="/img/icons/uparrow.png">
				</div>
				<div id="postsGrid">
					
				</div>
				<div id="downArrowDiv">
					<img id="downArrow" class="arrow" src="/img/icons/downarrow.png">
				</div>
				<div>
					<span class="chromeText">This site is optimized for Chrome</span>
				</div>
			</div>
		</div>
		<div id="canvasArea" class="roundedDiv">
			<div id="canvasTitle" class="roundedDiv">
				<table>
					<tr>
						<td style="width:80%">
							<span id="canvasTitleText" class="animated zoomIn">
								
							</span>
						</td>
						<td style="width:10%">
							<a id="directLink" href="#">
								Direct link
							</a>
						</td>
						<td style="width:10%">
							
							<img class="fbshare" src="/img/fbshare.png"/>
						</td>
					</tr>
				</table>
			<canvas id="canvasBg" class="canvasBg canvasElement"></canvas>
			<canvas id="canvasMain" class="canvasMain canvasElement"></canvas>
		</div>
		<script>
	      $(document).ready(function(){

	      	new MyBlog().init();

	      });
	    </script>
	</body>
</html>