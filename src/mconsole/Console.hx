/*
Copyright (c) 2012 Massive Interactive

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/

package mconsole;

import haxe.PosInfos;

#if haxe3
import Map;
import haxe.CallStack;
import haxe.ds.StringMap;
#else
import haxe.Stack;
private typedef CallStack = haxe.Stack;
private typedef StringMap<T> = Hash<T>;
#end

/**
	This console implementation assumes the availability of the WebKit console. 
	We inline calls to the native API rather than simply creating an extern so 
	we can add additional console methods (such as enterDebugger). This also 
	means we can convert some Haxe structures (XML for example) into something 
	more readable in the console.

	In flash, we call the WebKit console API through ExternalInterface.
**/
class Console
{
	#if no_console // null implementation

	public static function start() {}
	public static function stop() {}
	public static function addPrinter(printer:Printer) {}
	public static function removePrinter(printer:Printer) {}

	inline public static function log(message:Dynamic, ?pos:PosInfos) {}
	inline public static function info(message:Dynamic, ?pos:PosInfos) {}
	inline public static function debug(message:Dynamic, ?pos:PosInfos) {}
	inline public static function warn(message:Dynamic, ?pos:PosInfos) {}
	inline public static function error(message:Dynamic, ?stack:Bool=false, ?pos:PosInfos) {}
	inline public static function trace() {}
	inline public static function assert(expression:Bool, message:Dynamic) {}
	inline public static function count(?title:String) {}
	inline public static function group(message:Dynamic) {}
	inline public static function groupEnd() {}
	inline public static function time(name:String) {}
	inline public static function timeEnd(name:String) {}
	inline public static function markTimeline(label:String) {}
	inline public static function profile(?title:String) {}
	inline public static function profileEnd(?title:String) {}

    public static var defaultPrinter = null;

	#else

	/**
		The default console printer.
	**/
	public static var defaultPrinter = 

	#if (cpp && nme)
		new LogPrinter(haxe.Log.trace);
	#elseif (js && samsung && !browser)
		new AlertPrinter();
	#elseif (flash || (js && !nodejs))
		new ConsoleView();
	#elseif (sys || nodejs)
		new FilePrinter();
	#end

	/**
		The ConsolePrinters to print output to.
	**/

	static var printers:Array<Printer> = cast [defaultPrinter];
	
	/**
		The current group depth, incremented when group(name) is called, and 
		decremented when groupEnd() is called.
	**/
	static var groupDepth = 0;

	/**
		A map of named timestamps.
	**/
	static var times = new StringMap<Float>();

	/**
		A map of counters by a unique posInfo identifier.
	**/
	static var counts = new StringMap<Int>();

	/**
		The previous value of haxe.Log.trace if redirectTraces has been called, 
		or null if it has not.
	**/
	static var previousTrace:Dynamic;

	/**
		Is the console currently active?
	**/
	static var running = false;

	#if flash
	
	/**
		Magic: The only way to get Haxe XML objects to print nicely in the 
		WebKit console is if they are HTMLDom objects. So we log XML as:
			{__xml__:true, xml:xml.toString()}
		We call this "bridge" function via external interface, which checks for 
		__xml__ == true, and parses XML into a DOM using a DOMParser if it is.
	**/
	static var BRIDGE = "__mconsole__";

