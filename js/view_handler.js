var TodosList = function(settings){
	//privare methods
	var options = $$.extend({
			holder : null,
			caption : 'TODOS',
			controls : null
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

		bo.innerHTML = "<div class='view'>"+
						"<input class='toggle' type='checkbox'"+(item.done ? 'checked' : '')+">"+
						"<label title='"+item.desc+"'>"+item.title+"</label>"+
						"<span class='priority span-label' title='Priority'>"+item.priority+"</span>"+
						"<span class='order span-label' title='Order'>"+item.order+"</span>"+
						"<a class='destroy'></a>"+
					"</div>";

		return bo;
	};

	function init(){
		that.reload();
		that._bindEvents();
	};


	this._nextOrder = 1;

	this._bindEventsOnList = function(bo){
		bo.addEventListener('click', function(event){

			if(event.target.className === "toggle"){
				$$.toggleClass(event.currentTarget, 'task-completed');
			}else if(event.target.className === "destroy"){
				console.log("delete item");
			}
		});

		return bo;
	};

	this._bindEvents = function(){

	};

	//public methods

	this.add = function(item){
		options.holder.appendChild(that._bindEventsOnList(addItem(item)));
		that._nextOrder++;
	};

	this.remove = function(){};
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