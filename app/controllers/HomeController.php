<?php

class HomeController extends BaseController {

	function getPosts(){
		$pageNumber = Input::get("p","0");

		if(is_numeric($pageNumber)){
			if(intval($pageNumber)>0){
				$pageNumber = intval($pageNumber -1);
			}else{
				$pageNumber = 0;
			}
		}else{
			$pageNumber = 0;
		}

		$filteredPosts = Post::orderBy('id','desc')->skip($pageNumber * 3)->take(3)->get();

		$result = new stdClass();
		$result->posts = $filteredPosts;
		$result->noBack = $pageNumber == 0;
		$result->lastPost = ($pageNumber + 1) * 3 >= Post::count()-1;
		
		return json_encode($result);
	}

	function getPost(){
		$postId = Input::get("exp","1");

		if(is_numeric($postId)){
			if(intval($postId)>0){
				$postId = intval($postId);
			}else{
				$postId = 1;
			}
		}else{
			$postId = 1;
		}

		$post = Post::find($postId);

		if($post == null){
			$post = Post::first();
		}
		
		return json_encode($post);
	}

}
