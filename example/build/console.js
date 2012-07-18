var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); }
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.add(this.matchedLeft());
			buf.add(f(this));
			s = this.matchedRight();
		}
		buf.b[buf.b.length] = s == null?"null":s;
		return buf.b.join("");
	}
	,__class__: EReg
}
var m = m || {}
if(!m.console) m.console = {}
m.console.Printer = $hxClasses["m.console.Printer"] = function() { }
m.console.Printer.__name__ = ["m","console","Printer"];
m.console.Printer.prototype = {
	print: null
	,__class__: m.console.Printer
}
var FilteredPrinter = $hxClasses["FilteredPrinter"] = function(printer) {
	this.printer = printer;
};
FilteredPrinter.__name__ = ["FilteredPrinter"];
FilteredPrinter.__interfaces__ = [m.console.Printer];
FilteredPrinter.prototype = {
	printer: null
	,print: function(level,params,indent,pos) {
		if(level == m.console.LogLevel.error) this.printer.print(level,params,indent,pos);
	}
	,__class__: FilteredPrinter
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return a.iterator();
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b[s.b.length] = "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b[s.b.length] = i == null?"null":i;
			s.b[s.b.length] = " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b[s.b.length] = ", ";
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,__class__: Hash
}
var IntHash = $hxClasses["IntHash"] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return a.iterator();
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b[s.b.length] = "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b[s.b.length] = i == null?"null":i;
			s.b[s.b.length] = " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b[s.b.length] = ", ";
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,__class__: IntHash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b[s.b.length] = "{";
		while(l != null) {
			if(first) first = false; else s.b[s.b.length] = ", ";
			s.add(Std.string(l[0]));
			l = l[1];
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b[s.b.length] = sep == null?"null":sep;
			s.add(l[0]);
			l = l[1];
		}
		return s.b.join("");
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
}
var Main = $hxClasses["Main"] = function() { }
Main.__name__ = ["Main"];
Main.main = function() {
	m.console.Console.start();
	m.console.Console.defaultPrinter.attach();
	haxe.Log.trace("log",{ fileName : "Main.hx", lineNumber : 21, className : "Main", methodName : "main", customParams : ["Something happened."]});
	haxe.Log.trace("info",{ fileName : "Main.hx", lineNumber : 22, className : "Main", methodName : "main", customParams : ["Something interesting happened."]});
	haxe.Log.trace("debug",{ fileName : "Main.hx", lineNumber : 23, className : "Main", methodName : "main", customParams : ["WHY WON'T YOU WORK!!"]});
	haxe.Log.trace("warn",{ fileName : "Main.hx", lineNumber : 24, className : "Main", methodName : "main", customParams : ["I didn't test this code at all..."]});
	haxe.Log.trace("error",{ fileName : "Main.hx", lineNumber : 25, className : "Main", methodName : "main", customParams : ["Something bad happened."]});
	haxe.Log.trace("Logtastic",{ fileName : "Main.hx", lineNumber : 28, className : "Main", methodName : "main"});
	haxe.Log.trace("string",{ fileName : "Main.hx", lineNumber : 31, className : "Main", methodName : "main", customParams : [10,{ key : "value"}]});
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues(["This is a log message. It's better than bad, it's good!"]));
		m.console.Console.print(m.console.LogLevel.log,["This is a log message. It's better than bad, it's good!"],{ fileName : "Main.hx", lineNumber : 34, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["info"].apply(console,m.console.Console.toWebKitValues(["This if for the information of travellers and guests."]));
		m.console.Console.print(m.console.LogLevel.info,["This if for the information of travellers and guests."],{ fileName : "Main.hx", lineNumber : 35, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["debug"].apply(console,m.console.Console.toWebKitValues(["This is when you're debugging at 2am and have lost all hope."]));
		m.console.Console.print(m.console.LogLevel.debug,["This is when you're debugging at 2am and have lost all hope."],{ fileName : "Main.hx", lineNumber : 36, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["warn"].apply(console,m.console.Console.toWebKitValues(["Danger Will Robinson, DANGER!"]));
		m.console.Console.print(m.console.LogLevel.warn,["Danger Will Robinson, DANGER!"],{ fileName : "Main.hx", lineNumber : 37, className : "Main", methodName : "main"});
	}
	m.console.Console.error("Epic FAIL",{ fileName : "Main.hx", lineNumber : 38, className : "Main", methodName : "main"});
	Main.triggerException();
	m.console.Console.trace({ fileName : "Main.hx", lineNumber : 44, className : "Main", methodName : "main"});
	var a = null;
	m.console.Console.assert(a == null,"a is not null",{ fileName : "Main.hx", lineNumber : 48, className : "Main", methodName : "main"});
	try {
		m.console.Console.assert(a != null,"a is null",{ fileName : "Main.hx", lineNumber : 52, className : "Main", methodName : "main"});
	} catch( e ) {
	}
	m.console.Console.count("apples",{ fileName : "Main.hx", lineNumber : 57, className : "Main", methodName : "main"});
	m.console.Console.count("apples",{ fileName : "Main.hx", lineNumber : 60, className : "Main", methodName : "main"});
	var _g = 0;
	while(_g < 5) {
		var i = _g++;
		m.console.Console.count("iterator",{ fileName : "Main.hx", lineNumber : 63, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["group"].apply(console,m.console.Console.toWebKitValues(["Groups:"]));
		m.console.Console.print(m.console.LogLevel.log,["Groups:"],{ fileName : "Main.hx", lineNumber : 66, className : "Main", methodName : "main"});
		m.console.Console.groupDepth += 1;
	}
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues(["grouped log"]));
		m.console.Console.print(m.console.LogLevel.log,["grouped log"],{ fileName : "Main.hx", lineNumber : 67, className : "Main", methodName : "main"});
	}
	m.console.Console.error("grouped error",{ fileName : "Main.hx", lineNumber : 68, className : "Main", methodName : "main"});
	{
		if(m.console.Console.isWebKit) console["group"].apply(console,m.console.Console.toWebKitValues(["Nested groups:"]));
		m.console.Console.print(m.console.LogLevel.log,["Nested groups:"],{ fileName : "Main.hx", lineNumber : 69, className : "Main", methodName : "main"});
		m.console.Console.groupDepth += 1;
	}
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues(["nested log"]));
		m.console.Console.print(m.console.LogLevel.log,["nested log"],{ fileName : "Main.hx", lineNumber : 70, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["warn"].apply(console,m.console.Console.toWebKitValues(["nested warnings too"]));
		m.console.Console.print(m.console.LogLevel.warn,["nested warnings too"],{ fileName : "Main.hx", lineNumber : 71, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["groupEnd"].apply(console,m.console.Console.toWebKitValues([]));
		if(m.console.Console.groupDepth > 0) m.console.Console.groupDepth -= 1;
	}
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues(["with proper indenting"]));
		m.console.Console.print(m.console.LogLevel.log,["with proper indenting"],{ fileName : "Main.hx", lineNumber : 73, className : "Main", methodName : "main"});
	}
	{
		if(m.console.Console.isWebKit) console["groupEnd"].apply(console,m.console.Console.toWebKitValues([]));
		if(m.console.Console.groupDepth > 0) m.console.Console.groupDepth -= 1;
	}
	{
		if(m.console.Console.isWebKit) console["time"].apply(console,m.console.Console.toWebKitValues(["timer"]));
		m.console.Console.times.set("timer",haxe.Timer.stamp());
	}
	var b = 10.0;
	var _g = 0;
	while(_g < 100000) {
		var i = _g++;
		b *= 0.999;
	}
	{
		if(m.console.Console.isWebKit) console["timeEnd"].apply(console,m.console.Console.toWebKitValues(["timer"]));
		if(m.console.Console.times.exists("timer")) {
			m.console.Console.print(m.console.LogLevel.log,["timer" + ": " + ((haxe.Timer.stamp() - m.console.Console.times.get("timer")) * 1000 | 0) + "ms"],{ fileName : "Main.hx", lineNumber : 80, className : "Main", methodName : "main"});
			m.console.Console.times.remove("timer");
		}
	}
	if(m.console.Console.isWebKit) console["profile"].apply(console,m.console.Console.toWebKitValues(["performance"]));
	var f = function(x) {
		return x * x;
	};
	var x = f(10);
	if(m.console.Console.isWebKit) console["profileEnd"].apply(console,m.console.Console.toWebKitValues(["performance"]));
	if(m.console.Console.isWebKit) console["markTimeline"].apply(console,m.console.Console.toWebKitValues(["finished"]));
	m.console.Console.log(Xml.parse("<this><is><some><xml/><with/><elements/></some></is></this>"),{ fileName : "Main.hx", lineNumber : 92, className : "Main", methodName : "main"});
	m.console.Console.log({ anonymous : { object : { 'is' : true, anonymous : true}}},{ fileName : "Main.hx", lineNumber : 93, className : "Main", methodName : "main"});
	m.console.Console.log(["I'm","an","array","bitches"],{ fileName : "Main.hx", lineNumber : 94, className : "Main", methodName : "main"});
	m.console.Console.log(TestEnum.value1,{ fileName : "Main.hx", lineNumber : 95, className : "Main", methodName : "main"});
	m.console.Console.log(TestEnum.value2(33),{ fileName : "Main.hx", lineNumber : 98, className : "Main", methodName : "main"});
	m.console.Console.log(TestEnum.value3({ oooh : "fancy"}),{ fileName : "Main.hx", lineNumber : 99, className : "Main", methodName : "main"});
	var hash = new Hash();
	hash.set("hashy","goodness");
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues([hash]));
		m.console.Console.print(m.console.LogLevel.log,[hash],{ fileName : "Main.hx", lineNumber : 104, className : "Main", methodName : "main"});
	}
	var intHash = new IntHash();
	intHash.set(10,"int hashy goodness");
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues([intHash]));
		m.console.Console.print(m.console.LogLevel.log,[intHash],{ fileName : "Main.hx", lineNumber : 109, className : "Main", methodName : "main"});
	}
	var list = new List();
	list.add("support for iterables in general");
	list.add("also good");
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues([list]));
		m.console.Console.print(m.console.LogLevel.log,[list],{ fileName : "Main.hx", lineNumber : 115, className : "Main", methodName : "main"});
	}
	m.console.Console.removePrinter(m.console.Console.defaultPrinter);
	m.console.Console.addPrinter(new FilteredPrinter(m.console.Console.defaultPrinter));
	{
		if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues(["This shouldn't be logged (except in WebKit console)"]));
		m.console.Console.print(m.console.LogLevel.log,["This shouldn't be logged (except in WebKit console)"],{ fileName : "Main.hx", lineNumber : 122, className : "Main", methodName : "main"});
	}
	m.console.Console.error("This should be logged!",{ fileName : "Main.hx", lineNumber : 123, className : "Main", methodName : "main"});
	m.console.Console.stop();
}
Main.triggerException = function() {
	Main.addToStack();
}
Main.addToStack = function() {
	m.console.Console.error("oh noes!",{ fileName : "Main.hx", lineNumber : 136, className : "Main", methodName : "addToStack"});
}
Main.prototype = {
	__class__: Main
}
var TestEnum = $hxClasses["TestEnum"] = { __ename__ : ["TestEnum"], __constructs__ : ["value1","value2","value3"] }
TestEnum.value1 = ["value1",0];
TestEnum.value1.toString = $estr;
TestEnum.value1.__enum__ = TestEnum;
TestEnum.value2 = function(a) { var $x = ["value2",1,a]; $x.__enum__ = TestEnum; $x.toString = $estr; return $x; }
TestEnum.value3 = function(b) { var $x = ["value3",2,b]; $x.__enum__ = TestEnum; $x.toString = $estr; return $x; }
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && f.__name__ == null;
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && v.__name__ != null;
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
Reflect.prototype = {
	__class__: Reflect
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && x.charCodeAt(1) == 120) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype = {
	__class__: Std
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = new Array();
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b[this.b.length] = x == null?"null":x;
	}
	,addSub: function(s,pos,len) {
		this.b[this.b.length] = s.substr(pos,len);
	}
	,addChar: function(c) {
		this.b[this.b.length] = String.fromCharCode(c);
	}
	,toString: function() {
		return this.b.join("");
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && s.substr(0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && s.substr(slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return s.substr(r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return s.substr(0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += c.substr(0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += c.substr(0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.cca(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
StringTools.prototype = {
	__class__: StringTools
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || e.__ename__ == null) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	a.remove("__class__");
	a.remove("__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__properties__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.copy();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ != null) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
Type.prototype = {
	__class__: Type
}
var Xml = $hxClasses["Xml"] = function() {
};
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	var rules = [Xml.enode,Xml.epcdata,Xml.eend,Xml.ecdata,Xml.edoctype,Xml.ecomment,Xml.eprolog];
	var nrules = rules.length;
	var current = Xml.createDocument();
	var stack = new List();
	while(str.length > 0) {
		var i = 0;
		try {
			while(i < nrules) {
				var r = rules[i];
				if(r.match(str)) {
					switch(i) {
					case 0:
						var x = Xml.createElement(r.matched(1));
						current.addChild(x);
						str = r.matchedRight();
						while(Xml.eattribute.match(str)) {
							x.set(Xml.eattribute.matched(1),Xml.eattribute.matched(3));
							str = Xml.eattribute.matchedRight();
						}
						if(!Xml.eclose.match(str)) {
							i = nrules;
							throw "__break__";
						}
						if(Xml.eclose.matched(1) == ">") {
							stack.push(current);
							current = x;
						}
						str = Xml.eclose.matchedRight();
						break;
					case 1:
						var x = Xml.createPCData(r.matched(0));
						current.addChild(x);
						str = r.matchedRight();
						break;
					case 2:
						if(current._children != null && current._children.length == 0) {
							var e = Xml.createPCData("");
							current.addChild(e);
						}
						if(r.matched(1) != current._nodeName || stack.isEmpty()) {
							i = nrules;
							throw "__break__";
						}
						current = stack.pop();
						str = r.matchedRight();
						break;
					case 3:
						str = r.matchedRight();
						if(!Xml.ecdata_end.match(str)) throw "End of CDATA section not found";
						var x = Xml.createCData(Xml.ecdata_end.matchedLeft());
						current.addChild(x);
						str = Xml.ecdata_end.matchedRight();
						break;
					case 4:
						var pos = 0;
						var count = 0;
						var old = str;
						try {
							while(true) {
								if(!Xml.edoctype_elt.match(str)) throw "End of DOCTYPE section not found";
								var p = Xml.edoctype_elt.matchedPos();
								pos += p.pos + p.len;
								str = Xml.edoctype_elt.matchedRight();
								switch(Xml.edoctype_elt.matched(0)) {
								case "[":
									count++;
									break;
								case "]":
									count--;
									if(count < 0) throw "Invalid ] found in DOCTYPE declaration";
									break;
								default:
									if(count == 0) throw "__break__";
								}
							}
						} catch( e ) { if( e != "__break__" ) throw e; }
						var x = Xml.createDocType(old.substr(10,pos - 11));
						current.addChild(x);
						break;
					case 5:
						if(!Xml.ecomment_end.match(str)) throw "Unclosed Comment";
						var p = Xml.ecomment_end.matchedPos();
						var x = Xml.createComment(str.substr(4,p.pos + p.len - 7));
						current.addChild(x);
						str = Xml.ecomment_end.matchedRight();
						break;
					case 6:
						var prolog = r.matched(0);
						var x = Xml.createProlog(prolog.substr(2,prolog.length - 4));
						current.addChild(x);
						str = r.matchedRight();
						break;
					}
					throw "__break__";
				}
				i += 1;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(i == nrules) {
			if(str.length > 10) throw "Xml parse error : Unexpected " + str.substr(0,10) + "..."; else throw "Xml parse error : Unexpected " + str;
		}
	}
	if(!stack.isEmpty()) throw "Xml parse error : Unclosed " + stack.last().getNodeName();
	return current;
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	nodeType: null
	,nodeName: null
	,nodeValue: null
	,parent: null
	,_nodeName: null
	,_nodeValue: null
	,_attributes: null
	,_children: null
	,_parent: null
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getParent: function() {
		return this._parent;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) x._parent._children.remove(x);
		x._parent = this;
		this._children.push(x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = this._children.remove(x);
		if(b) x._parent = null;
		return b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) x._parent._children.remove(x);
		x._parent = this;
		this._children.insert(pos,x);
	}
	,toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b[s.b.length] = "<";
			s.add(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b[s.b.length] = " ";
				s.b[s.b.length] = k == null?"null":k;
				s.b[s.b.length] = "=\"";
				s.add(this._attributes.get(k));
				s.b[s.b.length] = "\"";
			}
			if(this._children.length == 0) {
				s.b[s.b.length] = "/>";
				return s.b.join("");
			}
			s.b[s.b.length] = ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.add(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b[s.b.length] = "</";
			s.add(this._nodeName);
			s.b[s.b.length] = ">";
		}
		return s.b.join("");
	}
	,__class__: Xml
	,__properties__: {get_parent:"getParent",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",set_nodeName:"setNodeName",get_nodeName:"getNodeName"}
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype = {
	__class__: haxe.Log
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	return [];
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b[b.b.length] = "\nCalled from ";
		haxe.Stack.itemToString(b,s);
	}
	return b.b.join("");
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b[b.b.length] = "a C function";
		break;
	case 1:
		var m = $e[2];
		b.b[b.b.length] = "module ";
		b.b[b.b.length] = m == null?"null":m;
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b[b.b.length] = " (";
		}
		b.b[b.b.length] = file == null?"null":file;
		b.b[b.b.length] = " line ";
		b.b[b.b.length] = line == null?"null":line;
		if(s1 != null) b.b[b.b.length] = ")";
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b[b.b.length] = cname == null?"null":cname;
		b.b[b.b.length] = ".";
		b.b[b.b.length] = meth == null?"null":meth;
		break;
	case 4:
		var n = $e[2];
		b.b[b.b.length] = "local function #";
		b.b[b.b.length] = n == null?"null":n;
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	return null;
}
haxe.Stack.prototype = {
	__class__: haxe.Stack
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return Date.now().getTime() / 1000;
}
haxe.Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	};
	Array.prototype.remove = Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	};
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	};
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return undefined;
		return x;
	};
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		} else if(len < 0) len = this.length + len - pos;
		return oldsub.apply(this,[pos,len]);
	};
	Function.prototype["$bind"] = function(o) {
		var f = function() {
			return f.method.apply(f.scope,arguments);
		};
		f.scope = o;
		f.method = this;
		return f;
	};
}
js.Boot.prototype = {
	__class__: js.Boot
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype = {
	__class__: js.Lib
}
m.console.PrinterBase = $hxClasses["m.console.PrinterBase"] = function() {
	this.printPosition = true;
	this.printLineNumbers = true;
};
m.console.PrinterBase.__name__ = ["m","console","PrinterBase"];
m.console.PrinterBase.prototype = {
	printPosition: null
	,printLineNumbers: null
	,position: null
	,lineNumber: null
	,print: function(level,params,indent,pos) {
		var _g1 = 0, _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			params[i] = Std.string(params[i]);
		}
		var message = params.join(", ");
		var nextPosition = "@ " + pos.className + "." + pos.methodName;
		var nextLineNumber = Std.string(pos.lineNumber);
		var lineColumn = "  ";
		var emptyLineColumn = "  ";
		if(this.printPosition) {
			if(nextPosition != this.position) this.printLine(m.console.ConsoleColor.none,nextPosition,pos);
		}
		if(this.printLineNumbers) {
			emptyLineColumn = StringTools.lpad(""," ",5);
			if(nextPosition != this.position || nextLineNumber != this.lineNumber) lineColumn = StringTools.lpad(nextLineNumber," ",4) + " "; else lineColumn = emptyLineColumn;
		}
		this.position = nextPosition;
		this.lineNumber = nextLineNumber;
		var color = (function($this) {
			var $r;
			switch( (level)[1] ) {
			case 0:
				$r = m.console.ConsoleColor.white;
				break;
			case 1:
				$r = m.console.ConsoleColor.blue;
				break;
			case 2:
				$r = m.console.ConsoleColor.green;
				break;
			case 3:
				$r = m.console.ConsoleColor.yellow;
				break;
			case 4:
				$r = m.console.ConsoleColor.red;
				break;
			}
			return $r;
		}(this));
		var indent1 = StringTools.lpad(""," ",indent * 2);
		message = lineColumn + indent1 + message;
		message = message.split("\n").join("\n" + emptyLineColumn + indent1);
		this.printLine(color,message,pos);
	}
	,printLine: function(color,line,pos) {
		throw "method not implemented in ConsolePrinterBase";
	}
	,__class__: m.console.PrinterBase
}
m.console.ConsoleView = $hxClasses["m.console.ConsoleView"] = function() {
	m.console.PrinterBase.call(this);
	this.atBottom = true;
	this.projectHome = "/ws/mcore/example/console/ConsoleExample/";
	var document = js.Lib.document;
	this.element = document.createElement("pre");
	this.element.id = "console";
	var style = document.createElement("style");
	this.element.appendChild(style);
	var rules = document.createTextNode("#console {\n\tfont-family:monospace;\n\tbackground-color:#002B36;\n\tbackground-color:rgba(0%,16.9%,21.2%,0.95);\n\tpadding:8px;\n\theight:600px;\n\tmax-height:600px;\n\toverflow-y:scroll;\n\tposition:absolute;\n\tleft:0px;\n\ttop:0px;\n\tright:0px;\n\tmargin:0px;\n\tz-index:10000;\n}\n#console a { text-decoration:none; }\n#console a:hover div { background-color:#063642 }\n#console a div span { display:none; float:right; color:white; }\n#console a:hover div span { display:block; }");
	style.type = "text/css";
	if(style.styleSheet) style.styleSheet.cssText = rules.nodeValue; else style.appendChild(rules);
	var me = this;
	this.element.onscroll = function(e) {
		me.updateScroll();
	};
};
m.console.ConsoleView.__name__ = ["m","console","ConsoleView"];
m.console.ConsoleView.__interfaces__ = [m.console.Printer];
m.console.ConsoleView.__super__ = m.console.PrinterBase;
m.console.ConsoleView.prototype = $extend(m.console.PrinterBase.prototype,{
	element: null
	,projectHome: null
	,atBottom: null
	,updateScroll: function() {
		this.atBottom = this.element.scrollTop - (this.element.scrollHeight - this.element.clientHeight) == 0;
	}
	,printLine: function(color,line,pos) {
		var style = (function($this) {
			var $r;
			switch( (color)[1] ) {
			case 0:
				$r = "#839496";
				break;
			case 1:
				$r = "#ffffff";
				break;
			case 2:
				$r = "#248bd2";
				break;
			case 3:
				$r = "#859900";
				break;
			case 4:
				$r = "#b58900";
				break;
			case 5:
				$r = "#dc322f";
				break;
			}
			return $r;
		}(this));
		var file = pos.fileName + ":" + pos.lineNumber;
		var fileName = pos.className.split(".").join("/") + ".hx";
		var url = "txmt://open/?url=file://" + this.projectHome + "src/" + fileName + "&line=" + pos.lineNumber;
		this.element.innerHTML = this.element.innerHTML + "<a href='" + url + "'><div style='color:" + style + "'>" + line + "<span>" + file + "</span></div></a>";
		if(this.atBottom) this.element.scrollTop = this.element.scrollHeight;
	}
	,attach: function() {
		js.Lib.document.body.appendChild(this.element);
	}
	,remove: function() {
		js.Lib.document.body.removeChild(this.element);
	}
	,__class__: m.console.ConsoleView
});
m.console.Console = $hxClasses["m.console.Console"] = function() { }
m.console.Console.__name__ = ["m","console","Console"];
m.console.Console.previousTrace = null;
m.console.Console.start = function() {
	if(m.console.Console.running) return;
	m.console.Console.running = true;
	m.console.Console.previousTrace = haxe.Log.trace;
	haxe.Log.trace = m.console.Console.haxeTrace;
	if(m.console.Console.isWebKit) {
	} else m.console.Console.defaultPrinter.attach();
}
m.console.Console.stop = function() {
	if(!m.console.Console.running) return;
	m.console.Console.running = false;
	haxe.Log.trace = m.console.Console.previousTrace;
	m.console.Console.previousTrace = null;
}
m.console.Console.haxeTrace = function(value,pos) {
	var params = pos.customParams;
	if(params == null) params = [];
	var level = (function($this) {
		var $r;
		switch(value) {
		case "log":
			$r = m.console.LogLevel.log;
			break;
		case "warn":
			$r = m.console.LogLevel.warn;
			break;
		case "info":
			$r = m.console.LogLevel.info;
			break;
		case "debug":
			$r = m.console.LogLevel.debug;
			break;
		case "error":
			$r = m.console.LogLevel.error;
			break;
		default:
			$r = (function($this) {
				var $r;
				params.unshift(value);
				$r = m.console.LogLevel.log;
				return $r;
			}($this));
		}
		return $r;
	}(this));
	if(m.console.Console.isWebKit) console[Std.string(level)].apply(console,m.console.Console.toWebKitValues(params));
	m.console.Console.print(level,params,pos);
}
m.console.Console.addPrinter = function(printer) {
	m.console.Console.removePrinter(printer);
	m.console.Console.printers.push(printer);
}
m.console.Console.removePrinter = function(printer) {
	m.console.Console.printers.remove(printer);
}
m.console.Console.print = function(level,params,pos) {
	var _g = 0, _g1 = m.console.Console.printers;
	while(_g < _g1.length) {
		var printer = _g1[_g];
		++_g;
		printer.print(level,params,m.console.Console.groupDepth,pos);
	}
}
m.console.Console.log = function(message,pos) {
	if(m.console.Console.isWebKit) console["log"].apply(console,m.console.Console.toWebKitValues([message]));
	m.console.Console.print(m.console.LogLevel.log,[message],pos);
}
m.console.Console.info = function(message,pos) {
	if(m.console.Console.isWebKit) console["info"].apply(console,m.console.Console.toWebKitValues([message]));
	m.console.Console.print(m.console.LogLevel.info,[message],pos);
}
m.console.Console.debug = function(message,pos) {
	if(m.console.Console.isWebKit) console["debug"].apply(console,m.console.Console.toWebKitValues([message]));
	m.console.Console.print(m.console.LogLevel.debug,[message],pos);
}
m.console.Console.warn = function(message,pos) {
	if(m.console.Console.isWebKit) console["warn"].apply(console,m.console.Console.toWebKitValues([message]));
	m.console.Console.print(m.console.LogLevel.warn,[message],pos);
}
m.console.Console.error = function(message,pos) {
	if(m.console.Console.isWebKit) console["error"].apply(console,m.console.Console.toWebKitValues([message]));
	var stack = m.console.StackHelper.toString(haxe.Stack.callStack());
	m.console.Console.print(m.console.LogLevel.error,["Error: " + message + "\n" + stack],pos);
}
m.console.Console.trace = function(pos) {
	if(m.console.Console.isWebKit) console["trace"].apply(console,m.console.Console.toWebKitValues([]));
	var stack = m.console.StackHelper.toString(haxe.Stack.callStack());
	m.console.Console.print(m.console.LogLevel.error,["Stack trace:\n" + stack],pos);
}
m.console.Console.assert = function(expression,message,pos) {
	if(m.console.Console.isWebKit) console["assert"].apply(console,m.console.Console.toWebKitValues([expression,message]));
	if(!expression) {
		var stack = m.console.StackHelper.toString(haxe.Stack.callStack());
		m.console.Console.print(m.console.LogLevel.error,["Assertion failed: " + message + "\n" + stack],pos);
		throw message;
	}
}
m.console.Console.count = function(title,pos) {
	if(m.console.Console.isWebKit) console["count"].apply(console,m.console.Console.toWebKitValues([title]));
	var position = pos.fileName + ":" + pos.lineNumber;
	var count = m.console.Console.counts.exists(position)?m.console.Console.counts.get(position) + 1:1;
	m.console.Console.counts.set(position,count);
	m.console.Console.print(m.console.LogLevel.log,[title + ": " + count],pos);
}
m.console.Console.group = function(message,pos) {
	if(m.console.Console.isWebKit) console["group"].apply(console,m.console.Console.toWebKitValues([message]));
	m.console.Console.print(m.console.LogLevel.log,[message],pos);
	m.console.Console.groupDepth += 1;
}
m.console.Console.groupEnd = function(pos) {
	if(m.console.Console.isWebKit) console["groupEnd"].apply(console,m.console.Console.toWebKitValues([]));
	if(m.console.Console.groupDepth > 0) m.console.Console.groupDepth -= 1;
}
m.console.Console.time = function(name,pos) {
	if(m.console.Console.isWebKit) console["time"].apply(console,m.console.Console.toWebKitValues([name]));
	m.console.Console.times.set(name,haxe.Timer.stamp());
}
m.console.Console.timeEnd = function(name,pos) {
	if(m.console.Console.isWebKit) console["timeEnd"].apply(console,m.console.Console.toWebKitValues([name]));
	if(m.console.Console.times.exists(name)) {
		m.console.Console.print(m.console.LogLevel.log,[name + ": " + ((haxe.Timer.stamp() - m.console.Console.times.get(name)) * 1000 | 0) + "ms"],pos);
		m.console.Console.times.remove(name);
	}
}
m.console.Console.markTimeline = function(label,pos) {
	if(m.console.Console.isWebKit) console["markTimeline"].apply(console,m.console.Console.toWebKitValues([label]));
}
m.console.Console.profile = function(title,pos) {
	if(m.console.Console.isWebKit) console["profile"].apply(console,m.console.Console.toWebKitValues([title]));
}
m.console.Console.profileEnd = function(title,pos) {
	if(m.console.Console.isWebKit) console["profileEnd"].apply(console,m.console.Console.toWebKitValues([title]));
}
m.console.Console.enterDebugger = function() {
	debugger;
}
m.console.Console.detectWebKit = function() {
	return console != null && console.log != null;
}
m.console.Console.callWebKit = function(method,params) {
	console[method].apply(console,m.console.Console.toWebKitValues(params));
}
m.console.Console.toWebKitValues = function(params) {
	var _g1 = 0, _g = params.length;
	while(_g1 < _g) {
		var i = _g1++;
		params[i] = m.console.Console.toWebKitValue(params[i]);
	}
	return params;
}
m.console.Console.toWebKitValue = function(value) {
	if(Std["is"](value,Xml)) {
		var parser = new DOMParser();
		return parser.parseFromString(value.toString(),"text/xml").firstChild;
	} else if(Std["is"](value,Hash)) {
		var $native = { };
		var hash = (function($this) {
			var $r;
			var $t = value;
			if(Std["is"]($t,Hash)) $t; else throw "Class cast error";
			$r = $t;
			return $r;
		}(this));
		var $it0 = hash.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			$native[key] = m.console.Console.toWebKitValue(hash.get(key));
		}
		return $native;
	} else if(Std["is"](value,IntHash)) {
		var $native = { };
		var hash = (function($this) {
			var $r;
			var $t = value;
			if(Std["is"]($t,IntHash)) $t; else throw "Class cast error";
			$r = $t;
			return $r;
		}(this));
		var $it1 = hash.keys();
		while( $it1.hasNext() ) {
			var key = $it1.next();
			$native[Std.string(key)] = m.console.Console.toWebKitValue(hash.get(key));
		}
		return $native;
	} else {
		var $e = (Type["typeof"](value));
		switch( $e[1] ) {
		case 7:
			var e = $e[2];
			var $native = [];
			var name = Type.getEnumName(e) + "." + value[0];
			var params = value.slice(2);
			if(params.length > 0) {
				$native.push(name + "(");
				var _g1 = 0, _g = params.length;
				while(_g1 < _g) {
					var i = _g1++;
					$native.push(m.console.Console.toWebKitValue(params[i]));
				}
				$native.push(")");
			} else return [name];
			return $native;
		default:
		}
		if(Reflect.field(value,"iterator") != null) {
			var $native = [];
			var iterable = value;
			var $it2 = iterable.iterator();
			while( $it2.hasNext() ) {
				var i = $it2.next();
				$native.push(m.console.Console.toWebKitValue(i));
			}
			return $native;
		}
	}
	return value;
}
m.console.Console.prototype = {
	__class__: m.console.Console
}
m.console.LogLevel = $hxClasses["m.console.LogLevel"] = { __ename__ : ["m","console","LogLevel"], __constructs__ : ["log","info","debug","warn","error"] }
m.console.LogLevel.log = ["log",0];
m.console.LogLevel.log.toString = $estr;
m.console.LogLevel.log.__enum__ = m.console.LogLevel;
m.console.LogLevel.info = ["info",1];
m.console.LogLevel.info.toString = $estr;
m.console.LogLevel.info.__enum__ = m.console.LogLevel;
m.console.LogLevel.debug = ["debug",2];
m.console.LogLevel.debug.toString = $estr;
m.console.LogLevel.debug.__enum__ = m.console.LogLevel;
m.console.LogLevel.warn = ["warn",3];
m.console.LogLevel.warn.toString = $estr;
m.console.LogLevel.warn.__enum__ = m.console.LogLevel;
m.console.LogLevel.error = ["error",4];
m.console.LogLevel.error.toString = $estr;
m.console.LogLevel.error.__enum__ = m.console.LogLevel;
m.console.ConsoleColor = $hxClasses["m.console.ConsoleColor"] = { __ename__ : ["m","console","ConsoleColor"], __constructs__ : ["none","white","blue","green","yellow","red"] }
m.console.ConsoleColor.none = ["none",0];
m.console.ConsoleColor.none.toString = $estr;
m.console.ConsoleColor.none.__enum__ = m.console.ConsoleColor;
m.console.ConsoleColor.white = ["white",1];
m.console.ConsoleColor.white.toString = $estr;
m.console.ConsoleColor.white.__enum__ = m.console.ConsoleColor;
m.console.ConsoleColor.blue = ["blue",2];
m.console.ConsoleColor.blue.toString = $estr;
m.console.ConsoleColor.blue.__enum__ = m.console.ConsoleColor;
m.console.ConsoleColor.green = ["green",3];
m.console.ConsoleColor.green.toString = $estr;
m.console.ConsoleColor.green.__enum__ = m.console.ConsoleColor;
m.console.ConsoleColor.yellow = ["yellow",4];
m.console.ConsoleColor.yellow.toString = $estr;
m.console.ConsoleColor.yellow.__enum__ = m.console.ConsoleColor;
m.console.ConsoleColor.red = ["red",5];
m.console.ConsoleColor.red.toString = $estr;
m.console.ConsoleColor.red.__enum__ = m.console.ConsoleColor;
m.console.StackHelper = $hxClasses["m.console.StackHelper"] = function() { }
m.console.StackHelper.__name__ = ["m","console","StackHelper"];
m.console.StackHelper.createFilters = function() {
	var filters = new Hash();
	filters.set("@ m.console.ConsoleRedirect.haxeTrace:59",true);
	return filters;
}
m.console.StackHelper.toString = function(stack) {
	return "null";
}
m.console.StackHelper.prototype = {
	__class__: m.console.StackHelper
}
m.console.StackItemHelper = $hxClasses["m.console.StackItemHelper"] = function() { }
m.console.StackItemHelper.__name__ = ["m","console","StackItemHelper"];
m.console.StackItemHelper.toString = function(item) {
	return (function($this) {
		var $r;
		var $e = (item);
		switch( $e[1] ) {
		case 1:
			var module = $e[2];
			$r = module;
			break;
		case 3:
			var method = $e[3], className = $e[2];
			$r = className + "." + method;
			break;
		case 4:
			var v = $e[2];
			$r = "Lambda(" + v + ")";
			break;
		case 2:
			var line = $e[4], file = $e[3], s = $e[2];
			$r = (s == null?file.split("::").join(".") + ":" + line:m.console.StackItemHelper.toString(s)) + ":" + line;
			break;
		case 0:
			$r = "(anonymous function)";
			break;
		}
		return $r;
	}(this));
}
m.console.StackItemHelper.prototype = {
	__class__: m.console.StackItemHelper
}
if(!m.exception) m.exception = {}
m.exception.Exception = $hxClasses["m.exception.Exception"] = function(message,cause,info) {
	if(message == null) message = "";
	this.name = Type.getClassName(Type.getClass(this));
	this.message = message;
	this.cause = cause;
	this.info = info;
};
m.exception.Exception.__name__ = ["m","exception","Exception"];
m.exception.Exception.getStackTrace = function(source) {
	var s = "";
	if(s != "") return s;
	var stack = haxe.Stack.exceptionStack();
	while(stack.length > 0) {
		var $e = (stack.shift());
		switch( $e[1] ) {
		case 2:
			var line = $e[4], file = $e[3], item = $e[2];
			s += "\tat " + file + " (" + line + ")\n";
			break;
		case 1:
			var module = $e[2];
			break;
		case 3:
			var method = $e[3], classname = $e[2];
			s += "\tat " + classname + "#" + method + "\n";
			break;
		case 4:
			var value = $e[2];
			break;
		case 0:
			break;
		}
	}
	return s;
}
m.exception.Exception.prototype = {
	name: null
	,get_name: function() {
		return this.name;
	}
	,message: null
	,get_message: function() {
		return this.message;
	}
	,cause: null
	,info: null
	,toString: function() {
		var str = this.get_name() + ": " + this.get_message();
		if(this.info != null) str += " at " + this.info.className + "#" + this.info.methodName + " (" + this.info.lineNumber + ")";
		if(this.cause != null) str += "\n\t Caused by: " + m.exception.Exception.getStackTrace(this.cause);
		return str;
	}
	,__class__: m.exception.Exception
	,__properties__: {get_message:"get_message",get_name:"get_name"}
}
m.exception.ArgumentException = $hxClasses["m.exception.ArgumentException"] = function(message,cause,info) {
	if(message == null) message = "";
	m.exception.Exception.call(this,message,cause,info);
};
m.exception.ArgumentException.__name__ = ["m","exception","ArgumentException"];
m.exception.ArgumentException.__super__ = m.exception.Exception;
m.exception.ArgumentException.prototype = $extend(m.exception.Exception.prototype,{
	__class__: m.exception.ArgumentException
});
m.exception.IllegalOperationException = $hxClasses["m.exception.IllegalOperationException"] = function(message,cause,info) {
	if(message == null) message = "";
	m.exception.Exception.call(this,message,cause,info);
};
m.exception.IllegalOperationException.__name__ = ["m","exception","IllegalOperationException"];
m.exception.IllegalOperationException.__super__ = m.exception.Exception;
m.exception.IllegalOperationException.prototype = $extend(m.exception.Exception.prototype,{
	__class__: m.exception.IllegalOperationException
});
if(!m.loader) m.loader = {}
m.loader.Loader = $hxClasses["m.loader.Loader"] = function() { }
m.loader.Loader.__name__ = ["m","loader","Loader"];
m.loader.Loader.prototype = {
	uri: null
	,progress: null
	,progressed: null
	,completed: null
	,failed: null
	,cancelled: null
	,load: null
	,cancel: null
	,__class__: m.loader.Loader
	,__properties__: {get_progress:"get_progress"}
}
m.loader.LoaderError = $hxClasses["m.loader.LoaderError"] = { __ename__ : ["m","loader","LoaderError"], __constructs__ : ["IOError","SecurityError","FormatError","DataError"] }
m.loader.LoaderError.IOError = function(info) { var $x = ["IOError",0,info]; $x.__enum__ = m.loader.LoaderError; $x.toString = $estr; return $x; }
m.loader.LoaderError.SecurityError = function(info) { var $x = ["SecurityError",1,info]; $x.__enum__ = m.loader.LoaderError; $x.toString = $estr; return $x; }
m.loader.LoaderError.FormatError = function(info) { var $x = ["FormatError",2,info]; $x.__enum__ = m.loader.LoaderError; $x.toString = $estr; return $x; }
m.loader.LoaderError.DataError = function(info,data) { var $x = ["DataError",3,info,data]; $x.__enum__ = m.loader.LoaderError; $x.toString = $estr; return $x; }
if(!m.signal) m.signal = {}
m.signal.Event = $hxClasses["m.signal.Event"] = function(bubbles) {
	if(bubbles == null) bubbles = false;
	this.bubbles = bubbles;
};
m.signal.Event.__name__ = ["m","signal","Event"];
m.signal.Event.prototype = {
	bubbles: null
	,target: null
	,currentTarget: null
	,signal: null
	,clone: function() {
		return new m.signal.Event(this.bubbles);
	}
	,__class__: m.signal.Event
}
m.signal.Signal = $hxClasses["m.signal.Signal"] = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = m.signal.SlotList.NIL;
	this.priorityBased = false;
};
m.signal.Signal.__name__ = ["m","signal","Signal"];
m.signal.Signal.prototype = {
	valueClasses: null
	,numListeners: null
	,slots: null
	,priorityBased: null
	,add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = m.signal.SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw new m.exception.IllegalOperationException("You cannot addOnce() then add() the same listener without removing the relationship first.",null,{ fileName : "Signal.hx", lineNumber : 133, className : "m.signal.Signal", methodName : "registrationPossible"});
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
	,__class__: m.signal.Signal
	,__properties__: {get_numListeners:"get_numListeners"}
}
m.signal.Signal1 = $hxClasses["m.signal.Signal1"] = function(type) {
	m.signal.Signal.call(this,[type]);
};
m.signal.Signal1.__name__ = ["m","signal","Signal1"];
m.signal.Signal1.__super__ = m.signal.Signal;
m.signal.Signal1.prototype = $extend(m.signal.Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new m.signal.Slot1(this,listener,once,priority);
	}
	,__class__: m.signal.Signal1
});
m.signal.EventSignal = $hxClasses["m.signal.EventSignal"] = function(target) {
	m.signal.Signal1.call(this,m.signal.Event);
	this.set_target(target);
};
m.signal.EventSignal.__name__ = ["m","signal","EventSignal"];
m.signal.EventSignal.__super__ = m.signal.Signal1;
m.signal.EventSignal.prototype = $extend(m.signal.Signal1.prototype,{
	target: null
	,set_target: function(value) {
		if(value == this.target) return this.target;
		this.removeAll();
		this.target = value;
		return this.target;
	}
	,dispatch: function(event) {
		if(event.target != null) event = event.clone();
		event.target = this.target;
		event.currentTarget = this.target;
		event.signal = this;
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(event);
			slotsToProcess = slotsToProcess.tail;
		}
		if(!event.bubbles) return;
		var currentTarget = this.target;
		while(currentTarget != null && Reflect.hasField(currentTarget,"parent")) {
			currentTarget = Reflect.field(currentTarget,"parent");
			if(Std["is"](currentTarget,m.signal.IBubbleEventHandler)) {
				event.currentTarget = currentTarget;
				var handler = (function($this) {
					var $r;
					var $t = currentTarget;
					if(Std["is"]($t,m.signal.IBubbleEventHandler)) $t; else throw "Class cast error";
					$r = $t;
					return $r;
				}(this));
				if(!handler.onEventBubbled(event)) break;
			}
		}
	}
	,__class__: m.signal.EventSignal
	,__properties__: $extend(m.signal.Signal1.prototype.__properties__,{set_target:"set_target"})
});
m.signal.IBubbleEventHandler = $hxClasses["m.signal.IBubbleEventHandler"] = function() { }
m.signal.IBubbleEventHandler.__name__ = ["m","signal","IBubbleEventHandler"];
m.signal.IBubbleEventHandler.prototype = {
	onEventBubbled: null
	,__class__: m.signal.IBubbleEventHandler
}
m.signal.Signal0 = $hxClasses["m.signal.Signal0"] = function() {
	m.signal.Signal.call(this);
};
m.signal.Signal0.__name__ = ["m","signal","Signal0"];
m.signal.Signal0.__super__ = m.signal.Signal;
m.signal.Signal0.prototype = $extend(m.signal.Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new m.signal.Slot0(this,listener,once,priority);
	}
	,__class__: m.signal.Signal0
});
m.signal.Signal2 = $hxClasses["m.signal.Signal2"] = function(type1,type2) {
	m.signal.Signal.call(this,[type1,type2]);
};
m.signal.Signal2.__name__ = ["m","signal","Signal2"];
m.signal.Signal2.__super__ = m.signal.Signal;
m.signal.Signal2.prototype = $extend(m.signal.Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new m.signal.Slot2(this,listener,once,priority);
	}
	,__class__: m.signal.Signal2
});
m.signal.Slot = $hxClasses["m.signal.Slot"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
m.signal.Slot.__name__ = ["m","signal","Slot"];
m.signal.Slot.prototype = {
	listener: null
	,once: null
	,priority: null
	,enabled: null
	,signal: null
	,remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) throw "listener cannot be null";
		return this.listener = value;
	}
	,__class__: m.signal.Slot
	,__properties__: {set_listener:"set_listener"}
}
m.signal.Slot0 = $hxClasses["m.signal.Slot0"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	m.signal.Slot.call(this,signal,listener,once,priority);
};
m.signal.Slot0.__name__ = ["m","signal","Slot0"];
m.signal.Slot0.__super__ = m.signal.Slot;
m.signal.Slot0.prototype = $extend(m.signal.Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: m.signal.Slot0
});
m.signal.Slot1 = $hxClasses["m.signal.Slot1"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	m.signal.Slot.call(this,signal,listener,once,priority);
};
m.signal.Slot1.__name__ = ["m","signal","Slot1"];
m.signal.Slot1.__super__ = m.signal.Slot;
m.signal.Slot1.prototype = $extend(m.signal.Slot.prototype,{
	param: null
	,execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: m.signal.Slot1
});
m.signal.Slot2 = $hxClasses["m.signal.Slot2"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	m.signal.Slot.call(this,signal,listener,once,priority);
};
m.signal.Slot2.__name__ = ["m","signal","Slot2"];
m.signal.Slot2.__super__ = m.signal.Slot;
m.signal.Slot2.prototype = $extend(m.signal.Slot.prototype,{
	param1: null
	,param2: null
	,execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: m.signal.Slot2
});
m.signal.SlotList = $hxClasses["m.signal.SlotList"] = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(m.signal.SlotList.NIL != null) throw new m.exception.ArgumentException("Parameters head and tail are null. Use the NIL element instead.",null,{ fileName : "SlotList.hx", lineNumber : 40, className : "m.signal.SlotList", methodName : "new"});
		this.nonEmpty = false;
	} else if(head == null) throw new m.exception.ArgumentException("Parameter head cannot be null.",null,{ fileName : "SlotList.hx", lineNumber : 48, className : "m.signal.SlotList", methodName : "new"}); else {
		this.head = head;
		this.tail = tail == null?m.signal.SlotList.NIL:tail;
		this.nonEmpty = true;
	}
};
m.signal.SlotList.__name__ = ["m","signal","SlotList"];
m.signal.SlotList.NIL = null;
m.signal.SlotList.prototype = {
	head: null
	,tail: null
	,nonEmpty: null
	,length: null
	,get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == m.signal.SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new m.signal.SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new m.signal.SlotList(slot);
		if(this.tail == m.signal.SlotList.NIL) return new m.signal.SlotList(slot).prepend(this.head);
		var wholeClone = new m.signal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new m.signal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new m.signal.SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new m.signal.SlotList(slot);
		var priority = slot.priority;
		if(priority > this.head.priority) return this.prepend(slot);
		var wholeClone = new m.signal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new m.signal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new m.signal.SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new m.signal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new m.signal.SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,__class__: m.signal.SlotList
	,__properties__: {get_length:"get_length"}
}
js.Boot.__res = {}
js.Boot.__init();
{
	var d = Date;
	d.now = function() {
		return new Date();
	};
	d.fromTime = function(t) {
		var d1 = new Date();
		d1["setTime"](t);
		return d1;
	};
	d.fromString = function(s) {
		switch(s.length) {
		case 8:
			var k = s.split(":");
			var d1 = new Date();
			d1["setTime"](0);
			d1["setUTCHours"](k[0]);
			d1["setUTCMinutes"](k[1]);
			d1["setUTCSeconds"](k[2]);
			return d1;
		case 10:
			var k = s.split("-");
			return new Date(k[0],k[1] - 1,k[2],0,0,0);
		case 19:
			var k = s.split(" ");
			var y = k[0].split("-");
			var t = k[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		default:
			throw "Invalid date format : " + s;
		}
	};
	d.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d1 = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d1 < 10?"0" + d1:"" + d1) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
	};
	d.prototype.__class__ = $hxClasses["Date"] = d;
	d.__name__ = ["Date"];
}
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	$hxClasses["Math"] = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
}
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses["Array"] = Array;
	Array.__name__ = ["Array"];
	var Int = $hxClasses["Int"] = { __name__ : ["Int"]};
	var Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
	var Float = $hxClasses["Float"] = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses["Bool"] = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses["Class"] = { __name__ : ["Class"]};
	var Enum = { };
	var Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
}
{
	Xml.Element = "element";
	Xml.PCData = "pcdata";
	Xml.CData = "cdata";
	Xml.Comment = "comment";
	Xml.DocType = "doctype";
	Xml.Prolog = "prolog";
	Xml.Document = "document";
}
{
	if(typeof document != "undefined") js.Lib.document = document;
	if(typeof window != "undefined") {
		js.Lib.window = window;
		js.Lib.window.onerror = function(msg,url,line) {
			var f = js.Lib.onerror;
			if(f == null) return false;
			return f(msg,[url + ":" + line]);
		};
	}
}
m.signal.SlotList.NIL = new m.signal.SlotList(null,null);
Xml.enode = new EReg("^<([a-zA-Z0-9:._-]+)","");
Xml.ecdata = new EReg("^<!\\[CDATA\\[","i");
Xml.edoctype = new EReg("^<!DOCTYPE ","i");
Xml.eend = new EReg("^</([a-zA-Z0-9:._-]+)>","");
Xml.epcdata = new EReg("^[^<]+","");
Xml.ecomment = new EReg("^<!--","");
Xml.eprolog = new EReg("^<\\?[^\\?]+\\?>","");
Xml.eattribute = new EReg("^\\s*([a-zA-Z0-9:_-]+)\\s*=\\s*([\"'])([^\\2]*?)\\2","");
Xml.eclose = new EReg("^[ \r\n\t]*(>|(/>))","");
Xml.ecdata_end = new EReg("\\]\\]>","");
Xml.edoctype_elt = new EReg("[\\[|\\]>]","");
Xml.ecomment_end = new EReg("-->","");
js.Lib.onerror = null;
m.console.ConsoleView.CONSOLE_STYLES = "#console {\n\tfont-family:monospace;\n\tbackground-color:#002B36;\n\tbackground-color:rgba(0%,16.9%,21.2%,0.95);\n\tpadding:8px;\n\theight:600px;\n\tmax-height:600px;\n\toverflow-y:scroll;\n\tposition:absolute;\n\tleft:0px;\n\ttop:0px;\n\tright:0px;\n\tmargin:0px;\n\tz-index:10000;\n}\n#console a { text-decoration:none; }\n#console a:hover div { background-color:#063642 }\n#console a div span { display:none; float:right; color:white; }\n#console a:hover div span { display:block; }";
m.console.Console.defaultPrinter = new m.console.ConsoleView();
m.console.Console.printers = [m.console.Console.defaultPrinter];
m.console.Console.groupDepth = 0;
m.console.Console.times = new Hash();
m.console.Console.counts = new Hash();
m.console.Console.running = false;
m.console.Console.isWebKit = m.console.Console.detectWebKit();
m.console.StackHelper.filters = m.console.StackHelper.createFilters();
m.signal.Signal.__meta__ = { fields : { createSlot : { IgnoreCover : null}}};
Main.main()
//@ sourceMappingURL=console.js.map