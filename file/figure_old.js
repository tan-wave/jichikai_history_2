var url = [];
var title = [];
var url_po = -1;//現在位置、進むで+1

var favorite_url = [];
var favorite_title = [];

function draw(){
	var fig_img = document.getElementById("fig_img");
	var fig_title = document.getElementById("fig_title");
	var judgment=false;
	fig_img.src = url[url_po];
	fig_title.innerHTML = title[url_po];
	if(fig_img.src != ""){
		for(i=0 ; i<favorite_url.length ; i++){
			if (fig_img.src==favorite_url[i]){
				judgment=true;
				break;
			}
		}
		if (judgment){
			document.getElementById("favorite_img_star").src="./icon/star-full.svg";
		}else{
			document.getElementById("favorite_img_star").src="./icon/star-empty.svg";
		}
	}
}

//画像リンククリック時
function add_img(url_gen,exp_txt){
	url.length = url_po + 1;
	title.length = url_po + 1;
	url_po ++;
	url.push("img/"+ url_gen);
	title.push(exp_txt);

	draw();
	
}

//ボタンクリック時
function back(){
	if(url_po > 0){
		url_po --;
		draw();
	}
}
function forward(){
	if(url.length-1 > url_po){
		url_po ++;
		draw();
	}
}
function newpage(){
	var fig_img = document.getElementById("fig_img");
	/*初期状態での作動防止*/
	if(fig_img.src != ""){
		window.open(fig_img.src);
	}
}

function favorite(){
	var fig_img = document.getElementById("fig_img");
	var judgment = true;
	/*初期状態での作動防止*/
	if(fig_img.src != ""){
		for(i=0 ; i<favorite_url.length ; i++){
			if (fig_img.src==favorite_url[i]){
				judgment=false;
				break;
			}
		}
		if (judgment){
			favorite_url[favorite_url.length] = fig_img.src;
			favorite_title[favorite_title.length] = fig_title.innerHTML;
			document.getElementById("favorite_img_star").src="./icon/star-full.svg";
		}else{
			favorite_url.splice(i,1);
			favorite_title.splice(i,1);
			document.getElementById("favorite_img_star").src="./icon/star-empty.svg";
		}
	}
}

function favorite_list(){
	var favorite_list = document.getElementById("fig_favorite_list");
	if(favorite_list.style.display == "none"){
		favorite_list.style.display = "block";
	}else{
		favorite_list.style.display = "none";
	}
}