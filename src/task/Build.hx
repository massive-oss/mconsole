import m.task.target.HaxeLib;
import m.task.target.Neko;
import m.task.target.Web;
import m.task.target.Haxe;

class Build extends m.task.core.BuildBase
{
	public function new()
	{
		super();
	}

	@target function haxelib(target:HaxeLib)
	{
		target.name = "mconsole";
		target.version = "1.0.0";
		target.url = "http://github.com/massiveinteractive/MassiveConsole";
		target.license.organization = "Massive Interactive";
		target.username = "massive";
		target.description = "MassiveConsole is a cross platform console and logging library.";
		target.copyFiles = function()
		{
			cp("src/lib", target.path);
		}
	}

	function example(target:Haxe)
	{
		target.addPath("src/lib");
		target.addPath("src/example/src");
		target.main = "Main";
	}

	@target('example-swf') function exampleSWF(target:Web)
	{
		example(target.js);
	}

	@target('example-js') function exampleJS(target:Web)
	{
		example(target.js);
	}

	@target('example-neko') function exampleNeko(target:Neko)
	{
		example(target);
	}

	@task function release()
	{
		require("clean");
		require("build haxelib", "build example-js", "build example-swf", "build example-neko");
	}
}
