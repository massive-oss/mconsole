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

#if (sys || nodejs)
import haxe.PosInfos;
import haxe.io.Output;

#if sys
import sys.io.File;
import sys.FileSystem;
import sys.io.FileOutput;
#end

import mconsole.Printer;

/**
	A console printer that prints formatted logs to stdout, or a file if `path` 
	is provided when created.
**/
#if haxe3
class FilePrinter extends PrinterBase implements Printer
#else
class FilePrinter extends PrinterBase, implements Printer
#end
{
	/**
		Whether or not to print color sequences to indicate	the LogLevel of 
		each printed message.

		See https://wiki.archlinux.org/index.php/Color_Bash_Prompt#List_of_colors_for_prompt_and_Bash
	**/
	public var colorize:Bool;

	/**
		The FileOutput to print message to.
	**/
	#if nodejs
	var output:Dynamic;
	#else
	var output:Output;
	#end

	/**
		Create a new CommandLineConsolePrinter, passing an option file path if 
		messages should be printed to a file instead of stdout.

		@param	path	The optional path of the file to print to.
	**/
	public function new(?path:String, ?append:Bool=true)
	{
		super();

		if (path != null)
		{
			// don't colorize log file output by default
			colorize = false;
		
			#if nodejs
			output = {buffer:[]};
			output.writeString = function(value:String) {
				output.buffer.push(value);
			};

			var fs = untyped __js__("require('fs')");
			var mode = (!fs.existsSync(path) || !append) ? "w" : "a";
			var stream:Dynamic = fs.createWriteStream(path, {flags:mode});
			stream.once("open", function() {
				output.writeString = function(value:String) {
					stream.write(value);
				}
				while (output.buffer.length > 0) 
					stream.write(output.buffer.shift());				
			});
			output.close = stream.end;
			
			#else
			// either write or append to path
			// TODO (dp): do we need to close this Output on deactivate?
			if (!FileSystem.exists(path) || !append)
			{
				output = File.write(path, false);
			}
			else
			{
				output = File.append(path, false);
			}
			#end
		}
		else
		{
			colorize = true;
			#if nodejs
			output = {writeString:function(v:String) { 
				untyped console.log(v.substr(0, v.length -1)); 
			}};
			#else
			output = Sys.stdout();
			#end
		}
	}

	/**
		Print a colored line of output to the console.
	**/
	override function printLine(color:ConsoleColor, line:String, pos:PosInfos)
	{
		if (colorize)
		{
			line = switch (color)
			{
				case none: line;
				case white: Style.white(line);
				case blue: Style.blue(line);
				case green: Style.green(line);
				case yellow: Style.yellow(line);
				case red: Style.red(line);
			};
		}
		
		output.writeString(line + "\n");
	}
}

#end
