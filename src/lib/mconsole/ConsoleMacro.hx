// See the file "LICENSE" for the full license governing this code

package mconsole;

/**
	Macro helpers for the console package.
**/
@IgnoreCover
class ConsoleMacro
{
	/**
		Returns a string constant of the full path to the current project directory.
	**/
	#if haxe3 macro #else @:macro #end public static function getCwd()
	{
		var cwd = Sys.getCwd();
		cwd = cwd.split("\\").join("\\\\");
		return haxe.macro.Context.parse("'" + cwd + "'", haxe.macro.Context.currentPos());
	}
}
