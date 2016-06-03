var request = require('request'), 
	cheerio = require('cheerio'), 
	fs = require('fs'), 
	images = [];


	request('http://imgur.com/gallery/nHLVf', function(err, resp, body){
		if (!err && resp.statusCode === 200) {
			var $ = cheerio.load(body);

			$('img', '#inside').each(function(){
				var url = $(this).attr('src');
				images.push(url);
			});
			console.log(images)
			for (i in images) {
				request(images[i].replace('//i', 'http://i')).pipe(fs.createWriteStream('wall/'+images[i].replace('//i.imgur.com/', '')));
			}
		}
	});
