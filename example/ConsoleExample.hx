import haxe.PosInfos;
import mconsole.Printer;
import mconsole.LogLevel;

#if haxe3
import haxe.ds.IntMap;
import haxe.ds.StringMap;
#else
private typedef IntMap<T> = IntHash<T>;
private typedef StringMap<T> = Hash<T>;
#end
/**
This example demonstrate the mconsole API. To recompile the example, execute 
`haxe build.hxml` from the command line. Three targets are generated: 
JavaScript, Flash and Neko. JavaScript and Flash targets log both to the WebKit 
console and an on screen logger. Neko will log output to stdout.
*/
class ConsoleExample
{
	public static function main():Void
	{
		Console.start();

		#if (js || flash)
		// the defaultPrinter for flash/js is mconsole.ConsoleView. If WebKit 
		// is available, it is not attached automatically. We attach here for 
		// demonstration purposes.
		Console.defaultPrinter.attach();
		#end

		// enter debugger (flash and js only)
		// Console.enterDebugger();
		
		// named log levels
		trace("log", "Something happened.");
		trace("info", "Something interesting happened.");
		trace("debug", "WHY WON'T YOU WORK!!");
		trace("warn", "I didn't test this code at all...");
		trace("error", "Something bad happened.");

		// no level defaults to log
		trace("Logtastic");

		// log multiple arguments
		trace("string", 10, {key:"value"});

		// use the api directly
		Console.log("This is a log message. It's better than bad, it's good!");
		Console.info("This if for the information of travellers and guests.");
		Console.debug("This is when you're debugging at 2am and have lost all hope.");
		Console.warn("Danger Will Robinson, DANGER!");
		Console.error("Epic FAIL");
		
		// pretty stack traces
		triggerException();

		// print a stack trace
		Console.trace();

		// assertions throw errors and print a message when they fail
		var a = null;
		Console.assert(a == null, "a is not null");

		try
		{
			Console.assert(a != null, "a is null");
		}
		catch (e:Dynamic) {}
		
		// count how many times a line is called
		Console.count("apples");

		// note the same "name" in different locations will start seperate counters
		Console.count("apples");

		// or while iterating...
		for (i in 0...5) Console.count("iterator");

		// group messages into... groups!
		Console.group("Groups:");
		Console.log("grouped log");
		Console.error("grouped error");
		Console.group("Nested groups:");
		Console.log("nested log");
		Console.warn("nested warnings too");
		Console.groupEnd();
		Console.log("with proper indenting");
		Console.groupEnd();

		// start timers to see how long things take
		Console.time("timer");
		var b = 10.0;
		for (i in 0...100000) b *= 0.999;
		Console.timeEnd("timer");

		// start and stop the profiler (js only for now)
		Console.profile("performance");
		var f = function(x) { return x * x; }
		var x = f(10);
		Console.profileEnd("performance");

		// and add markers to your timeline (js only for now)
		Console.markTimeline("finished");

		// console will do it's best to convert values to inspectable JS objects
		Console.log(Xml.parse("<this><is><some><xml/><with/><elements/></some></is></this>"));
		Console.log({anonymous:{object:{is:true,anonymous:true}}});
		Console.log(["I'm","an","array"]);
		Console.log(value1);

		// like enums
		Console.log(value2(33));
		Console.log(value3({oooh:"fancy"}));

		// and mapes
		var map = new StringMap<String>();
		map.set("mapy", "goodness");
		Console.log(map);

		// and int mapes
		var intMap = new IntMap<String>();
		intMap.set(10, "int mapy goodness");
		Console.log(intMap);

		// and iterable objects in general
		var list = new List<String>();
		list.add("support for iterables in general");
		list.add("also good");
		Console.log(list);

		// test a custom printer
		Console.removePrinter(Console.defaultPrinter);
		Console.addPrinter(new FilteredPrinter(Console.defaultPrinter));

		// now only errors are logged
		Console.log("This shouldn't be logged (except in WebKit console)");
		Console.error("This should be logged!");

		// cleanup
		Console.stop();
	}

	static function triggerException()
	{
		addToStack();
	}

	static function addToStack()
	{
		Console.error("oh noes!");
	}
}

/**
A simple printer implementation that filters messages for another printer so 
that only error messages are printed.
*/
class FilteredPrinter implements Printer
{
	var printer:Printer;

	public function new(printer:Printer)
	{
		this.printer = printer;
	}

	public function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void
	{
		if (level == LogLevel.error) printer.print(level, params, indent, pos);
	}
}

enum TestEnum
{
	value1;
	value2(a:Int);
	value3(b:Dynamic);
}
