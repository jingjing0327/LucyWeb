var video_data;
var server_url = "http://115.28.66.229/"

function redirectUrl(url, name) {
	var time = new Date().getTime();
	var t_encode = time * 6 + 1991 + 327 + 511 + 2537;
	$.ajax({
		type : "get",
		url : server_url + "RedirectUrlServlet",
		data : {
			"time" : time,
			"t_encode" : t_encode,
			"url" : url,
			"name" : name
		},
		async : false,
		dataType : "json",
		success : function(data) {
			chooseSettingPlayer(data);
		}
	});
}

function video_click(uuid, video_name) {
	$('#video_title_name').html(video_name)
	var time = new Date().getTime();
	var t_encode = time * 6 + 1991 + 327 + 511 + 2537;
	$.ajax({
		type : "get",
		url : server_url + "VideoRealUrlPreferredServlet",
		data : {
			"time" : time,
			"t_encode" : t_encode,
			"uuid" : uuid
		},
		async : false,
		dataType : "json",
		success : function(data) {
			chooseSettingPlayer(data);
		}
	});
}

function chooseSettingPlayer(data) {
	var video_main = $("#video_main");
	var video_main_complex = $("#video_main_complex");
	var videoHtml = '<video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" width="720" height="360" poster="png/MY_VIDEO_POSTER.png" data-setup={"aspectRatio":"720:360"}></video>';
	var swfobjectHtml = '<div id="swfobject_player"></div>';
	var resultVideoType = data.container;
	console.log("resultVideoType===>>"+resultVideoType);
	var playerType = judgePlayerType(resultVideoType);
	if (playerType == "videojs") {
		try{
		var swf_player= $("#swfobject_player")
		swf_player.getObjectById('Object').StopPlay();
		}catch(err){
			
		}
		$("#swfobject_player").html('')
		video_main.show();
		video_main_complex.hide();
		settingVideojsUrl(data);
	} else if (playerType = "swfobjectjs") {
		video_main.hide();
		videojs('my-video').pause();
		video_main.hide();
		video_main_complex.show();
		video_main_complex.html(swfobjectHtml);
		setingSwfobjectUrl(data);
	}
}

function setingSwfobjectUrl(data) {
	video_data = data;
	var flashUrl = video_data.src[0];
	var flashvars = {
		// M3U8 url, or any other url which compatible with SMP player (flv,
		// mp4, f4m) // escaped it for urls with ampersands
		src : escape(flashUrl),
		// url to OSMF HLS Plugin
		plugin_m3u8 : "plugin/HLSProviderOSMF.swf",
	};
	var params = {
		// self-explained parameters
		allowFullScreen : true,
		allowScriptAccess : "always",
		bgcolor : "#000000"
	};
	var attrs = {
		name : "swfobject_player"
	};

	swfobject.embedSWF(
	// url to SMP player
	"plugin/StrobeMediaPlayback.swf",
	// div id where player will be place
	"swfobject_player",
	// width, height
	"100%", "600",
	// minimum flash player version required
	"10.2",
	// other parameters
	null, flashvars, params, attrs);
//	swf_player.getObjectById('Object').Play();
}

function settingVideojsUrl(data) {
	video_data = data;
	var aa = [];
	var srcs = data.src;
	var videoType = judgeVideoType(data.container);
	console.log("videoType===>>" + videoType);
	console.log("data.container===>>" + data.container);
	for (var i = 0; i < srcs.length; i++) {
		aa.push({
			sources : [ {
				src : srcs[i],
				type : videoType
			} ]
		});
	}
	var player = videojs('my-video');
	player.playlist(aa);
	player.playlist.autoadvance(0);
	player.player();
}

function judgeVideoType(beforType) {
	var afterType = "video/x-flv";
	switch (beforType) {
	case "mp4":
		afterType = "video/mp4";
		break;
	case "flv":
		afterType = "video/x-flv";
		break;
	case "m3u8":
		afterType = "application/x-mpegURL";
		break;
	}
	return afterType;
}

function judgePlayerType(videoType) {
	var defaultPlayer = "videojs";
	var flashM3U8Player = "swfobjectjs";
	switch (videoType) {
	case "mp4":
		return defaultPlayer;
	case "flv":
		return defaultPlayer;
	case "m3u8":
		return flashM3U8Player;
	}
}

function set_split_video() {
	$("#video_ppppp").toggle();
	var html = '';
	for (var i = 0; i < video_data.src.length; i++) {
		var tempi = i + 1;
		html += '<span class="choose_span"><a href="javascript:play_auto_split('
				+ i + ')">第' + tempi + '段</a></span>';
	}
	$('#video_ppppp').html(html)
}

function play_auto_split(position) {
	console.log(position);
	var player = videojs('my-video');
	var ppp = player.playlist.currentItem(position);
	console.log(ppp);
}

 redirectUrl("http://api.s4yy.com/acfun.php?vid=26catBoDxyG4exyC74ch4EG5udNrbrmH0PfFrzZyROkCQo7qLKphCmQX&type=mp4","我不是潘金莲")

var time = new Date().getTime();
var t_encode = time * 6 + 1991 + 327 + 511 + 2537;
var html = ''

$.ajax({
	type : "get",
	url : server_url + "VideoServlet",
	data : {
		"time" : time,
		"t_encode" : t_encode,
		"pageNo" : 0
	},
	async : false,
	dataType : "json",
	success : function(data) {
		for (var i = 0; i < data.length; i++) {
			var xx = data[i]['uuid']
			// data[i]['uuid']
			html += '<a href=javascript:video_click("' + xx + '","'
					+ data[i]['name'] + '");>' + data[i]['name'] + '</a>'
		}
		$('#video_name').html(html)
	}
});

var player = videojs('my-video');
player.play();

/* hot key */
videojs('my-video').ready(function() {
	this.hotkeys({
		volumeStep : 0.1,
		seekStep : 5,
		enableModifiersForNumbers : false
	});
});