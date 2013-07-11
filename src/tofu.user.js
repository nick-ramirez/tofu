// ==UserScript==
// @name            ToFu Script
// @description     The next generation of Kingsofchaos enhancement
// @version         0.20121110
// @include         http://*kingsofchaos.com/*
// @exclude         http://*kingsofchaos.com/chat/*
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/jquery-1.8.3.min.js
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/underscore-1.4.2.min.js
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/hex_md5.js
// @require         https://raw.github.com/DonatoB/tofu/master/server/libs/highstock-1.1.5.js
// @resource    sidebar_targets          https://raw.github.com/DonatoB/tofu/master/server/img/sidebar_targets.gif
// @resource    sidebar_sabtargets       https://raw.github.com/DonatoB/tofu/master/server/img/sidebar_sabtargets.gif
// @resource    sidebar_fakesabtargets   https://raw.github.com/DonatoB/tofu/master/server/img/sidebar_fakesabtargets.gif
// @resource    icon_sword               https://raw.github.com/DonatoB/tofu/master/server/img/sword.png
// @resource    styles				     https://raw.github.com/DonatoB/tofu/master/server/css/styles.css
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// ==/UserScript==

// Silver sword icon from here - http://www.iconfinder.com/iconsets/free-silver-button-icons-2#readme
// For information on the development of this through the ages please visit: http://stats.luxbot.net/about.php

var Plugins = {};
<<<<<<< HEAD
var version = '0.2.130709';
||||||| merged common ancestors
var version = '0.2.130518';
=======
var version = '0.2.130710';
>>>>>>> 52cffa32e464635e47c194b0ebc449f8c05bb2e3
var Buttons = {
	gold : 0,
	cost_col : 0,
	
    btn_update: function() {
        function currentExpenditure($rows) {
            var total_cost = 0;
            $rows.each(function(idx) {
				var $this = $(this);
                var amount = $this.find("input").first().val() || 0;    
                var price = $this.find("input.btn_helper").first().attr('cost');
                total_cost += (amount*price || 0);
            }); 
            return total_cost;
        }
        
        var cur_cost = currentExpenditure(this.$rows);
        var money_left = Math.max(0, this.gold - cur_cost);
		
		var self = this;
        this.$rows.each(function() {
			var $this = $(this);
			var $btn = $this.find("input.btn_helper").first();
			log (money_left + " " + $btn.attr("cost"));
			
			var newVal = Math.floor( money_left / $btn.attr("cost"));
			if ( typeof(self.constraintFunc) == typeof(Function)) {
				newVal = self.constraintFunc(newVal, $this);
			}
			$btn.val( newVal )
		});
    }
	
    , init: function(gold, $table, costColumnIndex, constraintFunc) {
		this.gold = gold;
		this.cost_col = costColumnIndex;
		this.$rows = $table.find("tr:has(input[type='text'])");
		this.constraintFunc = constraintFunc;
		
		var self = this;
		
        $table.find("input").keyup(function() {
            self.btn_update(); 
        });
		
        this.$rows.each(function(index,element) {
            var $cols = $(element).children("td");
			var cost = $cols.eq(costColumnIndex).text().int();
			if (cost > 0)
				$(element).append("<td><input type='button' cost="+cost+" value=0 class='btn_helper' /></td>");
        });
        
        this.btn_update();
        
		$(".btn_helper").click(function(element) {
			var amount = $(element.target).val();
			$(this).parent().parent().find("input").eq(0).val(amount);
			self.btn_update(); 
		});
    }
}

var Constants = {

	version : '0.1.20130321'
	
	, baseUrl     : 'http://donatoborrello.com/koc/bot/luxbot.php?'
	, downloadUrl : 'http://donatoborrello.com/koc/bot/luxbot.user.js'
	, versionUrl  : 'http://donatoborrello.com/koc/bot/luxbot.version.php'
	
    , statsdesc : {0:'Strike Action', 1:'Defensive Action', 2:'Spy Rating', 3:'Sentry Rating', 4:'Gold'}

    , storedStrings : ['race',  'kocnick', 'forumName', 'forumPass', 'auth', 'logself']

    , storedNumbers :['kocid', 'tff', 'income', 'sa', 'da', 'spy', 'sentry', 'spyWeaps', 'sentryWeaps', 'daWeaps', 'saWeaps']
	
    , spyWeaps : ['Rope','Dirk','Cloak','Grappling Hook','Skeleton Key','Nunchaku']
	
    , sentryWeaps : ['Big Candle','Horn','Tripwire','Guard Dog','Lookout Tower']
	
    , daWeaps : ['Helmet', 'Shield','Chainmail','Plate Armor', 'Mithril', 'Elven Cloak', 'Gauntlets', 'Heavy Shield', 'Dragonskin', 'Invisibility Shield' ]
	
	, options : [ 'logself', 'scrollbattlelog', 'turnclock', 'commandCenterStats', 'targets', 'fakesabtargets', 'goldprojection', 'armorygraph', 'armorydiff']
}
var ControlPanel = {

    init: function () {

		this.$controlbox = $("<div>", {
			'id': 'tofu_control_box',
			'html' : 'TOFUTOFU'
		});

		$('body').append( this.$controlbox );


		this.$controlbox.click( this.showControlPanel );
    }


    , showControlPanel: function() {
		GUI.displayHtml('<div id="tofu_popup_navbar"><ul></ul></div><div id="tofu_popup_content"></div>');
		
		var panelTabs = [
			// 'Tab Text', 'id', callback
			['Show links', 'showlinkbox', ControlPanel.showLinkBox],
			['Farmlist Setup','showfarmlist', ControlPanel.showFarmList],
			['Check for update', 'checkupdate', Init.checkForUpdate]
		];
		
		var $nav = $('#tofu_popup_navbar > ul');
		_.each(panelTabs, function(arr) {
			$nav.append("<li><a href='javascript:void(0);' id='"+arr[1]+"'>"+arr[0]+"</a></li>");
			$('#'+arr[1]).click(arr[2]);
		});
    }



    ,  toggle: function() {
        var $d = $("_luxbot_darken").toggle();
    }


    // GUI pages

    , showLinkBox: function () {
		alert('showlinkbox');
		return;
        var html =  " <table class='table_lines' id='_luxbot_links_table' width='100%' cellspacing='0'\
        cellpadding='6' border='0'>\
        <tr>\
        <th colspan='7'>FF Links</th>\
        </tr>\
        <tr>\
        <td><a href='http://stats.luxbot.net/'>Player Statistics</a></td>\
        <td><a href='http://fearlessforce.net/'>FF Forums</a></td>\
        <td><a href='http://stats.luxbot.net/sabbing.php'>Enemies Sablist</a></td>\
        </tr>\
        </table> ";

        html += '<table class="table_lines" id="_luxbot_links_table" width="100%" cellspacing="0" cellpadding="6" border="0">\
        <tr><th>Recruiters Links</th></tr>\
        <tr><td><a href="http://stats.luxbot.net/clicks.php">Clitclick</a></td>\
        </tr></table>';

        showMessage(html);

    }

    ,  showMessageBox: function() {
        if (messages === undefined) {
            return;
        }
        var content = '';
        var i;
        for (i = 0; i < messages.length; i++) {
            var y = messages[i].split('|');
            content += '<tr id="_luxbot_message_' + y[3] + '"><td><a href="javascript:void(0);" name="' + y[3] + '">+</a></td><td>' + y[1] + '</td><td>' + y[0] + '</td><td>' + y[2] + '</td></tr>';
        }

        GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>Show</th><th>Sender</th><th>Subject</th><th>Date</th></tr>' + content + '</table>');
        document.getElementById("_luxbot_guibox").addEventListener('click', GUI.showMessageDetails, true);
    }

    , showMessageDetails: function(event) {
        if (event.target.name !== undefined) {

            getLux('&a=getmessage&id=' + String(event.target.name),
               function(r) {
                    var q = document.getElementById('_luxbot_message_' + String(event.target.name));
                    GUI.showMessage('<h3>Messages</h3><table id="_luxbot_messages" width="100%"><tr><th>From</th><td>' + q.childNodes[1].innerHTML + '</td></tr><tr><th>Subject</th><td>' + q.childNodes[2].innerHTML + '</td></tr><tr><th>Date</th><td>' + q.childNodes[3].innerHTML + '</td></tr><tr><th>Message</th><td>' + r.responseText + '</td></tr>', GUI.showMessageBox);
                    addCSS('#_luxbot_messages {border-spacing:4px;}\
                    #_luxbot_messages th{width:100px;padding:6px;}');
            });
        }
    }
    
}

    function log(s)               { GM_log(s); console.log(s);   }
    function openTab(t)           { GM_openInTab(t); }
    function gmSetValue(t, t2)    { GM_setValue(t, "" + t2 + ""); } // Convert to string for storage of large ints
    function gmDeleteValue(t)     { GM_deleteValue(t); }
    function gmGetValue(t, def)   { return GM_getValue(t, def);}
    function gmGetResourceText(t) { return GM_getResourceText(t); }
    function gmGetResourceURL(t)  { return GM_getResourceURL(t); }
    function gmAddStyle(t)        { GM_addStyle(t); }

    function get(address, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: address,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible)',
                'Accept': 'application/atom+xml,application/xml,text/xml'
            },
            onload: function(r) {
                if (callback) { callback(r); }
            }
        });
    }
    
    function post(address, data, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: address,
            headers:{'Content-type':'application/x-www-form-urlencoded'},
            'data': encodeURI(data),
            onload: function(r) {
                if (callback) { callback(r); }
            }
        });
    }
    // function postJson(address, data, callback) {
        // GM_xmlhttpRequest({
            // method: "POST",
            // url: address,
            // headers:{'Content-type':'application/json'},
            // data: {json : JSON.stringify(data)},
            // onload: function(r) {
                // if (callback) { callback(r); }
				// log(r.responseText);
            // }
        // });
    // }
	
	function getLux(url, callback) {
        var address = Constants.baseUrl+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
        
        log("Get URL: " +address);
        get(address, callback);
    }
    
    function postLux(url, data, callback) {
        var address = Constants.baseUrl+'&username='+User.kocnick+'&password=' + User.forumPass +'&auth=' + User.auth + url;
        
        log("Post URL: "+ address);
        post(address, data, callback);
    }
	
    function postLuxJson(url, data, callback) {
		postLux(url, '&json='+JSON.stringify(data), callback);
		log(url , data);
    }
