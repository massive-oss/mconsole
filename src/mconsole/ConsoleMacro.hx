package mconsole;

#if (macro && !haxe_209)
import neko.Sys;
#end

/**
A macro helpers for the console package.
*/
@IgnoreCover
@:macro class ConsoleMacro
{
	/**
	Returns a string constant of the full path to the current project directory.
	*/
	public static function getCwd()
	{
		var cwd = Sys.getCwd();
		cwd = cwd.split("\\").join("\\\\");
		return haxe.macro.Context.parse("'" + cwd + "'", haxe.macro.Context.currentPos());
	}
}
