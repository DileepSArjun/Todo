var $$ = function () {};

$$.extend = function ( obj1, obj2 ) {
    'use strict';
    var obj3 = {};
    for ( var attrName in obj1 ) {
        obj3[ attrName ] = obj1[ attrName ];
    }
    for ( var attrName in obj2 ) {
        obj3[ attrName ] = obj2[ attrName ];
    }
    return obj3;
};
$$.find = function ( selector, holder ) {
    'use strict';
    if ( holder ) {
        return document.querySelector( selector );
    }
    return document.querySelector( selector );
};
$$.findAll = function ( selector, holder ) {
    'use strict';
    if ( holder ) {
        return document.querySelectorAll( selector );
    }
    return document.querySelectorAll( selector );
};
$$.hasClass = function ( element, cls ) {
    'use strict';
    return ( ' ' + element.className + ' ' )
        .indexOf( ' ' + cls + ' ' ) > -1;
};
$$.toggleClass = function ( element, className ) {
    'use strict';
    if ( !element || !className ) {
        return;
    }

    var classString = element.className,
        nameIndex = classString.indexOf( className );
    if ( nameIndex === -1 ) {
        classString += ' ' + className;
    } else {
        classString = classString.substr( 0, nameIndex ) + classString.substr( nameIndex + className.length );
    }
    element.className = classString;
};

$$.getUnwantedItem = function ( name, value ) {
    'use strict';
    return function ( item ) {
        if ( item[ name ] !== value ) {
            return item;
        }
    }
};