(function($j){
	/*
	* jqueryオブジェクトがサードパーティーのブログパーツに汚染されるのを回避するため
	* jqueryオブジェクトの複製を作成。
	*/
	$j.gjQuery = function(){
		return $j.gjQuery.impl.selector()
	}
	$j.gjQuery.impl = {
		selector : function(){
			var s = function(expr){
				var o=this,arr=[];
				if(this instanceof arguments.callee){
					o._$j=expr.each(function(idx){
						arr[idx]=this;
					})
					return $j.extend(arr,this)
				}
				else return new arguments.callee($j(expr))
			}   
			for(var i in $j)if($j.isFunction($j[i]))s[i]=$j[i];
			return this.jqWrap(s);
		},
		jqWrap : function(s){
			s.fn=s.prototype;
			for(var i in $j.fn)
				if($j.isFunction($j.fn[i]))
					(function(i){
						s.fn[i] = function(){
							var target = this.constructor == s ? this : this._$j;
							var ins = $j.fn[i].apply(target,arguments)
							if(!(ins instanceof $j))return ins;
							if(ins==target){
								var _ins = new s(ins);
								for(var j in this)
									if(typeof _ins[j]=='undefined' && this.hasOwnProperty(j))_ins[j]=this[j]
								return _ins;
							}
							return new s(ins)
						}
					})(i)
			return s;
		}
	}
})(jQuery)
$gbQuery = $.gjQuery();

