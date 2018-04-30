/**
 * z_module_MicroTemplating.js Created by Zjp on 2017/08/26.
 * 模板引擎：
 * 		目前只做到数据的单向绑定
 * 		事件的绑定（未完待定......）never
 */
;(function(root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		var z_module = root['Z_MODULE'] = root['Z_MODULE'] || {};
		var require = z_module['LocalJs']['require'];
		z_module['microTemplatingByES6String'] = factory(require);
	}
})(this, function() {
	var cache = {};
	var tmpl = function (str, data){
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			cache[str] = cache[str] ||
				tmpl(document.getElementById(str).innerHTML) :

			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			new Function("obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +

				// Introduce the data as local variables using with(){}
				"with(obj){p.push('" +

				// Convert the template into pure JavaScript
				str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'")
				+ "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
	};
	console.logTime('microTemplatingByES6String.js run');
	return tmpl
});