<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PostsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		if (!Schema::hasTable('posts'))
		{
			Schema::create('posts', function($table)
			{
	    		$table->increments('id');
	    		$table->string("img",200);
	    		$table->string("title",100);
	    		$table->text("content");
	    		$table->date("date",50);
	    		$table->string("type",20);
	    		$table->string("scriptUrl",200);
	    		$table->string("scriptClass",20);
			});


		}
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		if (Schema::hasTable('posts'))
		{
			Schema::drop("posts");
		}
	}

}
