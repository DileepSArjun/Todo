var STORAGE_KEY = "todos-items";

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
			priority : 2,
			done : false
		}, {
			title : 'Client Call',
			desc : 'Baraweez Client call',
			order : 3,
			priority : 1,
			done : false
		},{
			title : 'Cropper lib issues',
			desc : 'Resolve cropper lib redmine issues',
			order : 4,
			priority : 2,
			done : false
		},{
			title : 'Redmine issue fixes',
			desc : 'Work on Todo project',
			order : 5,
			priority : 3,
			done : false
		},{
			title : 'Facebook Api integration',
			desc : 'For filepicker plugin',
			order : 6,
			priority : 1,
			done : false
		}];

		return todos;
	};

	function fetchStorageData(){};

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

	function orderByPriority(dataSet){
		if(dataSet.length <= 0) return [];

		var p1 = [],
			p2 = [],
			p3 = [],
			orderedData =  [];

		for(var i = 0; i < dataSet.length ; i++){
			if(dataSet[i].priority === 1){
				p1.push(dataSet[i]);
			}else if(dataSet[i].priority === 2){
				p2.push(dataSet[i]);
			}else {
				p3.push(dataSet[i]);
			}
		}

		return p1.concat(p2).concat(p3);
	};

	function backendPull(){
		return JSON.parse(LocalStorekeep.get(STORAGE_KEY));
	};

	function backendPush(value){
		LocalStorekeep.set(STORAGE_KEY, JSON.stringify(value));
	};

	function backendAdd(item){
		var items = backendPull() || [];
		item && items.push(item);
		backendPush(items);
	};

	function backendEdit(item){
		var items = backendPull();

		for(var i = 0; i < items.length; i++){
			if(items[i].id === item.id){
				items[i].title = item.title;
				items[i].desc = item.desc;
				items[i].priority = item.priority;
			}
		}

		backendPush(items);
	};

	function backendDelete(id){
		var items = backendPull();

		items.removeValue('id', id);
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

		options.controls.selectSort && options.controls.selectSort.addEventListener('change', function(event){
			that.sort(event.currentTarget.value);
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
		backendAdd(item);
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

	this.getNextOrder = function(){
		return that._nextOrder;
	};

	this.reload = function(){
		//var dataSet = fetchData();
		var dataSet = backendPull();
		options.holder.innerHTML = "";

		if(!dataSet) return false;
		if(dataSet.length <=0) return false;

		for(var i = 0; i < dataSet.length; i++){
			options.holder.appendChild(that._bindEventsOnList(addItem(dataSet[i])));
		}
	};

	this.reorderByPriority = function(){
		var dataSet = orderByPriority(fetchData());
		options.holder.innerHTML = "";

		for(var i = 0; i < dataSet.length ; i++){
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

	this.sort = function(value){
		value = value.toUpperCase();

		if(value === "ORDER"){
			that.reload();
		}else if(value === "PRIORITY"){
			that.reorderByPriority();
		}else {
			return false;
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