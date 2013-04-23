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
import haxe.Log;
import mconsole.Printer;

/**
	A simple console printer that prints formatted logs using the default haxe.Log.Trace

	@param output the original haxe.Log.trace function to call;
**/
#if haxe3
class LogPrinter extends PrinterBase implements Printer
#else
class LogPrinter extends PrinterBase, implements Printer
#end
{
	var output:Dynamic->PosInfos->Void;

	/**
		Create a new TracePrinter
	**/
	public function new(output:Dynamic->PosInfos->Void)
	{
		this.output = output;
		super();
	}

	override public function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void
	{
		params = params.copy();
		
		// prepare message
		for (i in 0...params.length)
			params[i] = Std.string(params[i]);
		
		var message = params.join(", ");

		// update position
		position = "@ " + pos.className + "." + pos.methodName;
		lineNumber = Std.string(pos.lineNumber);

		// replace fileName with custom position string
		pos.fileName = position;

		// indent message

		var indentStr = "  " + StringTools.lpad("", " ", indent * 2);

		message = "\n" + indentStr + message.split("\n").join("\n" + indentStr);
	
		// determine color from level
		var color = switch (level)
		{
			case log: white;
			case info: blue;
			case debug: green;
			case warn: yellow;
			case error: red;
		}

		// print message
		printLine(color, message, pos);
	}


	/**
		If colorize if false, write line to output, else write a style sequence, 
		then a line of output, then a style reset sequence.
	**/
	override function printLine(color:ConsoleColor, line:String, pos:PosInfos)
	{
		output(line, pos);
	}
}
