package mconsole;

#if (neko || php || cpp)
import haxe.PosInfos;
import haxe.io.Output;

#if haxe_209
import sys.io.File;
import sys.FileSystem;
import sys.io.FileOutput;
#else
import sys.io.File;
import neko.FileSystem;
import neko.io.FileOutput;
#end

import mconsole.Printer;

/**
A console printer that prints formatted logs to stdout, or a file if `path` is 
provided when created.
*/
class FilePrinter extends PrinterBase, implements Printer
{
	/**
	Whether or not to print color sequences to indicate	the LogLevel of 
	each printed message.

	See https://wiki.archlinux.org/index.php/Color_Bash_Prompt#List_of_colors_for_prompt_and_Bash
	*/
	public var colorize:Bool;

	/**
	The FileOutput to print message to.
	*/
	var output:Output;

	/**
	Create a new CommandLineConsolePrinter, passing an option file path if 
	messages should be printed to a file instead of stdout.

	@param	path	The optional path of the file to print to.
	*/
	public function new(?path:String)
	{
		super();
		
		if (path != null)
		{
			// don't colorize log file output by default
			colorize = false;
			
			// either write or append to path
			// TODO (dp): do we need to close this Output on deactivate?
			if (!FileSystem.exists(path))
			{
				output = File.write(path, false);
			}
			else
			{
				output = File.append(path, false);
			}
		}
		else
		{
			colorize = true;

			#if haxe_209
			output = Sys.stdout();
			#else
			output = neko.io.File.stdout;
			#end
		}
	}

	/**
	If colorize if false, write line to output, else write a style sequence, 
	then a line of output, then a style reset sequence.
	*/
	override function printLine(color:ConsoleColor, line:String, pos:PosInfos)
	{
		if (colorize)
		{
			ConsoleStyle.set(switch (color)
			{
				case none: ConsoleStyle.reset;
				case white: ConsoleStyle.whiteF;
				case blue: ConsoleStyle.blueF;
				case green: ConsoleStyle.greenF;
				case yellow: ConsoleStyle.yellowF;
				case red: ConsoleStyle.redF;
			});
		}

		output.writeString(line + "\n");

		if (colorize) ConsoleStyle.set(ConsoleStyle.reset);
	}
}

/**
A utility class for working with shell style sequences.
*/
@:extern class ConsoleStyle
{
	inline public static function set(style:Int)
	{
		#if haxe_209
		Sys.print("\033[" + style + "m");
		#else
		neko.Lib.print("\033[" + style + "m");
		#end
	}

	inline public static var blackF = 30;
	inline public static var redF = 31;
	inline public static var greenF = 32;
	inline public static var yellowF = 33;
	inline public static var blueF = 34;
	inline public static var purpleF = 35;
	inline public static var cyanF = 36;
	inline public static var whiteF = 37;
	inline public static var blackB = 40;
	inline public static var redB = 41;
	inline public static var greenB = 42;
	inline public static var yellowB = 43;
	inline public static var blueB = 44;
	inline public static var purpleB = 45;
	inline public static var cyanB = 46;
	inline public static var whiteB = 47;
	inline public static var boldOn = 1;
	inline public static var boldOff = 22;
	inline public static var italicsOn = 3;
	inline public static var italicsOff = 23;
	inline public static var underlineOn = 4;
	inline public static var underlineOff = 24;
	inline public static var blinkOn = 5;
	inline public static var blinkOff = 25;
	inline public static var invertOn = 7;
	inline public static var invertOff = 27;
	inline public static var reset = 0;
}

#end
