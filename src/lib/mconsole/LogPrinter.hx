// See the file "LICENSE" for the full license governing this code

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