	/**
		Eval'd to create the bridge.
	**/
	static var CREATE_BRIDGE_SCRIPT = BRIDGE + 
" = function() {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    args.push(arg.___xml___ ? new DOMParser().parseFromString(arg.xml,'text/xml').firstChild : arg);
  }
  console[arguments[0]].apply(console, args);
}";
	
	/**
		Eval'd to remove the bridge.
	**/
	static var REMOVE_BRIDGE_SCRIPT = "delete window." + BRIDGE;
	#end
	

	/**
		Starts the console, redirecting haxe.Log.trace and adding a default 
		printer if WebKit is not available.

		The trace method accepts a variable number of arguments which are 
		passed to the console. If the first argument is a string that matches a 
		log level (log, info, warn...) then the trace is logged at that level.
	**/
	public static function start()
	{
		if (running) return;
		running = true;

		// redirect trace
		previousTrace = haxe.Log.trace;
		haxe.Log.trace = haxeTrace;

		if (hasConsole)
		{
			#if flash
			// create bridge
			flash.external.ExternalInterface.call("eval", CREATE_BRIDGE_SCRIPT);
			#end
		}
		else
		{
			#if ((js && !nodejs) || flash)
			// attach default printer to document/stage
			// defaultPrinter.attach();
			#end
		}
	}

	/**
		Restores the console to an inactive state.
	**/
	public static function stop()
	{
		if (!running) return;
		running = false;

		// restore previous trace
		haxe.Log.trace = previousTrace;
		previousTrace = null;

		#if flash
		if (hasConsole)
		{
			// cleanup bridge
			flash.external.ExternalInterface.call("eval", REMOVE_BRIDGE_SCRIPT);
		}
		else
		{
			#if (js || flash)
			// remove default printer to document/stage
			defaultPrinter.remove();
			#end
		}
		#end
	}

	/**
		Add a console printer.
	**/
	public static function addPrinter(printer:Printer)
	{
		removePrinter(printer);
		printers.push(printer);
	}

	/**
		Remove a console printer.
	**/
	public static function removePrinter(printer:Printer)
	{
		printers.remove(printer);
	}

	/**
		The method called by Haxe trace. Checks if the first parameter matches 
		a log level, and forwards the log to the appropriate handler.
	**/
	static function haxeTrace(value:Dynamic, ?pos:PosInfos)
	{
		var params = pos.customParams;
		if (params == null) params = [];
		else pos.customParams = null;
		
		var level = switch (value)
		{
			case "log": LogLevel.log;
			case "warn": LogLevel.warn;
			case "info": LogLevel.info;
			case "debug": LogLevel.debug;
			case "error": LogLevel.error;
			default:
				params.unshift(value);
				LogLevel.log;
		}

		if (hasConsole) callConsole(Std.string(level), params);
		print(level, params, pos);
	}

	/**
		Print a message to each of the printers.
	**/
	inline static function print(level:LogLevel, params:Array<Dynamic>, pos:PosInfos)
	{
		for (printer in printers) printer.print(level, params, groupDepth, pos);
	}

	/**
		Logs the message.
	**/
	inline public static function log(message:Dynamic, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("log", [message]);
		print(LogLevel.log, [message], pos);
	}

	/**
		Logs the message.
	**/
	inline public static function info(message:Dynamic, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("info", [message]);
		print(LogLevel.info, [message], pos);
	}

	/**
		Logs the message.
	**/
	inline public static function debug(message:Dynamic, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("debug", [message]);
		print(LogLevel.debug, [message], pos);
	}

	/**
		Logs a "warning" icon followed by a color-coded message.
	**/
	inline public static function warn(message:Dynamic, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("warn", [message]);
		print(LogLevel.warn, [message], pos);
	}

	/**
		Logs an "error" icon followed by a color-coded message.
	**/
	inline public static function error(message:Dynamic, ?stack:Array<StackItem>=null, ?pos:PosInfos):Void
	{
		if (stack == null) stack = CallStack.callStack();
		var stackTrace = stack.length > 0 ? "\n" + StackHelper.toString(stack) : "";

		if (hasConsole)
		{
			#if js
			callConsole("error", [message]);
			#elseif flash
			// can't send flash stack trace to WebKit, so warn instead
			callConsole("warn", ["Error: " + message + stackTrace]);
			#end
		}

		print(LogLevel.error, ["Error: " + message + stackTrace], pos);
	}

	/**
		Logs a stack trace at the moment the function is called. The stack 
		trace lists the functions on the call stack (functions that have been 
		called and have not yet finished executing and returned) and the values 
		of any arguments passed to those functions.
	**/
	inline public static function trace(?pos:PosInfos):Void
	{
		if (hasConsole)
		{
			#if js
			callConsole("trace", []);
			#elseif flash
			// can't send flash stack trace to WebKit, so info instead
			var stack = StackHelper.toString(CallStack.callStack());
			callConsole("info", ["Stack trace:\n" + stack]);
			#end
		}

		var stack = StackHelper.toString(CallStack.callStack());
		print(LogLevel.error, ["Stack trace:\n" + stack], pos);
	}

	/**
		If expression evaluates to false, logs the message.
	**/
	inline public static function assert(expression:Bool, message:Dynamic, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("assert", [expression, message]);

		if (!expression)
		{
			var stack = StackHelper.toString(CallStack.callStack());
			print(LogLevel.error, ["Assertion failed: " + message + "\n" + stack], pos);
			throw message;
		}
	}

	/**
		Logs the number of times this line of code has executed, and an 
		optional title.
	**/
	inline public static function count(title:String, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("count", [title]);

		var position = pos.fileName + ":" + pos.lineNumber;
		var count = (counts.exists(position) ? counts.get(position) + 1 : 1);
		counts.set(position, count);
		print(LogLevel.log, [title + ": " + count], pos);
	}

	/**
		Logs the message object and begins an indented block for further 
		log entries.
	**/
	inline public static function group(message:Dynamic, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("group", [message]);

		print(LogLevel.log, [message], pos);
		groupDepth += 1;
	}

	/**
		Ends an indented block of log entries.
	**/
	inline public static function groupEnd(?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("groupEnd", []);
		if (groupDepth > 0) groupDepth -= 1;
	}

	/**
		Starts a timer and gives it a name.
	**/
	inline public static function time(name:String, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("time", [name]);
		// Use Sys.time() in macros, see: https://github.com/haxenme/NME/issues/21
		times.set(name, #if macro Sys.time() #else haxe.Timer.stamp() #end);
	}

	/**
		Logs the time since Console.time(name) was called, and restarts the timer.
	**/
	inline public static function timeEnd(name:String, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("timeEnd", [name]);
		
		if (times.exists(name))
		{
			// Use Sys.time() in macros, see: https://github.com/haxenme/NME/issues/21
			print(LogLevel.log, [name + ": " + Std.int((#if macro Sys.time() #else haxe.Timer.stamp() #end - times.get(name)) * 1000) + "ms"], pos);
			times.remove(name);
		}
	}

	/**
		Adds a label to the timeline view marking when the point when the 
		method was called.
	**/
	inline public static function markTimeline(label:String, ?pos:PosInfos):Void
	{
		if (hasConsole) callConsole("markTimeline", [label]);

		// TODO: native implementation
	}

	/**
		Begins profiling JavaScript—tracking the number of times each function 
		is called, the time spent in that function, and the time spent in 
		nested groups of functions. If a title is provided, the profile is 
		named.
	*/
	inline public static function profile(?title:String, ?pos:PosInfos):Void
	{
		#if js
		if (hasConsole) callConsole("profile", [title]);
		#end

		// not currently supported outside of JS/WebKit
	}

	/**
		Ends one or more JavaScript profiles. If a title is provided and a 
		running profile has a matching title, only the current run of that 
		profile is ended. Otherwise, the current run of all profiles is ended.
	*/
	inline public static function profileEnd(?title:String, ?pos:PosInfos):Void
	{
		#if js
		if (hasConsole) callConsole("profileEnd", [title]);
		#end

		// not currently supported outside of JS/WebKit
	}

	/**
		Inserts a breakpoint at the calling position.
	**/
	inline public static function enterDebugger()
	{
		#if js
		untyped __js__("debugger");
		#elseif flash
		flash.system.ApplicationDomain.currentDomain.getDefinition("flash.debugger::enterDebugger")();
		#end
	}

	//------------------------------------------------------------------------- WebKit

	/**
		The console method used to print xml.
	**/
	static var dirxml = "dirxml";

	/**
		Is the WebKit console API available?
	**/
	static var hasConsole = detectConsole();

	/**
		Detects if the WebKit console API is available, either natively in 
		JavaScript or via ExternalConnection in Flash.
	**/
	static function detectConsole():Bool
	{ 
		#if (js && samsung && !browser)
		return false;
		#elseif (js && !nodejs)
		if (untyped console != null && console[dirxml] == null) dirxml = "log";
		return untyped __js__("console != undefined && console.log != undefined && console.warn != undefined");
		#elseif flash
		return flash.external.ExternalInterface.available &&
			flash.external.ExternalInterface.call("console.error.toString") != null;
		#else
		return false;
		#end
	}

	/**
		Calls a method on the WebKit console API, either directly in JS or via 
		ExternalInterface in Flash running in a WebKit browser.
	**/
	inline static function callConsole(method:String, params:Array<Dynamic>)
	{
		#if (js && !nodejs)
		if (untyped console[method] != null)
		{
			if (method == "log" && Std.is(params[0], Xml)) method = dirxml;
			
			if (untyped console[method].apply != null)
				untyped console[method].apply(console, mconsole.Console.toConsoleValues(params));
			else if (untyped Function.prototype.bind != null)
				untyped Function.prototype.bind.call(console[method], console).apply(console, mconsole.Console.toConsoleValues(params));
		}
			
		#elseif flash
		params = params.copy();
		params.unshift(method);
		params.unshift(BRIDGE); // the bridge function, see Console.start
		Reflect.callMethod(null, flash.external.ExternalInterface.call, toConsoleValues(params));
		#end
	}

	/**
		Convert parameters for console methods into 'native' objects that will 
		print.
	**/
	static function toConsoleValues(params:Array<Dynamic>):Array<Dynamic>
	{
		for (i in 0...params.length) params[i] = toConsoleValue(params[i]);
		return params;
	}

	/**
		Converts a value into the anything that will print nicely in the 
		console.
	**/
	static function toConsoleValue(value:Dynamic):Dynamic
	{
		var typeClass = Type.getClass(value);
		var typeName = typeClass == null ? "" : Type.getClassName(typeClass);

		if (typeName == "Xml")
		{
			#if js
			var parser = untyped __js__("new DOMParser()");
			return parser.parseFromString(value.toString(), "text/xml").firstChild;
			#elseif flash
			return {___xml___:true, xml:value.toString()};
			#end
		}
		#if haxe3
		else if (typeName == "Map" || typeName == "StringMap" || typeName == "IntMap")
		{
			var native = {};
			var map:IMap<Dynamic, Dynamic> = cast value;
			for (key in map.keys())
			{
				Reflect.setField(native, Std.string(key), toConsoleValue(map.get(key)));
			}
			return native;
		}
		#else
		else if (typeName == "Hash")
		{
			var native = {};
			var hash = cast(value, Hash<Dynamic>);
			for (key in hash.keys())
			{
				Reflect.setField(native, Std.string(key), toConsoleValue(hash.get(key)));
			}
			return native;
		}
		else if (typeName == "IntHash")
		{
			var native = {};
			var hash = cast(value, IntHash<Dynamic>);
			for (key in hash.keys())
			{
				Reflect.setField(native, Std.string(key), toConsoleValue(hash.get(key)));
			}
			return native;
		}
		#end
		else
		{
			switch (Type.typeof(value))
			{
				case TEnum(e):
					var native = [];
					var name = Type.getEnumName(e) + "." + Type.enumConstructor(value);
					var params:Array<Dynamic> = Type.enumParameters(value);

					if (params.length > 0)
					{
						native.push(name + "(");
						for (i in 0...params.length) native.push(toConsoleValue(params[i]));
						native.push(")");
					}
					else
					{
						return [name];
					}

					return native;
				default:
			}
			
			if (typeName == "Array" || typeName == "List" || typeName == "haxe.FastList")
			{
				var native = [];
				var iterable:Iterable<Dynamic> = cast value;
				for (i in iterable) native.push(toConsoleValue(i));
				return native;
			}
		}
		
		return value;
	}

	#end
}
