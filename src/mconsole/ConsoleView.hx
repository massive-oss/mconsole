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

import mconsole.Printer;
import haxe.PosInfos;

#if (js && !nodejs)
#if haxe3
import js.Browser;
import js.html.Element;
#else
import js.Dom;
private typedef Element = HtmlDom;
private typedef Browser = js.Lib;

#end
/**
	A Printer that prints formatted logs to an HTML element.
**/
#if haxe3
class ConsoleView extends PrinterBase implements Printer
#else
class ConsoleView extends PrinterBase, implements Printer
#end
{
	/**
		The styles added to the document for the console printer.
	**/
	inline static var CONSOLE_STYLES =
"#console {
	font-family:monospace;
	background-color:#002B36;
	background-color:rgba(0%,16.9%,21.2%,0.95);
	padding:8px;
	height:600px;
	max-height:600px;
	overflow-y:scroll;
	position:absolute;
	left:0px;
	top:0px;
	right:0px;
	margin:0px;
	z-index:10000;
}
#console a { text-decoration:none; }
#console a:hover div { background-color:#063642 }
#console a div span { display:none; float:right; color:white; }
#console a:hover div span { display:block; }";
	
	/**
		The HTML element to print to, created when the printer is constructed 
		and attached to document.body.
	**/
	public var element(default, null):Element;

	/**
		The projects home directory, determined at compilation time by a macro. 
		Used to determine absolute URLs to log positions, so that clicking on a 
		log can open the correct file (and line, if supported) in a users editor.
	**/
	var projectHome:String;

	/**
		Is the log output currently scrolled to the bottom. When true new logs will 
		cause the log output window to scroll to display new log entries.
	**/
	var atBottom:Bool;

	public function new()
	{
		super();

		atBottom = true;
		projectHome = ConsoleMacro.getCwd();

		// create element
		var document = Browser.document;
		element = document.createElement("pre");
		element.id = "console";
		
		var style = document.createElement("style");
		element.appendChild(style);

		var rules = document.createTextNode(CONSOLE_STYLES);

		untyped
		{
			style.type = 'text/css';
			if (style.styleSheet) style.styleSheet.cssText = rules.nodeValue;
			else style.appendChild(rules);
		}

		// listen for scroll events
		var me = this;
		element.onscroll = function(e) { me.updateScroll(); }
	}

	/**
		When output scrolls, evaluate whether output is scrolled to the bottom.
	**/
	function updateScroll()
	{
		atBottom = element.scrollTop - (element.scrollHeight - element.clientHeight) == 0;
	}
	
	/**
		Prints a single line of coloured output to the log panel. Each line is 
		linked to open the position where it was printed using the sublime URL 
		scheme (mac only).

		https://github.com/hiddenbek/subl-handler
	**/
	override function printLine(color:ConsoleColor, line:String, pos:PosInfos)
	{
		var style = switch (color)
		{
			case none: "#839496";
			case white: "#ffffff";
			case blue: "#248bd2";
			case green: "#859900";
			case yellow: "#b58900";
			case red: "#dc322f";
		};

		var file = pos.fileName + ":" + pos.lineNumber;
		var fileName = pos.className.split(".").join("/") + ".hx";
		#if textmate
		var link = ' href="txmt://open/?url=file://' + projectHome + 'src/' + fileName + '&line=' + pos.lineNumber + '"';
		#else
		var link = '';
		#end
		element.innerHTML = element.innerHTML + "<a"+link+"><div style='color:" + style + "'>" + line + 
			"<span>" + file + "</span></div></a>";

		if (atBottom) element.scrollTop = element.scrollHeight;
	}

	public function attach()
	{
		Browser.document.body.appendChild(element);
		
	}

	public function remove()
	{
		Browser.document.body.removeChild(element);
	}
}

#elseif flash

import flash.text.TextField;
import flash.text.TextFormat;
import flash.display.Sprite;

/**
	A Printer that prints formatted logs to a Flash TextField.
**/
#if haxe3
class ConsoleView extends PrinterBase implements Printer
#else
class ConsoleView extends PrinterBase, implements Printer
#end
{
	/**
		The sprite container for the log panel
	**/
	public var sprite(default, null):Sprite;

	/**
		The background color of the log panel.
	**/
	var background:Sprite;

	/**
		The log output text field.
	**/
	var textField:TextField;

	/**
		Is the panel currently scrolled to the bottom? When true, new messages 
		will automatically scroll to the bottom.
	**/
	var atBottom:Bool;

	public function new()
	{
		super();

		atBottom = true;

		// create panel
		sprite = new Sprite();
		
		background = new Sprite();
		sprite.addChild(background);

		background.graphics.beginFill(0x002B36, 0.95);
		background.graphics.drawRect(0, 0, 100, 100);
		background.width = background.height = 1000;

		textField = new TextField();
		sprite.addChild(textField);

		textField.mouseWheelEnabled = true;
		textField.x = textField.y = 8;
		textField.width = 800;
		textField.multiline = true;
		textField.wordWrap = true;

		var format = new TextFormat();
		format.font = "_typewriter";
		format.size = 13;
		format.color = 0xFFFFFF;
		textField.defaultTextFormat = format;

		// listen for scrolling
		textField.addEventListener(flash.events.Event.SCROLL, textScrolled);

		// attach
		var current = flash.Lib.current;
		var stage = current.stage;
		
		stage.scaleMode = flash.display.StageScaleMode.NO_SCALE;
		stage.addEventListener(flash.events.Event.RESIZE, resize);
		
		resize(null);
	}

	/**
		Resize the log panel when the stage resizes.
	**/
	function resize(_)
	{
		var stage = flash.Lib.current.stage;

		background.width = stage.stageWidth;
		background.height = stage.stageHeight;

		textField.width = stage.stageWidth - 16;
		textField.height = stage.stageHeight - 16;

		updateScroll();
	}

	/**
		When the log output scrolls, evaluate atBottom.
	**/
	function textScrolled(_)
	{
		atBottom = textField.scrollV == textField.maxScrollV;
	}

	/**
		Scroll to the bottom of output if atBottom is true.
	**/
	function updateScroll()
	{
		if (atBottom) textField.scrollV = textField.maxScrollV;
	}

	/**
		Add a single formatted line of output to the log panel. Scroll to the 
		bottom of the output if atBottom is true.
	**/
	override function printLine(color:ConsoleColor, line:String, pos:PosInfos)
	{
		var format = new TextFormat();
		format.color = switch (color)
		{
			case none: 0x839496;
			case white: 0xffffff;
			case blue: 0x248bd2;
			case green: 0x859900;
			case yellow: 0xb58900;
			case red: 0xdc322f;
		};
		
		var start = textField.text.length;
		textField.appendText(line + "\n");
		textField.setTextFormat(format, start, textField.text.length);

		updateScroll();
	}

	public function attach()
	{
		flash.Lib.current.addChild(sprite);
	}

	public function remove()
	{
		flash.Lib.current.removeChild(sprite);
	}
}

#else

class ConsoleView implements Printer
{
	public function new() {}

	public function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos) {}
	public function attach() {}
	public function remove() {}
}

#end