var GUI = {

    init: function () {
        this.$popup = $('<div>', { 'id': 'tofu_popup_box' });
		$('body').append( this.$popup );

<<<<<<< HEAD
        this.$controlbox = $("<div>", {
			'id': 'tofu_control_box',
			'html' : 'TOFUTOFU'
		});

		$('body')
			.append( this.$controlbox )
			.append( this.$popup );
			
		var self = this;	
||||||| merged common ancestors
		// the variable version is a global created by the build script
        this.$controlbox = $("<div>", {
			'id': 'tofu_control_box',
			'html' : '<ul><li>ToFu Version</li><li>Version: '+version+'</li></ul> </div>'
		});

		$('body')
			.append( this.$controlbox )
			.append( this.$popup );
			
		var self = this;	
=======
		var self = this;
>>>>>>> 52cffa32e464635e47c194b0ebc449f8c05bb2e3
		this.$popup.click(function (event) {
			if ($(event.target).is("#tofu_popup_box")) {
				self.hide();
			}
		});

<<<<<<< HEAD
		$(document).keyup(function(e){
			if (e.keyCode === 27) { self.hide(); }
		});
		
		this.$controlbox.click(function() { 
			alert("Trying to open box");
||||||| merged common ancestors
		$(document).keyup(function(e) {
			if (e.keyCode != 27) { return; }
			self.hide();
=======
		$(document).keyup(function(e){
			if (e.keyCode === 27) { self.hide(); }
>>>>>>> 52cffa32e464635e47c194b0ebc449f8c05bb2e3
		});

    }

    , displayText: function(tx) {
        this.displayHtml("<div>"+tx+"</div>");
    }

    , displayHtml: function(html) {
		this.hide();
        this.$popup.append($("<div>").append(html));
        this.$popup.show();
    }

	, hide: function() {
		this.$popup.hide();
		this.$popup.children().remove();
	}

}

var Init = {

    loadUser : function(action) {
	
		var kocid;
		if (action == 'base') {
			var html = document.body.innerHTML.split("stats.php?id=");
			html = html[1];
			kocid = html.slice(0, html.indexOf('"'));
		}
		
        db.init(kocid);
        if (db.id === 0) return false;
                
        var userObject = {};

        _.map(Constants.storedStrings, function(val) {
            userObject[val] = db.get(val, '')
            // log(val + " : " + db.get(val, ''));
        })

        _.map(Constants.storedNumbers, function (val) {
            userObject[val] = db.get(val, 0);
            // log(val + " : " + db.get(val, 0));
        });

        var d = new Date();
        userObject.time_loaded = d.getTime();
        userObject.gold = Page.getPlayerGold()

        return userObject
    }    
 
    , checkForUpdate: function(startup) {
        if (db.get("luxbot_version",0) != Constants.version) {
            //if the version changes
            db.put("luxbot_version", Constants.version);
            db.put("luxbot_needsUpdate",0);
        }
        if (startup === 1 && db.get("luxbot_needsUpdate",0) === 1) {
            setTimeout(function() {
                $("#_luxbot_gui>ul").append("<li id='getUpdate' style='padding-top:5px;color:yellow'>Get Update!</li>");
                $("#getUpdate").click(function() {
                    openTab(Constants.downloadUrl); 
                });
            },1000);
            return;
        }
        
        var now = new Date(); 
        var lastCheck = db.get('luxbot_lastcheck', 0);

        if (startup != 1 || (now - new Date(lastCheck)) > (60*1000)) {
            get( Constants.versionUrl,
                function(responseDetails) {
                    var latestVersion = Number(responseDetails.responseText.replace(/\./, ''));
                    var thisVersion = Number(version.replace(/\./, ''));
                    if (latestVersion > thisVersion) {
                        db.put("luxbot_needsUpdate",1);
                        db.put("luxbot_version",Constants.version);
                        if (startup != 1) {
                            alert("There is an update!");
                            openTab(Constants.downloadUrl); 
                        }
                    } else if (startup !== 1) {
                        alert("You are up to date!");
                    }
                }
            );
            db.put('luxbot_lastcheck', now.toString());
        }
    }
    
    , checkUser: function() {
        if (User.forumName === 0 || User.forumPass === 0 || User.forumName === undefined 
          || User.forumPass === undefined || User.auth === undefined || User.auth === 0 
          || User.auth.length !== 32) {
                Init.showInitBox();
                return 0;
        } else {
            getLux('&a=vb_auth',
                function(r) {
                    if (r.responseText == '403') {
                        Init.showInitBox();
                        return 0;
                    }
                    
                    var x = r.responseText.split(';');
                    var logself = x.shift();
                    
                    stats = {'tffx':x.shift(), 'dax':x.shift(), 'goldx':x.shift()};
                    
                    var temp = document.getElementById('_luxbot_showMessageBox');
                    if (!temp) return;
                    temp.innerHTML = 'Show Messages (' + (x.length-1) + ')';
                    
                    // messages is a global var
                    // if ((Tofu.messages = x.pop()) === '1') {
                        // GUI.showMessageBox();
                    // }
                });
            return 1;
        }
        return 1;
    }
    
    , showInitBox: function () {
        
        function initLogin() {

            var f_user = $("#_forum_username").val();
            var f_pass = $("#_forum_password").val();
            if (f_pass === '' || f_user === '')
                return;
            GUI.displayText("Verifying...<br />");
            
            get('http://www.kingsofchaos.com/base.php',
                function(responseDetails) {
                        var html = responseDetails.responseText;
                        var user = textBetween(html,'<a href="stats.php?id=', '</a>');
                        user = user.split('">');
                        
                        db.put('kocnick', user[1]);
                        db.put('kocid', user[0]);
                        var password = HEX.hex_md5(f_pass);
                        db.put('forumPass', password);
                        db.put('forumName', f_user);
                        initVB();
                }
            );
        }
        
        function initVB() {
            getLux('&a=vb_login&kocid=' + db.get('kocid')+'&forumname='+db.get('forumName'),
                function(r) {
                    var ret = r.responseText;
                    if (ret.indexOf("Error") == -1) {
                        //success
                        db.put('auth', ret);
                        alert("Success");
                        GUI.hide();
                    } else {
                        GUI.displayText("There was an error, try refreshing your command center.");
                    }
            });    
        }
        
        var welcome ='<h1>Welcome</h1>There is no data for your LuX account.<br /><br />';
        GUI.displayText(welcome + 'Please login with your <a href="http://www.fearlessforce.net">FF Forums</a> info.<br /><br /> '+
                    'User: <input type="text" id="_forum_username" value="'+(User.forumName? User.forumName : '')+'"/> Password: <input type="password" id="_forum_password" /> <input type="button" value="Login"'+
                                    'id="_luxbot_login" /><br />');   
                                    
        $("#_luxbot_login").click(initLogin);
    
    }


}
    String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
	
    String.prototype.between = function(first,second) {
            var x = this.indexOf(first) + first.length;
            var z = this.substring(x);
            var y = z.indexOf(second);
            return z.substring(z,y);
    };
	
    String.prototype.instr = function(strFind){
		return (this.indexOf(strFind) >= 0);
	};
	
    String.prototype.int = function() {
        var r = parseInt(this.replace(/,/g,''),10);
        if (isNaN(r)) r=-1;
        return r;
    };
	
    String.prototype.float = function() {
        var r = parseFloat(this.replace(/[^0-9\.]*/g,''),10);
        if (isNaN(r)) r=-1;
        return r;
    };
	
    Number.prototype.int = function() {
        return this;
    }

    function to_int(str) {
        str = str.replace(/[^0-9\.]/g, '');
        if (str === '') {
            return '';
        }
        return parseInt(str, 10);
    }
    
    function remove_delimiters(str) {
        str = str.replace(/[;:&?]/g,'');
        return str;
    }    

    function textBetween (str,first,second) {
        if (str === null) {
            alert("Unexpected page formatting, please reload.");
            return "";
        }
        var x = str.indexOf(first) + first.length;
        var z = str.substr(x);
        var y = z.indexOf(second);
        return z.substr(z,y);
    }
    
    function html_row() {
        // Turn the arguments object into an array
        var arr = [].slice.call(arguments)
        return "<tr><td>"+arr.join("</td><td>")+"</td></tr>";
    }

    var addCommas = function () {
        var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');

		return function (sValue) {
			sValue = String(sValue);
			
			while(sRegExp.test(sValue)) {
				sValue = sValue.replace(sRegExp, '$1,$2');
			}
			return sValue;
		};
	}();
    
    // KoC Utils
    var db = {        
        // This allows it to store info for different koc ids on same pc
        init: function(kocid) {
            if (kocid === undefined || kocid === null) {
				this.id = gmGetValue("lux_last_user",0);
				return;
            }
			gmSetValue("lux_last_user", kocid);
			this.id = kocid;
        },
        get: function(option,def) {
            option += "_"+this.id;
            var value = gmGetValue(option, def);
            if (option.indexOf('gold_')>0) 
                value = parseInt(value, 10);
            return value;
        },
		getInt: function(option, def) {
			var ret = this.get(option, def);
			return parseInt(ret, 10);
		},
        put: function(option,val) {
            option += "_"+this.id;
            gmSetValue(option,val);
        },
        del: function(option) {
            option += "_"+this.id;
            gmDeleteValue(option);
        }
    };


    var Page = {
		// This gets extended with each page.
        getCurrentPage:function() {
            return document.URL.substring(document.URL.indexOf('.com')+5, document.URL.indexOf('.php'));    
        }
        
        , getPlayerGold :function() {
            var gold = textBetween(document.body.innerHTML, 'Gold:<font color="#250202">', '<');

            if (gold !== '') {
                gold = gold.replace('B', '000000000');
                gold = gold.replace('M', '000000');
                gold = gold.replace('K', '000');
                gold = to_int(gold);
            }
            return (gold || 0);
        }
    }

    function timeToSeconds (time, timeunit) {
        if (timeunit.match('minute')) { time = time * 60; } 
        else if (timeunit.match('hour')) { time = time * 60*60; } 
        else if (timeunit.match('day')) { time = time * 60*60*24; }
        else if (timeunit.match('week')) { time = time * 60*60*24*7; }
        else { time = time; }
        return time;
    }
    
    function timeElapsed(time) {
		var d = new Date()
		var ds =  d.getTime();
		var timespan = Math.floor((ds - time) / 1000)
		time = "";
		if ((timespan > 1209600) && (time === "")) time = Math.floor(timespan / 604800) + ' weeks ago';
		if ((timespan > 604800) && (time === "")) time = '1 week ago';
		if ((timespan > 172800) && (time === "")) time = Math.floor(timespan / 86400) + ' days ago';
		if ((timespan > 86400) && (time === "")) time = '1 day ago';
		if ((timespan > 7200) && (time === "")) time = Math.floor(timespan / 3600) + ' hours ago';
		if ((timespan > 3600) && (time === "")) time = '1 hour ago';
		if ((timespan > 120) && (time === "")) time = Math.floor(timespan / 60) + ' minutes ago';
		if ((timespan > 60) && (time === "")) time = '1 minute ago';
		if ((timespan > 1) && (time === "")) time = timespan + ' seconds ago';    
		if (time === "") time = '1 second ago';        
        return time;
    }

    function checkOption(opt) {
        if (db.get(opt, "true") == "true")
            return true;
        else
            return false;
    }

    function parseResponse(text,key) {
        var tx = text.split("\t\t");
        var t;
        for (t in tx) {
            var s = tx[t].split("\t");
            if (s[0] == key)
                return s[1];
        }
        return "";
    }
        
    function getTableByHeading(heading) {
        var $table = $("table.table_lines > tbody > tr > th:contains('"+heading+"')");
		
		return $table.last().parents().eq(2);
    }

    function getRowValues(searchText) {
        var $cells = $("tr:contains('"+searchText+"'):last > td")
        
        var vals = []
        $.each($cells, function (index, val) {
            if (index === 0) return
            vals.push($(val).text().trim())
        });
        
        return vals
    }
    function makeCollapsable(action) {
    
        function collapseTable(table) {
            var $table = $(table)
            $table.find(".expando").text("+")
            $table.addClass("collapsed_table")
        }
    
        function onTableClick(e) {        
            var $table = $(e.target).closest("table")

            if ($table.is(".collapsed_table")) {
                $table.find(".expando").text("-");
            } else {
                $table.find(".expando").text("+");
            }
            $table.toggleClass("collapsed_table");

            saveCollapsed();
        }

        function saveCollapsed() {
            var store = [];
            $("table").each(function(i,e) {
                if ($(e).is(".collapsed_table"))
                    store.push(i)
            });
            db.put('coltables_' + action, store.join(','));
        }    
        
        $(document).on('click', "table.table_lines > tbody > tr > th", onTableClick)

        var $tables = $("table").each(function(i,e) {
            // This is the only table that koc handles for us.
            if ($(e).is(".personnel"))
                return;
                
            $(e).find("tbody > tr:eq(0) >th").append("<span class='expando'>-</span>");
        });
        
        var coltables = db.get('coltables_' + action, '').split(',');
        _.map(coltables, function (i) { collapseTable($tables.eq(i)); });
    }
    function logBase(stats, data, officers) {
        //stats=sa;da;spy;sentry;
        //details=fort;siege;econ;tech;conscription;turns;covertlevel;bonus
                            
        getLux('&a=base' +
                '&stats=' + stats + 
                '&data=' + data +
                '&officers=' + officers,
            function(responseDetails) {
                    log("LogBase: "+ responseDetails.responseText);
        });
    }

    function sendLogDetails(user, opponent, oppid, siege, data, weaponstring,officers, logid) {
        getLux('&a=logspy&user=' + user + 
                                '&enemy=' + opponent + ';' + oppid + ';' + siege +
                                '&data=' + data + 
                                '&weapons=' + weaponstring +
                                '&officers=' + officers +
                                '&logid=' + logid,
                    function(responseDetails) {
                            log("SendLogDetails Response: "+ responseDetails.responseText);
                            // alert(responseDetails.responseText);
                    });
    }

	function sendAttackLogDetails (user, type, oppid, opponent, user_damages, opponent_damages, user_losses, opponent_losses, gold_stolen, logid, time) {
        getLux( '&a=logattack&type=' + type + '&user=' + user + 
            '&enemy=' + opponent + ';' + oppid + ';' + opponent_damages + ';' + opponent_losses +
            '&data=' + user_damages + ';' + user_losses + 
            '&gold=' + gold_stolen +
            '&time=' + time +
            '&logid=' + logid,
            function(responseDetails) {
        
        });
    }    
    function logRecon(enemy, enemyid, logid, gold, data, weapons) {
        getLux('&a=logRecon&enemy=' + enemy + 
                                '&enemyid=' + enemyid +
                                '&logid=' + logid +
                                '&gold=' + gold +
                                '&data=' + data + 
                                '&weapons=' + weapons
                    , function(responseDetails) {
                            log("logRecon Response: "+ responseDetails.responseText);
                    });
    }    

    function SendConquestDetails(contype) {
        getLux('a=logcon&contype=' + contype);
    }

    function logStats(nick, kocid, chain, palliance, alliances, data, officers) {
        //data = comid;race;rank;highest_rank;tff;morale;fortifications;treasury
        getLux('&a=stats' +
                            '&nick=' + nick +
                            '&kocid=' + kocid +
                            '&chain='+chain+
                            '&palliance=' + palliance + 
                            '&alliances=' + alliances + 
                            '&data=' + data +
                            '&officers=' + officers,
                function(responseDetails) {
                        log("LogStats: "+ responseDetails.responseText);
                        // alert(responseDetails.responseText);
                });
    }
 
var Options = {
	// Goal of this is to make the plugins toggle-able.

   showUserOptions: function() {
		var makeToggle = function(name,value,opt1,opt2) {
			var current = db.get(value, "true");
			var html;
			
			if (!opt1)
				opt1 = "Enabled";
			if (!opt2)
				opt2 = "Disabled";
			if (current == "true") {
				html = "<tr><td> "+name+"</td><td><input type='radio' name='"+value+"' checked='checked' value='true'>"+opt1+"</input>"
						+"<input type='radio' name='"+value+"' value='false'>"+opt2+"</input></tr>";
			} else {
				html = "<tr><td> "+name+"</td><td><input type='radio' name='"+value+"' value='true'>"+opt1+"</input>"
				+"<input type='radio' name='"+value+"' checked='checked' value='false'>"+opt2+"</input></tr>";
			}
			return html;
		}
		var c = (User.logself === 1) ?  ' checked="checked"' : '';
		
		var battlelog = db.get('battlelog', 0);
		
		GUI.showMessage('<h3>LuXBOT User Options</h3> <br />\
		<fieldset><legend>User Options</legend>\
			Log own details and gold from base: <input type="checkbox" id="_luxbot_logself"' + c + ' /><br />\
			Battle Log: <input type="radio" name="_luxbot_battlelog" value="0"' + (battlelog === 0 ? ' checked="checked"' : '') + ' />\
				No Action <input type="radio" name="_luxbot_battlelog" value="1"' + (battlelog === 1 ? ' checked="checked"' : '') + ' /> \
				Show Full Log with Bottom Scroll <input type="radio" name="_luxbot_battlelog" value="2"' + (battlelog === 2 ? ' checked="checked"' : '') + ' /> \
				Show Full Log with Top Scroll <input type="radio" name="_luxbot_battlelog" value="3"' + (battlelog === 3 ? ' checked="checked"' : '') + ' /> \
				Show Full Log with Redirect<br />\
			Always Focus Security Pages: <input type="checkbox" id="_luxbot_securitycheck" ' + (db.get('securityfocus', 0) === 1 ? ' checked="checked"' : '') + '/></fieldset>'
			+'<table>'
			+makeToggle("Turn Clock","option_clock") 
			+makeToggle("Stats In Command Center","option_commandCenterStats","Top","Side") 
			+makeToggle("Attack Targets","option_Targets") 
			// +makeToggle("Show Enemy Sab List","option_sabTargets") 
			+makeToggle("Show Fake Sab Targets","option_fakeSabTargets") 
			+makeToggle("Show Personal Gold Projections","option_goldProjection") 
			+makeToggle("Show Stats Changes in Armory","option_armory_diff") 
			+makeToggle("Show Armory Value Graph in Armory","option_armory_graph") 
			+"</table>"
			
			+ '<br /><br /><input type="button" value="Save!" id="_luxbot_save" /> <br />');
			
		document.getElementById("_luxbot_save").addEventListener('click', GUI.saveUserOptions, true);
	}
 
	, saveUserOptions: function() {

		_.each(Constants.options, function (option) {
			db.put("option_"+option, $("input[name='option_"+option+"']:checked").val());
		});
		
		GUI.toggleGUI();
	}
}
PluginHelper = {
	isEnabled : function(str) {
		var plugin = Plugins[str];
		var storedAs = 'plugin_enabled_' + str;
		
		db.get( storedAs, plugin.defaultEnabled);
	},
	
	onPage : function(str, page) {
		var plugin = Plugins[str];

		var pages = plugin.enabledPages;
		if ( ! _.isArray(pages) ) {
			return true;
		}
		return $.inArray(page, pages);
	},
	
	toRun : function (str, page) {

		return _.and(
			this.isEnabled(str),
			this.onPage(str, page)
		);
	}
}

Page.armory = {
    
        run : function() {
            $("table.table_lines:eq(2)").attr("id","military_effectiveness");
            $("table.table_lines:eq(5)").attr("id","buy_weapons_form");
            
            //next two lines adds the clickable buttons
            rows = $("form[name='buyform']").find("table>tbody>tr");
            Buttons.init(User.gold, getTableByHeading("Buy Weapons"), 2);


            this.formatPage()
            this.addBuyButton();
        }
        
        , formatPage : function () { 
            var spyWeaps = Constants.spyWeaps.join(",");
            var sentryWeaps = Constants.sentryWeaps.join(",");
            var daWeaps = Constants.daWeaps.join(",");
            
            var stable = $("table:contains('Military Effectiveness')").last();
            var sa = $(stable).find("tr:contains('Strike Action'):first>td:eq(1)").text();
            var da = $(stable).find("tr:contains('Defensive Action'):first>td:eq(1)").text();
            var spy = $(stable).find("tr:contains('Spy Rating'):first>td:eq(1)").text();
            var sentry = $(stable).find("tr:contains('Sentry Rating'):first>td:eq(1)").text();
            
            if (checkOption('option_armory_diff'))
                this.armory_diff(sa,da,spy,sentry);
                    
            //Send Armory to Luxbot
            var spyWeapsQty = 0;
            var sentryWeapsQty = 0;
            var daWeapsQty = 0;
            var saWeapsQty = 0;
            
            function retrieveWeapons(str) {
                //name:qty:repair
                str = str.split("\n");
                str[1] = str[1].split(" (")[0];
                
                if (spyWeaps.instr($.trim(str[1])))
                    spyWeapsQty +=  $.trim(str[2]).int();
                else if (sentryWeaps.instr($.trim(str[1])))
                    sentryWeapsQty +=  $.trim(str[2]).int();
                else if (daWeaps.instr($.trim(str[1])))
                    daWeapsQty += $.trim(str[2]).int();
                else 
                    saWeapsQty +=  $.trim(str[2]).int();
                    
                return $.trim(str[1]) + ':' + $.trim(str[2]) + ':' + $.trim(str[3]) + ';';
            }

            // This will be sent to luxbot server.
            var tempvar = ''; 
            
            // gets an array of weapons and tools
            var arr = $("input[name='doscrapsell']").parent().parent().parent().parent().parent().parent();


            arr.each(function(){
                tempvar+=retrieveWeapons($(this).text());
            });
            
            this.sabLogs_update(tempvar);
            this.sabLogs_init();
            
            this.armory_upgradeSuggestions(User);
            this.armory_aat();
            db.put('sa',sa);
            db.put('da',da);
            db.put('spy',spy);
            db.put('sentry',sentry);
            db.put('sentryWeaps',sentryWeapsQty);
            db.put('spyWeaps',spyWeapsQty);
            db.put('daWeaps',daWeapsQty);
            db.put('saWeaps',saWeapsQty);
            
            postLux('&a=armory', '&data='+tempvar); // pass the info to the db. 
            
            if (checkOption('option_armory_graph'))
                this.showStats();
        }    
  
        , showStats : function () {
            $(".personnel").before('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th>Armory Value Stats</th></tr><tr><td><div id="container"></div></td></tr></tbody></table><br />');

            getLux('&a=armoryStats',function(a) {
                
                    window.chart = new Highcharts.StockChart({
                        chart : {
                            renderTo : 'container'
                          , zoom : 'none'
                            // width: '100%'
                        },
                        rangeSelector: {
                            enabled: false
                        },
                        scrollbar : {
                            enabled : false
                        },
                        yAxis: {
                            min: 0
                            // startOnTick: false,
                            // endOnTick: false    
                        },

                        title : {
                            text : 'Armory Value'
                        },
                        
                        series : [{
                            name : 'Weapon Value',
                            data : $.parseJSON(a.responseText),
                            tooltip: {
                                valueDecimals: 0
                            }
                        }]
                    });        
                });
            }
            
        , armory_diff : function(sa,da,spy,sentry) {
        
            function describeDiff(diff,total) {
                if (diff === 0)
                    return '<span style="color:white"> + '+diff+'</span></td><td>&nbsp;';
                else if (diff < 0)
                    diff = '<span style="color:red"> '+addCommas(diff)+'</span></td><td>&nbsp;&nbsp;<span style="color:red">  '+(diff/total ).toFixed(4)+' %</span>';
                else
                    diff = '<span style="color:green"> + '+addCommas(diff)+'</td><td>&nbsp;&nbsp;<span style="color:green">  + '+(diff/total).toFixed(4)+' %</span>';
                return diff;
            }
            
            $("#military_effectiveness").after('<table id="armory_diff" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody id="diffFirstRow"><tr><th colspan=3>Stats Differences</th></tr></tbody></table>');
            
            $("#diffFirstRow").append("<tr><td>Strike Action: </td><td>"+describeDiff(sa.int() - User.sa.int(),User.sa.int())+"</td></tr>");
            $("#diffFirstRow").append("<tr><td>Defensive Action: </td><td>"+describeDiff(da.int() - User.da.int(),User.da.int())+"</td></tr>");
            $("#diffFirstRow").append("<tr><td>Spy: </td><td>"+describeDiff(spy.int() - User.spy.int(),User.spy.int())+"</td></tr>");
            $("#diffFirstRow").append("<tr><td>Sentry: </td><td>"+describeDiff(sentry.int() - User.sentry.int(),User.sentry.int())+"</td></tr>");
        
        }

        , addBuyButton : function() {
            var html ='<td colspan="5" align="center"><br><input name="buybut" type="submit" value="Buy Weapons" onclick="document.buyform.buybut.value="Buying.."; document.buyform.buybut.disabled=true; document.buyform.submit();"><br><br></td>';         

            $("#buy_weapons_form>tbody>tr").eq(1).before("<tr>"+html+"</tr>");
        }
        
        , sabLogs_update : function(weapList) {
            weapList = ';'+weapList;    //this is hack is important because of "shield" vs "invis shield"

            var d = new Date()
            var time = "" + d.getTime() + "";

            var old_weapList = db.get('lux_weaponList', '');
            old_weapList = old_weapList.split(';');
            var losses = '';
            $(old_weapList).each(function (i,e) {
                if (e) {
                    var weapName = e.split(':')[0];
                    var old_weapCount = parseInt(e.split(':')[1].replace(/[^0-9]/g,''), 10);
                    
                    //notice we search for weapName after a semi-colon, explaining prev hack.
                    var new_weapCount = parseInt(textBetween(weapList, ';'+weapName+':', ':').replace(/[^0-9]/g,''), 10);
                    
                    if (old_weapCount > new_weapCount) {
                        losses += (old_weapCount-new_weapCount) +":"+weapName +":"+time+";";
                    }
                    //handle if it is no longer in the list
                    if (weapList.indexOf(';'+weapName+':')== -1) {
                        losses += (old_weapCount) +":"+weapName+":"+time +";";
                    }
                }
            });
            
            if (losses !== '') {

                var arr = losses.split(';');
                var i=0;
                var h ="";
                for (i=0;i<=arr.length;i++) {
                    if(arr[i]){
                        var cols = arr[i].split(":");
                        h += "You have lost "+ cols[0] + " "+cols[1]+"s<br />";
                    }
                }

                
                
                
                $("body").append("<table id='_lux_sabbed_popup'><tbody><tr><th>Attention!</th></tr></tbody></table>");
                $('#_lux_sabbed_popup>tbody').append("<tr><td>"+h+"</td></tr>");
                
                
                var old_losses = db.get('lux_lostWeapons','');
                db.put('lux_lostWeapons', losses + old_losses);
            }
            db.put('lux_weaponList', weapList);
        }

        , sabLogs_init: function() {
            $("#military_effectiveness").before('<table id="_lux_sabbed" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"></table>');
            $("#buy_weapons_form").before('<table id="_lux_upgrades" class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"></table>');
            this.sabLogs_display();
        }
        
        , sabLogs_display: function() {
            var losses = db.get('lux_lostWeapons','').split(';');
            var i;
            $("#_lux_sabbed").html('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th colspan=2>Lost Weapons Log </th></tr><tr><td colspan=2 style="border-bottom:none"><div id="lux_sablogs_2"></div></td></tr></tbody></table>');
            $("#lux_sablogs_2").html('<table width="100%" cellspacing="0" cellpadding="6" border="0"><tbody></tbody></table>');
            
            for (i=0;i<5;i++) {
                if(losses[i]){
                    var cols = losses[i].split(':');
                    $("#lux_sablogs_2>table>tbody").append("<tr><td>"+cols[0]+" "+cols[1]+"s</td><td align=right>"+timeElapsed(cols[2])+"</td></tr>");
                }
            }
            $("#lux_sablogs_2>table>tbody").append("<tr><td>(<a id='viewSablog'>View All</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
            $("#clearSablog").click(function() { sabLogs_clear();});
            $("#viewSablog").click(function() { sabLogs_viewAll();});
        }
        
        , sabLogs_clear: function() {
            db.put("lux_lostWeapons",'');
            $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();
        }
        
        , sabLogs_viewAll : function() {
            $("#lux_sablogs_2").css("overflow-y","scroll");
            $("#lux_sablogs_2").css("height","180px");
            var losses = db.get('lux_lostWeapons','').split(';');
            $("#lux_sablogs_2>table>tbody>tr>td").parent().remove();
            
            var i;
            for (i=0;i<losses.length;i++) {
                if(losses[i]){
                    var cols = losses[i].split(':');
                    $("#lux_sablogs_2>table>tbody").append("<tr><td>"+cols[0]+" "+cols[1]+"s</td><td align=right>"+timeElapsed(cols[2])+"</td></tr>");
                }
            }
            $("#_lux_sabbed>table>tbody").append("<tr><td>(<a id='viewSablogLess'>View Less</a>)</td><td>(<a id='clearSablog'>Clear</a>)</td></tr>");
            $("#clearSablog").click(function() { sabLogs_clear();});
            $("#viewSablogLess").click(function() { sabLogs_display();});
        }

        , armory_aat: function() {
            var sellVal = 0;
            $("input[name='doscrapsell']").each(function(i,e) {
                var row = $(e).parents("tr").eq(1);        
                var qty = to_int($(row).children("td").eq(1).text());
                var cost = to_int($(e).val());
        
                sellVal += qty*cost;
            });
            var retailValue = sellVal*10/7;
            
            
            $("input[name='doscrapsell']").each(function(i,e) {
                var row = $(e).parents("tr").eq(1);        
                var cost = to_int($(e).val());
                $(row).children("td:eq(0)").append(" (" + Math.floor(retailValue / 400 / (cost*10/7)) + " aat)");
            });        
            
            $("table.table_lines:eq(0)>tbody>tr:eq(0)>th").append(" (Total Sell Off Value: "+ addCommas(sellVal)+" Gold)");
        }
        
        , armory_upgradeSuggestions: function(User) {
            var bpms, chars, skins, ivs, da_bonus, sa_bonus, da_bonus_new, sa_bonus_new, sa_cost, da_cost, da_sellRow, sa_sellRow;
            var gold = User.gold;
            function get_da(fort){
                var cb = 0;
                if (fort == "Camp") cb = 0;
                if (fort == "Stockade") cb = 1;
                if (fort == "Rabid") cb = 2;
                if (fort == "Walled") cb = 3;
                if (fort == "Towers") cb = 4;
                if (fort == "Battlements") cb = 5;
                if (fort == "Portcullis") cb = 6;
                if (fort == "Boiling Oil") cb = 7;
                if (fort == "Trenches") cb = 8;
                if (fort == "Moat") cb = 9;
                if (fort == "Drawbridge") cb = 10;
                if (fort == "Fortress") cb = 11;
                if (fort == "Stronghold") cb = 12;
                if (fort == "Palace") cb = 13;
                if (fort == "Keep") cb = 14;
                if (fort == "Citadel") cb = 15;
                if (fort == "Hand of God") cb = 16;
                //cb = Math.pow(1.25,cb);
                //cb = Math.round(cb*1000)/1000;
                return cb;
            }

            function get_sa(siege){
                var cb = 0;
                if (siege == "None") cb = 0;
                if (siege == "Flaming Arrows") cb = 1;
                if (siege == "Ballistas") cb = 2;
                if (siege == "Battering Rams") cb = 3;
                if (siege == "Ladders") cb = 4;
                if (siege == "Trojan") cb = 5;
                if (siege == "Catapults") cb = 6;
                if (siege == "War Elephants") cb = 7;
                if (siege == "Siege Towers") cb = 8;
                if (siege == "Trebuchets") cb = 9;
                if (siege == "Black Powder") cb = 10;
                if (siege == "Sappers") cb = 11;
                if (siege == "Dynamite") cb = 12;
                if (siege == "Greek Fire") cb = 13;
                if (siege == "Cannons") cb = 14;
                //cb = Math.pow(1.3,cb);
                //cb = Math.round(cb*1000)/1000;
                return cb;
            }


            var race = User.race;
            var da_race_factor = 1;
            var sa_race_factor = 1;
            if (race == "Dwarfs") 
                da_race_factor = 1.4;
            if (race == "Orcs") {
                da_race_factor = 1.2;
                sa_race_factor = 1.35;
            }

            var fort = $("form:nth-child(4) td:nth-child(1)").text();
            fort = fort.substr(0,fort.indexOf("("));
            var siege = $("form:nth-child(5) td:nth-child(1)").text();
            siege = siege.substr(0,siege.indexOf("("));
            
            var da_factor = get_da($.trim(fort));
            var sa_factor = get_sa($.trim(siege));


            
            var t = $("#military_effectiveness");
            var sa = to_int($(t).find("tbody>tr:eq(1)>td:eq(1)").text());
            var da = to_int($(t).find("tbody>tr:eq(2)>td:eq(1)").text());
        
            //sure this can be optimized but cba right now
            var saCost = new Array(40000,80000,160000,320000,640000,1280000,2560000,5120000,10240000,20480000,40960000,81920000,163840000,327680000);
            var daCost = new Array(40000,80000,160000,320000,640000,1280000,2560000,5120000,10240000,20480000,40960000,81920000,163840000,327680000,655360000,1310720000);

            sa_cost = saCost[sa_factor];
            da_cost = daCost[da_factor];
            
                sa_bonus = Math.pow(1.3,sa_factor);
                sa_bonus_new = Math.pow(1.3,sa_factor+1);
                da_bonus = Math.pow(1.25,da_factor);
                da_bonus_new = Math.pow(1.25,da_factor+1);
            
            var sell_ivs = Math.ceil((da_cost - gold) / 700000 );
            var sell_bpms = Math.ceil((sa_cost - gold) / 700000 );
            var sell_chars = Math.ceil((sa_cost - gold) / 315000 );
            var sell_skins = Math.ceil((da_cost - gold) / 140000 );
            
                var valPerBPM = sa_race_factor * 1000 * 5 * ((db.get("Tech",100) +1)/ 100) * (db.get("Offiebonus",100) / 100);
                var valPerCHA = sa_race_factor * 600 * 5 * (db.get("Tech",100) / 100) * (db.get("Offiebonus",100) / 100);
                var valPerIS = da_race_factor * 1000 * 5 * (db.get("Tech",100) / 100) * (db.get("Offiebonus",100) / 100);
                var valPerDS = da_race_factor * 256 * 5 * (db.get("Tech",100) / 100) * (db.get("Offiebonus",100) / 100);    
            
            var weaps = db.get('lux_weaponList');
            if (weaps.instr("Invisibility Shield"))
                ivs = to_int(textBetween(weaps,"Invisibility Shield:",":"));
            else
                ivs = 0;
            if (weaps.instr("Blackpowder Missile:"))
                bpms = to_int(textBetween(weaps,"Blackpowder Missile:",":"));
            else
                bpms = 0;
            if (weaps.instr("Chariot:"))
                chars = to_int(textBetween(weaps,"Chariot:",":"));
            else
                chars = 0;
            if (weaps.instr("Dragonskin:"))
                skins = to_int(textBetween(weaps,"Dragonskin:",":"));
            else
                skins = 0;
            
            
            var oldDa = Math.floor((valPerDS * skins + valPerIS *ivs) *da_bonus);
            var oldSa = Math.floor((valPerCHA * chars + valPerBPM *bpms) *sa_bonus);

            var newDa_skins = 0;
            var newDa_ivs = 0;
            var newSa_chars = 0;
            var newSa_bpms = 0;
            if (skins >= sell_skins) { 
                newDa_skins = valPerDS * (skins-sell_skins) + valPerIS *ivs;
                newDa_skins *= da_bonus_new;
                newDa_skins = Math.floor(newDa_skins);
            }
            if (ivs >= sell_ivs) {
                newDa_ivs = valPerDS *skins + valPerIS *(ivs-sell_ivs);
                newDa_ivs *= da_bonus_new;
                newDa_ivs = Math.floor(newDa_ivs);

            }
            
            if (chars >= sell_chars) {
                newSa_chars = valPerCHA *(chars - sell_chars) + valPerBPM*bpms;
                newSa_chars *= sa_bonus_new;
                newSa_chars = Math.floor(newSa_chars);

            } 
            if (bpms >= sell_bpms) {
                newSa_bpms = valPerCHA *(chars) + valPerBPM*(bpms-sell_bpms);
                newSa_bpms *= sa_bonus_new;
                newSa_bpms = Math.floor(newSa_bpms);
                
            }

            //DA first
            //Create thing with id ="_lux_armory_suggestions"
            var da_html = '<span style="color:red"> Not enough tools</span>';
            if (da_factor < 16) {
                da_sellRow = addCommas(da_cost);

                if (ivs >= sell_ivs) {
                    if (sell_ivs > 0)     
                        da_sellRow = addCommas(da_cost) + ' (Sell ' + addCommas(sell_ivs) + ' Invisibility Shields)';
                        
                    if (oldDa < newDa_ivs) 
                         da_html = addCommas(Math.floor(newDa_ivs)) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(newDa_ivs-oldDa))) + ')';
                    else 
                         da_html = addCommas(Math.floor(newDa_ivs)) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(newDa_ivs-oldDa))) + ')';
                }
                if (skins >= sell_skins) {
                    if (sell_skins > 0)     
                        da_sellRow = addCommas(da_cost) + ' (Sell ' + addCommas(sell_skins) + ' Dragonskins)';
                        
                    if (oldDa < newDa_skins) 
                         da_html = addCommas(Math.floor(newDa_skins)) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(newDa_skins-oldDa))) + ')';
                    else 
                         da_html = addCommas(Math.floor(newDa_skins)) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(newDa_skins-oldDa))) + ')';
                } 
            }
            
            //SA second
            var sa_html = '<span style="color:red"> Not enough tools</span>';
            if (sa_factor < 14) {
                 sa_sellRow = addCommas(sa_cost);
                
                if (bpms >= sell_bpms) {
                    if (sell_bpms > 0)    
                        sa_sellRow = addCommas(sa_cost) + ' (Sell ' + addCommas(sell_bpms) + ' Blackpowder Missles)';
                        
                    if (newSa_bpms > oldSa) 
                        sa_html = addCommas(newSa_bpms) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_bpms))) + ')';
                    else 
                        sa_html = addCommas(newSa_bpms) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_bpms))) + ')';
                } 
                if (chars >= sell_chars) {
                    if (sell_chars > 0)     
                        sa_sellRow = addCommas(sa_cost) + ' (Sell ' + addCommas(sell_chars) + ' Chariots)';
                        
                    if (newSa_chars > oldSa) 
                        sa_html = addCommas(newSa_chars) + ' (<a style="color:green"><b>+</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_chars))) + ')';
                    else 
                        sa_html = addCommas(newSa_chars) + ' (<a style="color:red"><b>-</b></a>' + addCommas(Math.floor(Math.abs(oldSa-newSa_chars))) + ')';
                }
            }    
            
            $("#_lux_upgrades").html('<table class="table_lines" width="100%" cellspacing="0" cellpadding="6" border="0"><tbody><tr><th colspan="2">Upgrade Suggestions</th></tr></tbody></table>');
            var temp = $("#_lux_upgrades>tbody");
            temp.append("<tr><td><b>Current Fortifications:</b></td><td align='right'>"+fort+" (" + da_factor + ")</td></tr>");
            if(da_factor<16) {
                temp.append("<tr><td>Upgrade Cost:</td><td align='right'>"+da_sellRow+"</td></tr>");
                temp.append("<tr><td>Estimated new DA</td><td align='right'>"+da_html+"</td></tr>");
            } else
                temp.append("<tr><td colspan=2>There are no more upgrades</td></tr>");
                
            temp.append("<tr><td><b>Current Siege:</b></td><td align='right'>"+siege+" (" + sa_factor + ")</td></tr>");
            if (sa_factor<14) {
                temp.append("<tr><td>Upgrade Cost:</td><td align='right'>"+sa_sellRow+"</td></tr>");
                temp.append("<tr><td>Estimated new SA</td><td align='right'>"+sa_html+"</td></tr>");
            } else
                temp.append("<tr><td colspan=2>There are no more upgrades</td></tr>");
            
        }
        
}

