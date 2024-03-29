var list_url = [];
var list_title = [];
var list_summary = [];

var list_position = -1;//現在位置、進むで+1、戻るで-1、0始まり

function draw() {
	var html_fig_img = document.getElementById("fig_img");
	var html_fig_title = document.getElementById("fig_title");

	//画像データの代入
	html_fig_img.src = list_url[list_position];
	html_fig_title.innerHTML = list_summary[list_position];
}

//画像リンククリック時
function click_img_link(img_original_name) {

	for (let i = 0; i < img_property.length; i++) {
		if (img_property[i][0]==img_original_name) {
			add_img(i);
			break;
		}
	}
}
// ギャラリーページのみ、左右のボタンクリックで移動
function move_previous(){
	for (let i = 0; i < img_property.length; i++) {
		if (img_property[i][1]==list_url[list_position]) {
			if (i>=1){
				add_img((i-1))
			}
			break;
		}
	}
}
function move_following(){
	for (let i = 0; i < img_property.length; i++) {
		if (img_property[i][1]==list_url[list_position]) {
			if (i < img_property.length - 1){
				add_img((i+1))
			}
			break;
		}
	}
}

//画像の追加（ログの破壊を伴う）
function add_img(i) {

	let img_url = img_property[i][1];
	let img_title = img_property[i][2];
	let img_summary = img_property[i][3];

	// list_position - 1 番目（現在表示している要素）までを残し、残りは破棄する
	list_position++;
	list_url.length = list_position;
	list_title.length = list_position;
	list_summary.length = list_position;

	// list_position番目に要素を入れる(番号の0がlengthの1と対応するため)
	list_url.push(img_url);
	list_title.push(img_title);
	list_summary.push(img_summary);

	draw();
}


//figcaptureボタンクリック時
function back() {
	if (list_position > 0) {
		list_position--;
		draw();
	}
}
function forward() {
	if (list_url.length - 1 > list_position) {
		list_position++;
		draw();
	}
}
function newpage() {
	var html_fig_img = document.getElementById("fig_img");
	/*初期状態での作動防止*/
	if (html_fig_img.src != "") {
		window.open(html_fig_img.src);
	}
}
