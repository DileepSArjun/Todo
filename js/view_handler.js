var STORAGE_KEY = "todos-items";

var TodosList = function ( settings ) {
	'use strict';
	//private methods
	var options = $$.extend( {
			holder: null,
			caption: 'TODOS',
			controls: null,
			detailView: null
		}, settings ),
		that = this;

	function addItem( item ) {
		var bo = document.createElement( 'li' );

		bo.id = "todos-item-" + that._nextOrder;
		bo.className = "li-item";
		item.done && $$.toggleClass(bo, 'task-completed');
		bo.setAttribute('data-attr', JSON.stringify(item));
		bo.setAttribute('tabindex', that._nextOrder);

		bo.innerHTML = "<div class='view'>" +
			"<input class='toggle' type='checkbox'" + ( item.done ? 'checked' : '' ) + ">" +
			"<label title='" + ( item.desc || '' ) + "'>" + item.title + "</label>" +
			"<span class='priority span-label p" + item.priority + "' title='Priority'>" + item.priority + "</span>" +
			"<a class='destroy'></a>" +
			"</div>";

		return bo;
	}

	function orderByPriority( dataSet ) {
		if ( dataSet.length <= 0 ) return [];

		var p1 = [],
			p2 = [],
			p3 = [],
			orderedData = [];

		for ( var i = 0; i < dataSet.length; i++ ) {
			if ( Math.abs( dataSet[ i ].priority ) === 1 ) {
				p1.push( dataSet[ i ] );
			} else if ( Math.abs( dataSet[ i ].priority ) === 2 ) {
				p2.push( dataSet[ i ] );
			} else {
				p3.push( dataSet[ i ] );
			}
		}

		return p1.concat( p2 )
			.concat( p3 );
	}

	function backendPull() {
		return JSON.parse( LocalStorekeep.get( STORAGE_KEY ) );
	}

	function backendPush( value ) {
		LocalStorekeep.set( STORAGE_KEY, JSON.stringify( value ) );
	}

	function backendAdd( item ) {
		var items = backendPull() || [];
		item && items.push( item );
		backendPush( items );
	}

	function backendEdit( item ) {
		var items = backendPull();

		for ( var i = 0; i < items.length; i++ ) {
			if ( items[ i ].id === item.id ) {
				items[ i ].title = item.title;
				items[ i ].desc = item.desc;
				items[ i ].priority = item.priority;
				items[ i ].done = item.done || false;
			}
		}

		backendPush( items );
	}

	function backendDelete( id ) {
		var items = backendPull();

		items = items.filter( $$.getUnwantedItem( 'id', id ) );
		backendPush( items );
	}


	function init() {
		that.reload();
		that._bindEvents();
	}


	this._nextOrder = 1;
	this._itemsLeft = 0;
	this._isEdit = false;

	this._modifItemsLeft = function () {
		var itemsBo = $$.findAll( 'li', options.holder ),
			itemsCompleted = 0;

		that._itemsLeft = 0;
		for ( var i = 0; i < itemsBo.length; i++ ) {
			if ( !$$.hasClass( itemsBo[ i ], 'task-completed' ) ) {
				that._itemsLeft++;
			} else {
				itemsCompleted++;
			}
		}

		if ( options.controls ) {
			options.controls.itemsLeft && ( options.controls.itemsLeft.innerHTML = that._itemsLeft + " items left" );
			options.controls.clearFinished && ( options.controls.clearFinished.innerHTML = "Clear " + itemsCompleted +
				" completed item's" );
		}
	};

	this._bindEventsOnList = function(bo){

		function onListSelect(event){
			event.stopPropagation();

			if ( event.target.className === "toggle" ) {
				var itemData = JSON.parse( event.currentTarget.getAttribute( 'data-attr' ) );

				$$.toggleClass( event.currentTarget, 'task-completed' );
				that._modifItemsLeft();
				if ( $$.hasClass( event.currentTarget, 'task-completed' ) ) {
					itemData.done = true;
				} else {
					itemData.done = false;
				}

				that.edit( itemData );
			} else if ( event.target.className === "destroy" ) {
				that.remove( event.currentTarget );
			} else {
				options.detailView && that._populateDetails( JSON.parse( event.currentTarget.getAttribute( 'data-attr' ) ) );
			}

			that._isEdit = true;
		};

		bo.addEventListener('click', onListSelect);
		bo.addEventListener('focus', onListSelect);
		return bo;
	};

	this._bindControls = function () {
		if ( !options.controls ) return false;

		options.controls.clearFinished && options.controls.clearFinished.addEventListener( 'click', function () {
			that.clearCompleted();
		} );

		options.controls.selectSort && options.controls.selectSort.addEventListener( 'change', function ( event ) {
			that.sort( event.currentTarget.value );
		} );
	};

	this._bindEvents = function(){
		$$.find('body').addEventListener('click', function(event){
			if(!$$.hasClass(event.target, 'li-item')){
				that._isEdit = false;
				
				if(options.detailView){
					options.detailView.title && (options.detailView.title.value = "");
					options.detailView.desc && (options.detailView.desc.value = "");
					options.detailView.order && (options.detailView.order.value = "");
					options.detailView.priority && (options.detailView.priority.value = "");
				}
			} );

		that._bindControls();
	};

	this._populateDetails = function ( details ) {
		options.detailView.title.value = details.title || "";
		options.detailView.desc.value = details.desc || "";
		options.detailView.order.value = details.order;
		options.detailView.priority.value = details.priority || 3;
	};

	//public methods

	this.add = function ( item ) {
		//if(that._isEdit) return false;
		options.holder.appendChild( that._bindEventsOnList( addItem( item ) ) );
		backendAdd( item );
		that._nextOrder++;
		!item.done && that._modifItemsLeft();
	};

	this.remove = function ( item ) {
		var id = JSON.parse( item.getAttribute( 'data-attr' ) )
			.id;
		options.holder.removeChild( item );
		that._modifItemsLeft();
		backendDelete( id );
	};

	this.edit = function ( item ) {
		//if(!that._isEdit) return false;
		backendEdit( item );
		that.reload();
	};

	this.getNextOrder = function () {
		return that._nextOrder;
	};

	this.reload = function () {
		//var dataSet = fetchData();
		var dataSet = backendPull();
		options.holder.innerHTML = '';

		if ( !dataSet ) {
			return false;
		}
		if ( dataSet.length <= 0 ) {
			return false;
		}

		for ( var i = 0; i < dataSet.length; i++ ) {
			options.holder.appendChild( that._bindEventsOnList( addItem( dataSet[ i ] ) ) );
			that._nextOrder++;
		}

		that._modifItemsLeft();
		options.controls && options.controls.selectSort && ( options.controls.selectSort.value = "ORDER" );
	};

	this.reorderByPriority = function () {
		var dataSet = orderByPriority( backendPull() );
		options.holder.innerHTML = "";

		for ( var i = 0; i < dataSet.length; i++ ) {
			options.holder.appendChild( that._bindEventsOnList( addItem( dataSet[ i ] ) ) );
		}
	};

	this.clearCompleted = function () {
		var itemsBo = $$.findAll( 'li', options.holder );

		for ( var i = 0; i < itemsBo.length; i++ ) {
			if ( $$.hasClass( itemsBo[ i ], 'task-completed' ) ) {
				that.remove( itemsBo[ i ] );
			}
		}
	};

	this.sort = function ( value ) {
		value = value.toUpperCase();

		if ( value === "ORDER" ) {
			that.reload();
		} else if ( value === "PRIORITY" ) {
			that.reorderByPriority();
		} else {
			return false;
		}
	};

	init();

	return {
		add: this.add,
		remove: this.remove,
		edit: this.edit,
		getDetails: this.getDetails,
		reload: this.reload,
		nextOrder: this.getNextOrder
	};

};