Page.attack = {

    run : function() {
    
            this.getSabInfo();
            this.checkCap();
    }
    
    , getSabInfo : function () {
        var userid = document.URL.substr(document.URL.indexOf('=')+1, 7);
        if (userid == "http://") {
            var getopponent = document.getElementsByName('defender_id');
            userid = getopponent[0].value;
        }
        

        $(".personnel").before("<table id='lux_sabbable' class='table_lines' width='100%' cellpadding='6' cellSpacing='0'><th colspan='3'>LuXBot Info - Sabbable<span style='float:right;'><a href='http://www.kingsofchaos.com/intelfile.php?asset_id="+userid+"'>(Logs)</a></span></th></table>");
    
        

        $("input[name='numsab']").after("&nbsp;<input type='button' id='bumpup' value='+1' />");
        $("#bumpup").click(function() {
            $("input[name='numsab']").val($("input[name='numsab']").val().int() + 1);
        });
        
        getLux('&a=getsab2&userid=' + userid,
            function(responseDetails) {
                var i;
                if (responseDetails.responseText == '403') {
                    $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">Access denied</td>');
                } else if (responseDetails.responseText == 'N/A') {
                    $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">No data available</td>');
                } else if (responseDetails.responseText.indexOf('<') > -1) {
                    $("#lux_sabbable").append('<td colspan="2" style="font-weight:bold;text-align:center;">Server Error. Contact Admin.</td>');
                } else {
                    var rt = responseDetails.responseText;
                    var sabInfo = parseResponse(rt, "sabinfo");
                    var hilight = parseResponse(rt, "hilight");
                    var userInfo = sabInfo.split(';');

                    for (i = 0; i < userInfo.length-1; i+=2) {
                        var builder = '<tr><td class="sabbable">';
                        if (! isNaN(userInfo[i].charAt(0)))
                            builder += '<span>'+userInfo[i]+'</span>';
                        else
                            builder += userInfo[i];
                        builder += '</td><td class="sabbable"><span>'+userInfo[i+1]+"</span></td></tr>";
                        
                         $("#lux_sabbable").append(builder);
                    }

                    if (hilight.length > 0)
                        $("#lux_sabbable").find("td").eq(hilight).css("border","1px solid #00FF66");
                    
                    $(".sabbable>span").click(function(e) {
                        var t = $(e.target).text();
                        t = t.trim().split(" ");
                        var count = t.shift();
                        var weap = t.join(" ");
                        weap = weap.substr(0,weap.length-1);//take off last "s"

                        var val = $("option[label='"+weap+"']").val();
                        $("select[name='enemy_weapon']").val(val);
                        $("input[name='numsab']").val(count);
                        $("input[name='numspies']").val('1');
                        $("select[name='sabturns']").val('5');
                    });
                }
            });
    }
    
    , checkCap: function() {
        var getopponent = document.getElementsByName('defender_id');
        var userid = getopponent[0].value;
        //alert(userid);
        
        if (document.body.innerHTML.indexOf('Your opponent has already suffered heavy losses today') != -1) {
            var data = userid;
            postLux('&a=logcap','targetID='+userid,function(){});
        }
    }
}

    //Attack Logs
