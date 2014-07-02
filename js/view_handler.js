var TodosList = function(settings){
	//privare methods
	var options = $$.extend({
			holder : null,
			caption : 'TODOS',
			controls : null,
			detailView : null
		}, settings),
		that = this;

	function fetchData(){
		var todos = [{
			title : 'Have breakfast',
			desc : 'heavy food',
			order : 1,
			priority : 1,
			done : true
		}, {
			title : 'Team meeting',
			desc : 'Baraweez team meeting',
			order : 2,
			priority : 1,
			done : false
		}];

		return todos;
	};

	function addItem(item){
		var bo = document.createElement('li');

		bo.id = "todos-item-" + that._nextOrder;
		item.done && $$.toggleClass(bo, 'task-completed');
		bo.setAttribute('data-attr', JSON.stringify(item));

		bo.innerHTML = "<div class='view'>"+
						"<input class='toggle' type='checkbox'"+(item.done ? 'checked' : '')+">"+
						"<label title='"+item.desc+"'>"+item.title+"</label>"+
						"<span class='priority span-label p"+item.priority+"' title='Priority'>"+item.priority+"</span>"+
						"<span class='order span-label' title='Order'>"+item.order+"</span>"+
						"<a class='destroy'></a>"+
					"</div>";

		return bo;
	};

	function init(){
		that.reload();
		that._bindControls();
	};


	this._nextOrder = 1;
	this._itemsLeft = 0;
	this._isEdit = false;

	this._modifItemsLeft = function(){
		var itemsBo = $$.findAll('li', options.holder),
			itemsCompleted = 0;;

		that._itemsLeft = 0;
		for(var i = 0; i < itemsBo.length; i++){
			if(!$$.hasClass(itemsBo[i], 'task-completed')){
				that._itemsLeft++;
			}else {
				itemsCompleted++;
			}
		}

		if(options.controls){
			options.controls.itemsLeft && (options.controls.itemsLeft.innerHTML = that._itemsLeft + " items left");
			options.controls.clearFinished && (options.controls.clearFinished.innerHTML = "Clear "+itemsCompleted+" completed item's");
		}
	};

	this._bindEventsOnList = function(bo){
		bo.addEventListener('click', function(event){

			if(event.target.className === "toggle"){
				$$.toggleClass(event.currentTarget, 'task-completed');
				that._modifItemsLeft();
			}else if(event.target.className === "destroy"){
				that.remove(event.currentTarget);
			}else {
				options.detailView && that._populateDetails(JSON.parse(event.currentTarget.getAttribute('data-attr')));
			}
		});

		return bo;
	};

	this._bindControls = function(){
		if(!options.controls) return false;

		options.controls.clearFinished && options.controls.clearFinished.addEventListener('click', function(){
			that.clearCompleted();
		});

		
	};

	this._populateDetails = function(details){
		options.detailView.title.value = details.title;
		options.detailView.desc.value = details.desc;
		options.detailView.order.value = details.order;
		options.detailView.priority.value = details.priority;
	};

	//public methods

	this.add = function(item){
		options.holder.appendChild(that._bindEventsOnList(addItem(item)));
		that._nextOrder++;
		!item.done && that._modifItemsLeft();
	};

	this.remove = function(item){
		var id = item.id;
		options.holder.removeChild(item);
		that._modifItemsLeft();
		//add call to remove the item from local-satorage with the same id
	};

	this.edit = function(){};
	this.getDetails = function(){};

	this.getNextOrder = function(){
		return that._nextOrder;
	};

	this.reload = function(){
		var dataSet = fetchData();
		options.holder.innerHTML = "";

		for(var i = 0; i < dataSet.length; i++){
			that.add(dataSet[i]);
		}
	};

	this.clearCompleted = function(){
		var itemsBo = $$.findAll('li', options.holder);

		for(var i = 0; i < itemsBo.length; i++){
			if($$.hasClass(itemsBo[i], 'task-completed')){
				that.remove(itemsBo[i]);
			}
		}
	};

	init();

	return {
		add : this.add,
		remove : this.remove,
		edit : this.edit,
		getDetails : this.getDetails,
		reload : this.reload,
		nextOrder : this.getNextOrder
	};

};