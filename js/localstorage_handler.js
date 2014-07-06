var LocalStorekeep = null;


(function(){
	LocalStorekeep = (function(){
		var get = function(key){
				if(window.localStorage)  return window.localStorage.getItem(key);
				
				var cname = key;
 			    var ca = document.cookie.split(';');
 			    for (var i=0; i < ca.length; i++) {
 			        var c = ca[i];
 			        while (c.charAt(0)==' ') c = c.substring(1,c.length);
 			        if (c.indexOf(cname) == 0) {
 			        	if(c.substring(cname.length, c.length) === ""){
 			        		return null;
 			        	}else {
 			        		return c.substring(cname.length, c.length);
 			        	}
 			        }
 			    }
 			    return null;
			},
			set = function(key, val){
				if(window.localStorage)  return window.localStorage.setItem(key, val);

				document.cookie = key + val + "; path=/";
 		    	return true;
			},
			clear = function(){
				return window.localStorage.clear();
			},
			remove = function(key){
				return window.localStorage.removeItem(key);
			};

		return {
			get : get,
			set : set,
			clear : clear,
			remove : remove
		}
	})();
})();