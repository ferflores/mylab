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
		$result->lastPost = $pageNumber + 1 * 3 >= Post::count();
		
		return json_encode($result);
	}

}
