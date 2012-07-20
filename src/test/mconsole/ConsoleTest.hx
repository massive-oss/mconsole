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

import massive.munit.Assert;

class ConsoleTest implements Printer
{
	var oldTrace:Dynamic;
	var value:Float;

	var lastLevel:LogLevel;
	var lastParams:Array<Dynamic>;
	var lastIndent:Int;
	var lastPos:PosInfos;
	var previousParams:Array<Dynamic>;

	public function new() {}

	@Before
	public function setup()
	{
		Console.start();
		Console.removePrinter(Console.defaultPrinter);
		Console.addPrinter(this);

		value = 10000;
		lastLevel = null;
		lastParams = null;
		lastIndent = -1;
		lastParams = previousParams = null;
	}

	@After
	public function tearDown()
	{
		Console.stop();
		Console.removePrinter(this);
	}

	@Test
	public function init_should_redirect_trace_to_printer()
	{
		trace("hello");
		Assert.areEqual("hello", lastParams[0]);
	}

	@Test
	public function default_level_should_be_log()
	{
		trace("hello");
		Assert.areEqual(LogLevel.log, lastLevel);
	}

	@Test
	public function default_indent_should_be_zero()
	{
		trace("hello");
		Assert.areEqual(0, lastIndent);
	}

	@Test
	public function position_should_be_passed_to_logger()
	{
		var pos = getNextPos();
		trace("hello");

		Assert.areEqual(pos.fileName, lastPos.fileName);
		Assert.areEqual(pos.className, lastPos.className);
		Assert.areEqual(pos.lineNumber, lastPos.lineNumber);
		Assert.areEqual(pos.methodName, lastPos.methodName);
	}

	@Test
	public function log_level_should_be_detected_from_first_param()
	{
		trace("log", "hello");
		Assert.areEqual(LogLevel.log, lastLevel);

		trace("info", "hello");
		Assert.areEqual(LogLevel.info, lastLevel);

		trace("debug", "hello");
		Assert.areEqual(LogLevel.debug, lastLevel);

		trace("warn", "hello");
		Assert.areEqual(LogLevel.warn, lastLevel);

		trace("error", "hello");
		Assert.areEqual(LogLevel.error, lastLevel);
	}

	@Test
	public function when_log_level_is_detected_it_is_not_printed()
	{
		trace("log", "hello");
		Assert.areEqual("hello", lastParams[0]);

		trace("info", "hello");
		Assert.areEqual("hello", lastParams[0]);

		trace("debug", "hello");
		Assert.areEqual("hello", lastParams[0]);

		trace("warn", "hello");
		Assert.areEqual("hello", lastParams[0]);

		// error prints message, then stack trace, so we check previous params
		trace("error", "hello");
		Assert.areEqual("hello", previousParams[0]);
	}

	@Test
	public function multiple_trace_arguments_are_passed_to_printer()
	{
		var info = {};
		trace(42, "hello", info);
		Assert.areEqual(42, lastParams[0]);
		Assert.areEqual("hello", lastParams[1]);
		Assert.areEqual(info, lastParams[2]);
	}

	#if flash
	static var MUNIT_STACK = "@ Function.http://adobe.com/AS3/2006/builtin::apply
@ (anonymous function)
@ massive.munit.TestRunner.executeTestCase:316
@ massive.munit.TestRunner.executeTestCases:287
@ massive.munit.TestRunner.execute:237
@ massive.munit.TestRunner.run:221
@ TestMain.new:50
@ TestMain.main:24";
	#else
	static var MUNIT_STACK = "@ (anonymous function)
@ massive.munit.TestRunner.executeTestCase:316
@ massive.munit.TestRunner.executeTestCases:287
@ massive.munit.TestRunner.execute:237
@ massive.munit.TestRunner.run:209";
	#end
	
	/*
	This test will probably have to be updated by someone if munit changes in 
	anyway. If that person is you: Welcome, friend!
	*/
	@Test
	public function trace_prints_message_then_stack_trace()
	{
		var pos = getNextPos();
		Console.trace();
		
		Assert.areEqual("Stack trace:\n" + getExpectedStack(pos), lastParams[0]);
	}

