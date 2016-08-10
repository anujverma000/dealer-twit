var sentimentBar;
$( document ).ready(function() {
	scaleVideoContainer();
	initBannerVideoSize('.video-container .poster img');
	initBannerVideoSize('.video-container .filter');
	initBannerVideoSize('.video-container video');
	if(initMap){
		initMap();
	}
	$(window).on('resize', function() {
		scaleVideoContainer();
		scaleBannerVideoSize('.video-container .poster img');
		scaleBannerVideoSize('.video-container .filter');
		scaleBannerVideoSize('.video-container video');
	});

	sentimentBar = $(".sentiment-bar").sentimentBar({
	    width : '100px',
	    progressColor: '#19436b',
	    backgrounColor: '#ccc'
	 });

});

function scaleVideoContainer() {
	var height = $(window).height() + 5;
	var unitHeight = parseInt(height) + 'px';
	$('.homepage-hero-module').css('height',unitHeight);
}

function initBannerVideoSize(element){
	$(element).each(function(){
		$(this).data('height', $(this).height());
		$(this).data('width', $(this).width());
	});
	scaleBannerVideoSize(element);
}

function scaleBannerVideoSize(element){
	var windowWidth = $(window).width(),
	windowHeight = $(window).height() + 5,
	videoWidth,
	videoHeight;
	$(element).each(function(){
		var videoAspectRatio = $(this).data('height')/$(this).data('width');
		$(this).width(windowWidth);

		if(windowWidth < 1000){
			videoHeight = windowHeight;
			videoWidth = videoHeight / videoAspectRatio;
			$(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});

			$(this).width(videoWidth).height(videoHeight);
		}
		$('.homepage-hero-module .video-container video').addClass('fadeIn animated');
	});
}

function saveSetup(){
	if($("#searchTerm").val() && $("#searchTerm").val() != ""){
		$(".new-items").fadeIn()
		$.post('/saveSetup',
					{ "value": $("#searchTerm").val() },
					function(data){
					$("#searchterms").append('<span class="term" id="'+data.id+'">' + data.value +'<a href="#" class="closeBtn" id="'+data.id+ '" onclick="deleteSetup(this.id)"></a></span>')
					$(".textfield").val('')
				})
	  }
}

function deleteSetup(id){
	$.ajax({'url':'/deleteSetup',
					'type' : 'delete',
					'data' : 'id=' + id,
					success : function(data){
					    console.log( data );
							$('#'+id).remove();
							console.log('Setup deleted successfully.');
					},
					error: function(jqXHR, data){
					    console.log('Failed to delete setup.');
				}
  });
}

var tweets = [];
var totalTweets = 0, max_id="";
function getTweets(){
	$.post('/search', {max_id: max_id}, function(data){
		if(data && data != ''){
			max_id = JSON.parse(data.data).search_metadata.max_id
			data = data.statuses
			data.forEach(function(status){
				tweets.push(getTweetEl(status))
				totalTweets = tweets.length;
			})
		}
	})
}

function getTweetEl(status){
	var sentiment = "";
	var fillKey = "";
	if(status.sentiment.score < -1){
		sentiment = '<div class="tweet-container negative"> <i class="thumbs fa fa-frown-o  fa-2"></i>'
		fillKey = "BAD"
	}else if(status.sentiment.score > 1){
		sentiment = '<div class="tweet-container positive"><i class="thumbs fa fa-smile-o fa-2"></i>'
		fillKey = "GOOD"
	}else{
		sentiment = '<div class="tweet-container netural"><i class="thumbs fa fa-circle-o fa-2"></i>'
		fillKey = "OKAY"
	}

	tweetElement = {fillKey: fillKey, status: status, el: sentiment
		+'<div class="tweet-user-pic"><img src="'+status.user.profile_image_url
		+'"></div><div class="tweet" id="'+status.id+'">'
		+'<div class="tweet-user">'+status.user.name+'</div>'
		+ status.text
		+'<div class="datetime">'+moment(status.created_at).fromNow()+'</div>'
		+'</div>'
		+'<div class="links">'
		+'<div class="link"><a href="https://twitter.com/'+status.user.screen_name+'/status/'+status.id_str+'" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i></a></div>'
		+'<div class="link" id="tweet_'+status.id_str+'" onclick="saveTweet(\''+status.id_str+'\')"><i class="fa fa-floppy-o" aria-hidden="true"></i></div>'
		+'</div>'
		+'</div>'}
	return tweetElement;
}

function saveTweet(id){
	$("#tweet_"+id.trim() +" i").removeClass("fa-floppy-o").addClass("fa-spinner fa-spin")
	$.post('/saveTweet', {id: id.trim()}, function(data){
		$("#tweet_"+data.id.trim()).hide()
	})
}

function getSavedTweets(){
	var count =0;
	$.get('/getSavedTweets', function(data){

		data.tweets.forEach(function(status){
			setTimeout(function(){
				count++;
				$("#savedTweetCount").html(count);
				$("#savedTweets").prepend(getTweetEl(status.tweet).el);
				$(".fa-floppy-o").hide()
			},300);
		})
	})
}

function hideTweets(type){
	$("body .tweet-container."+type).toggle()
}
var positiveTweets = 0, negativeTweets = 0; neturalTweets = 0;
if(document.location.pathname === "/profile"){
	getTweets();
	setInterval(function(){
		if(tweets.length > 0){
			var tweet = tweets.shift();
			if(tweet.fillKey === "GOOD"){
				positiveTweets++;
			}
			if(tweet.fillKey === "BAD"){
				negativeTweets++;
			}
			if(tweet.fillKey === "OKAY"){
				neturalTweets++;
			}
			$(".stat .positive").html(positiveTweets)
			$(".stat .negative").html(negativeTweets)
			$(".stat .netural").html(neturalTweets)
			$(".stat .total").html((positiveTweets + negativeTweets + neturalTweets))
			sentimentBar.setProgress(positiveTweets, (positiveTweets + negativeTweets + neturalTweets));
			if(tweet.status.user.location && tweet.status.user.location != ""){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'address': tweet.status.user.location}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						drawBubbles([{
							"latitude": results[0].geometry.location.lat(),
			        		"longitude":results[0].geometry.location.lng(),
			        		"fillKey" : tweet.fillKey
						}]);
					}
				});
			}
			//var el = '<a href="https://twitter.com/'+tweet.status.user.screen_name+'/status/'+tweet.status.id_str+'" target="_blank">'+tweet.el+'</a>'
			$("#tweets").prepend(tweet.el)
			$("#"+tweet.status.id).fadeIn()

		}else{
			if($('#searchterms .termData').length){
			 getTweets()
			}
		}
	}, 1000)
}
