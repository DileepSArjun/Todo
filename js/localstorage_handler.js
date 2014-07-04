var LocalStorekeep = null;


( function () {
	'use strict';
	LocalStorekeep = ( function () {
		var get = function ( key ) {
			return window.localStorage.getItem( key );
		},
		set = function ( key, val ) {
			return window.localStorage.setItem( key, val );
		},
		clear = function () {
			return window.localStorage.clear();
		},
		remove = function ( key ) {
			return window.localStorage.removeItem( key );
		};

		return {
			get: get,
			set: set,
			clear: clear,
			remove: remove
		}
	} )();
} )();