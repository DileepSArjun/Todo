var LocalStorekeep = null;

$(function(){
	LocalStorekeep = (function(){
		var get = function(key){
			return window.localStorage.getItem(key);
			},
			set = function(key, val){
				return window.localStorage.setItem(key, val);
			},
			clear = function(){
				return window.localStorage.clear();
			},
			remove = function(key){
				return window.localStorage.removeItem(key);
			},
			setCookie = function(name, value){
				document.cookie = name + value + "; path=/";
		    	return true;
			},
			getCookie = function(name){
				var cname = name;
			    var ca = document.cookie.split(';');
			    for (var i=0; i < ca.length; i++) {
			        var c = ca[i];
			        while (c.charAt(0)==' ') c = c.substring(1,c.length);
			        if (c.indexOf(cname) == 0) {
			            return c.substring(cname.length, c.length);
			        }
			    }
			    return null;
			},
			getUrlValue = function(varSearch){
				var SearchString = window.location.hash;
				var VariableArray = SearchString.split('&');
				for(var i = 0; i < VariableArray.length; i++){
					var KeyValuePair = VariableArray[i].split('=');
					if(KeyValuePair[0] == varSearch){
						return KeyValuePair[1];
					}
				}
			};
		return {
			get : get,
			set : set,
			clear : clear,
			remove : remove,
			setCookie : setCookie,
			getCookie : getCookie,
			getUrlValue : getUrlValue
		}
	})();
});