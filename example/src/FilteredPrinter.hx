import haxe.PosInfos;

import mconsole.Printer;
import mconsole.LogLevel;

/**
A simple printer implementation that filters messages for another printer so 
that only error messages are printed.
*/
class FilteredPrinter implements Printer
{
	var printer:Printer;

	public function new(printer:Printer)
	{
		this.printer = printer;
	}

	public function print(level:LogLevel, params:Array<Dynamic>, indent:Int, pos:PosInfos):Void
	{
		if (level == LogLevel.error) printer.print(level, params, indent, pos);
	}
}
