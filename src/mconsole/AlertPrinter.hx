package mconsole;

import mconsole.Printer;

class AlertPrinter implements Printer
{
	public function new() {}
	
	public function print(level, params, _, pos:haxe.PosInfos)
	{
		js.Lib.alert(Std.string(level) + ": " + pos.fileName + ":" + pos.lineNumber + ": " + params.join(" "));
	}
}