Page.attacklog = {
    run : function() {
        //send entire attacklog to lux
        var defendedRows = $("td.content > table.attacklog > tbody > tr");
        this.attackLogHelper(defendedRows,0);
        
        var $attackRows = $("td.content > p > table.attacklog > tbody > tr");
        this.attackLogHelper($attackRows, -1);
    }
    

    , attackLogHelper: function ($rows, shift ) {
        // TODO: TEST THIS
        function betweenTags (x) {
		//eg broken..
			var text = '<' + x.html();
            var y = textBetween($(text).text(), ">","<");
			log (x + ".." + y);
			x = y;
			return y;
        }
        
		
        for (var i = 2; i < $rows.size()-1; i++) {
			
            var rawData = $rows.eq(i).html().split("<td");
            //alert(rawData[3]);
            //this removes the junk to get value (ie. align="right">2</td> becomes 2)
            var enemy_id;
            var enemy;
            if (rawData[3].indexOf("not active") == -1) {
                enemy_id = rawData[3].match(/id=(\d*)"/)[1];
                enemy = rawData[3].match(/\d">(.+)<\/a>/)[1];
            } else {
                enemy_id = "";
                enemy = rawData[3].match(/">(.+)\(not active/)[1];
            }
            var logid = rawData[5+shift].match(/id=(\d*)"/)[1];
            var goldTemp = rawData[5+shift].match(/">([\d,]*) Gold/);
            var gold;
            if (goldTemp== null)
                gold = "defended";
            else 
                gold=goldTemp[1];

            rawData = _.map(rawData, betweenTags );
            var time = rawData[1];
            var timeunit = rawData[2];
            var type = rawData[4];
            var enemy_losses = rawData[6+shift];
            var your_losses = rawData[7+shift];
            var enemy_damage = rawData[8+shift];
            var your_damage = rawData[9+shift];
                
            //alert(your_damage);
            
            time = timeToSeconds(time,timeunit);
            if(!enemy_id)
                enemy_id=":invalid";//DONATO, Check this before release

            if(type.indexOf("attack")!=-1 || type.indexOf("raid")!=-1)    //this seems contradictory but it makes sense
                type="defend";
            else
                type="attack";
                
            //alert('time: ' + time + ' :: enemy: ' + enemy + ' :: gold: ' + gold + ' :: enemy_losses: ' + enemy_losses + ' :: your_losses: ' + your_losses + ' ::  enemy_damage: ' + enemy_damage + ' :: your_damage: ' + your_damage + ' :: logid: ' + logid);
            sendAttackLogDetails(User.kocnick, type, enemy_id, enemy, your_damage, enemy_damage, your_losses, enemy_losses, gold, logid, time);
        }
    }

 }
    
    //
    // Command Center Functions
    //
Page.base = {
    run: function() {
        this.basePage();
        this.baseLayout();
        this.commandCenterStats();
        makeCollapsable(action);
    }
    
    , commandCenterStats: function() {
        var $tbody = $("#tbody");

        if (checkOption('option_commandCenterStats'))
            $tbody.prepend("<tr id='ff-stats'><td colspan='2'><table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Your Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table></td></tr>");//prepend(tab);
        else
            $("tr:contains('Recent Attacks'):last").parent().parent().before("<table class='table_lines' cellpadding=6 width='100%'><tbody><tr><th colspan='2' align='center'>Your Statistics</th></tr><tr><td id='ff-load'></td></tr></tbody></table>");//prepend(tab);
            getLux("&a=sabstats",
             function(r) { $("#ff-load").html(""+r.responseText); 
        }); 
    }

    , baseLayout: function() {
        var $tbody = $("td.content > table > tbody").last()
        $tbody.attr("id","tbody");
        
        var $cols = $tbody.children("tr").children("td")
        $cols.children("br").remove()
        
        $cols.first().attr("id", "base_left_col")
        $cols.last().attr("id", "base_right_col")
        
        var $military_overview = getTableByHeading("Military Overview")
                        .addClass("military_overview")
                        .remove()
        var $military_effectiveness = getTableByHeading("Military Effectiveness")
                        .addClass("military_effectiveness")
                        .remove()
        var $personnel = getTableByHeading("Personnel")
        var $user_info = getTableByHeading("User Info")
                        .addClass("user_info")
        var $recent_attacks = getTableByHeading("Recent Attacks on You")
                        .addClass("recent_attacks")
                        .remove()
        var $commander_notice = getTableByHeading("Notice from Commander")
                        .addClass("commander_notice")
                        .remove()
        var $grow_army = getTableByHeading("Grow Your Army")
                        .addClass("grow_army")
                        .remove()
        var $officers = getTableByHeading("Officers")
                        .remove()
        $("#base_right_col").prepend($military_overview )
        $("#base_right_col").prepend($officers )
        $("#base_right_col").prepend($military_effectiveness )
        $("#base_left_col").append($recent_attacks )
        // $("#base_left_col").append($grow_army ) // Causes errors?
        $(".user_info").after($commander_notice)
        
        //if player is blocking ads, this adds some extra space.
         $("td.content").parent().children("td").eq(2).attr("width", "50");
    }
      
    , basePage: function() {
        db.put('race', textBetween($("head>link").eq(3).attr("href"),"css/",".css"));

        var stable = $("table:contains('Military Effectiveness')").last();
        var sa = $(stable).find("tr:contains('Strike Action'):first>td:eq(1)").text();
        var da = $(stable).find("tr:contains('Defensive Action'):first>td:eq(1)").text();
        var spy = $(stable).find("tr:contains('Spy Rating'):first>td:eq(1)").text();
        var sentry = $(stable).find("tr:contains('Sentry Rating'):first>td:eq(1)").text();

        
        stable = $("table:contains('Military Overview')").last();
        var fort = $(stable).find("tr:contains('Fortification'):first>td:eq(1)").text();
        var siege = $(stable).find("tr:contains('Siege Technology'):first>td:eq(1)").text();
        var economy = $(stable).find("tr:contains('Economy'):first>td:eq(1)").text();
        var technology = $(stable).find("tr:contains('Technology'):last>td:eq(1)").text();
        var conscription = $(stable).find("tr:contains('Conscription'):first>td:eq(1)").text();
        conscription = conscription.substr(0, conscription.indexOf(' soldiers'));
        var tff = $("body").find("tr:contains('Total Fighting Force'):last>td:eq(1)").text();
        var turns = $(stable).find("tr:contains('Game Turns'):first>td:eq(1)").text();
        turns = turns.substr(0,turns.indexOf(" /"));
        var covertlevel = $(stable).find("tr:contains('Covert Level'):first>td:eq(1)").text();
        var income = $(stable).find("tr:contains('Projected Income'):first>td:eq(1)").text();
        income = income.substr(0,income.indexOf(" Gold")).int();

        var officers = Page.stats.stats_getOfficers(false);

        var bonus = textBetween($(".officers>tbody>tr:last").text(), "(x ",")");
        
		// this will help for paging through officers and recording their info
       // nav();
        
        db.put('sa',sa);
        db.put('da',da);
        db.put('spy',spy);
        db.put('sentry',sentry);
        db.put('income',income + "");
        db.put('tff',tff);
        
        logBase(sa.int() + ";"+da.int()+";"+spy.int()+";"+sentry.int(), fort+";"+siege+";"+economy+";"+technology+";"+conscription.int()+";"+turns.int()+";"+covertlevel+";"+bonus, officers);
    }
}
Page.battlefield = {

	statsLoadedId : undefined,
	allKocids : [],
	
    run: function() { 
        this.battlefieldAct();
        this.showUserInfoB();
    }
    
    , battlefieldAct: function () {
        var $playerRows = $('tr.player');
         
        var logInfo = this.logGold($playerRows);
		this.allKocids = _.keys(logInfo);
		
		var self = this;
		postLuxJson('&a=battlefield', logInfo,
			function(r) {
				var json = $.parseJSON(r.responseText);
				
				self.showGold(json);
			});	
		return;
		
		
        this.bf_needsRecon($playerRows);
        this.bf_online($playerRows);

        var $nav = $("tr.nav");
        if ($nav.size()) {
            var q = $nav.find('a');
            q.on("click", this.battlefieldAct);
            if (q.size() > 1) {
                $(q[1]).on('click', this.battlefieldAct);
                q[1].accessKey = 'c';
                q[0].accessKey = 'x';
            } else {
                if (q[0].innerHTML.indexOf('lt') !== -1) {
                    q[0].accessKey = 'x';
                } else {
                    q[0].accessKey = 'c';
                }
            }
        }
    }
    
    , logGold: function ($playerRows) {
		var logInfo = {};
		
        $playerRows.each(function(index, row) {
			var $cols = $(row).find('td');
            var kocid = $(row).attr("user_id");
            if ( !kocid ) { return; }

			var gold = to_int( $cols.eq(5).text() );
			if (name == User.kocnick && User.logself === 0) {
				gold = '';
			}

			logInfo[kocid] ={
					'name'  : $cols.eq(2).text(),
					'race'  : $cols.eq(4).text().trim(),
					'gold'  : gold,
					'rank'  : to_int($cols.eq(6).text()),
					'alliance' : $.trim($cols.eq(1).text()),
					'tff'   : to_int($cols.eq(3).text())
			};
        });

        return logInfo;
    }
    
    , showGold: function (json) {

		log("ShowGold");
		log(json);
		_.each(json, function(obj, id) {
			log("Trying to load " + id + " " + obj);
			var GoldTd = $("tr[user_id='"+id+"'] > td").eq(5);
			GoldTd.text( addCommas(obj["gold"]) + ' Gold, ' + obj["update"]);
			GoldTd.css("color","#aaaaaa");
			GoldTd.css("font-style","italic");
		});
    }
        
    , bf_needsRecon: function ($pRows) {
        
        var kocids = '';
        $pRows.each(function() {
            kocids += textBetween($(this).children('td').eq(2).html(),'id=','">')+",";
        });
        kocids = kocids.slice(0,-1);
        if (kocids === '') {
            return;
        }
        
        var page = textBetween($(".battlefield>tbody>tr").last().text(), 'page ', ' of'); 
        var ppx = (page-1)*20+1;


        getLux('&a=bf_needsrecon&u=' + kocids,
            function(r) {
                //log(r.responseText);
                var i, s, id, rank, name;
                var players = r.responseText.split(';');
                
                for (i = 0; i < players.length; i++) {
                    if (players[i] === '') {
                        continue;
                    }
                    s = players[i].split(':');
                    id = s[0];
                    rank = s[1];
                    name = s[2];
                    $(".battlefield>tbody>tr.player[user_id='"+id+"']").children("td").eq(2).append('<a href="http://www.kingsofchaos.com/attack.php?id='+id+'"><img title="Stats are out of date" class="_lux_needs_update" src="http://www.luxbot.net/bot/img/luxupdate.gif" /></a>');
                }
            });
    }
    
    , bf_online: function (users) {

        var kocids = '';
        $(".battlefield>tbody>tr.player").each(function() {
            kocids += textBetween($(this).children('td').eq(2).html(),'id=','">')+",";
        });
        
        kocids = kocids.slice(0,-1);
        if (kocids === '') 
            return;

        var page = textBetween($(".battlefield>tbody>tr").last().text(), 'page ', ' of'); 
        var ppx = (page-1)*20+1;

        getLux('&a=bf_online&u=' + kocids,
            function(r) {
                //log(r.responseText);
                var players = r.responseText.split(';');
                var i;
                for (i = 0; i < players.length; i++) {
                    if (players[i] === '') {
                        continue;
                    }
                    var s = players[i].split(':');
                    var id = s[0];
                    var rank = s[1];
                    var name = s[2];
                    $(".battlefield>tbody>tr.player").eq(rank-ppx).children("td").eq(2).append(' <sup style="color:0066CC">Online</sup>');
                }
            });
    }    
    
    
    , battlefieldShowInfo: function (data) {
        // Hack to get the element to write into
        var $container = $("tr.profile").find("form[action='writemail.php']").closest("tbody");
        
        $("tr.bf_inject").remove();
        
        if (data == '403') {
            $container.prepend('<tr class="bf_inject"><td colspan="4" style="font-weight:bold;text-align:center;background-color:#B4B5B4;color:#181818;border-bottom:1px solid black;padding:5px 0 5px 10px;">Access denied</td>');
        } else if (data == 'N/A') {
             $container.prepend('<tr class="bf_inject"><td colspan="4" style="font-weight:bold;text-align:center;background-color:#B4B5B4;color:#181818;border-bottom:1px solid black;padding:5px 0 5px 10px;">No data available</td>');
        } else {
            var userInfo = data.split(';');
            var i;

            for (i = 4 ; i >=0; i--) {
                var stat = userInfo[i*2]
                var time = userInfo[i*2+1]
                
                $container.prepend("<tr class='bf_inject><td style='font-weight:bold'>"+statsdesc[i]+"</td><td>"+stat+"</td><td class='_luxbotago'>"+time+"</td></tr>")
            }
        }
    }
  
    , showUserInfoB: function () {
		var self = this;
        $("a.player").on('click', function(event) {
            if (String(event.target).indexOf('stats.php') > -1) {
                var userid = String(event.target).substr(String(event.target).indexOf('=')+1, 7);
                if (self.statsLoadedId == userid) {
                    self.statsLoadedId=0;
                    return;
                }
                self.statsLoadedId = userid;
                getLux('&a=getstats&userid=' + userid,
                    function(responseDetails) {
                        var r = responseDetails.responseText;
                        this.battlefieldShowInfo(r);
                });
            }
        });
    }
}

    //
    // Conquest Page Functions
    //
Page.conquest = {
    run: function() {
    
        function doConquest() {
          // Need approval from Ta- for this.
            // var count = 1 + to_int($("#wCount").text());
            // $("#wCount").text('Wizards (x'+count+')');
            // post("http://www.kingsofchaos.com/conquest.php",
                // "conquest_target=Wizards&conquest=Go+on+a+conquest+against+Wizards%21&hash=",false);

            $("tr:contains('Wizards')").last().find("input[type='submit']").click();//last().submit();
        }
        
        if ($("table.table_lines>tbody>tr").size() > 10) {
            $("table.table_lines>tbody>tr:eq(2)").before("<tr><td id='wCount'>Wizards (x0)</td><td align='right'>1,000,000,000</td><td align='center'><button style='width:90%' id='doCon'>Go on a conquest against Wizards!</button></td></tr>");
            $("#doCon").click(doConquest);
        }
    }
    
}
    
  

Page.detail = {

    run: function() {
        this.showBattleLog();
        // Gold Update on attacks 
        this.processAttackLogDetail();
    }

    
    , showBattleLog : function() {
        var i;
        var a = db.get('battlelog', 0);
        if (a === 0) {
            return;
        } else if (a === 2 || a === 1) {
            var table;
            var q = document.getElementsByTagName('td');
            for (i = 0; i < q.length; i++) {
                if (q[i].className.indexOf('report') != -1) {
                    table = q[i];
                    break;
                }
            }
            
            for (i = 0; i < table.childNodes.length; i++) {
                if (table.childNodes[i].nodeName != '#text') {
                    table.childNodes[i].style.display = 'block';
                }
            }
            
            document.getElementsByClassName('battle')[0].className += '2';
            
            var dummyTable = document.body.appendChild(document.createElement('table'));
            dummyTable.className = 'battle';
            dummyTable.style.display = 'none';
            dummyTable.style.height = document.body.scrollTop;
            window.addEventListener(
                'scroll',
                function () {
                  dummyTable.style.height = document.body.scrollTop;
                },
                false);
        } else if (a == 3) {
            if (document.URL.indexOf('suspense') != -1) {
                document.location = document.URL.substr(0, document.URL.indexOf('suspense'));
            }
        }
    }
	
    , processAttackLogDetail : function() {
        var gold_stolen, attack_id;

        //send specific attack to Lux
        var attackReport = $("td.report:first").text();
            
        if (attackReport.indexOf('counter-attack') == -1) {
            //TODO:: Write
            //processDefendLog();
            return;
        }
        
        var your_damage = textBetween(attackReport, 'Your troops inflict',' damage on the enemy!');
        var enemy_damage = textBetween(attackReport, 'counter-attack and inflict ', ' damage on your army!');
        var enemy_name = attackReport.match(/As (.*)'s army runs from the/);
            enemy_name = enemy_name[1];
        var your_losses = textBetween(attackReport, 'Your army sustains ', ' casualties');

        var enemy_losses = textBetween(attackReport, 'The enemy sustains ', ' casualties');

        var enemy_id = $("form > input [name='id']").val();
        enemy_id = textBetween(attackReport, 'name="id" value="', '"');
        enemy_id = $("input[name='id']").val();
        
        if (attackReport.indexOf('You stole') == -1)
            gold_stolen = 'defended';
        else
            gold_stolen = textBetween(attackReport, 'You stole ', ' gold');
        
        if (document.URL.indexOf('&') == -1)
            attack_id = document.URL.substring(document.URL.indexOf('attack_id=')+10);
        else
            attack_id = document.URL.substring(document.URL.indexOf('attack_id=')+10,document.URL.indexOf('&'));

        sendAttackLogDetails(User.kocnick, "attack", enemy_id, enemy_name, your_damage, enemy_damage, your_losses, enemy_losses, gold_stolen, attack_id, 'now');
    }
}
  

Page.inteldetail = {

    run: function() {
        this.processIntelLog();
    }

    , processSabLog : function() {
        var sabtext = $("td.content").text();
        if (sabtext.indexOf('Your spies successfully enter') == -1) {
          //turned illegal
          //  history.back();
            return;
        }
        
        var player = sabtext.between("successfully enter ", "'s armory");
        var amount = sabtext.between("and destroy ", " of the enemy's");
        var weapon = sabtext.between("of the enemy's ", " stockpile.");
        var logid = String(document.location).substr(String(document.location).indexOf('=')+1);
        getLux('&a=logsab&target=' + player + '&weapon=' + weapon + '&amount=' + amount + '&logid=' + logid,
            function(responseDetails) {
                //log(responseDetails.responseText);
            });
    }
    
    , processIntelLog : function()  {
        //proccess recons and sabotages

        var text = $("td.content").text()
        
        //notice for sabotages it says "your spies" for recon "your spy"
        if (text.indexOf('Your spy') == -1) {
            this.processSabLog();
            return;
        }

        if (text.indexOf('As he gets closer, one of the sentries spots him and sounds the alarm.') != -1) {
            //now illegal
            //history.back();
            return;
        }

        
        var enemy = text.between("your spy sneaks into ","'s camp");
        var enemyid = $("input[name='id']").val()
        var logid = String(document.location).substr(String(document.location).indexOf('=')+1);
        
        var rowsToGrab = ["Mercenaries", "Soldiers",
                        "Strike Action", "Defensive Action", "Spy Rating", "Sentry Rating",
                        "Covert Skill", "Covert Operatives", "Siege Technology", "Attack Turns",
                        "Unit Production"]
                        
        var data = []
        _.map(rowsToGrab, function (str) {
            var temp = getRowValues(str);
            data = data.concat(temp)
        });
        data = data.join(";")

        var stable = $("table:contains('Treasury')").last();
        var gold = to_int($(stable).find("tr>td").text());
        
        
        stable = $("table:contains('Weapons')").last();
        var weap_rows = $(stable).find("tbody>tr>td").parent();
        var weapons = "";
        $(weap_rows).each(function(i,e) {
            var r = $(e).text().split("\n");
            var g = r[1].trim()+":"+r[2].trim()+":"+r[3].trim()+":"+r[4].trim();
            weapons += g +";";
        });        
        logRecon(enemy, enemyid, logid, gold, data, weapons)
    }

}
Page.intelfile = {   
    run: function() { }
}

Page.mercs = {

    run: function() {
	
		var buttonsConstraint = function(val, $row) {
			var quantityAvailable = $row.find("td").eq(2).text().int();
			return Math.min(val, quantityAvailable);
		}
		
        Buttons.init(User.gold, getTableByHeading("Buy Mercenaries"), 1, buttonsConstraint);
    }
	
    
}
Page.recruit = {

	addRecruitId : function() {
		var kocid = document.body.innerHTML.between("stats.php?id=", '"');
		var recruitid= document.URL.substring( document.URL.indexOf("=") +1 );
	
		getLux('&a=addRecruitid&kocid=' + kocid + '&recruitid='+recruitid);
	},
	
    run: function() {
		this.addRecruitId();
    }
}

Page.stats = {   

    run: function() {
        this.enemyid = document.URL.split(/[=&?]/)[2];

        this.statsPage();
        this.collapseAllianceInfoS();
        this.showLoggedStats();
        this.addStatsPageButtons();
        this.statsOnlineCheck();
    }
    
    , statsPage: function() {
        if (document.body.innerHTML.indexOf('Invalid User ID') != -1) {
            logStats('', this.enemyid, '', '','', 'invalid', '');
        } else {
            var stable = $("table:contains('User Stats')").last();
            
            var name = $(stable).find("tr:contains('Name:'):first>td:last").html().trim();
            var comid = $(stable).find("tr:contains('Commander:')>td:last").html().trim();
            comid = textBetween(comid,'id=','"');
            var race = $(stable).find("tr:contains('Race:')>td:last").html().trim();
            var rank = $(stable).find("tr:contains('Rank:'):first>td:last").html().trim();
            var highest_rank = $(stable).find("tr:contains('Highest Rank:')>td:last").html().trim();
            var tff = to_int($(stable).find("tr:contains('Army Size:')>td:last").html().trim());
            var morale = $(stable).find("tr:contains('Army Morale:')>td:last").text().trim();
            var chain = $(stable).find("tr:contains('Chain Name:')>td:last");
            if ($(chain).size() > 0)
                chain = $(chain).html().trim();
            else 
                chain = "";
                                 
            var treasury = $(stable).find("tr:contains('Treasury:')>td:last").html();
            if (treasury)
                treasury = to_int(treasury);
            else
                treasury = '';
            var fort = $(stable).find("tr:contains('Fortifications:')>td:last").html().trim();
            
            var officers = this.stats_getOfficers(false);
            var alliances = this.stats_getAlliances(stable);



            this.addIncomeCalc(race, tff);
            this.nav();
            logStats(name, this.enemyid, chain, alliances[0],alliances[1], comid + ";"+race+";"+rank+";"+highest_rank+";"+tff+";"+morale+";"+fort+";"+treasury, officers);
        }
    }
  
    , showLoggedStats: function() {
		var self = this;
        var userid = document.URL.substr(document.URL.indexOf('=')+1, 7);


        $("#luxstats_reload").live("click",function() {
            self.updateUserInfoS(userid);
        });
        
        var offieTable = $("body").find("table:contains('Officers'):last");
        offieTable.parent().prepend("<table id='luxstats_info' class='table_lines' width='100%' cellPadding=6 cellSpacing=0><tbody></tbody></table><br />");
        
        $("#luxstats_info>tbody").html('<tr><th colspan="3">LuXBot Info<span id="luxstats_reload" style="cursor:pointer;color:pink;font-size:8pt;float:right">(reload)</span></th></tr>');
        
        this.updateUserInfoS(userid);
    }

    , updateUserInfoS: function(userid) {
            getLux('&a=getstats&userid=' + userid,
            function(responseDetails) {
                var i;
                var container = $("#luxstats_info");
                $(container).find("td").parent().remove();
                if (responseDetails.responseText == '403') {
                    container.append('<tr><td colspan="2" style="font-weight:bold;text-align:center;">Access denied</td></tr>');
                } else if (responseDetails.responseText == 'N/A') {
                    container.append('<tr><td colspan="2" style="font-weight:bold;text-align:center;">No data available</td></tr>');

                } else {
                    var userInfo = responseDetails.responseText.split(';');

                    for (i = 0; i < 10; i+=2) {
                        if (userInfo[i]== '???') {
                            container.append("<tr><td>"+Constants.statsdesc[i/2]+"</td><td colspan=2>"+userInfo[i]+"</td></tr>");
                        }
                        else
                            container.append("<tr><td>"+Constants.statsdesc[i/2]+"</td><td>"+userInfo[i]+"</td><td class='_luxbotago'>"+userInfo[i+1]+"</td></tr>");
                    }
                    if (userInfo.length > 10)
                        container.append("<tr><td>"+userInfo[11]+"</td></tr>");
                }
            });
    }

    , collapseAllianceInfoS: function() {
        var nameRE = /User Stats<\/th>/ig;
        var q = document.getElementsByTagName('table');
        var statstable;
        var i;
        
        for(i = 0; i < q.length; i++){
            if(q[i].innerHTML.match(nameRE) && !q[i].innerHTML.match(/<table/)) {
                statstable = q[i];
                break;
            }
        }
        
        if (statstable === undefined) { return; }
       
        var allianceindex;
        for (i = 0; i < statstable.rows.length; i++) {
            if (statstable.rows[i].cells[0].innerHTML.indexOf('Alliances') > -1) {
                allianceindex = i;
                break;
            }
        }

        // alliance splitted
        var alliances = statstable.rows[allianceindex].cells[1].innerHTML.split(',');
        var pri_alliance = 'None';
        var sec_alliances = [];
        for (i = 0; i < alliances.length; i++) {
            if (alliances[i].indexOf('(Primary)') > -1) {
                pri_alliance = alliances[i];
            } else {
                sec_alliances[sec_alliances.length] = alliances[i];
            }
            continue;
        }
		
        statstable.rows[allianceindex].cells[0].innerHTML = '<b>Alliances (' + alliances.length + '):</b>';
        statstable.rows[allianceindex].cells[1].innerHTML = pri_alliance + '<br><div id="_luxbot_alliances">' + sec_alliances.join(', ') + '</div><a id="expandAlliances"> + Show Secondary</a>';

		$("body").on('click', '#expandAlliances', function(){
			var q = document.getElementById('_luxbot_alliances');
			q.style.display = 'none';
			q.style.visibility = 'hidden';
			q.nextSibling.id = 'collapseAlliances';
			q.nextSibling.innerHTML = ' + Show Secondary';
		});
		$("body").on('click', '#collapseAlliances', function(){
			var q = document.getElementById('_luxbot_alliances');
			q.style.display = 'block';
			q.style.visibility = 'visible';
			q.nextSibling.id = 'expandAlliances';
			q.nextSibling.innerHTML = ' - Hide Secondary'
		});
    }
    

    
    , addIncomeCalc: function(race, tff) {
    
        var bonus = 1;        
        if(race == 'Humans') { bonus = 1.30; }
        if(race == 'Dwarves') { bonus = 1.15; }
        
        var formattedTbg = addCommas(Math.floor(60* tff *bonus));
        
        var nameIC = /<td><b>Name:<\/b>/;
        var z = document.getElementsByTagName('table');
        var table;
        
         for(var i = 0; i < z.length; i++){
            if(z[i].innerHTML.match(nameIC) && !z[i].innerHTML.match(/<table/)) {
                table = z[i];
                break;
            }
        }
         
         var x = table.insertRow(10);
         x.insertCell(0).innerHTML = '<b>Estimated gold per Hour:<b>';
         x.insertCell(1).innerHTML = '(' + formattedTbg + ')';
    
    }

    , addStatsPageButtons: function() {
        var $table = getTableByHeading("User Stats");
        
        var $nameTd = $table.find('tr:contains("Name:")').first().find("td").last();
        $nameTd.append(' <a href="http://www.stats.luxbot.net/history.php?playerSearch='+ this.enemyid +'" target="_blank" class="tofu viewHistory">View history</a>');
    }

    , nav: function() {
        $("table.officers tr.nav a").click(function() {
            setTimeout(function() {
                statsPage();
            },100);
            nav();
        });
    }
    
    , stats_getOfficers: function(tolog) {
        var officers = "";
        var rows = $("table.officers>tbody>tr>td>a").parent().parent();
        $(rows).each(function(i,row) {
            if ( ! $(row).hasClass('nav')) {
                var offieInfo = $(row).find("td:eq(0)").html();
                officers += textBetween(offieInfo,"id=",'"') +";";
            }
        });
        
        //cut off trailing semicolon
        officers = officers.slice(0, -1);

        return officers;            
    }

    , stats_getAlliances: function(stable) {
        var name, a
        var row = $(stable).find("tr:contains('Alliances:')>td:last").html();
        var allys = row.split('alliances.php?');
        
        var primary = ''
        var secondary = [];
        for (a in allys) {
            name = textBetween(allys[a],'id=','">');
            if (allys[a].indexOf('(Primary)') == -1) {
                if (name !== '') 
                    secondary[secondary.length] = name;
            }
            else 
                primary = name;
        }    
        return new Array(primary,secondary);
    }

    , statsOnlineCheck: function() {

        var userid = document.URL.split(/[=&?]/)[2];

        getLux('&a=stats_online&u=' + userid,
            function(r) {
                var stable = $("table:contains('User Stats')").last();
                var tx = r.responseText;
            //alert("hello");
                if (parseResponse(tx, "online") !== '') {
                    $(stable).find("tr:contains('Name')").first().find("td:eq(1)").append('&nbsp;<img title="Player is online"  class="_lux_online" src="http://www.luxbot.net/bot/img/online2.gif" />');
                }
                
                var msg = parseResponse(tx, "message");
                if (User.kocid == userid) {
                    //if it is the users stats page, allow them to update
                    $(stable).find("tr:contains('Fortifications')").after("<tr><td colspan=2><center><textarea id='aaa' style='width:360px;height:100px;'>"+msg+"</textarea><br /><input type='button' value='Update' id='lux_updateMessage' /></center></td></tr>");
                    $("#lux_updateMessage").click(function() {
                        postLux('&a=set_message', '&msg=' + $("#aaa").val());                    
                    });
                }
                else {
                    if (msg !== '') {
                        $(stable).find("tr:contains('Fortifications')").after("<tr><td colspan=2><center><textarea style='width:50%'>"+msg+"</textarea></center></td></tr>");
                    }
                }
            });
    }
}
Page.train = {
    run: function() {
        this.unheldWeapons();
        this.tffChart();
        
        //Set up the clickable buttons
		var buttonsConstraint = function( val, $row ) {
			var selected = 0;
			$("input[type='text']").each(function() {
				selected += $(this).val().int();
			});
			var maxCanTrain = to_int(getRowValues("Untrained Soldiers")[0]);
			return Math.min(val, maxCanTrain - selected);
		}
		
        Buttons.init(User.gold, getTableByHeading("Train Your Troops"), 1, buttonsConstraint);
    }
    
	, unheldWeapons : function() {
		function describe(unheld) {
            if (unheld < 0) {
                return '<span style="color:white">None ('+unheld+')</span>';
			}
            return '<span style="color:red">'+unheld+'</span>';
        }
		function getTroopCount($table, str) {
			return $stable
					.find("tr:contains('"+ str +"'):first>td:last")
					.html().int();
		}
        var $stable = $("table.personnel").last();
        
        var spies        = getTroopCount($stable, "Spies");
        var sentries     = getTroopCount($stable, "Sentries");
        var attackers    = getTroopCount($stable, "Trained Attack Soldiers");
        var attackMercs  = getTroopCount($stable, "Trained Attack Mercenaries");
        var defenders    = getTroopCount($stable, "Trained Defense Soldiers");
        var defenseMercs = getTroopCount($stable, "Trained Defense Mercenaries");

        $stable.after("<table width='100%' cellspacing='0' cellpadding='6' border='0' id='holding' class='table_lines'><tbody><tr><th colspan=3>Troops/Weapons</th></tr><tr><th class='subh'>Troops</th><th  class='subh'>Weapons</th><th align='right' class='subh'>Unhelds</th></tr></tbody></table>");
        
        var unheldSpy = describe(User.spyWeaps - spies );
        var unheldSentry = describe(User.sentryWeaps - sentries );
        var unheldStrike = describe(User.saWeaps - attackers - attackMercs );
        var unheldDefense = describe(User.daWeaps - defenders - defenseMercs );

        $("#holding")
			.append("<tr><td><b>Strike Weapons&nbsp;</b></td><td>"+User.saWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldStrike+" </td></tr>")
			.append("<tr><td><b>Defense Weapons&nbsp;</b></td><td>"+User.daWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldDefense+" </td></tr>")
			.append("<tr><td><b>Spy Weapons&nbsp;</b></td><td>"+User.spyWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldSpy +"</td></tr>")
			.append("<tr><td><b>Sentry Weapons&nbsp;</b></td><td>"+User.sentryWeaps+"&nbsp;&nbsp;</td><td align='right'> "+ unheldSentry+" </td></tr>");
	}
	
    , tffChart: function() {
        var $stable = $("table:contains('Train Your Troops')").last();
        $stable.after( $("<table>", { 'id': 'growth', 'class' : 'table_lines'})
				.append("<tbody><tr><th colspan=3>Growth Stats</th></tr></tbody>")
		);
        $("#growth").append("<tr><td><div id='container' style='height:250px'></div></td></tr>");
        
        getLux('&a=trainStats',function(a) {
			var chart = new Highcharts.StockChart({
				chart : {
					renderTo : 'container',
					zoom : 'none'
				},
				navigator : {
					enabled : true
				},
				scrollbar : {
					enabled : false
				},
				yAxis: {
					min: 0
					// startOnTick: false,
					// endOnTick: false    
				},
				rangeSelector: {
					enabled: false
				},
				title : {
					text : 'Total Fighting Force'
				},
				
				series : [{
					name : 'Army Size',
					data : $.parseJSON(a.responseText),
					tooltip: {
						valueDecimals: 0
					}
				}]
			});        
        }.bind(this));

        var notech = document.body.innerHTML.split('You have no technology');
        if (notech[1]) {
            db.put("Tech",1);
        }
        else {
            var tech = document.body.innerHTML.split('(x ');
            tech = tech[1].split(' ');
            tech = parseFloat(tech[0]);
            tech = Math.floor(tech*100);
            db.put("Tech",tech);
        }
    }
}
Plugins['fakesabtargets'] = {
    description : "Fake-Sab targets button added to sidebar"
	
	, defaultEnabled : false
	
	, run : function () {
		this.addButton();
	}
	
    , addButton : function() {
		var $sabButton = $('<a>', {'href':'#'}).append(
			$("<img>", {
				'onclick' : 'return false;',
				'class' : 'tofu',
				'id' : 'sidebar_sabtargets',
				'src' : gmGetResourceURL("sidebar_fakesabtargets")
		}));
		
		$sabButton.click(this.showFakeSabList.bind(this));
		
		var $leftBarRows = $("td.menu_cell> table> tbody > tr");
		$leftBarRows.eq(2).after($("<tr>").append($sabButton));
   }

	, showFakeSabList : function() {
		var $table = $("<table>", {'class': 'table_lines', 'id':'_luxbot_targets_table', 'width':'100%', cellspacing:0, cellpadding:6, border:0 });

		$table.append('<tr><td id="_sab_content">Loading... Please wait...</td></tr>');
		GUI.displayHtml($table);
		this.getFakeSabTargets();
	}

	, getFakeSabTargets : function() {
		getLux('&a=getfakesabtargets',
			function(r) {
				var i;
				log(r.responseText);
				if ( r.responseText != '403' ) {
					document.getElementById('_sab_content').innerHTML = r.responseText;
				}
		});
	}
}
Plugins['gold_projection'] = {
	description : "Show projected gold beneath current gold",
	
	defaultEnabled : true,
	
	run : function() {
		var offset = 11; // Seconds after minute until turn arrives.
		
		function nextMinute($obj, income, accumulator) {
			$obj.text("Projection: "+ addCommas(User.gold.int() + income*accumulator));
			
			setTimeout(function() {
				nextMinute($obj, income, accumulator+1);
			}, 60*1000); // Update again in exactly 1 minute
		}
		
		// Add the display to the DOM
		$("tr:contains('Last Attacked:'):last").parent().find("tr:eq(0)")
				.after("<tr><td colspan=2 style='color: BLUE; font-size: 6pt;text-align:center' id='gold_projection'></td></tr>");

		var date = new Date();
		var currentSeconds = date.getSeconds();
		var secsTillTurn =( (60 + offset) - currentSeconds) % 60;
		setTimeout(
			function() {
				nextMinute( $("#gold_projection"), User.income.int(), 1);
			}
			, secsTillTurn*1000
		);
	}
}
// ==UserScript==
// @name           Koc Addon Recruit Helper
// @namespace      http://*kingsofchaos.com/*
// @description    Help in recruiting : Remember messages sent to users and when they were sent etc.
// @include        http://*kingsofchaos.com/*
// @exclude		   http://www.kingsofchaos.com/confirm.login.php*
// @exclude		   http://*.kingsofchaos.com/index.php*
// @exclude		   http://*.kingsofchaos.com/error.php*
// ==/UserScript==

var CurrentURL = document.URL;
PageURL = CurrentURL.split(".com/");
PageURL = PageURL[1].split(".php");

if (PageURL[0] == "writemail") {

    var stuff = document.body.innerHTML;
    nick = stuff.split("<b>To:</b> ");
    nick = nick[1].split("</th>"); 
    nick = nick[0];
    nick = nick.replace(/\n/g,"").replace(/&nbsp;.*/g,"");
    statid = document.getElementsByName("to")[0].value;

    var d = new Date()
    var ds = "" + d.getTime() + "";
    if (GM_getValue('KoC_Message_Time_' + statid)) {
        timespan = Math.floor((ds - Math.floor(GM_getValue('KoC_Message_Time_' + statid))) / 1000);
        var time = duration(timespan);
        var th = document.getElementsByTagName('th');
        for(i=0;i< th.length;i++) {
          if((th[i].innerHTML.match('To:')) && (!(th[i].innerHTML.match('Subject:')))) {
            th[i].innerHTML += '&nbsp;&nbsp;&nbsp;<span title="Subject: '+ GM_getValue('KoC_Message_Subj_'+statid) + "\nMessage:\n" + GM_getValue('KoC_Message_Msg_'+statid).replace(/<br>/g,"\n") + '">[Last Msg: '+ time + ']</span>';
             break;
           }
         }
    }


  var sendbut = document.getElementsByName("send")[0];
  sendbut.addEventListener('click', function(event) {
      var message = document.getElementsByTagName('textarea')[0].value.replace(/\n/g,'<br>'); 
      var q = document.getElementsByTagName('input'); 
      for (var j=0; j < q.length; j++) {
         if (q[j].type == 'text') {
           if(q[j].name == 'subject')
             subject = q[j].value;
         }
       }
      GM_setValue('KoC_Message_Nick_' + statid, nick);
      GM_setValue('KoC_Message_Subj_' + statid, subject);
      GM_setValue('KoC_Message_Msg_' + statid, message);
      GM_setValue('KoC_Message_Time_' + statid, ds);

  },true);
}

if (PageURL[0] == "inbox") {
 var delbut = document.getElementsByName("delete_all_to_messages")[0];
 var detailsbut = document.createElement('input');
 detailsbut.setAttribute("type","button");
 detailsbut.setAttribute("name","outgoing_message_details");
 detailsbut.setAttribute("id","ogm_details");
 detailsbut.setAttribute("value","Details");
 detailsbut.addEventListener('click', function(event) {
 var valarr = GM_listValues();
 var idstime = new Array();
  for each (var val in GM_listValues()) {
   if (val.match("KoC_Message_Time_")) {
    var temprow = new Array(val.replace(/KoC_Message_Time_/g,""),GM_getValue(val));
    idstime.push(temprow);
   }
  }
  idstime.sort(function(a,b){return b[1]-a[1]}); 

  var tds = document.getElementsByTagName('td'); 
  for(i=0;i<tds.length;i++) { 
    if (tds[i].getAttribute("class") == "content") { 
      var content = tds[i]; 
      break 
    }
  }

  var detailsHTML = "<table width=\"100%\" bgcolor=\"#000000\" border=\"0\" cellspacing=\"6\" cellpadding=\"6\">\n\t<tr>\n\t\t<th>To</th>\n\t\t<th>Subject</th>\n\t\t<th>Sent</th>\n\t\t<th>Message</th></tr>"

 for each (var pair in idstime) {
    statid = pair[0];
    var d = new Date()
    var ds = "" + d.getTime() + "";
    timespan = Math.floor((ds - Math.floor(GM_getValue('KoC_Message_Time_' + statid))) / 1000);
    toname = GM_getValue("KoC_Message_Nick_"+statid);
    tosubj = GM_getValue('KoC_Message_Subj_'+statid);
    if (toname == null) { toname = statid; }
    if (tosubj == "") { tosubj = "None"; }
    rowHTML = '<tr id="msg_row_'+statid+'"><td><a href="stats.php?id='+statid+'">'+ toname +'</a></td><td>'+ tosubj +'</td><td>'+duration(timespan)+'</td><td align="center"><input type="button" id="og_msg_'+statid+'" value="Show"></td></tr>';
    detailsHTML += rowHTML; 
  }
 content.innerHTML = detailsHTML;

 for each (var pair in idstime) {
  statid = pair[0];
  document.getElementById("og_msg_"+statid).addEventListener('click',(function(statid){ return function() { displaymsg(GM_getValue("KoC_Message_Msg_"+statid),statid,this.value); this.value = ((this.value == "Show") ? "Hide" : "Show"); } })(statid),false);
 }
 

 },true);
 delbut.parentNode.insertBefore(detailsbut,delbut);
}

function displaymsg ( msg, statid, toggle ) {
 if (toggle == "Show") {

 var therow = document.getElementById("msg_row_"+statid);
 var msgrow = document.createElement('tr');
 msgrow.setAttribute('id','the_msg_'+statid);
 msgrow.innerHTML = "<td style=\"padding-left: 30px; padding-right: 30px;\" colspan=\"4\" width=\"100%\">\n\t\t<table width=\"100%\" bgcolor=\"#888888\" cellpadding=\"6\" cellspacing=\"0\">\n\t\t<tbody><tr>\n\t\t\t<td style=\"border: 1px solid rgb(136, 136, 136);\" colspan=\"3\" bgcolor=\"#111111\"><p style=\"padding-left: 15px;\">"+ msg +"</p></td>\n\t\t</tr>\n\t\t</tbody></table>\n\t\t</td>"
 therow.parentNode.insertBefore(msgrow,therow.nextSibling);
 } else {
  var msgrow = document.getElementById('the_msg_'+statid);
  msgrow.parentNode.removeChild(msgrow);
 }
}

function duration ( timespan ) {
  time = "";
  if ((timespan > 1209600) && (time === "")) time += Math.floor(timespan / 604800) + ' weeks ago';
  if ((timespan > 604800) && (time === "")) time += '1 week ago';
  if ((timespan > 172800) && (time === "")) time += Math.floor(timespan / 86400) + ' days ago';
  if ((timespan > 86400) && (time === "")) time += '1 day ago';
  if ((timespan > 7200) && (time === "")) time += Math.floor(timespan / 3600) + ' hours ago';
  if ((timespan > 3600) && (time === "")) time += '1 hour ago';
  if ((timespan > 120) && (time === "")) time += Math.floor(timespan / 60) + ' minutes ago';
  if ((timespan > 60) && (time === "")) time += '1 minute ago';
  if ((timespan > 1) && (time === "")) time += timespan + ' seconds ago';
  if (time === "") time += '1 second ago';
  return time;
}

Plugins['recon_request'] = {
	description : "Recon request system"
	
	, defaultEnabled : true
	
	, run : function() {
		this.initReconRequest();
	}
	
    , initReconRequest : function() {
        var x = $('<div id="_luxbot_ReconRequestPopup" style="display:none; position: absolute; top:0px; margin:15px; padding:20px;background-color: black; border: 1px solid green; font-family: arial; font-size: 10px;  overflow: auto;">');
        $("body").append(x);
        x.css("left",(document.body.clientWidth/2)-100 + "px");
        $("#_luxbot_ReconRequestPopup").click(function () {
            this.toggleReconRequestPopup(! db.get('reconRequest'));
        });

        this.toggleReconRequestPopup(db.get('reconRequest') !== 0);
    }

    , addRequestRecon: function() {
        var getopponent = document.getElementsByName('defender_id');
        var data = getopponent[0].value;
        document.getElementById("_luxbot_requestRecon").disabled = true;
        document.getElementById("_luxbot_requestRecon").style.color = "gray";
        postLux('&a=reconrequest','kocid=' +data, function(r,debug) {
                if(r.responseText == 'OWK') {
                    alert('A request has already been sent.');
                } else if(r.responseText == 'OK') {
                    alert('Your request has been sent.');
                } else {
                    alert('Your request could not be sent, try again later!'+r.responseText);
                }
        });
    }
    
    , toggleReconRequestPopup: function (bool) {
        //if bool == true, then show info
        //if bool == false then hide and show number
        
        getLux('&a=reconrequestlist',
            function(r, debug) {
                var i;
                var q = $('#_luxbot_ReconRequestPopup');
                var incoming = r.responseText.split(';');
                var numberRequests = r.responseText.split('(s)').length - 1;
                
                if (numberRequests > 0) {
                    q.slideDown();
                    var stringBuilder = "<span style=\"color: red;\">("+numberRequests+") Recon Requests</span><br />";
                    if (bool) {
                        for (i = 0; i < incoming.length; i++) {
                            var info = incoming[i].split(':');
                            stringBuilder+= info[0]+" | <a href='stats.php?id="+info[1]+"'>"+info[2]+"</a> by "+info[3]+ "<br />";
                        }
                        db.put('reconRequest', 1);        
                    } else {
                        db.put('reconRequest', 0);
                    }
                    q.html(stringBuilder);
                }
        });
    }
}
Plugins['sabtargets'] = {
    description : "Sab targets button added to sidebar"
	
	, defaultEnabled : true
	
	, run : function () {
		this.addSabTargetsButton();
	}
    , addSabTargetsButton : function() {
		var $sabButton = $('<a>', {'href':'#'}).append(
			$("<img>", {
				'onclick' : 'return false;',
				'class' : 'tofu',
				'id' : 'sidebar_sabtargets',
				'src' : gmGetResourceURL("sidebar_sabtargets")
		}));
		
		$sabButton.click(this.sabTargetsButton.bind(this));
		
		var $leftBarRows = $("td.menu_cell> table> tbody > tr");
		$leftBarRows.eq(2).after($("<tr>").append($sabButton));
   }

	, sabTargetsButton : function() {
        var $html = $("<table>", {
			'class' : 'table_lines tofu',
			'id' : '_luxbot_targets_table',
			'width': '100%',
			'cellspacing': 0,
			'cellpadding': 0,
			'border': 0})
			.append('<tr><td id="getTodaysSabs" ><input type="button" value="View Your Sabs" /></td></tr>'
			       +'<tr><td id="_sab_content">Loading... Please wait...</td></tr>');
				   
        GUI.displayHtml( $html );
        this.getSabTargets();
	}
	
    , getSabTargets : function() {
        getLux('&a=getsabtargets',
            function(r) {
				$("#_sab_content").html(r.responseText);
               
				// $("#getTodaysSabs").html("View Your Sabs - Test 1")
					// .attr('value', 'View Your Sabs - Test 2')
					// .unbind('click')
					// .click(this.getTodaysSabs);
            }.bind(this));
    }
	 
    , getTodaysSabs : function () {
		getLux('&a=getTodaysSabs',
            function(r) {
                document.getElementById('_sab_content').innerHTML = r.responseText;    
                document.getElementById('getTodaysSabs').value="View Sab List";
                document.getElementById('getTodaysSabs').addEventListener('click',getSabTargets,true);
                document.getElementById('getTodaysSabs').removeEventListener('click',getTodaysSabs,false);
        });      
    }
}
 
Plugins['targets'] = {
    description : "Targets button added to sidebar"
	
	, defaultEnabled : true
	
	, run : function () {
		this.addTargetsButton();
	}
	
	, addTargetsButton : function() {
		var $button = $('<a>', {'href':'#'}).append(
			$("<img>", {
				'onclick' : 'return false;',
				'class' : 'tofu',
				'id' : 'sidebar_sabtargets',
				'src' : gmGetResourceURL("sidebar_targets")
		}));
		
		$button.click(this.showFarmList.bind(this));
		
		var $leftBarRows = $("td.menu_cell > table> tbody > tr");
		$leftBarRows.eq(2).after($("<tr>").append($button));
   }
	
	, showFarmList : function() {
		var farmOptions = _.map(this.formInputs, function (def, key) {
			return db.get(key, def);
		});
		var maxDa = db.get("maxDa", 1000);
		var minTff = db.get("minTff", 10);
		var minGold = db.get("minGold", 0);
		var maxSeconds = db.get("maxSeconds", 120);
		var byProjection = db.get("byProjection", "");
		var saMultiplier = db.get("saMultiplier", 0.80);
		var tffAdder = db.get("tffAdder", 50);
		
		 var html = '<table class="table_lines" id="_luxbot_targets_table" width="100%" cellspacing="0" cellpadding="6" border="0">'
		+'<tr><th colspan="7" class="header">Master Targets (Loading)</th></tr>'
		+'<tr id="targetsFirstRow"><td><b>Name</b></td><td colspan="2" align="center"><b>Defensive Action</b></td><td align="center"><b>Total Fighting Force</b></td><td width=200 align="right"><b>Gold</b></td><td>&nbsp;</td><td>&nbsp;</td></tr>'
		+'<tr><th colspan="7">Settings</th></tr>'
		+'<tr><td colspan=7 id="targets_settings"> </td></tr>'
		+'</table>';
		
		 
		var form1 = $("<fieldset style='width: 20%; padding:10px 0 5px 10%; float: left;' id='autofill'><legend>Autofill</legend></fieldset>");
			form1.append($("<label for=saMultiplier />").text("SA x "));
			form1.append($("<input type=text name=saMultiplier size=5/><br />").val(saMultiplier));

			form1.append($("<label for=tffAdder>").text("TFF + "));
			form1.append($("<input type=text name=tffAdder size=4/><br />").val(tffAdder));
			form1.append($("<input type=button id='targets_autofill' value='Autofill' /><br />"));
		
		var form2 = $("<fieldset style='width: 30%; padding:10px; float: left;' id='values'><legend>Filter Settings</legend></fieldset>");
			form2.append($("<label  class='tLabel' for=maxDa />").text("Max Defense: "));
			form2.append($("<input type=text name=maxDa /><br />").val(maxDa));
			form2.append($("<label class='tLabel' for=minTff>").text("Min TFF: "));
			form2.append($("<input type=text name=minTff /><br />").val(minTff));
			form2.append($("<label  class='tLabel' for=minGold>").text("Min Gold: "));
			form2.append($("<input type=text name=minGold /><br />").val(minGold));
			form2.append($("<label  class='tLabel' for=maxSeconds>").text("Max Gold Age: "));
			form2.append($("<input type=text name=maxSeconds /><br />").val(maxSeconds));
			form2.append($("<label  class='tLabel' for=maxSeconds>").text("Filter by Projection: "));
			form2.append($("<input type=checkbox name=by_projection value='1' /><br />").attr("checked",byProjection));

		var form3 = $("<fieldset style='width: 20%; padding:10px 0 5px 10%; float: left;' id='autofill'><legend>Reset / Save</legend></fieldset>");
			form3.append($("<input type=button id='targets_refresh' value='Refresh' /><br /><br />"));
			form3.append($("<input type=button id='targets_save' value='Save' /><br />"));
			form3.append($("<input type=button id='targets_reset' value='Reset' /> "));

		GUI.displayText(html);
		$("#targets_settings").append(form1);    
		$("#targets_settings").append(form2);    
		$("#targets_settings").append(form3);    
			
		var self = this;
		$("#targets_refresh").click(function() {
			self.getTargets();
		});            
		$("#targets_autofill").click(function() {
			var tffAdd = $("input[name='tffAdder']").val();
			var saMult = $("input[name='saMultiplier']").val();
			$("input[name='minTff']").val(Math.floor(User.tff.int()+tffAdd.int()));
			$("input[name='maxDa']").val(Math.floor(User.sa.int() * saMult ));
		});
		$("#targets_reset").click(function() {
			$("input[name='minTff']").val(10);
			$("input[name='maxDa']").val(1000);
			$("input[name='minGold']").val(0);
			$("input[name='maxSeconds']").val(120);
			$("input[name='saMultiplier']").val(0.80);
			$("input[name='tffAdder']").val(50);
			$("input[name='by_projection']").attr("checked", "");
		});
		$("#targets_save").click(function() {
			db.put("maxDa", $("input[name='maxDa']").val().int().toString());
			db.put("minTff", $("input[name='minTff']").val().int());
			db.put("minGold", $("input[name='minGold']").val().int());
			db.put("maxSeconds", $("input[name='maxSeconds']").val().int());
			db.put("saMultiplier", $("input[name='saMultiplier']").val().float().toString());
			db.put("tffAdder", $("input[name='tffAdder']").val().int());
			db.put("byProjection", $("input[name='by_projection']").prop('checked'));
			self.getTargets();
		});

		this.getTargets(); 
	}

	, getTargets : function() {
		$(".targetTR").remove();
		getLux('&a=gettargets&g=' + db.get('minGold',0) + '&t=' + db.get('minTff', 0) 
			 + '&d=' + db.get('maxDa', 0) + '&q=' + db.get('maxSeconds', 0)
			 + '&by_projection=' + db.get('byProjection',0),
		   function(r) {
				var row, i;
				var x = r.responseText.split(';');
				var html="";
				for(i = 0; i < x.length-1; i++) {
					row = x[i].split(':');
					html += '<tr class="targetTR">'+
					'<td><a href="/stats.php?id=' + row[1] + '">' + row[0] + '</a></td><td align="right">' + (row[3]) + '</td><td>(' + row[4] + ')</td>' +
					'<td align="center">' + row[2] + '</td>'
					+'<td align="right">'
						+'<span class="gold">' + row[5] + '</span>'
						+'<span class="projection" style="display:none;">Projected: '+row[7] + '</span>' +
					'</td>' +
					'<td align="left">(' +row[6] + ')</td>'+
					// '<td align="right"><input type="button" value="Attack" style="cursor:pointer" name="_luxbot_targets_t" id="__' + row[1] + '"></td>'+
					'</tr>';
				}
				$("#targetsFirstRow").after(html);
				
				// Remove "Loading" text.
			   $("#_luxbot_targets_table .header").text("Master Targets");
			   
				$(".targetTR").hover(
					function () {
						$(this).find(".gold").hide();
						$(this).find(".projection").show();
					}, function () {
						$(this).find(".gold").show();
						$(this).find(".projection").hide();                  
				});
			});    
	}

}
// Note: The version is added here by the build script as a global string.

var User;
var action;

!function($, _, document) {
    "use strict";

	gmAddStyle( gmGetResourceText ("styles") );

	
    action = Page.getCurrentPage();
	
    User = Init.loadUser(action);
	if (!User) {
		alert ("Please go to your Command Center for initialization");
		return false;
	}

	GUI.init();
<<<<<<< HEAD
	
||||||| merged common ancestors
=======
	ControlPanel.init();
>>>>>>> 52cffa32e464635e47c194b0ebc449f8c05bb2e3
    Init.checkForUpdate(1);

    if( Init.checkUser() === 0) {
         return;
    }

	// Every page has its own init. Look at /includes/pages/...
	if (Page[action]) {
		Page[action].run();
	}
	
	// Plugins want to be run on all pages. Look at /includes/plugins/...
	_.each(Plugins, function(plugin) {
		if (PluginHelper.toRun(plugin)) {
			plugin.run();
		}
	});

}(window.jQuery, (this._ || _ || unsafeWindow._), document);
