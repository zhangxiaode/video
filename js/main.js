$(document).ready(function(){
	/*按钮显隐*/
	/*$(".video").hover(function(){
		$(this).find(".videoBottom").fadeIn();
	},function(){
		$(this).find(".videoBottom").fadeOut();
	})*/
	/*播放/暂停*/
	$(".videoBtn").on("click",".playpause",function(){
		if ($(this).hasClass("pause"))
		{
			$(this).removeClass("pause").addClass("play");
			$(this).find("path").html("<animate id='playAnimate' attributeName='d' calcMode='linear' fill='freeze' from='M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z' to='M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z' dur='0.3s' repeatCount='1'/>");
			document.getElementById("playAnimate").beginElement();
			$("#video").get(0).play();
		}else{
			$(this).removeClass("play").addClass("pause");
			$(this).find("path").html("<animate id='playAnimate' attributeName='d' calcMode='linear' fill='freeze' from='M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z' to='M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z' dur='0.3s' repeatCount='1'/>");
			document.getElementById("playAnimate").beginElement();
			$("#video").get(0).pause();
		}
	})
	/*缓存*/
	//loadProgress
	$("#video").get(0).onprogress=function(){
		$(".loadProgress").css("transform","scaleX(" + $("#video").get(0).buffered.end(0)/$("#video").get(0).duration + ")");
	}
	//hoverProgress
	$(".videoProgress").mousemove(function(event){
		//document.querySelector('canvas').getContext('2d').drawImage($("#video").get(0),0,0,854,480);
		var obj=getOffsetLeft($(".videoProgress").get(0));
		var hoverLeft=event.clientX-obj;
		var percent=hoverLeft/$(".videoProgress").width();
		$(".hoverProgress").css("transform","scaleX(" + percent + ")");
	}).click(function(event){
		var obj=getOffsetLeft($(".videoProgress").get(0));
		var hoverLeft=event.clientX-obj;
		var ct=(hoverLeft/$(".videoProgress").width())*($("#video").get(0).duration);
		$("#video").get(0).currentTime=ct;
		$(".playProgress").css("transform","scaleX(" + $("#video").get(0).currentTime/$("#video").get(0).duration + ")");
	})
	//playProgress
	$("#video").get(0).addEventListener("play",function(){
		var setPlay=setInterval(function(){
			$(".playProgress").css("transform","scaleX(" + $("#video").get(0).currentTime/$("#video").get(0).duration + ")");
		},10);
		$("#video").get(0).addEventListener("pause",function(){
			clearInterval(setPlay);
		})
	})
	function getOffsetLeft(obj){
		var tmp = obj.offsetLeft;
		var val = obj.offsetParent;
		while(val != null){
			tmp += val.offsetLeft;
			val = val.offsetParent;
		}
		return tmp;
	}
	/*播放时间*/
	$("#video").get(0).addEventListener("loadedmetadata",function(){
		var num1=parseInt($("#video").get(0).duration);
		var num2=parseInt(num1/60);
		var num3=num1%60;
		if (num3<10){num3 = "0" + num3;}
		$(".videoLeftBtn").find(".dura").text(num2 + ":" + num3);
		$(".videoLeftBtn").find(".curr").text("0:00");
	})
	$("#video").get(0).addEventListener("timeupdate",function(){
		var num1=parseInt($("#video").get(0).currentTime);
		var num2=parseInt(num1/60);
		var num3=num1%60;
		if (num3<10){num3 = "0" + num3;}
		$(".videoLeftBtn").find(".curr").text(num2 + ":" + num3);
	})
	/*音量调整*/
	$("#video").get(0).volume=0;
	var currentVolume=0;
	$(".volume").hover(function(){
		$(this).animate({"width":"92px"},200);
		$(this).find(".volumeLine").animate({"width":"52px"},200);
	},function(){
		$(this).animate({"width":"30px"},200);
		$(this).find(".volumeLine").animate({"width":"0"},200);
	})
	$(".videoBtn").on("mousedown",".volumePanel",function(even){
		var th=$(this);
		var x=even.clientX;
		var lef2=parseInt($(".volumePanel").css("left"));
		th.on("mousemove",function(even){
			var lef=lef2+even.clientX-x;
			if (lef<=40 && lef>=0)
			{
				$(".volumePanel").css("left",lef + "px");
				$("#video").get(0).volume=lef/40;
				currentVolume=lef;
				if (lef==0)
				{
					$("#volumeSvg1").children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z");
					//$("#volumeSvg1").children("path").html("<animateMotion attributeName='d' from='M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z' to='M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z' begin='0s' dur='3s' repeatCount=1 />");
					$("#volumeSvg2").css("opacity","1");
				}
				else if(lef>0 && lef<20){
					$("#volumeSvg2").css("opacity","0");
					$("#volumeSvg1").children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z");					
					//$("#volumeSvg1").children("path").html("<animateMotion path='M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z' begin='0s' dur='3s' repeatCount=1 />");
				}
				else{
					$("#volumeSvg2").css("opacity","0");
					$("#volumeSvg1").children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z");					
					//$("#volumeSvg1").children("path").html("<animateMotion path='M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z' begin='0s' dur='3s' repeatCount=1 />");
				}
			}
		})
		$(this).on("mouseup",function(even){
			$(this).unbind("mousemove");
		})
	})
	$(".videoBtn").on("mousedown",".volumeLine",function(even){
		var obj=getOffsetLeft($(".volumeLine").get(0));
		var lef=even.clientX-obj;
		if (lef<=40 && lef>=0){
			$(".volumePanel").css("left",lef + "px");
			$("#video").get(0).volume=lef/40;
			currentVolume=lef;
			if (lef!=0)
			{
				$("#volumeSvg1").children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z");
				$("#volumeSvg2").css("opacity","0");
			}
			else{
				$("#volumeSvg1").children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z");
				$("#volumeSvg2").css("opacity","1");
			}
		}
	})
	$(".videoBtn").on("click","#volumeSvg1",function(){
		if ($(this).parents(".volume").hasClass("closeVolume"))
		{
			$(this).parents(".volume").removeClass("closeVolume");
			$("#video").get(0).volume=currentVolume/40;
			$(".volumePanel").css("left",currentVolume + "px");
			if (currentVolume!=0)
			{
				$(this).children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z");
				$(this).find("#volumeSvg2").children("path").attr("d","M 26.11,15.73 24.85,14.5 22.52,16.76 20.20,14.5 18.94,15.73 21.26,18 18.94,20.26 20.20,21.5 22.52,19.23 24.85,21.5 26.11,20.26 23.79,18 l 2.32,-2.26 0,0 z");
				$("#volumeSvg2").css("opacity","0");
			}
		}
		else{
			$(this).parents(".volume").addClass("closeVolume");
			//$("#video").get(0).muted();
			$("#video").get(0).volume=0;
			$(".volumePanel").css("left",0);
			$(this).children("path").attr("d","M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z");
			$(this).find("#volumeSvg2").children("path").attr("d","M 26.11,15.73 24.85,14.5 22.52,16.76 20.20,14.5 18.94,15.73 21.26,18 18.94,20.26 20.20,21.5 22.52,19.23 24.85,21.5 26.11,20.26 23.79,18 l 2.32,-2.26 0,0 z");
			$("#volumeSvg2").css("opacity","1");
		}
	})
	/*setting*/
	$(".videoBtn").on("click",".setting",function(){
		if($(this).hasClass("open")){
			$(".settingDialog").fadeOut();
			$(this).removeClass("open");
		}
		else{
			$(".settingDialog").fadeIn();
			$(this).addClass("open");
		}
	})
	//autoPlay是否自动播放
	$(".settingDialog").find(".autoPlay").on("click",".hasCheck",function(){
		if($(this).find(".checkbox").hasClass("checked")){
			$(this).find(".checkbox").removeClass("checked");
			$("#video").get(0).autoplay=false;
		}
		else{
			$(this).find(".checkbox").addClass("checked");
			$("#video").get(0).autoplay=true;
		}
	})
	//annotation是否显示注释
	$(".settingDialog").find(".annotation").on("click",".hasCheck",function(){
		if($(this).find(".checkbox").hasClass("checked")){
			$(this).find(".checkbox").removeClass("checked");
			//...
		}
		else{
			$(this).find(".checkbox").addClass("checked");
			//...
		}
	})
	//speed 速度选择
	$(".settingDialog").on("click",".speed",function(){
		$(".settingDialog").children(".sdMain").hide();
		$(".speedDialog").show();
	})
	$(".speedDialog").on("click",".sdItem",function(){
		$(".settingDialog").children(".sdMain").show();
		$(".speedDialog").hide();
		var index=$(this).index();
		if (index!=0)
		{
			$(".speed").find(".sdItemContent").text($(this).text());
			if (index==3)
			{
				$("#video").get(0).playbackRate=1;
			}
			else{
				$("#video").get(0).playbackRate=parseFloat($(this).text());
			}
		}
	})
	//caption字幕选择
	$(".settingDialog").on("click",".caption",function(){
		
	})
	/*全屏*/
	var videoWid=$(".video").width();
	var videoHei=$(".video").height();
	var fullWid=$("html").width();
	var fullHei=$("html").height();
	$(".videoRightBtn").on("click",".full",function(){
		if ($(this).hasClass("fullScreen"))
		{
			$(".video").animate({"width":fullWid + "px","height":fullHei + "px"},300);
			$(this).addClass("fullScreenReturn").removeClass("fullScreen");	
			$(".theater").hide();
		}
		else{
			$(".theater").show();
			$(this).addClass("fullScreen").removeClass("fullScreenReturn");
			if ($(".theater").hasClass("theatre")){
				$(".video").animate({"width":videoWid + "px","height":videoHei + "px"},300);
			}
			else{
				$(".video").animate({"width":"1000px","height":"562px"},300);
			}
		}
	})
	/*剧场模式*/
	$(".videoRightBtn").on("click",".theater",function(){
		if ($(this).hasClass("theatre")){
			$(".video").animate({"width":"1000px","height":"562px"},300);
			$(this).addClass("theatreReturn").removeClass("theatre");
		}
		else{
			$(".video").animate({"width":videoWid + "px","height":videoHei + "px"},300);
			$(this).addClass("theatre").removeClass("theatreReturn");
		}
	})
})