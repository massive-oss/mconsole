Console provides a consistent cross platform logging and debugging API. The API 
is consistent with that of the WebKit console. Developers can:

* redirect calls to "trace" to the console
* log messages at different levels
* print stack traces
* inspect structured objects in the WebKit console
* log multiple values in a single trace
* make assertions that trigger errors when they fail
* count invocations at positions within their code
* visually group log messages
* use timers to measure program performance
* start and stop profiling where available
* log Haxe objects in way that is easily inspectable in the WebKit console
* insert breakpoints (on supported platforms)

Console currently supports a number compile time modes:

* On system platforms (neko/php/cpp/nodejs) console prints to stdout, colorising output
* In JS/Flash running in WebKit browser console prints to WebKit console
* In JS running in non-webkit browser console prints to an element in the DOM
* In Flash running standalone or in a non-WebKit browser console prints to an 
  on screen logging panel.
* When the compiler flag `no_console` is set, the console inlines null 
  expressions, removing any runtime overhead from logging.

![MassiveConsole in action](https://github.com/downloads/massiveinteractive/mconsole/mconsole.png)

## Example Usage:

You can download an example of mconsole usage [here](https://github.com/downloads/massiveinteractive/mconsole/example.zip).

To enable the console, call:

```javascript
Console.start();
```

To log a message at a named level:

```javascript
trace("log", "Something happened.");
trace("info", "Something interesting happened.");
trace("debug", "WHY WON'T YOU WORK!!");
trace("warn", "I didn't test this code at all...");
trace("error", "Something bad happened.");
```

Messages default to LogLevel.log:

```javascript
trace("Logtastic");
```

Log multiple values using trace. In WebKit console each value is inspectable 
(rather than concatenating as a string)

```javascript
trace("string", 10, {key:"value"});
```

You can also call the logging API directly:

```javascript
Console.log("better than bad, it's good!);
```

Errors will print a message, then a stack trace:

```javascript
Console.error("Epic fail");
```

Outputs:

	Error: Epic fail
	@ SomeClass.someMethod:20
	@ SomeOtherClass.someOtherMethod:48

You can also use `Console.trace` to print a stack trace without triggering 
an error:

```javascript
Console.trace();
```

Outputs:

	Stack trace:
	@ SomeClass.someMethod:20
	@ SomeOtherClass.someOtherMethod:48

Assertion will print a message and stack trace, then throw and exception when 
the condition is false:

```javascript
Console.assert(foo == false, "foo is not false!!");
```

Outputs:

	Assertion failed: foo is not false
	@ SomeClass.someMethod:20
	@ SomeOtherClass.someOtherMethod:48

To count the number of times a line of code is invoked:

```javascript
function someCode()
{
	Console.count("apples");
}

someCode();
someCode();
```

Outputs:

	apples: 1
	apples: 2

Note that counters are identified by their position, not their label:

```javascript
Console.count("apples");
Console.count("apples");
```

Outputs

	apples: 1
	apples: 1

To insert a breakpoint in JavaScript or Flash:

```javascript
Console.enterDebugger();
```

Group log messages together visually:

```javascript
Console.group("Group");
Console.log("grouped log");
Console.group("Nested group");
Console.warn("nested warn");
Console.groupEnd();
Console.groupEnd();
```

Output:

	Group
	  grouped log
	  Nested Group
	    nested warn

Timers can be used to quickly monitor runtime performance:

```javascript
Console.time("munging");
for (i in 0...4200000000) munge();
Console.timeEnd("munging");
```

Output:

	munging: 2410ms

### JavaScript/Webkit only

The WebKit profiler can be started and stopped:

```javascript
Console.profile("performance");
var f = function(x) { return x * x; }
var x = f(10);
Console.profileEnd("performance");
```

And markers added to the WebKit timeline view:

```javascript
Console.markTimeline("finished");
```

### Type conversion

As the WebKit console has user friendly structure inspection, console will try 
to convert native Haxe values into something inspectable where possible:

```javascript
// inspectable XML dom
Console.log(Xml.parse("<this><is><some><xml/><with/><elements/></some></is></this>"));

// enums and enums with parameters
Console.log(value1);
Console.log(value2(33));
Console.log(value3({oooh:"fancy"}));

// mapes
var map = new StringMap<String>();
map.set("mapy", "goodness");
Console.log(map);

var intMap = new IntMap<String>();
intMap.set(10, "int mapy goodness");
Console.log(intMap);

// and iterable objects in general
var list = new List<String>();
list.add("support for iterables in general");
list.add("also good");
Console.log(list);
```

## Printer

Printing is implemented by a `mconsole.Printer`. Custom printers can be used:

```javascript
Console.addPrinter(new MyConsolePrinter());
```

A default printer is always created. This is a `ConsoleView` for JavaScript and 
Flash, or a FilePrinter for system targets.

To implement a custom printer:

```javascript
/**
A ConsolePrinter that raises an alert for each log message.
*/
class AlertConsolePrinter implements mconsole.Printer
{
	public function print(level:mconsole.LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void
	{
		js.Lib.alert(Std.string(level) + "@" + pos.className + "." + pos.methodName + ":" + params.join(", "));
	}
}
```

## Caveats

When logging to the WebKit console (JavaScript in a WebKit browser) redirected 
traces will not display the correct source position in the console panel. The 
position of the Console.haxeTrace will be shown instead. This is a limitation 
of the Haxe logging API.

Flash targets can talk to the WebKit console over external interface, but 
messages will not show the correct position. Use a ConsoleView if you 
require log positions.
