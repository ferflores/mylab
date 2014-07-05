<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<title>Fernando Flores V Lab</title>
		<link rel="stylesheet" href="{{ asset ("/css/newLab.css") }}" />
		<script src="{{ asset("/js/vendor/jquery1.11.js") }}"></script>
		<script src="{{ asset("/js/exp/fractalTree.js") }}"></script>
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
		<div id="main">
		</div>

		<div id="leftBarBg">
			
		</div>
		<div id="leftBar">
			<h2 class="page-title">Fernando Flores V</h2>
		</div>
		<div id="canvasArea">
			<canvas id="canvasTestBG"></canvas>
			<canvas id="canvasTest"></canvas>
		</div>
		<script>
	      $(document).ready(function(){
	      	var canvas = document.getElementById("canvasTest");
	      	canvas.width = $(canvas.parentNode).width();
	      	canvas.height = $(canvas.parentNode).height();
	      	var canvas2 = document.getElementById("canvasTestBG");
	      	canvas2.width = $(canvas2.parentNode).width();
	      	canvas2.height = $(canvas2.parentNode).height();
	      	new FractalTree().run([canvas2, canvas]);
	      });
	    </script>
	</body>
</html>