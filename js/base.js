var $$ = function(){};

$$.extend = function(obj1, obj2){
	var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};
$$.find = function(selector, holder){
    if(holder){
        return document.querySelector(selector);
    }
    return document.querySelector(selector);
};
$$.findAll = function(selector, holder){
	if(holder){
        return document.querySelectorAll(selector);
    }
    return document.querySelectorAll(selector);
};
$$.hasClass = function(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};
$$.toggleClass = function(element, className){
    if (!element || !className){
        return;
    }
    
    var classString = element.className, nameIndex = classString.indexOf(className);
    if (nameIndex == -1) {
        classString += ' ' + className;
    }
    else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
    }
    element.className = classString;
};