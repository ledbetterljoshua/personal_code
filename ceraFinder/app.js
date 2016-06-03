
$(function(){
	var account = $('a.post-account').text();

	var theCeraShoppers = ["AnotherBadlyPhotoshoppedPhotoofMichaelCeraEveryday", "ANewBadlyPhotoshoppedPhotoofMichaelCeraEveryday"]

	function ceraShoppers() {
	    if($.inArray(account, theCeraShoppers) != -1) {
	        $('.post-header').append('<p style="position: relative;top: 0;left: 0;z-index: 999;color: #fff;text-align: center;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.7);font-weight: 800;vertical-align: middle;" class="ceraChecker">Check the username dude! It\'s Cera!!<p>');
	    }
	    if ($.inArray(account, theCeraShoppers) === -1) {
	        $('.ceraChecker').remove()
	    }
	}; ceraShoppers();

	setInterval(function(){
	    if (account != $('a.post-account').text()) {
	        //page has changed and you are looking at a new persons post
	        account = $('a.post-account').text();
	        ceraShoppers();
	    }
	}, 100);
}());