$(document).ready(function(){
	var $ = $gbQuery;

	$.fn.follow = function(config) {
		var defaults = {
			show_counter: false
		};
		var options = $.extend(defaults, config);

		var follow_blog_ids = new Array();
		jQuery.each($('a[follow_blog_id]'), function(i, elm) {
			var attr = $(elm).attr('follow_blog_id');
			if(attr){follow_blog_ids[i] = attr;}
		});

		if(follow_blog_ids.length){setStatus(follow_blog_ids);}

		function setStatus(blog_ids) {
			$.ajax({
				url: '/api/follow_status?'+ parseInt((new Date)/1000),
				dataType: 'json',
				data: {'blog_ids': blog_ids},
				success: function(data){
					jQuery.each(data, function(bid, val) {
						if (val['deny_follow']) {
							$('a[follow_blog_id='+bid+']').hide();
							$('a[unfollow_blog_id='+bid+']').hide();
						} else {
							if (val['followed']) {
								$('a[follow_blog_id='+bid+']').hide();
								$('a[unfollow_blog_id='+bid+']').show();
							} else {
								if (val['owner'] || !val['created_blog'] || !val['limit_check']) {
									$('a[follow_blog_id='+bid+']').hide();
									$('a[unfollow_blog_id='+bid+']').hide();
									if ($('#owner-'+bid)) {
										$('#owner-'+bid).show();
									}
								} else {
									$('a[follow_blog_id='+bid+']').show();
									$('a[unfollow_blog_id='+bid+']').hide();
								}
							}

							$('a[follow_blog_id='+bid+']').click(
								function(ev) {
									follow(bid);
									return false;
								}
							);
							$('a[unfollow_blog_id='+bid+']').click(
								function(ev) {
									unfollow(bid);
									return false;
								}
							);
							$('a[unfollow_blog_id='+bid+']').mouseover(
								function(ev) {
									$(this).html('解除する');
									return false;
								}
							);
							$('a[unfollow_blog_id='+bid+']').mouseout(
								function(ev) {
									$(this).html('読者登録中');
									return false;
								}
							);

							if ($('#follow-reader-count-'+bid)) {
								setFollowReaderCount(bid, val['count']);
							}
						}
					});
				}
			});
		};

		function unfollow(blog_id) {
			$.ajax({
				url: '/api/unfollow?' + parseInt((new Date)/1000),
				dataType: 'json',
				data: {'blog_id': blog_id},
				success: function(data){
					if (data.success) {
						$("a[unfollow_blog_id='"+blog_id+"']").hide();
						$("a[follow_blog_id='"+blog_id+"']").show();
						setFollowReaderCount(blog_id, data.count);
					}
				}
			});
		};

		function follow(blog_id) {
			$("a[follow_blog_id='"+blog_id+"']").hide();
			$.ajax({
				url: '/api/follow?' + parseInt((new Date)/1000),
				dataType: 'json',
				data: {'blog_id': blog_id},
				cache: false,
				success: function(data){
					if (data.success) {
						$("a[unfollow_blog_id='"+blog_id+"']").show();
						setFollowReaderCount(blog_id, data.count);
					} else if (!data.login) {
						$("a[follow_blog_id='"+blog_id+"']").show();
						window.location.href = data.url;
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$("a[unfollow_blog_id='"+blog_id+"']").show();
				}
			});
		};

		function setFollowReaderCount(bid, count) {
			if (!options.show_counter) return;

			$('#follow-reader-count-'+bid).html(count);
			if (count > 0) {
				$('#follow-reader-count-span-'+bid).show();
			} else {
				$('#follow-reader-count-span-'+bid).hide();
			}
		}
	};

	$.fn.ad = function() {
		$.ajax({
			url: '/api/user/is_free_owner',
			type: 'get',
			success: function(data){
				if (data==1) {
					$('#ad-anounce').show();
				}
			}
		});
	};

	$.fn.fadeContents = function(config) {
		var defaults = {
			animate: 1000,
			elm: null,
			fadeinPoint: 0.5,
			dataLayerParams: {}
		}
		options = $.extend(defaults, config);

		// 記事の終わりまでの高さを取得
		var height = $('.entry-body-text').height() + $('.entry-body-text').offset().top;

		var showFlg = false;
		$(window).scroll(function () {
			// elmの高さ*fadeinPointくらいになったらフェードイン
			if ($(this).scrollTop() >= height * options.fadeinPoint) {

				$('#'+options.elm).fadeIn(
					options.animate,
					function() {
						if (options.dataLayerParams) {
							if (showFlg == true) { return; }
							dataLayer.push(options.dataLayerParams);
							showFlg = true;
						}
					}
				);
			} else {
				$('#'+options.elm).fadeOut();
			}
		});
	};

	$.fn.cookie = function(config) {
		var options;
		var defaults = {
			expire: 0,// valid util user close the browser.
			path: '/',
			domain: document.domain,
			secure: 0,
			name: null,
			value: null
		}
		options = $.extend(defaults, config);

		if (options['value'] != null) {
			set(options['name'], options['value'], options['expire'],
				options['path'], options['domain'], options['secure']);
		} else {
			return get(options['name']);
		}

		function get(name){
			var prefix = escape(name)+"=";
			var cookies = (document.cookie||"").split(/;\s*/);
			for(var i=0;i<cookies.length;i++){
				if(cookies[i].indexOf(prefix)>=0){
					return unescape(cookies[i].split(/=/)[1]);
				}
			}
			return undefined;
		};

		function set(name,value,expire,path,domain,secure){
			if( typeof(name)==='undefined' ){
				alert('jquery.cookie.set requires name.');
				return;
			}
			if( typeof(value)==='undefined' ){
				value = "";
			}
			var attributes = "";
			// expires
			if( typeof(expire)!=='undefined' && expire!=null && expire!=0){
				if( typeof(expire)==='number' ){
					expire = new Date((new Date()).getTime()+expire*60*60*1000);
					attributes+='; expires='+expire.toUTCString();
				}else if( typeof(expire)==='object' ){
					attributes+='; expires='+expire.toUTCString();
				}else if( typeof(expire)==='string' ){
					attributes+='; expires='+expire;
				}
			}
			// path
			if( typeof(path)!=='undefined' && path!=null ){
				attributes+='; path='+path;
			}else if( path ){
				attributes+='; path='+path;
			}
			// domain
			if( typeof(domain)!=='undefined' && domain ){
				attributes+='; domain='+domain;
			}
			// secure
			if( typeof(secure)!=='undefined' && secure ){
				attributes+='; secure=1';
			}
			document.cookie = escape(name)+'='+escape(value)+attributes;
		}
	};

	$.fn.sDispatch = function(config) {
		var defaults = {};
		var options = $.extend(defaults, config);

		$('#'+options.id).submit(function(){
			return execute();
		});

		function execute() {
			var bsf = document.bsearch;
			if (bsf.scope.value == 'this') { return true; }

			var gsf = document.gsearch;
			if (bsf.scope.value == 'all') {
				gsf.MT.value = bsf.sword.value;
				gsf.submit();
			}

			var wsf = document.wsearch;
			if (bsf.scope.value == 'web') {
				wsf.MT.value = bsf.sword.value;
				wsf.submit();
			}
			return false;
		}
	};

	$.fn.blogPch = function(config) {
		return this.each(function() {
			var album = $('#mod-global-header-album');
			var stage = $('#mod-global-header-pch');
			var close = $('#mod-global-header-pch-close');
			if (!album) { return; }

			var pch_popup_sw = null;
			var defaults = { bid: null }
			var options = $.extend(defaults, config);
			if (options['bid'] == null) { return; }

			album.mouseover(function(){
				if (stage.css('display') === 'block') { return; }

				pch_popup_sw = setTimeout(function(){
					if ($("#mod-global-header-pch").get(0).lastChild.tagName !== 'UL') {
						_initPhotoList(options['bid']);
					} else {
						_offsetPhotoList();
					}
					stage.css('display', 'block');
				});
			});

			album.mouseout(function(){
				clearTimeout(pch_popup_sw);
			});

			stage.click(function(){
				stage.css('display', 'none');
				$(window).unbind('resize', _offsetPhotoList)
			});

			$(window).resize(_offsetPhotoList);
		});

		function _initPhotoList(bid) {
			$.getJSON(
				'/api/photo_channel/get_channels',
				{ bid: bid, p: 0, random: Math.random() },
				function(channels){
					if (channels || channels.length < 1) {
						_makePhotoList(channels);
					} else {
						_showError();
					}
				}
			);
		}

		function _makePhotoList(channels) {
			if (channels <= 0) return;

			var stage = $('#mod-global-header-pch');
			var close = $('#mod-global-header-pch-close');
			close.css('display', 'block');
			var ul = $(document.createElement('ul'));

			$(channels).each(function(no){
				var pch = channels[no];
				var li = $(document.createElement('li'));
				if( Math.ceil( (no+1)/7 ) > 1 ){
					li.addClass('ph_list_box2');
				} else {
					li.addClass('ph_list_box');
				}
				if( ((no+1)%7) === 0 || no+1 === channels.length ){
					li.addClass('list-period');
				}

				var img  = $(document.createElement('img'));
				img.attr({
					src: pch.channel_thumbnail,
					alt: pch.channel_title
				});

				var span = $(document.createElement('span'));
				span.addClass('inph_list_box');

				var a = $(document.createElement('a'));
				a.attr({
					href: '/photo/'+pch.channel_no+'?fm=global_h',
					title: pch.channel_title
				});

				span.append(img);
				a.append(span);
				li.append(a);
				ul.append(li);
				if( ((no+1)%7) === 0 || (no+1) === channels.length ){
					var li = $(document.createElement('li'));
					li.addClass('clearboth');
					ul.append(li);
				}
			});
			stage.append(ul);
			_offsetPhotoList();
		}

		function _offsetPhotoList() {
			var h_rect = getRect($('#mod-global-header'));
			var a_rect = getRect($('#mod-global-header-album'));
			var stage = $('#mod-global-header-pch');
			stage.css('top', h_rect.bottom + 'px');
			stage.css('left', a_rect.left + 'px');

			function getRect(elm){
				elm = elm.get(0);
				var r = { height:0, width:0, top:0, right:0, bottom:0, left:0 };
				if(!elm) { return r };
				if( elm.getBoundingClientRect ){ // IE8,FF3-
					r = elm.getBoundingClientRect();
					r = { height:r.bottom-r.top, width:r.right-r.top, top:r.top, right:r.right, bottom:r.bottom, left:r.left };
				} else {
					r = { height:elm.offsetHeight, width:elm.offsetWidth, top:0, right:0, bottom:0, left:0 };
					while( elm ){
						r.left += elm.offsetLeft;
						r.top += elm.offsetTop;
						elm = elm.offsetParent;
					}
					r.right = r.left + r.width;
					r.bottom = r.top + r.height;
				}
				return r;
			};
		}

		function _showError() {
			$('#mod-global-header-pch').html('画像の取得に失敗しました');
		}

	};

	$.fn.pc2sp = function(config) {
		return this.each(function() {
			if (!isSmartphone()) return false;

			var defaults = { mode: 'add' }
			var options = $.extend(defaults, config);

			hideAddressBar();

			$(window).bind('orientationchange',hideAddressBar);
			if( navigator.userAgent.match(/iphone|ipod|ipad/i) ){
				$(window).bind('onunload', function(){});
			}

			if (options['mode'] === 'add') {
				addViewModeElement();
			} else {
				clearPcView();
			}

		});

		function clearPcView(){
			var str = "pcv=1;";
			var dt = new Date();
			dt.setDate(dt.getDate() - 1);
			str += "expires=" + dt.toGMTString() + ";";
			var d = 'path=/;domain=' + document.domain + ';';
			document.cookie = str + d;
			location.href = getSmartphoneUrl(document.URL);
		}

		function addViewModeElement(){
			var el = document.createElement("div");
			el.id = 'mod-sp-header';
			var src = '';
			src += '<style type="text/css">\n';
			src += '#mod-sp-header {\n';
			src += '  background-color: #666;\n';
			src += '  padding: 60px 0px;\n';
			src += '  text-align: center;\n';
			src += '  clear: both;\n';
			src += '}\n';
			src += '#mod-sp-header a {\n';
			src += '  padding: 20px;\n';
			src += '  font-size: 50px;\n';
			src += '  color: #fff;\n';
			src += '  font-weight: bold;\n';
			src += '  text-decoration: none;\n';
			src += '  text-align: center;\n';
			src += '  -webkit-box-shadow: 0 2px 6px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.2), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.2), inset 0 -15px 30px rgba(0,0,0,0.6);\n';
			src += '  -webkit-border-radius: 20px;\n';
			src += '  background: rgba(0,0,0,0.4);\n';
			src += '  text-shadow: 0 -1px 1px #aaa, -1px 0 1px #aaa, 1px 0 1px #000;\n';
			src += '  margin: 0 auto;\n';
			src += '}\n';
			src += '#mod-sp-header a:hover{\n';
			src += '  -webkit-box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.3), inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -15px 30px rgba(0,0,0,0.3);\n';
			src += '}\n';
			src += '#mod-sp-header a:active{\n';
			src += '  -webkit-box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px rgba(0,0,0,0.3), inset 0 1px rgba(0,0,0,0.8), inset 0 10px 20px rgba(0,0,0,0.8), inset 0 -15px 30px rgba(0,0,0,0.3);\n';
			src += '  background: rgba(0,0,0,0.5);\n';
			src += '}\n';
			src += '</style>\n';
			src += '<a id="clear_pc_view">'+unescape('%u30B9%u30DE%u30FC%u30C8%u30D5%u30A9%u30F3%u7248%u3067%u898B%u308B')+'</a>\n';

			$(el).html(src);
			$(document.body).append(el);

			$("#clear_pc_view").on("click",function(){
				$gbQuery(this).pc2sp({mode:"clear"});
			});
		}

		function isSmartphone(){
			if ( typeof window.orientation != 'undefined' || navigator.userAgent.match(/iphone|ipod|ipad|android/i) ){
				return true;
			}
			return false;
		}

		function hideAddressBar(){
			setTimeout(function(){if(window.pageYOffset==0){window.scrollTo(0,1)}},0);
		}

		function getSmartphoneUrl(url){
			return url.split('?')[0].split('#')[0];
		}

	};

	$.fn.click_counter = function(config){

		function exec(e,id){
			var t = e.target,
			url = t.href||'',
			src = t.src||'',
			target = t.target||null,
			delegate = false;

			// find href-value in parent element at once.(case of image with href in parent element)
			// for ie(ie return href-value as clicked image src value)
			if(!url || url==src){
				var closest =  $(t).closest('a');
				target = closest.attr('target');
				url    = closest.attr('href');
			}
			if(!url){ return; }

			// for webkit browser(safari,chrome, etc)
			if(window.chrome || window.opera || 'webkitAppearance' in document.documentElement.style || 'MozAppearance' in document.documentElement.style){
				delegate = true;
				if(url.match(/^(http|\/)/i)){
					e.stopPropagation();
					e.preventDefault();
				}
			}

			var href = url.match(/^(http|\/)/i)?url:src;

			var _title = '-'; if (t.firstChild ) { _title = t.firstChild.data; }
			dataLayer.push({'gbClickCategory': encodeURIComponent(id), 
					'gbClickAction': 'click', 
					'gbClickLabel' : _title + ":" + href, 
					'event':'gbClickCount'});

			jump(url,delegate,target);
		};

		function jump(url,delegate,target){
			if(!url.match(/^(http|\/)/i) || delegate===false){return;}

			switch(target){
			case '_blank':
				window.open(url);
				break;
			default:
				window.location.href = url;
				break;
			}
		};
	
		var defaults = { click_count_id: new Array() }
		var options = $.extend(defaults, config);

		for(var i=options['click_count_id'].length;--i>=0;){
			var str = options['click_count_id'][i];
			if( !str || str.length===0 ){ continue; }
			if(str.split('')[0]==='#' && str.indexOf(' ')<0 && $(str).length>0){
				$(str).on('click',function(e){exec(e,e.currentTarget.id);});
			} else if(str.split('')[0]!=='.' && str.indexOf(' ')<0 && $(document.getElementById(str)).length>0){
				$(document.getElementById(str)).on('click',function(e){exec(e,e.currentTarget.id);});
			} else if($(str).length>0){
				if(str.indexOf(' ')>-1){
					var cn='',cls = str.split(' ');
					for(var j=cls.length; --j>=0;){
						if(cls[j].substr(0,1)==='#'){cn=cls[j].slice(1); break;}
						if(cls[j].substr(0,1)==='.'){cn=cls[j].slice(1); break;}
					}
					if(cn){$(str).each(function(){
						var n = cn;
						$(this).on('click', function(e){exec(e,n);});
					});}
				} else {
					$(str).each(function(){
						$(this).on('click',function(e){exec(e,e.currentTarget.className);});
					});
				}
			}
		}
	};

	$.fn.fontResizer = function(config){
		var types = ['xx-small','x-small','small','medium','large'],
			path = location.pathname.match(/^\/[a-z0-9_-]+/),
			defaults = {
				original: 2, // types[2]
				range: 2,
				domain: document.domain,
				cookie: {key:'font-resizer'} // cookie options or false
			};

		var options = $.extend(defaults, config);
		path = '/'; //path[0];

		if( options.cookie ){
			var size = $(this).cookie({name:options.cookie.key, path:path});
			if( typeof(size)!=='undefined' && size != options.original){
				$(document.body).css('fontSize',types[parseInt(size)]);
			}
		}

		$('#'+options.id+'-large').click(function(ev){ resize(ev, 'large'); });
		$('#'+options.id+'-reset').click(function(ev){ resize(ev, 'reset'); });
		$('#'+options.id+'-small').click(function(ev){ resize(ev, 'small'); });

		function resize(ev, act){
			ev.stopPropagation();
			var size, font_size;

			if( options.cookie ){
				size = $(this).cookie({name:options.cookie.key, path:path});
			}
			size = (typeof(size)==='undefined') ? options.original : parseInt(size);

			switch(act){
			case 'large':
				if( ++size > options.original+options.range ){ return false; }
				break;
			case 'small':
				if( --size < options.original-options.range ){ return false; }
				break;
			case 'reset':
			default:
			}
			if( act==='reset' || size==options.original ){
				size = font_size = '';
			} else {
				font_size = types[size];
			}

			if( options.cookie ){
				var d =new Date();d.setTime(0);
				// for clear old cookie
				//$(this).cookie({name:options.cookie.key, domain:'goo.ne.jp', path:'/', value:'', expire:d.toGMTString()});

				var cookie = {name:options.cookie.key, domain:options.domain, path:path, value:size, expire:d.toGMTString()};
				if( size!==''){
					var d =new Date();d.setTime(2147483647000);
					cookie.expire = d.toGMTString();
				}
				$(this).cookie(cookie);
				if(size==='reset'){ location.reload(); }
			}

			$(document.body).css('fontSize',font_size);
			return false;
		}
	};

	$.fn.getReTargeting = function(){
		if( typeof goo_re_targeting_request==='undefined'){ return; }
		var url = goo_re_targeting_request.split('?');
		if(url[1]){
			var params = url[1].split('&'), types;
			for(var i=0,l=params.length; i<l; i++){
				if( params[i].indexOf('type') !== -1){
					types = params[i].split('='); break;
				}
			}
		}

		$.ajax({
			type: 'GET',
			url: url[0],
			data: url[1],
			dataType: 'jsonp',
			jsonp: 'callback', // req param name
			jsonpCallback: 'xlis_srt_result', // req func name
			crossDomain: true,
			scriptCharset: 'utf-8',
			isModified:	true,
			success: function(data,ts,xhr){
				$.fn.setReTargeting(data);
			},
			error: function(ret, text, err){
			//	alert(err.message);
			}
		});

	};

	$.fn.setReTargeting = function(data){
		if( !data.result ){return false;}
		$.goo_re_targeting_list = data.result;
		$('.goo_re_targeting').each(function(){
			var target = this;
			match = goo_re_targeting.shift();
			if(!match){return;}
			target.innerHTML = goo_re_targeting_html(match[0],match[1]);
		});
	};

	$gbQuery(this).getReTargeting();

	$.fn.getAreaMatch = function(){
		if( typeof goo_area_match_request==='undefined'){ return; }
		var url = goo_area_match_request.split('?');
		if(url[1]){
			var params = url[1].split('&'), types;
			for(var i=0,l=params.length; i<l; i++){
				if( params[i].indexOf('type') !== -1){
					types = params[i].split('='); break;
				}
			}
		}

		$.ajax({
			type: 'GET',
			url: url[0],
			data: url[1]||'',
			dataType: types[1]||'json',
			jsonp: 'callback', // req param name
			jsonpCallback: '$gbQuery.fn.setAreaMatch', // req func name
			crossDomain: true,
			scriptCharset: 'utf-8',
			isModified:	true,
			success: function(data,ts,xhr){
				if(this.dataType==='json'&&data.pop.detail){ $.fn.setAreaMatch(data); }
			},
			error: function(ret, text, err){
			//	alert(err.message);
			}
		});
	}

	$.fn.setAreaMatch = function(data){
		if( !data.pop.detail ){return false;}
		$.goo_area_match_list = data.pop.detail;
		$('.goo_area_match').each(function(){
			var target = this,
				match = goo_area_match.shift();
			if(!match){return;}
			target.innerHTML = goo_area_match_html(match[0],match[1]);
		});
	};

	$.fn.change_captcha = function() {
		$.get('/popup/blog/gen_one_time_id', {},
			function(one_time_id) {
				document.send_message_form.one_time_id.value = one_time_id;
				$('#captcha img').attr('src', '/popup/blog/captcha?one_time_id='+one_time_id);
			});
	};

	/* ------------------------------------------------------------------------
		Class: prettyPopin
		Use: Alternative to popups
		Author: Stephane Caron (http://www.no-margin-for-errors.com)
		Version: 1.3
	------------------------------------------------------------------------- */
	$.fn.prettyPopin = function(settings) {
		var _followScroll = false;
		var _readyBound = false;

		settings = jQuery.extend({
			modal : false, /* true/false */
			width : false, /* false/integer */
			height: false, /* false/integer */
			opacity: 0.5, /* value from 0 to 1 */
			animationSpeed: 'fast', /* slow/medium/fast/integer */
			followScroll: true, /* true/false */
			loader_path: 'images/prettyPopin/loader.gif', /* path to your loading image */
			callback: function(){} /* callback called when closing the popin */
		}, settings);

		function bindReady(){ // To bind them only once
			if(_readyBound) return;
			_readyBound = true;
			$(window).scroll(function(){ _centerPopin(); });
			$(window).resize(function(){ _centerPopin(); });
		};
		bindReady();
		
		return this.each(function(){
			var popinWidth;
			var popinHeight;
			var $c;
		
			$(this).click(function(){
				buildoverlay();
				buildpopin();
			
				// Load the content
				$.get($(this).attr('href'),function(responseText){
					$('.prettyPopin .prettyContent .prettyContent-container').html(responseText);
				
					// This block of code is used to calculate the width/height of the popin
					popinWidth = settings.width || $('.prettyPopin .prettyContent .prettyContent-container').width() + parseFloat($('.prettyPopin .prettyContent .prettyContent-container').css('padding-left')) + parseFloat($('.prettyPopin .prettyContent .prettyContent-container').css('padding-right'));
					$('.prettyPopin').width(popinWidth);
					popinHeight = settings.height || $('.prettyPopin .prettyContent .prettyContent-container').height() + parseFloat($('.prettyPopin .prettyContent .prettyContent-container').css('padding-top')) + parseFloat($('.prettyPopin .prettyContent .prettyContent-container').css('padding-bottom'));
					$('.prettyPopin').height(popinHeight);
				
					// Now reset the width/height
					$('.prettyPopin').height(45).width(45);
				
					displayPopin();
				});
				return false;
			});

			var displayPopin = function() {
				var scrollPos = _getScroll();

				projectedTop = ($(window).height()/2) + scrollPos['scrollTop'] - (popinHeight/2);
				if(projectedTop < 0) {
					projectedTop = 10;
					_followScroll = false;
				}else{
					_followScroll = settings.followScroll;
				};

				$('.prettyPopin').animate({
					'top': projectedTop,
					'left': ($(window).width()/2) + scrollPos['scrollLeft'] - (popinWidth/2),
					'width' : popinWidth,
					'height' : popinHeight
				},settings.animationSpeed, function(){
					displayContent();
				});
			};
		
			var buildpopin = function() {
				$('body').append('<div class="prettyPopin"><a href="#" id="b_close" rel="close">Close</a><div class="prettyContent"><img src="'+settings.loader_path+'" alt="Loading" class="loader" /><div class="prettyContent-container"></div></div></div>');
				$c = $('.prettyPopin .prettyContent .prettyContent-container'); // The content container
			
				$('.prettyPopin a[rel=close]:eq(0)').click(function(){ closeOverlay(); return false; });
			
				var scrollPos = _getScroll();
			
				// Show the popin
				$('.prettyPopin').width(45).height(45).css({
					'top': ($(window).height()/2) + scrollPos['scrollTop'],
					'left': ($(window).width()/2) + scrollPos['scrollLeft']
				}).hide().fadeIn(settings.animationSpeed);
			};
		
			var buildoverlay = function() {
				$('body').append('<div id="overlay"></div>');
			
				// Set the proper height
				$('#overlay').css('height',$(document).height());
			
				// Fade it in
				$('#overlay').css('opacity',0).fadeTo(settings.animationSpeed,settings.opacity);
			
				if(!settings.modal){
					$('#overlay').click(function(){
						closeOverlay();
					});
				};
			};
		
			var displayContent = function() {
				$c.parent().find('.loader').hide();
				$c.parent().parent().find('#b_close').show();
				$c.fadeIn(function(){
					// Focus on the first form input if there's one
					$(this).find('input[type=text]:first').trigger('focus');

					// Check for paging
					$('.prettyPopin a[rel=internal]').click(function(){
						$link = $(this);

						// Fade out the current content
						$c.fadeOut(function(){
							$c.parent().find('.loader').show();

							// Submit the form
							$.get($link.attr('href'),function(responseText){
								// Replace the content
								$c.html(responseText);

								_refreshContent($c);
							});
						});
						return false;
					});

					// Submit the form in ajax
					$('.prettyPopin form').bind('submit',function(){
						$theForm = $(this);
						// Fade out the current content
						$c.fadeOut(function(){
							$c.parent().find('.loader').show();
						
							// Submit the form
							$.post($theForm.attr('action'), $theForm.serialize(),function(responseText){
								// Replace the content
								$c.html(responseText);

								_refreshContent($c);
							});
						});
						return false;
					});
				});
				$('.prettyPopin a[rel=close]:gt(0)').click(function(){ closeOverlay(); return false; });
				$('input[rel=close]').click(function(){ closeOverlay(); return false; });
			};
	
			var _refreshContent = function(){
				var scrollPos = _getScroll();

				if(!settings.width)	popinWidth = $c.width() + parseFloat($c.css('padding-left')) + parseFloat($c.css('padding-right'));
				if(!settings.height) popinHeight = $c.height() + parseFloat($c.css('padding-top')) + parseFloat($c.css('padding-bottom'));

				projectedTop = ($(window).height()/2) + scrollPos['scrollTop'] - (popinHeight/2);
				if(projectedTop < 0) {
					projectedTop = 10;
					_followScroll = false;
				}else{
					_followScroll = settings.followScroll;
				};

				$('.prettyPopin').animate({
					'top': projectedTop,
					'left': ($(window).width()/2) + scrollPos['scrollLeft'] - (popinWidth/2),
					'width' : popinWidth,
					'height' : popinHeight
				}, settings.animationSpeed,function(){
					displayContent();
				});
			};
		
			var closeOverlay = function() {
				$('#overlay').fadeOut(settings.animationSpeed,function(){ $(this).remove(); });
				$('.prettyPopin').fadeOut(settings.animationSpeed,function(){ $(this).remove(); settings.callback() });
			};
		});
	
		function _centerPopin(){
			if(!_followScroll) return;

			// Make sure the popin exist
			if(!$('.prettyPopin')) return;
			
			var scrollPos = _getScroll();

			if(jQuery.support.checkOn && 
			   jQuery.support.noCloneEvent && 
			   !window.globalStorage && 
			   !jQuery.support.cors) {
			// $.browser.operaは非推奨API
			//if($.browser.opera) {
				windowHeight = window.innerHeight;
				windowWidth = window.innerWidth;
			}else{
				windowHeight = $(window).height();
				windowWidth = $(window).width();
			};

			projectedTop = ($(window).height()/2) + scrollPos['scrollTop'] - ($('.prettyPopin').height()/2);
			if(projectedTop < 0) {
				projectedTop = 10;
				_followScroll = false;
			}else{
				_followScroll = true;
			};

			$('.prettyPopin').css({
				'top': projectedTop,
				'left': ($(window).width()/2) + scrollPos['scrollLeft'] - ($('.prettyPopin').width()/2)
			});
		};
	
		function _getScroll(){
			scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
			return {scrollTop:scrollTop,scrollLeft:scrollLeft};
		};
	};

	$.fn.inhebitContext = function(){
		var bodyimg = $('.entry-body img'),
			imgsel = ['.etBody img','#entry_text img','.etImage','.thumbnail','.imglist img','.custom-follow-table2 img',
						'.mod-entry-image-thumbnail img','.articleheadimage img','.img_frame img','#jacketbg'];
		$(imgsel).each(function(){
			Array.prototype.push.apply(bodyimg, $(this.toString()));
		});
		if ( !bodyimg.length ){ return false;}
		var username = location.pathname.split('/')[1];
		$(bodyimg).each(function(){
			var re = /\.goo\.ne\.jp\/(?:user_image|thumbnail|cnv)\//;
			if( !this.src || !this.src.match(re) ){ return; }
			$(this).on('contextmenu', function(e){return false;});
			$(this).on('dragstart', function(){return false;});
			// ie && ff
			if ( document.uniqueID || 'MozAppearance' in document.documentElement.style ){
				if ( $(this).parent().prop('tagName')==='A'){
					$(this).parent().on('dragstart', function(){return false;});
				}
			}
		});
	};
	if(typeof CLICK_CONTROL!='undefined' && CLICK_CONTROL){$gbQuery(this).inhebitContext();}

	$gbQuery(this).getAreaMatch();

	// count target
	var default_click_count = [
		 '#mod-global-header-l'
		,'#mod-global-header-m'
	//	,'#mod-global-footer'
		,'#mod-advertising'
		,'#mod-relation-popular'
		,'.mod-relation-cat'
		,'.mod-relation-tag'
		,'#mod-login'
		,'#mod-goo-recommends'
		,'#mod-powered-by'
		,'#mod-profile-tw'
		,'#mod-profile-fb'
		,'#selfrecommendshare'
		,'#genre_cat'
		,'#mod-entry-image-more'
		,'.mod-entry-image-thumbnail'
		,'.mod-entry-image-text'
		,'#imglist'
		,'.imglist-menu'
		,'#ranking_bnr_rkg'
		,'#ranking_bnr_mura'
		,'.theme-tit2'
	];
	if( typeof click_count_id!=='undefined' && click_count_id.length>0 ){
		for(var i=click_count_id.length; --i>=0;){
			default_click_count.push(click_count_id[i]);
		}
	}
	$gbQuery(this).click_counter({click_count_id: default_click_count});

	$gbQuery(this).blogPch({bid: window.BID});
	$gbQuery(this).pc2sp({mode:"add"});
	$gbQuery(this).sDispatch({id:"global_header_search"});

	if( $('#font-resizer').length>0 ){
		$gbQuery(this).fontResizer({id: 'font-resizer'});
	}
	if( $('#mod-message').length>0 ){
		$gbQuery("a[rel^='prettyPopin']").prettyPopin({
			modal : true,
			width : 380,
			height: false,
			loader_path: '/img/static/admin/imgmanage/icon-imgupload-40.gif'
		});
	}
	if( $('#mod-gfooter-bottom').length>0 ){
		$gbQuery(this).follow({
			show_counter: true
		});
		setTimeout(function(){$('#mod-gfooter-bottom').fadeIn();},100);
	}

});
