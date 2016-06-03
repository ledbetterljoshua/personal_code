module.exports = function(Review, router) {
	router.route('/posts')

	    // create a post (accessed at POST http://localhost:8080/api/posts)
	    .post(function(req, res, next) {
	        var post            = new Review();      // create a new instance of the post model
	        post.url            = req.body.url;
	        post.steps			= req.body.steps;
	        post.items			= req.body.items;
	        post.highlighted    = req.body.highlighted;
	        post.comment        = req.body.comment;  // set the posts name (comes from the request)
	        post.image          = req.body.image;
	        post.title          = req.body.title;
	        post.description    = req.body.description;
	        post.timeStamp      = req.body.timeStamp;
	        post.group          = req.body.group;
	        post.favorite       = req.body.favorite;
	        post.readlater      = req.body.readlater;
	        post.private        = req.body.private;
	        // save the post and check for errors

	        post.save(function(err) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'post created!' });
	        });
	        
	    })
	    /* ================================== 
			GET FROM THE database
	==================================*/
	    .get(function(req, res, next) {
	        
	        //var current_user = req.user.facebook.id || req.Authorization;

	        Review.find().exec(function(err, posts) {
	          if (err) throw err;

	          // show the admins in the past month
	          console.log(posts);
	           res.json(posts);
	        });

	    });
	    /* ==================================
			GET A SINGLE ITEM
	==================================*/

		router.route('/posts/:post_id')

	    // get the post with that id (accessed at GET http://localhost:8080/api/posts/:post_id)
	    .get(function(req, res, next) {
	        Review.findById(req.params.post_id, function(err, post) {
	            if (err)
	                res.send(err);
	            res.json(post);
	        });
	    })
	    

	    // update the post with this id (accessed at PUT http://localhost:8080/api/posts/:post_id)
	    .put(function(req, res, next) {

	        // use our post model to find the post we want
	        Review.findById(req.params.post_id, function(err, post) {

	            if (err)
	                res.send(err);

	            post.comment = req.body.comment;  // update the posts info
	            post.image = req.body.image;
	            post.title = req.body.title;
		        post.description = req.body.description;
		        post.timeStamp = req.body.timeStamp;
	    	    post.group = req.body.group;
	            post.favorite       = req.body.favorite;
	            post.readlater      = req.body.readlater;
	            post.private        = req.body.private;
	            // save the post
	            post.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'post updated!' });
	            });

	        });
	    })

	    // delete the post with this id (accessed at DELETE http://localhost:8080/api/posts/:post_id)
	    .delete(function(req, res, next) {
	        Review.remove({
	            _id: req.params.post_id
	        }, function(err, post) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    });

      router.route('/posts/text/:query')
      .get(function(Review) {
	    return function(req, res) {
	      Review.find(
	          { $text : { $search : req.params.query } },
	          { score : { $meta: 'textScore' } }).
	        sort({ score: { $meta : 'textScore' } }).
	        limit(10).
	        exec(handleMany.bind(null, 'reviews', res));
	    };
	  });

		function handleMany(property, res, error, result) {
		  if (error) {
		    return res.
		      status(status.INTERNAL_SERVER_ERROR).
		      json({ error: error.toString() });
		  }

		  var json = {};
		  json[property] = result;
		  res.json(json);
		}
}