// See the file "LICENSE" for the full license governing this code

package mconsole;

import mconsole.Printer;

class AlertPrinter implements Printer
{
	public function new() {}
	
	public function print(level, params, _, pos:haxe.PosInfos)
	{
		#if js
		js.Browser.alert(Std.string(level) + ": " + pos.fileName + ":" + pos.lineNumber + ": " + params.join(" "));
		#end
	}
}
