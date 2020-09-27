//global vars
var ao_9033e924a54;    //for audienceOne

(function(){

window.bta = {
    cookieDomain : 'domain=.goo.ne.jp; ',

    pixelingSites : [
        /^https?:\/\/search\.goo\.ne\.jp\/web\.jsp\?/,
        /^https?:\/\/green\.search\.goo\.ne\.jp\/search\?/,
        /^https?:\/\/wsearch\.ocn\.ne\.jp\/ocn\.jsp\?/,
        /^https?:\/\/www\.goo\.ne\.jp\/(\?TH\=[^\/]+)?$/,
        /^https?:\/\/www\.goo\.ne\.jp\/green\//,
        /^https?:\/\/nttxstore\.jp\/_II_/,
        /^https?:\/\/travel\.goo\.ne\.jp\/(ab|ab_hotel)\//,
        /^https?:\/\/(oshiete|autos|blog|eco|green|house|sim\.oshiete|fortune|news|kids|baby|wedding|health|money|product|postcode)\.goo\.ne\.jp/
    ],

    hasSerializableParameters : {    //when query strings of pixeling is serializable,set true.
        "marketOne"    : false,
        "goo-cookie"   : true,
        "scaleOut"     : false,
        "logicad"      : false,
        "xl_dmp"       : true,
        "adap.tv"      : false,
        "dbm"          : false,
        "crm-cookie"   : false,
        "tubeMogul"    : false
    },

    platformsAndFunctions : {

        "marketOne" : function(receivedObj) {
            var receivedStrings;
            
            receivedStrings = receivedObj.toString();
            (new Image()).src = '//m.one.impact-ad.jp/pix?' + receivedStrings + '&t=i';
        },

        "goo-cookie" : function(array) {
            var drawnArray = [];
            var datedArray = [];
            var connectedArray = [];
            var xdmpMargedArray = {};
            var regulatedArray = [];
            var serializedArray = [];
            var newerArray = [];
            var limitedNumberArray = [];
            var generatedValue;
            var currentEpoch;

            if (array.length >= 11) {
                drawnArray = draw(array);
                datedArray = attachDate(drawnArray);
            } else {
                datedArray = attachDate(array);
            }
            connectedArray = connectExisting(datedArray);

            if (connectedArray === "error") {
                return;
            }
            xdmpMargedArray = margeXDMPCookie(connectedArray);
            regulatedArray = regulate(xdmpMargedArray);

            if (regulatedArray.length === 0) {
                return;
            }
            serializedArray = serialize(regulatedArray);

            newerArray = eraseOld(serializedArray);
            limitedNumberArray = newerArray.slice(0, 10);
            generatedValue = limitedNumberArray.toString();
            generatedValue = generatedValue.replace(/\,/g, "|");
            currentEpoch = bta.getCurrentUTC();
            document.cookie = 'ATA=' + generatedValue + '; expires=' +
                    (new Date(currentEpoch + 86400000 * 30)).toUTCString() + '; ' + bta.cookieDomain + 'path=/';

            function draw(array) {
                var removeLength;
                var rndRemovePos;

                removeLength = array.length - 10;
                rndRemovePos = Math.floor(Math.random() * 11);
                array.splice(rndRemovePos, removeLength);
                return array;
            }

            function attachDate(array){    //even when all values are invalid,returns empty newArray
                var i;
                var newArray = [];

                for (i=0; i < array.length; i++) {
                    var valueOfArray = [];

                    if (valueOfArray = array[i].match(/^id\=(.+)$/)) {
                        valueOfArray = valueOfArray[1];
                        newArray.push(valueOfArray+"_"+ bta.getCurrentYMD());
                    }
                }
                return newArray;
            }

            function connectExisting(array){
                var matchedString = [];
                var existingCookieStr;
                var existingCookieArray = [];
                var newCookieArray;

                try {
                    if (matchedString = document.cookie.match(/(?:^|;\s+)ATA=([^;\s]+)/)) {
                        existingCookieStr = matchedString[1];    //ex. "A1_20140208|A2_20140210"
                        existingCookieArray = existingCookieStr.split("|");
                        newCookieArray = array.concat(existingCookieArray);    //connection as array
                    } else {    //when no previous cookie
                        newCookieArray = array;
                    }
                    return newCookieArray;
                } catch(e) {
                    return "error";
                }
           }

            function margeXDMPCookie(array) {
                var xdmpVal;
                var xdmpArr;
                var newArr;

                xdmpVal = bta.getCookie('XDMP_ATA');

                if (xdmpVal === 0) return array;
                xdmpArr = xdmpVal.split('|');
                newArr = xdmpArr.concat(array);
                return newArr;
            }

            function regulate(array){
                var i;
                var newArray = [];
                var regulatedValue;

                for (i=0; i < array.length; i++) {
                    if (regulatedValue = array[i].match(/^[^\_]+_\d{8}$/)) {
                        newArray.push(regulatedValue);
                    }
                }
                return newArray;
            }

            function serialize(array){
                var i;
                var regulatedData = {};
                var newArray = [];
                var eachValue;

                for (i=0; i < array.length; i++) {
                    eachValue = array[i].toString().match(/^([^\_]+)_\d{8}$/);

                    if (!(eachValue[1] in regulatedData)) {
                        regulatedData[eachValue[1]] = true;
                        newArray.push(array[i]);
                    }
                }
                return newArray;
            }

            function eraseOld(array){
                var i;
                var cookieYMD;
                var cookieEpoch;

                for (i=array.length-1; i>=0; i--) {
                    cookieYMD = array[i].toString().match(/^.+_(\d{4})(\d{2})(\d{2})$/);
                    cookieEpoch = Date.parse(cookieYMD[1]+"\/"+cookieYMD[2]+"\/"+cookieYMD[3]);

                    if ((currentEpoch - cookieEpoch) > 86400000*30) {
                        array.pop();
                    } else {
                        break;
                    }
                }
                return array;
            }
        },

        "scaleOut" : function(receivedObj) {
            var receivedStrings;
            
            receivedStrings = receivedObj.toString();
            (new Image()).src = 'https://ssl.socdm.com/sa/img?' + receivedStrings + '&t=2';
        },
            
        "logicad" : function(receivedObj) {
            var receivedStrings;
            var receivedParameter;
            var rpValue;
            var smQuery;
            var staticSmnAdvertiserId = "00001674";
            var params;
            var logicadFrame;
            var logicadWindow;
            var logicadDocument;

            receivedStrings = receivedObj.toString();
            receivedParameter = receivedStrings.match(/^rp\=(.*)/);
            
            if (!!receivedParameter) {
                rpValue = receivedParameter[1];
            }
            
            if (rpValue === 'green_eco') {
                smQuery = 'advertiser_id=' + staticSmnAdvertiserId + '&rp=' + rpValue;
            } else {
                params = rpValue.match(/(.+?)_(.+)/);
                
                if (!!params) {
                    smQuery = 'advertiser_id=' + params[1] + '&rp=' + params[2];
                }
            }
            
            logicadFrame = document.createElement('iframe');
            logicadFrame.id = 'logicadFrame';
            logicadFrame.width = '0';
            logicadFrame.height = '0';
            logicadFrame.frameBorder = '0';
            logicadFrame.style.display = 'none';
            document.body.appendChild(logicadFrame);
            logicadWindow = logicadFrame.contentWindow;
            logicadDocument = logicadWindow.document;
            logicadDocument.open();
            logicadDocument.write('<script type="text/javascript" src=' + '"//tag.ladsp.com/pixel_p?' + smQuery + '&referer=' + encodeURIComponent(document.referrer.toString()) + '"' + '>\x3c/script>');
            logicadDocument.close();
        },

        "xl_dmp" : function(receivedObj) {
            var receivedStrings;
            var nguserid;
            var goouidParam;
            var title;
            var ref;
            var scriptElm;
            var userAttributes;

            receivedStrings = !!receivedObj ? '&' + receivedObj.toString() : '';
            receivedStrings = receivedStrings.replace(/,/, '&');

            nguserid = bta.getCookie("NGUserID");
            goouidParam = nguserid !== 0 ? '&goouid=' + nguserid : '';
            userAttributes = '&' + bta.getUserAttributes();

            if (bta.isPC) {
                title = document.title.match(/(^.*)(?:\s-\s)/);
                title = title ? title : document.title.match(/(^.*)(?:\s\|\s)/);
            } else {
                title = document.title.match(/(^.*)(?:\s\|\s)/);
            }
            title = (!!title && !!title[1]) ? title[1] : document.title;
            title = encodeURIComponent(title);
            ref = encodeURIComponent(document.referrer);
            scriptElm = bta.contentDocument.createElement("script");
            scriptElm.type = 'text/javascript';
            scriptElm.async = 'async';
            scriptElm.defer = 'defer';
            var altid = '';
            var xuuid = bta.getCookie('XUUID');
            if ( ( bta.isIPhone || bta.isIPad ) && xuuid !== 0 ){
                altid = '&altid=' + xuuid;
            }

            scriptElm.src = '//pulsar.xlisting.jp/xsync?ds=1F4AE5F7A68792F&ap=xdmp' + receivedStrings + userAttributes + goouidParam + '&title=' + title + '&ref_url=' + ref + altid +'&ru='+ encodeURIComponent(bta.hrefLocating);
            bta.contentHead.appendChild(scriptElm);
        },

        "adap.tv" : function(receivedObj) {
            var receivedStrings;
            
            receivedStrings = receivedObj.toString();
            (new Image()).src = '//segments.adap.tv/data/?p=nttresonant&type=gif&add=true&' + receivedStrings;
        },

        "dbm" : function(receivedObj) {
            var receivedStrings;
            var param1;
            var param2;
            var imgElm;

            if (!receivedObj) return;
            receivedStrings = receivedObj.toString();
            param1 = receivedStrings.match(/cat=([^@]+)/);
            param1 = !!param1 ? param1[1] : '';
            param2 = receivedStrings.match(/@(.+)/);
            param2 = !!param2 ? param2[1] : '';
            imgElm = bta.contentDocument.createElement('img');
            imgElm.src = '//ad.doubleclick.net/ddm/activity/src=' + param1 + ';type=invmedia;cat=' + param2 + ';dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=1';
            imgElm.width = '0';
            imgElm.height = '0';
            imgElm.border = '0';
            imgElm.style.display = 'none';
            bta.contentBody.appendChild(imgElm);
        },

        "crm-cookie" : function(receivedObj) {
            var receivedStrings;
            var param;
            var currentEpoch;
            var MAX_NUMBER;

            receivedStrings = receivedObj.toString();

            if (receivedStrings.match(/=$/)) return;    // when value is empty
            param = receivedStrings.split(',');
            MAX_NUMBER = 20;

            if (param.length > MAX_NUMBER) {
                param = param.slice(0, MAX_NUMBER);
            }
            param = param.join('|');
            param = param.toUpperCase();
            currentEpoch = bta.getCurrentUTC();
            document.cookie = param + '; expires=' +
                    (new Date(currentEpoch + 86400000 * 365)).toUTCString() + '; ' + bta.cookieDomain + 'path=/';
        },

        "tubeMogul" : function(receivedObj) {
            var param;
            var target;
            var imgElm;

            if (receivedObj) {
                param = receivedObj.toString();
                target = bta.contentBody;
            } else {
                param = 'sid=Z7wZxolWDoTqv6YX6jc6';
                target = document.getElementsByTagName('body')[0];
            }

            imgElm = bta.contentDocument.createElement('img');
            imgElm.src = 'https://rtd.tubemogul.com/upi/?' + param;
            imgElm.width = '0';
            imgElm.height = '0';
            imgElm.border = '0';
            imgElm.style.display = 'none';
            target.appendChild(imgElm);
        }
    },

    getCurrentYMD : function() {
        var date;
        var month;
        var day;
        var ymd;

        date = new Date();
        month = date.getMonth()+1;
        month = (month <= 9) ? "0"+month : month;
        day = date.getDate();
        day = (day <= 9) ? "0"+day : day;
        ymd = ""+date.getFullYear()+month+day;
        return ymd;
    },

    getCurrentUTC : function() {
        return !!Date.now ? Date.now() : new Date().getTime();
    },

    initialize : function() {
        this.hostLocating = location.host;
        this.hrefLocating = location.href;
        this.cookieDocument = document.cookie;
        this.ua = navigator.userAgent;
        this.isHttp = /^http\:/.test(location.protocol);
    },

    detectUA : function() {
        this.isIPhone = /iPhone/.test(this.ua);
        this.isIPad = /iPad/.test(this.ua);
        this.isAndroidMobile = /Android/.test(this.ua) && /Mobile/.test(this.ua);
        this.isAndroidTablet = /Android/.test(this.ua) && !/Mobile/.test(this.ua);
        this.isTablet = this.isIPad || this.isAndroidTablet;
        this.isSmartphone = this.isIPhone || this.isAndroidMobile;
        this.isPC = !this.isTablet && !this.isSmartphone;
        this.isMobile = !this.isPC;
    },

    getCookie : function(name) {
        var cookieStrings;
        var cookies;

        cookieStrings = document.cookie;

        if (!name || cookieStrings === '') {
            return 0;
        }
        cookies = cookieStrings.split("; ");

        for (var i = 0; i < cookies.length; i++) {
            var str = cookies[i].split("=");
            if (str[0] != name) continue;
            return unescape(str[1]);
        }
        return 0;
    },

    checkOptouted : function() {
        var ataCookieVal;
        
        ataCookieVal = this.getCookie('ATA');

        if (!!ataCookieVal && ataCookieVal.match(/^00/)) {
            this.isOptouted = true;
        } else {
            this.isOptouted = false;
        }
    },

    iframe          : document.createElement("iframe"),
    contentWindow   : null,
    contentDocument : null,
    
    prepareIframe : function() {
        this.iframe.id          = "bta";
        this.iframe.width       = 0;
        this.iframe.height      = 0;
        this.iframe.frameBorder = 0;
        this.iframe.style.display = 'none';
        document.body.appendChild(this.iframe);
        this.contentWindow =  this.iframe.contentWindow;
        this.contentDocument = this.contentWindow.document;
        this.contentDocument.open();
        this.contentDocument.close();
        this.contentHead = this.contentDocument.getElementsByTagName('head')[0];
        this.contentBody = this.contentDocument.getElementsByTagName('body')[0];
    },

    prepareXDMPCallback : function() {
        function genCookie(str) {
            var currentEpoch;

            currentEpoch = bta.getCurrentUTC();
            // document.cookie = 'XDMP_ATA=' + str + '; expires=' +
                    // (new Date(currentEpoch + 86400000)).toUTCString() + '; ' + bta.cookieDomain + 'path=/';
        }

        this.contentWindow.xlis_dmp_uuinfo = function(json) {
            var i;
            var ataArr = [];
            var ataStr;
            var ymd;

            if (!json.segments) {
                genCookie('');
                return;
            }

            for (i = 0; i < json.segments.length; i++) {

                if (!!json.segments[i].segment_alias_code && !!json.segments[i].segment_alias_code.ipsx) {
                    ataArr.unshift(json.segments[i].segment_alias_code.ipsx);
                }
            }

            if (ataArr.length === 0) {
                genCookie('');
                return;
            }

            ataArr = ataArr.slice(0, 10);
            ataStr = ataArr.toString();

            if (/^(,+|)$/.test(ataStr)) {
                genCookie('');    // only empty strings
                return;
            }
            ymd = bta.getCurrentYMD();
            ataStr = ataStr.replace(/,|$/g ,'_' + ymd + '|');
            ataStr = ataStr.replace(/\|$/, '');
            genCookie(ataStr);
        };
    },

    syncXDMP : function() {
        var scriptElm;

        if (this.getCookie('XDMP_ATA') !== 0) return;
        this.prepareXDMPCallback();
        scriptElm = this.contentDocument.createElement('script');
        scriptElm.type = 'text/javascript';
        scriptElm.src = '//pulsar.xlisting.jp/xuuinfo?clid=215fafb8de20ffd&callback=xlis_dmp_uuinfo';
        scriptElm.async = 'async';
        scriptElm.defer = 'defer';
        this.contentHead.appendChild(scriptElm);
    },

    prepareCallback : function() {
        this.contentWindow.do_pix = function(json){
            var obj = {};
            var platform,index,key,val,array;

            for(platform in json) {

                if (json.hasOwnProperty(platform)) {

                    if (!(platform in bta.platformsAndFunctions)) {
                        continue;
                    }
                    obj[platform] = [];

                    for(index in json[platform]) {

                        if (json[platform].hasOwnProperty(index)) {

                            for(key in json[platform][index]) {

                                if(json[platform][index].hasOwnProperty(key)) {
                                    val = json[platform][index][key];
                                    array = key+"="+val;
                                    obj[platform].push(array);
                                    
                                    if(!bta.hasSerializableParameters[platform]) {
                                        bta.platformsAndFunctions[platform](obj[platform]);//execute function of each platform(NOT in series)
                                        obj[platform] = [];
                                    }
                                }
                            }
                        }
                    }

                    if(!!bta.hasSerializableParameters[platform]) {
                        bta.platformsAndFunctions[platform](obj[platform]);//execute function of each platform(in series)
                    }
                }
            }
        }
    },

    runBta : function() {
        this.prepareCallback();
        var script = this.contentDocument.createElement('script');
        script.src = "//log000.goo.ne.jp/bridge?url=" + encodeURIComponent(location.href);
        this.contentDocument.body.appendChild(script);
    },

    runFuwatto : {
        recommendFlag : null,
        init : function(){
            this.recommendFlag = 0;
        },
        disp_fuwatto : function(){
            //oshiete
            /*
            if ( bta.hrefLocating.match(/^https?:\/\/oshiete\.goo\.ne\.jp\/qa/) ) {
                var categoryMap = {
                "美容・健康,その他(美容・健康)":1,
                "美容・健康,ダイエット・フィットネス,ダイエット・運動":1,
                "美容・健康,ダイエット・フィットネス,ダイエット・食事食品":1,
                "美容・健康,ダイエット・フィットネス,その他(ダイエット・フィットネス)":1,
                "美容・健康,デンタルケア":1,
                "美容・健康,健康,がん":1,
                "美容・健康,健康,その他(健康)":1,
                "美容・健康,健康,アレルギー・花粉症":1,
                "美容・健康,健康,インフルエンザ":1,
                "美容・健康,健康,ヘルスケア(健康管理)":1,
                "美容・健康,健康,メンタルヘルス":1,
                "美容・健康,健康,女性の病気":1,
                "美容・健康,健康,性の悩み":1,
                "美容・健康,健康,栄養":1,
                "美容・健康,健康,病気":1,
                "美容・健康,健康,病院":1,
                "美容・健康,健康,禁煙・禁酒":1,
                "美容・健康,健康,薄毛・抜け毛":1,
                "ライフ,出産・育児,その他(出産・育児)":1,
                "ライフ,出産・育児,不妊":1,
                "ライフ,出産・育児,出産":1,
                "ライフ,出産・育児,妊娠":1,
                "ライフ,出産・育児,育児":1
                };
                var categories = this.getCategories();

                if (categoryMap[categories.join(',')]) {
                this.recommendFlag = 1;
                }
            }
            */

            //health
            /*
            if (bta.hrefLocating.match(/^https?:\/\/health\.goo\.ne\.jp\/(column|medical\/search)/)) {
                this.recommendFlag = 1;
            }
            */

            //baby
            /*
            if (bta.hrefLocating.match(
                    /^https?:\/\/baby\.goo\.ne\.jp\/(member|goo\/contents|naturals|pg\/baby|gakubun|nips)\//)) { 
                this.recommendFlag = 1;
            }
            */

            //20160225 for enquete
            if (!!bta.hrefLocating.match(/^https?:\/\/www\.goo\.ne\.jp\/($|\?TH=[0M]|\?isp=goo|\?mode=test)/) &&
                    !!decodeURIComponent(bta.cookieDocument).match(/gooproperty[^;]*TH=[0M]/)) {
                this.recommendFlag = 1;
            } else if (!!bta.hrefLocating.match
                    (/^https?:\/\/oshiete\.goo\.ne\.jp\/qa\/|^https?:\/\/(news|ima)\.goo\.ne\.jp\//)) {
                this.recommendFlag = 1;
            }

            if (this.recommendFlag === 1) {
                var script = document.createElement('SCRIPT');
                script.type = 'text/javascript';
                script.src = '//feature.goo.ne.jp/fuwatto?url=' + encodeURIComponent(document.location);
                script.charset = 'utf-8';
                document.body.appendChild(script);
            }
        },

        judgeById : function() {
            //20160302 enquete
            var nguserid = bta.getCookie("NGUserID");
            var prb;
            var rnd;

            if (!!nguserid && !(bta.isTablet || bta.isSmartphone)) {
                prb = 6;
                rnd = Math.ceil(Math.random()*prb);

                if (rnd === 1) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }

            /*
            var nguserid = bta.getCookie("NGUserID");

            if(nguserid){
                var splitted = nguserid.split("-");
                var int_value = parseInt(splitted[1]) + parseInt(splitted[2]) + parseInt(splitted[3]);

                if(int_value % 2 == 0 && !( bta.isTablet || bta.isSmartphone ) ){
                    return 1;
                }
            }
            return 0;
            */
        },

        getCategories : function() {
            var list = document.getElementById('crumb').getElementsByTagName('li');
            var categories = [];
            var i, max, link, text;

            i = bta.isSmartphone ? 0 : 1;    //1 = isPC or isTablet
            
            for (max = list.length; i < max; i++) {
                link = list[i].getElementsByTagName('a').item(0);

                if (link) {
                    text = link.textContent || link.innerText || '';

                    if (text.length) {
                        categories.push(text.replace(/^[\s\u3000]+/, '').replace(/[\s\u3000]+$/, ''));
                    }
                }
            }
            return categories;
            }
    },

    getUserAttributes : function() {
        var cookies;
        var bta;
        var gender;
        var genderConfidence;
        var age;
        var ageConfidence;
        var dcdc;
        var business;
        var line;
        var domain;
        var carrier;
        var query;
        
        cookies = document.cookie;
        bta = cookies.match(/BTA\=.+G(F|M)(\d)A?(\d)?(\d)?/);
        gender           = !!bta && !!bta[1] ? bta[1] : '';
        genderConfidence = !!bta && !!bta[2] ? bta[2] : '';
        age              = !!bta && !!bta[3] ? bta[3] : '';
        ageConfidence    = !!bta && !!bta[4] ? bta[4] : '';
        dcdc = cookies.match(/DCDC\=B?(\d)?L?(\d)?D?(\d)?C?(\d)?/);
        business = !!dcdc && dcdc[1] ? dcdc[1] : '';
        line     = !!dcdc && dcdc[2] ? dcdc[2] : '';
        domain   = !!dcdc && dcdc[3] ? dcdc[3] : '';
        carrier  = !!dcdc && dcdc[4] ? dcdc[4] : '';
        query = 'g=' + gender + '&gc=' + genderConfidence + '&a=' + age + '&ac=' + ageConfidence + '&b=' + business + '&l=' + line + '&d=' + domain + '&c=' + carrier;
        return query;
    },

    pixAdWords : function() {
        var categories;
        var bodyElm;
        var imgElm;

        categories = this.runFuwatto.getCategories();
        
        if (!!categories && !!categories[0].match(/お金・保険・資産運用/)) {
            bodyElm = document.getElementsByTagName('body')[0];
            imgElm = document.createElement('img');
            imgElm.height = '1';
            imgElm.width = '1';
            imgElm.style.borderStyle = 'none';
            imgElm.alt = '';
            imgElm.src = '//googleads.g.doubleclick.net/pagead/viewthroughconversion/958584331/?value=0&guid=ON&script=0';
            bodyElm.appendChild(imgElm);
        }
    },

    pixSpecifiedModels : function() {
        var url;
        var scriptElm;
        var dcdcCookie;

        var dcdcVal;
        var carrier;
        var pathOnIphone;
        
        if (this.isAndroidMobile || this.isAndroidTablet) {

            if (this.ua.match(/SO-04E|SO-01F|SO-02F|SO-03F|SO-04F|SO-01G|SO-02G|SO-04D|SO-05D|SO-01E|SO-02E|SO-03E/)) {
                url = '//adcdn.goo.ne.jp/images/pix/mmjwaqk0g7.js';
            } else if (this.ua.match(/SC-04E|SC-01F|SC-02F|SC-04F|SC-01G|SC-02G|SC-04G|SC-05G|SC-06D|SC-03E/)) {
                url = '//adcdn.goo.ne.jp/images/pix/cuf1ptf2mp.js';
            } else if (this.ua.match(/SH-06E|SH-07E|SH-01F|SH-02F/)) {
                url = '//adcdn.goo.ne.jp/images/pix/3gh8khykwx.js';
            } else {
                return;
            }
        }
        
        if (this.isIPhone) {
            dcdcCookie = this.getCookie('DCDC');

            if (dcdcCookie === 0) return;

            dcdcVal = dcdcCookie.match(/(?:C)(\d)/);
            carrier = !!dcdcVal ? dcdcVal[1] : '-1';
            carrier = parseInt(carrier);

            if (carrier >= 1 && carrier <= 3) {
                pathOnIphone = {
                    1 : '//adcdn.goo.ne.jp/images/pix/fu4y8f6qy4.js',
                    2 : '//adcdn.goo.ne.jp/images/pix/8a38q130u6.js',
                    3 : '//adcdn.goo.ne.jp/images/pix/qxcyfy94yk.js'
                };
                url = pathOnIphone[carrier];
            } else {
                return;
            }
        }
        scriptElm = document.createElement('script');
        scriptElm.type = 'text/javascript';
        scriptElm.src = url;
        document.getElementsByTagName('head')[0].appendChild(scriptElm);
    },
        
    detectAdaptvExceptionURL : function() {
        var i;
        var exeptionURL = [
            /http:\/\/(green\.)?search\.goo\.ne\.jp/
        ];
        
        for (i=0; i < exeptionURL.length; i++) {
            if ((exeptionURL[i]).test(this.hrefLocating)) {
                return true;
            }
        }
        return false;
    },

    pixASI : function() {
        var btaVal;
        var catAndNum;
        var cat;
        var num;
        var gte;
        var lte;
        var definedCat;
        var imgElm;
        var encodedLocation;
        var encodedCategory;

        btaVal = document.cookie.match(/(?:BTA=[^;]*R)(\d+)/);

        if (!btaVal) return;
        btaVal = btaVal[1];

        catAndNum = {
            'Beauty & Fashion'     : [[373, 374], [377, 379]],
            'Entertainment'        : [[1, 16], [36, 56], [119, 122], [141, 142], [409, 409]],
            'Finance & Business'   : [[161, 229], [239, 239], [350, 365], [367, 371], [436, 436]],
            'Food & Drink'         : [[262, 269]],
            'Health & Well Being'  : [[375, 376], [380, 396]],
            'Household Management' : [[230, 234], [237, 238], [240, 247], [255, 255], [422, 435]],
            'Lifestyle'            : [[104, 104], [235, 236], [256, 261], [270, 342], [403, 408], [410, 421]],
            'Parenting'            : [[252, 254], [372, 372]],
            'Shopping'             : [[133, 135]],
            'Sports'               : [[17, 35]],
            'Technology'           : [[57, 102], [105, 118], [123, 132], [136, 140], [143, 160], [397, 402]]
        };

        loop:
        for (cat in catAndNum) {
            if (catAndNum.hasOwnProperty(cat)) {

                for (num in catAndNum[cat]) {
                    if (catAndNum[cat].hasOwnProperty(num)) {
                        gte = catAndNum[cat][num][0];
                        lte = catAndNum[cat][num][1];

                        if (gte <= btaVal && btaVal <= lte) {
                            definedCat = cat;
                            break loop;
                        }
                    }
                }
            }
        }

        if (!definedCat) return;
        imgElm = bta.contentDocument.createElement('img');
        encodedLocation = encodeURIComponent(bta.hrefLocating);
        encodedCategory = encodeURIComponent(encodeURIComponent(definedCat));
        imgElm.src = '//pix04.revsci.net/F09828/b3/0/3/noscript.gif?DM_LOC=' +
                encodedLocation + '%3Fcategory%3D' + encodedCategory + '%26bpid%3Dgoo';

        imgElm.width = '0';
        imgElm.height = '0';
        imgElm.style.display = 'none';
        bta.contentBody.appendChild(imgElm);
    },

    setXuuidCookie : function(){
        var xuuidCookie = bta.getCookie('XUUID');
        var scriptElm;
        if(xuuidCookie === 0){
            scriptElm = document.createElement('script');
            scriptElm.type = 'text/javascript';
            scriptElm.src = '//xuuid.xlisting.jp/uuid/';
            scriptElm.async = true;

            bta.contentWindow.xuuid_cb = function(obj) {
                clearTimeout(timeoutID);
                if (!!obj && !!obj['xuuid'] ) {
                    var expiredYears = 10 * 365;
                    document.cookie = "XUUID=" + obj.xuuid + "; expires=" +
                        (new Date(bta.getCurrentUTC() + expiredYears * 24 * 60 * 60 * 1000)).toUTCString() + "; domain=.goo.ne.jp; path=/";
                }
                bta.cookieSync();
            };

            var timeoutID = setTimeout(function(){
                bta.contentWindow.xuuid_cb = function(){};
                bta.cookieSync();
            }, 300);
            bta.contentBody.appendChild(scriptElm);

        } else {
            bta.cookieSync();
        }
    },

    cookieSync : function() {
        var expireSettings;
        var funcs;
        var platform;
        var re;
        var platformVal;
        var diff;
        var limit;
        var currentUTC;
        var currentYMD;
        var prevYMD;
        var prevUTC;
        var orgCookieStr;
        var newCookieAry = [];
        var newCookieStr;
        var isCookieUpdated = false;

        expireSettings = {
            'CA' : 20,
            'SMN' : 20,
            'SIZMEK' : 20
        };

        isXuuidCookieNeeded = {
            'CA' : false,
            'SMN' : false,
            'SIZMEK' : true
        };

        funcs = {
            'CA' : function() {
                var scriptElm;
                
                scriptElm = document.createElement('script');
                scriptElm.charset = 'UTF-8';
                scriptElm.src = '//adp-pubd-static.adtdp.com/t/ins_syncxl.js';
                scriptElm.async = true;
                document.getElementsByTagName("body")[0].appendChild(scriptElm);
            },
            'SMN' : function() {
                var imgElm;

                imgElm = document.createElement('img');
                imgElm.src = '//cr-p10050.ladsp.com/pid/10050';
                imgElm.width = '1';
                imgElm.height = '1';
                imgElm.border = '0';
                imgElm.style.display = 'none';
                document.getElementsByTagName('body')[0].appendChild(imgElm);
            },

            'SIZMEK' : function() {
                window.versaTag = {};
                var sizmekScriptElm;
                var xuuidCookie = bta.getCookie('XUUID');

                versaTag.id = "5168";
                versaTag.sync = 0;
                versaTag.dispType = "js";
                versaTag.ptcl = "HTTPS";
                versaTag.bsUrl = "bs.serving-sys.com/BurstingPipe";
                versaTag.activityParams = {
                    "OrderID":"","Session":"","Value":"","productid": xuuidCookie, "productinfo":"","Quantity":""
                };
                versaTag.retargetParams = {};
                versaTag.dynamicRetargetParams = {};
                versaTag.conditionalParams = {};

                sizmekScriptElm = document.createElement('script');
                sizmekScriptElm.id = 'ebOneTagUrlId';
                sizmekScriptElm.src = 'https://secure-ds.serving-sys.com/SemiCachedScripts/ebOneTag.js';
                document.getElementsByTagName("body")[0].appendChild(sizmekScriptElm);
            }
        };

        function convertYmdToUtc(str) {
            var ymd;
            var year;
            var month;
            var day;

            ymd = str.match(/(\d{4})(\d{2})(\d{2})/);
            year = ymd[1];
            month = ymd[2];
            month = parseFloat(month) - 1;    // 0 = jan
            day = ymd[3];
            return new Date(year, month, day);
        }

        currentYMD = this.getCurrentYMD();
        currentUTC = this.getCurrentUTC();
        orgCookieStr = document.cookie.match(/(?:CSST=)([^;]*)/);
        orgCookieStr = !!orgCookieStr ? orgCookieStr[1] : '';

        var xuuid = bta.getCookie('XUUID');

        for (platform in funcs) {
            if (funcs.hasOwnProperty(platform)) {
                re = new RegExp('(' + platform + ')' + '_(\\d{8})');
                platformVal = orgCookieStr.match(re);
                
                if (!platformVal) {
                    if( isXuuidCookieNeeded[platform] && !xuuid) {
                        continue;
                    }
                    newCookieAry.push(platform + '_' + currentYMD);
                    funcs[platform]();
                    isCookieUpdated = true;
                    continue;
                }

                prevYMD = platformVal[2];
                prevUTC = convertYmdToUtc(prevYMD);
                diff = (currentUTC - new Date(prevUTC)) / 86400 / 1000;
                limit = expireSettings[platform];

                if (diff >= limit) {
                    if( isXuuidCookieNeeded[platform] && !xuuid) {
                        continue;
                    }
                    newCookieAry.push(platform + '_' + currentYMD);
                    funcs[platform]();
                    isCookieUpdated = true;
                } else {
                    newCookieAry.push(platform + '_' + prevYMD);
                }
                continue;
            }
        }

        if (isCookieUpdated) {
            newCookieStr = newCookieAry.join('|');
            document.cookie = 'CSST=' + newCookieStr + '; expires=' +
                    (new Date(currentUTC + 86400000 * 365)).toUTCString() + '; ' + this.cookieDomain + 'path=/';
        }
    },

    pixGroupTargeting : function() {
        var scriptElem;

        scriptElem = document.createElement('script');
        scriptElem.src = '//adcdn.goo.ne.jp/images/pix/b083bvurce.js';
        scriptElem.type = 'text/javascript';
        scriptElem.async = 'async';
        scriptElem.defer = 'defer';

        document.body.appendChild(scriptElem);
    },

    pixCommon : function() {
        var ScriptElem;
        scriptElem = document.createElement('script');
        scriptElem.src = '//adcdn.goo.ne.jp/images/pix/2dwkwwau99.js?20171221';
        scriptElem.type = 'text/javascript';
        scriptElem.async = 'async';
        scriptElem.defer = 'defer';

        document.body.appendChild(scriptElem);
    },

    pixDcm: function(){
	var cb = "cbDcmOCID"; if( cb in window) return;
	var _callJSONP = function(url){
	    var sc=document.createElement("script");
	    sc.src=url; sc.async=true; sc.defer=true;
	    document.head.appendChild(sc);
	};
        var _getPkid = function(){
	    cookies = document.cookie.split("; ")
	    for(var i = 0; i < cookies.length; i++){
		var kv = cookies[i].split("=");
		if(kv[0].match(/^_pk_id\..+/)) return encodeURIComponent(kv[1]);
	    }
	};
	var _dcmTag = function(){
	    if("_paq" in window) return; window._paq = [];
	    var u="//docomo-analytics.com/dcm/";
	    _paq.push(["trackPageView"]);
	    _paq.push(['setTrackerUrl',u+'tr/dcmAn/img']);
	    _paq.push(['setSiteId',132]);
	    _paq.push(["trackingType",2]);
	    _paq.push(["afterAuthFlg",1]);
	    _paq.push(["dcmsydc",1]);
	    var d=document,g=d.createElement("script"),s=d.getElementsByTagName("script")[0];
	    g.type='text/javascript';g.async=true;g.defer=true;g.src=u+'js/union.js';
	    s.parentNode.insertBefore(g,s);
	};
	
	window[cb] = function(d){
	    if(!d.ocid) return;
	    _dcmTag();
	    var _pkid = _getPkid();
	    if( bta.getCookie("dcmsydc") && _pkid ){
		_callJSONP("//bwb101.goo.ne.jp/pix.js?id=ktgjfszyme&pkid="
			   +_pkid+"&ocid="+d.ocid+"&url="+encodeURIComponent(bta.hrefLocating));
	    }
	};
	_callJSONP("//bwb101.goo.ne.jp/url_to/ocid.js?callback="+cb+"&url="+encodeURIComponent(bta.hrefLocating));
    }

};

bta.prepareIframe();

bta.initialize();

bta.detectUA();

bta.checkOptouted();


if (bta.isOptouted) {
    return;
}

bta.xlDmpPixelingSites = [
    /^https?:\/\/(?!(oshiete\.goo\.ne\.jp\/qa\/)|(sp\.)?nttxstore|blog\.goo\.ne\.jp)/    // ＜教えてQA・ストア・ブログ＞を除く
]
for (var i=0; i<bta.xlDmpPixelingSites.length; i++) {
    if ((bta.xlDmpPixelingSites[i]).test(bta.hrefLocating)) {
        bta.platformsAndFunctions.xl_dmp();
        break;
    }
}

for (var i=0; i<bta.pixelingSites.length; i++) {
    if ((bta.pixelingSites[i]).test(bta.hrefLocating)) {
        bta.syncXDMP();
        bta.runBta();
        break;
    }
}

/*停止中
if (!!window.gooad) {

        if (typeof window.gooad.billboard === 'undefined' ||    //oshiete,news,ima…
                !window.gooad.billboard.isBillboardActive) {    //top
            bta.runFuwatto.init();

            if (bta.runFuwatto.judgeById() === 1) {
                bta.runFuwatto.disp_fuwatto();
            }
    }
}
*/

if (bta.isPC && !!bta.hrefLocating.match(/^https?:\/\/oshiete.goo\.ne\.jp\/qa\//)) {
    bta.pixAdWords();
}

if (!!bta.getCookie('DCDC') && bta.getCookie('DCDC').indexOf('G01') >= 0 &&
        bta.detectAdaptvExceptionURL() === false) {
    bta.platformsAndFunctions['adap.tv']('segid=ABC4');
}

if (bta.isSmartphone || bta.isAndroidTablet) {
    bta.pixSpecifiedModels();
}

/*
if (bta.isPC && !!bta.hrefLocating.match(/^https?:\/\/oshiete.goo\.ne\.jp/) &&
        !bta.ua.match(/firefox/i)) {
    bta.pixASI();
}
*/

if (!!bta.hrefLocating.match(/^https?:\/\/oshiete.goo\.ne\.jp\/qa\//)) {
    bta.setXuuidCookie();
}

if (bta.isMobile && !!bta.getCookie('DCDC') && bta.getCookie('DCDC').indexOf('C1') >= 0) {
    bta.platformsAndFunctions['tubeMogul']();
}

if (bta.isPC && bta.getCookie('DCDC') && bta.getCookie('DCDC').indexOf('L1') >= 0) {
    bta.platformsAndFunctions['tubeMogul']('sid=fwZ1IBDaTTuDgtJ0vfn0');
}

if (bta.isPC && bta.getCookie('DCDC') && bta.getCookie('DCDC').indexOf('G01') >= 0) {
    bta.pixGroupTargeting();
}

bta.pixCommon();

if( /^https:\/\/oshiete\.goo\.ne\.jp\/qa\/[0-9]+\.html.*/.test(bta.hrefLocating) ){
    bta.pixDcm();
}

}());
