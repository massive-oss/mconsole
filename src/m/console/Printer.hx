package m.console;

import haxe.PosInfos;

/**
A ConsolePrinter is responsible for printing the output of the Console. 
Messages can be printed at different LogLevels and at different 
indentations. Implementations can also define activate/deactivate behavior 
when they are set/unset as the current console printer using 
Console.setPrinter()
*/
interface Printer
{
	/**
	Print an array of values to the console at a LogLevel and indent level.

	@param	level	The level of the message to print
	@param	params	An array of values to print
	@param	indent	The indent level of the message to be printed.
	@param	pos		The position where the message was printed.
	*/
	function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void;
}

/**
A base ConsolePrinter implementation for functionality shared by 
FlashConsolePrinter, HTMLConsolePrinter and CommandLineConsolePrinter.
*/
class PrinterBase
{
	/**
	When the printing position changes (position is className.methodName), 
	print the new position before the message.
	*/
	public var printPosition:Bool;

	/**
	When the printing line changes print the line number before the message.
	*/
	public var printLineNumbers:Bool;

	/**
	The previous log's position.
	*/
	var position:String;

	/**
	The previous log's line number.
	*/
	var lineNumber:String;

	function new()
	{
		printPosition = true;
		printLineNumbers = true;
	}

	/**
	Print an array of values to the console at a LogLevel and indent level.

	@param	level	The level of the message to print
	@param	params	An array of values to print
	@param	indent	The indent level of the message to be printed.
	@param	pos		The position where the message was printed.
	*/
	public function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void
	{
		params = params.copy();
		
		// prepare message
		for (i in 0...params.length)
			params[i] = Std.string(params[i]);
		var message = params.join(", ");

		// get position
		var nextPosition = "@ " + pos.className + "." + pos.methodName;
		var nextLineNumber = Std.string(pos.lineNumber);

		// print positions/lines
		var lineColumn = "  ";
		var emptyLineColumn = "  ";

		if (printPosition)
		{
			if (nextPosition != position)
			{
				printLine(none, nextPosition, pos);
			}
		}
		
		if (printLineNumbers)
		{
			
			emptyLineColumn = StringTools.lpad("", " ", 5);

			if (nextPosition != position || nextLineNumber != lineNumber)
			{
				lineColumn = StringTools.lpad(nextLineNumber, " ", 4) + " ";
			}
			else
			{
				lineColumn = emptyLineColumn;
			}
		}

		// update position
		position = nextPosition;
		lineNumber = nextLineNumber;

		// determine color from level
		var color = switch (level)
		{
			case log: white;
			case info: blue;
			case debug: green;
			case warn: yellow;
			case error: red;
		}

		// indent message
		var indent = StringTools.lpad("", " ", indent * 2);
		message = lineColumn + indent + message;
		message = message.split("\n").join("\n" + emptyLineColumn + indent);

		// print message
		printLine(color, message, pos);
	}

	/**
	Abstract implementation.
	*/
	function printLine(color:ConsoleColor, line:String, pos:PosInfos)
	{
		throw "method not implemented in ConsolePrinterBase";
	}
}

/**
An enum defining possible colors for console output.
*/
enum ConsoleColor
{
	none;
	white;
	blue;
	green;
	yellow;
	red;
}
