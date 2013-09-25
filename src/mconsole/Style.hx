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

/**
	A utility class for working with shell styles. Each method returns a string 
	wrapped by a start and end style sequence. Note that styles will only apply 
	when the environment variable CLICOLOR is set.
**/
#if (sys || nodejs)
class Style
{
	static var clicolor = #if (nodejs && !sys) untyped __js__("process.env.CLICOLOR") #else Sys.getEnv("CLICOLOR") #end == "1";

	static function style(string:String, start:Int, stop:Int):String
	{
		return clicolor ? "\033[" + start + "m" + string + "\033[" + stop + "m" : string;
	}

	inline public static function bold(s:String):String
	{
		return style(s, 1, 22);
	}

	inline public static function italic(s:String):String
	{
		return style(s, 3, 23);
	}

	inline public static function underline(s:String):String
	{
		return style(s, 4, 24);
	}

	inline public static function inverse(s:String):String
	{
		return style(s, 7, 27);
	}

	inline public static function white(s:String):String
	{
		return style(s, 37, 39);
	}

	inline public static function grey(s:String):String
	{
		return style(s, 90, 39);
	}

	inline public static function black(s:String):String
	{
		return style(s, 30, 39);
	}

	inline public static function blue(s:String):String
	{
		return style(s, 34, 39);
	}

	inline public static function cyan(s:String):String
	{
		return style(s, 36, 39);
	}

	inline public static function green(s:String):String
	{
		return style(s, 32, 39);
	}

	inline public static function magenta(s:String):String
	{
		return style(s, 35, 39);
	}

	inline public static function red(s:String):String
	{
		return style(s, 31, 39);
	}

	inline public static function yellow(s:String):String
	{
		return style(s, 33, 39);
	}
}

#end
