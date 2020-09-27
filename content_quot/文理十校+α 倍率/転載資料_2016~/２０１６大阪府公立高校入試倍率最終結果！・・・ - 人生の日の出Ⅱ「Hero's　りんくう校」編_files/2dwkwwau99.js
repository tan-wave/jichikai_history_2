(function(){

  // ----------------------------------
  // extract ids from cookies
  // ----------------------------------
  var nguserid = document.cookie.match(/NGUserID=([^\;]+);/);
  if(nguserid){
    nguserid = nguserid[1];
  }
  var xuuid = document.cookie.match(/XUUID=([^\;]+);/);
  if(xuuid){
    xuuid = xuuid[1];
  }

  // ----------------------------------
  // id_map(TD)
  // ----------------------------------
  if(xuuid){
    var key = '5804/ce5cc8a20566b9da39bc7dd85267b1809999da69';
    var db    = 'xlisting';
    var table = 'id_map';
    var url   = 'https://in.treasuredata.com/postback/v3/event/' + db + '/' + table + '?td_write_key=' + key + '&td_global_id=td_global_id' + '&xuuid=' + xuuid + '&nguserid=' + nguserid;
    (new Image()).src = url;
  }

})();
