/*!
* jQuery Mobile 1.4.5
* Git HEAD hash: 68e55e78b292634d3991c795f06f5e37a512decc <> Date: Fri Oct 31 2014 17:33:30 UTC
* http://jquerymobile.com
*
* Copyright 2010, 2014 jQuery Foundation, Inc. and othercontributors
* Released under the MIT license.
* http://jquery.org/license
*
*/

// このプログラムは上記のようにライセンスされているプログラムをMIT licenseに従い改造したものです。
// https://opensource.org/licenses/mit-license.php

// ただし、元の「KISS ～Kishi-Kho Information Serving System～」に対しては、改造・再配布の許可を取っていません。

(function () {

	function addDecorativeClass(selector,addedClass,switchingSelector=selector,switchingAttr="data-theme") {
		console.log(selector+":"+switchingAttr);
		$(selector).each(function() {
			if(switchingSelector==selector){
				if($(this).attr(switchingAttr)=="b"){
					$(this).addClass(addedClass+"-b");
				}else{
					$(this).addClass(addedClass+"-a");
				}
			}else{
				if($(switchingSelector).attr(switchingAttr)=="b"){
					$(this).addClass(addedClass+"-b");
				}else{
					$(this).addClass(addedClass+"-a");
				}
			}
		});
	}
	function AdjustPageHeight(liCount) {
		var uiCount = $("[data-role=collapsible-set]").children().length;
		var uiHeight = $("[data-role=collapsible] :first-child").css("height");
		uiHeight = Number(uiHeight.slice(0, uiHeight.indexOf("px")));
		// var liHeight=$("[data-role=collapsible] li").css("height");
		// liHeight=liHeight.slice(0,liHeight.indexOf("px"));
		var panelPaddingTop = $("[data-role=panel]>*").css("padding-top");
		panelPaddingTop = Number(panelPaddingTop.slice(0, panelPaddingTop.indexOf("px")));
		var panelPaddingBottom = $("[data-role=panel]>*").css("padding-bottom");
		panelPaddingBottom = Number(panelPaddingBottom.slice(0, panelPaddingBottom.indexOf("px")));
		var panelHeight = uiHeight * (uiCount + liCount) + panelPaddingTop + panelPaddingBottom;
		$("[data-role=page]").css("min-height", panelHeight + "px");
	}

	$("html").addClass("ui-mobile");
	$("body").addClass("ui-mobile-viewport ui-overlay-a");
	$("body>*").wrapAll($('<div class="ui-page ui-page-theme-a ui-page-footer-fixed ui-page-active" data-role="page" tabindex="0"></div>'));

	// フッター
	$("[data-role=footer]").addClass("ui-footer ui-bar-inherit ui-footer-fixed slideup");
	// $("[data-role=buttonToPanel]").addClass("ui-btn ui-btn-inline");
	// $("[data-role=buttonToTop]").addClass("ui-btn ui-btn-inline");

	// リストパネル（サイドバー）へのclass付与
	$("[data-role=panel]").addClass("ui-panel ui-panel-position-left ui-panel-display-overlay ui-panel-animate ui-panel-closed");
	addDecorativeClass("[data-role=panel]","ui-body");
	
	$("[data-role=collapsible-set]").addClass("ui-collapsible-set ui-corner-all");
	addDecorativeClass("[data-role=collapsible-set]","ui-group-theme");
	$("[data-role=collapsible-set]").wrap($('<div class="ui-panel-inner"></div>'));

	

	// リストパネルのおのおのの項目
	$("[data-role=collapsible]").addClass("ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-collapsible-collapsed");
	$("[data-role=collapsible]:first-child").addClass("ui-first-child");
	$("[data-role=collapsible]:last-child").addClass("ui-last-child");

	// 見出しに対する操作
	$("[data-role=collapsible]>*:not([data-role=listview])").addClass("ui-collapsible-heading ui-collapsible-heading-collapsed");
	$("[data-role=collapsible]>*:not([data-role=listview])").wrapInner($('<span href="#" class="ui-collapsible-heading-toggle ui-btn ui-icon-arrow-d ui-btn-icon-left"></span>'));
	addDecorativeClass(".ui-collapsible-heading-toggle","ui-btn","[data-role=collapsible-set]");

	// リストパネル内の折り畳まれている部分
	$("[data-role=listview]").wrap($('<div class="ui-collapsible-content ui-collapsible-content-collapsed"></div>'));
	addDecorativeClass(".ui-collapsible-content","ui-body","[data-role=collapsible-set]","data-content-theme");
	$("[data-role=listview]").addClass("ui-listview");
	$("[data-role=listview] li a").addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
	$("[data-role=listview] :first-child").addClass("ui-first-child");
	$("[data-role=listview] :last-child").addClass("ui-last-child");
	addDecorativeClass("[data-role=listview]","ui-group-theme");

	// HTML上の初期指定に従い該当する項目を開く
	$("[data-collapsed=false]").toggleClass("ui-collapsible-collapsed");
	$("[data-collapsed=false]").children(":first-child").toggleClass("ui-collapsible-heading-collapsed");
	$("[data-collapsed=false]").children(":first-child").find("span").toggleClass("ui-icon-arrow-d ui-icon-arrow-u");
	$("[data-collapsed=false]").children(":not(:first-child)").toggleClass("ui-collapsible-content-collapsed");

	AdjustPageHeight($("[data-collapsed=false]").find("li").length);

	
	// リストパネル見出しクリック時
	$("[data-role=collapsible]").on("click", function () {

		// クリックした見出しが現状閉まっているとき
		if ($(this).hasClass("ui-collapsible-collapsed")) {
			// 見出しを開く前に、一旦全ての見出しを閉める
			$("[data-role=collapsible]").addClass("ui-collapsible-collapsed");
			$("[data-role=collapsible]").children(":first-child").addClass("ui-collapsible-heading-collapsed");
			$("[data-role=collapsible]").children(":first-child").find("span").addClass("ui-icon-arrow-d");
			$("[data-role=collapsible]").children(":first-child").find("span").removeClass("ui-icon-arrow-u");
			$("[data-role=collapsible]").children(":not(:first-child)").addClass("ui-collapsible-content-collapsed");
		}
		$(this).toggleClass("ui-collapsible-collapsed");
		$(this).children(":first-child").toggleClass("ui-collapsible-heading-collapsed");
		$(this).children(":first-child").find("span").toggleClass("ui-icon-arrow-d ui-icon-arrow-u");
		$(this).children(":not(:first-child)").toggleClass("ui-collapsible-content-collapsed");

		// 今見出しを開いたか否か
		if (!$(this).hasClass("ui-collapsible-collapsed")) {
			// リストパネルに合わせて全体のmin-heightを調整
			var liCount = $(this).find("li").length;
			AdjustPageHeight(liCount);
		} else {
			$("[data-role=page]").css("min-height", "calc(100vh - 49px)");
		}

	});

	// スマホ画面時に「部屋を移動する」サイドバーの表示・非表示を切り替える
	$('html').on("click", function () {
		// console.log("C");

		var isOnButton = false;
		var isOnPanel = false;
		$(":hover").each(function () {
			var dataRoll = $(this).attr("data-role");

			// 「部屋を移動する」ボタンをクリックしたか（＝今そのボタンの上にカーソルがあるか）を確認
			if (dataRoll == "buttonToPanel") {
				isOnButton = true;
				// console.log("Button");
			}
			// リストパネル上をクリックしたか（＝今そのボタンの上にカーソルがあるか）を確認
			if (dataRoll == "panel") {
				isOnPanel = true;
				// console.log("panel");
			}
		});

		// classの操作
		var isPanelOpened = $("[data-role=panel]").hasClass("ui-panel-open");
		if (!isPanelOpened && isOnButton) {
			$("[data-role=panel]").addClass("ui-panel-open");
			$("[data-role=panel]").removeClass("ui-panel-closed");
		} else if (isPanelOpened && !isOnPanel) {
			$("[data-role=panel]").removeClass("ui-panel-open");
			$("[data-role=panel]").addClass("ui-panel-closed");
		}
	});
}());