	@Test
	public function assertion_prints_nothing_when_true()
	{
		Console.assert(true, "true is not true");
		Assert.isNull(lastParams);
	}

	@Test
	public function assertion_prints_message_then_stack_trace_when_false()
	{
		var message = "false is not true";
		
		var pos:PosInfos = null;

		try {
			pos = getNextPos();
			Console.assert(false, message);
		} catch (e:Dynamic) {}

		Assert.areEqual("Assertion failed: " + message + "\n" + getExpectedStack(pos), lastParams[0]);
	}

	@Test
	public function count_prints_number_of_invocations()
	{
		testCount();
		Assert.areEqual("apples: 1", lastParams[0]);
		testCount();
		Assert.areEqual("apples: 2", lastParams[0]);
	}

	function testCount()
	{
		Console.count("apples");
	}

	@Test
	public function counts_at_different_positions_increment_seperately()
	{
		Console.count("apples");
		Assert.areEqual("apples: 1", lastParams[0]);
		Console.count("apples");
		Assert.areEqual("apples: 1", lastParams[0]);
	}

	@Test
	public function count_with_different_label_increments_based_on_position()
	{
		testCountLabel("apples");
		Assert.areEqual("apples: 1", lastParams[0]);
		testCountLabel("pears");
		Assert.areEqual("pears: 2", lastParams[0]);
	}

	function testCountLabel(label:String)
	{
		Console.count(label);
	}

	@Test
	public function group_increments_indent()
	{
		Console.group("group");
		Console.log("hello");
		Assert.areEqual(1, lastIndent);
		Console.groupEnd();
	}

	@Test
	public function group_end_decrements_indent()
	{
		Console.group("group");
		Console.log("hello");
		Console.groupEnd();
		Console.log("hello again");
		Assert.areEqual(0, lastIndent);
	}

	@Test
	public function group_increments_indent_each_time_called()
	{
		for (i in 0...4) Console.group("group");
		Console.log("hello");
		Assert.areEqual(4, lastIndent);
		for (i in 0...4) Console.groupEnd();
	}

	@Test
	public function group_end_decrements_indent_each_time_called()
	{
		for (i in 0...4) Console.group("group");
		for (i in 0...4) Console.groupEnd();
		Console.log("hello");
		Assert.areEqual(0, lastIndent);
	}

	@Test
	public function group_end_when_no_group_does_not_cause_negative_indents()
	{
		Console.groupEnd();
		Console.log("hello");
		Assert.areEqual(0, lastIndent);
	}

	@Test
	public function time_prints_duration_since_last_timer()
	{
		Console.time("timer");
		for (i in 0...400000) value *= Math.random();
		Console.timeEnd("timer");
		
		var pattern = ~/timer: (\d+)ms/;
		Assert.isTrue(pattern.match(lastParams[0]));
		
		var time = Std.parseInt(pattern.matched(1));
		Assert.isTrue(time > 0);

		// check for int
		Assert.areEqual(Std.string(time), pattern.matched(1));
	}

	@Test
	public function time_resets_previous_timer()
	{
		Console.time("timer");
		for (i in 0...100000) value *= Math.random();
		Console.time("timer");
		Console.timeEnd("timer");

		var pattern = ~/timer: (\d+)ms/;
		pattern.match(lastParams[0]);
		var time = Std.parseInt(pattern.matched(1));
		Assert.areEqual(0, time);
	}

	@Test
	public function time_end_does_nothing_if_timer_does_not_exist()
	{
		Console.timeEnd("timer");
		Assert.areEqual(null, lastParams);
	}

	// helper

	public function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void
	{
		lastLevel = level;
		previousParams = lastParams;
		lastParams = params.copy();
		lastIndent = indent;
		lastPos = pos;
	}

	function getNextPos(?pos:PosInfos)
	{
		pos.lineNumber += 1;
		return pos;
	}

	function getExpectedStack(pos:PosInfos)
	{
		#if js
		// no stack traces in js
		return "null";
		#else
		var expectedStack = "@ " + pos.className + "." + pos.methodName + ":" + pos.lineNumber + "\n";
		expectedStack += MUNIT_STACK;
		return expectedStack;
		#end
	}
}
