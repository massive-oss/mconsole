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

#if haxe3
import haxe.CallStack;
import haxe.ds.StringMap;
#else
import haxe.Stack;
private typedef CallStack = haxe.Stack;
private typedef StringMap<T> = Hash<T>;
#end

/**
	A utility class for formatting stack traces as strings.
**/
class StackHelper
{
	static var filters = createFilters();

	static function createFilters()
	{
		var filters = new StringMap<Bool>();
		filters.set("@ mconsole.ConsoleRedirect.haxeTrace:59", true);
		return filters;
	}

	public static function toString(stack:Array<StackItem>):String
	{
		#if js
		return "null";
		#else
		var stackTrace = [];
		
		// trim unhelpful frames
		#if neko
		stack.pop(); // sys.io.FileOutput.$statics:1
		#elseif flash
		stack.pop(); // ?:1:boot_acaf.init
		stack.pop(); // Boot.hx:41:boot_acaf.new
		stack.pop(); // Boot.hx:71:flash.Boot.start
		#end


		var i:Int = 0;
		for (item in stack)
		{
			var itemString = "@ " + StackItemHelper.toString(item, #if cpp i==1 #else false #end);
			if (!filters.exists(itemString)) stackTrace.push(itemString);
			i ++;
		}

		return stackTrace.join("\n");
		#end
	}
}

/**
	A utility class for formatting stack items as strings.
**/
class StackItemHelper
{
	public static function toString(item:StackItem, isFirst:Bool=false):String
	{

		return switch (item)
		{
			case Module(module): module;
			case Method(className, method):
				#if flash
				if (className == "Function" && method == "<anonymous>") "(anonymous function)";
				else className + "." + method;
				#else
				className + "." + method;
				#end
			case Lambda(v): "Lambda(" + v + ")";
			case FilePos(s, file, line):
				#if cpp
				if(isFirst && StringTools.endsWith(file, "Reflect.hx"))
					"(anonymous function)"
				else convertCPPPosition(s, file, line);

				#elseif neko
				(s == null ? file.split("::").join(".") + ":" + line : toString(s));
				#else
				(s == null ? file.split("::").join(".") + ":" + line : toString(s)) + ":" + line;
				#end
			case CFunction: "(anonymous function)";
		}
	}

	#if cpp
	static function convertCPPPosition(s:StackItem, file:String, line:Int):String
	{
		if(s != null)
		{
			var a = file.substr(0, file.length-3).split("/");
			a.pop();

			return a.join(".") + "." +toString(s) + ":" + line;
		}

		return file.split("/").join(".").substr + ":" + line;
	}
	#end

}
