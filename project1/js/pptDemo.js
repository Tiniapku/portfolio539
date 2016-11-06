// JavaScript Document

/*for a demo of pictures like ppt
代码主要借鉴自：http://www.nosetime.com/，其代码风格尚好，很干净很专业
更新：该网站恐怕抄袭了这篇博文的代码，但从时间看，又似博文私自转载网站代码http://blog.csdn.net/dongsg11200/article/details/8118760*/
function PPTBox()
{
	this.uid = PPTBoxHelper.getId();
	PPTBoxHelper.instance[this.uid] = this;
	this._$ = function(id){return document.getElementById(id);};
	this.width = 600;//宽度
	this.height = 371;//高度
	this.picWidth = 15;//小图宽度，也就是icon的宽度和高度
	this.picHeight = 12;//小图高度
	this.autoplayer = 4;//自动播放间隔（秒）
	this.target = "_blank";//在新页面打开链接
	this._box = [];
	this._curIndex = 0;
}
PPTBox.prototype =
{
	_createMainBox : function (){//这里其实是一段根据需要生成html代码的js代码
		var flashBoxWidth = this.width * this._box.length + 5;
		var html="<div id='"+this.uid+"_mainbox' class='mainbox'  style='width:"+(this.width)+"px;height:"+(this.height+2)+"px;'>";
		//这段代码翻译过来就是<div id="" class='mainbox' style='width=px; height:px;>
		html += "<div id='"+this.uid+"_flashbox' class='flashbox' style='width:"+flashBoxWidth+"px;height:"+(this.height+2)+"px;'></div>";
		//<div id="flashbox" class='flashbox' style="width:px; height:px;"></div>
		html += "<div id='"+this.uid+"_imagebox' class='imagebox' style='width:"+this.width+"px;height:"+(this.picHeight+2)+"px;top:-"+(this.picHeight+20)+"px;'></div>";
		//<div id="imagebox" class="imagebox" style="width:px;height:px;"></div>这是底下的那条白线吧
		html += "</div>";
		document.write(html);
	},
	_init : function (){
		var picstyle= "";
		var eventstr = "PPTBoxHelper.instance['"+this.uid+"']";
		var flashbox = "";
		var imageHTML="";
		for(var i=0;i<this._box.length;i++){
			var parame = this._box[i];
			flashbox += this.flashHTML(parame.url,parame.title,this.width,this.height,i);
			imageHTML ="<div class='bitdiv "+((i==0)?"curimg":"defimg")+"' title ="+parame.title+" src='/icon/SpayMenuBarDown.gif' "+picstyle+" onclick = \""+eventstr+".clickPic("+i+")\"  onmouseover=\""+eventstr+".mouseoverPic("+i+")\"></div>" + imageHTML;
		}
		//<div class="bitdiv defimg/curimg" title="" src="picstyle" onclick="" onmouseover=""></div>其中onclick和onmouseover调用了两个函数
		this._$(this.uid+"_flashbox").innerHTML = flashbox;
		this._$(this.uid+"_imagebox").innerHTML = imageHTML;

	},
	_play : function(){
		clearInterval(this._autoplay);
		var idx = this._curIndex+1;
		if(idx>=this._box.length){idx=0;}
		this.changeIndex(idx);
		var eventstr = "PPTBoxHelper.instance['"+this.uid+"']._play()";
		this._autoplay = setInterval(eventstr,this.autoplayer*1000);

	},
	flashHTML : function(url,title,width,height,idx) {
		var isFlash = url.substring(url.lastIndexOf('.')+1).toLowerCase()=="swf";
		var html = "";
		if(isFlash){
			html = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "
			+ "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0' width='"+width+"' height='"+height+"'>"
			+ "<param name=\"movie\" value=\""+url+"\" />"
			+ "<param name='quality' value='high' />"
			+ "<param name='wmode' value='transparent'>"
			+ "<embed src='"+url+"' quality='high' wmode='opaque' pluginspage='http://www.macromedia.com/go/getflashplayer'"
			+"  type='application/x-shockwave-flash' width="+width+" height='"+height+"'></embed>"
			+"  </object>";
		} else {
			var eventstr = "PPTBoxHelper.instance['"+this.uid+"']";
			var style = "";
			if(this._box[idx].href){
				style = "cursor:pointer"
			}
			html="<div style='width:"+width+"px;height:"+height+"px;float:left'><img src='"+url+"' style='width:"+width+"px;height:"+height+"px;"+style+"' onclick = \""+eventstr+".clickPic("+idx+")\"/><div style='margin-top:-40px;line-height:40px;background:#fff;filter:alpha(opacity=80);opacity:0.8;text-align:center;font-size:16px;color:#86006B'>"+title+"</div></div>";
		}
		return html;
	},
	changeIndex : function(idx){
		var parame = this._box[idx];
		moveElement(this.uid+"_flashbox",-(idx*this.width),1);
		var imgs = this._$(this.uid+"_imagebox").getElementsByTagName("div");
		imgs[this._box.length-1-this._curIndex].className = "bitdiv defimg";
		imgs[this._box.length-1-idx].className = "bitdiv curimg";
		this._curIndex = idx;
	},
	mouseoverPic:function(idx){
		this.changeIndex(idx);
		if(this.autoplayer>0){
			clearInterval(this._autoplay);
			var eventstr = "PPTBoxHelper.instance['"+this.uid+"']._play()";
			this._autoplay = setInterval(eventstr,this.autoplayer*1000);
		}
	},
	clickPic:function(idx){
		var parame = this._box[idx];
		if(parame.href&&parame.href!=""){
			window.open(parame.href,this.target);
		}
	},//单击打开页面的函数
	add:function (imgParam){
		this._box[this._box.length] = imgParam;
	},
	show : function () {
		this._createMainBox();
		this._init();
		if(this.autoplayer>0){
			var eventstr = "PPTBoxHelper.instance['"+this.uid+"']._play()";
			this._autoplay = setInterval(eventstr,this.autoplayer*1000);
		}
	}
}
var PPTBoxHelper =
{
	count: 0,
	instance: {},
	getId: function() { return '_ppt_box-' + (this.count++); }
};
//下面这一段代码是管图片切换的函数
function moveElement(elementID,final_x,interval) {
	if (!document.getElementById) return false;
	if (!document.getElementById(elementID)) return false;
	var elem = document.getElementById(elementID);
	if (elem.movement) {
		clearTimeout(elem.movement);
	}
	if (!elem.style.left) {
		elem.style.left = "0px";
	}
	var xpos = parseInt(elem.style.left);
	if (xpos == final_x ) {
		return true;
	}
	if (xpos < final_x) {
		var dist = Math.ceil((final_x - xpos)/5);
		xpos = xpos + dist;
	}
	if (xpos > final_x) {
		var dist = Math.ceil((xpos - final_x)/5);
		xpos = xpos - dist;
	}//这里是设计了连续滑动的视觉效果，每次图片向后推进五分之一，因为动作比较快，给用户的感觉就是连续滑动。
	elem.style.left = xpos + "px";
	var repeat = "moveElement('"+elementID+"',"+final_x+","+interval+")";
	elem.movement = setTimeout(repeat,interval);//循环切换，永不停歇
}

