

define('tinymce/inlite/alien/Type', [
], function () {
	var isType = function (type) {
		return function (value) {
			return typeof value === type;
		};
	};

	var isArray = function (value) {
		return Array.isArray(value);
	};

	var isNull = function (value) {
		return value === null;
	};

	var isObject = function (predicate) {
		return function (value) {
			return !isNull(value) && !isArray(value) && predicate(value);
		};
	};

	return {
		isString: isType("string"),
		isNumber: isType("number"),
		isBoolean: isType("boolean"),
		isFunction: isType("function"),
		isObject: isObject(isType("object")),
		isNull: isNull,
		isArray: isArray
	};
});
