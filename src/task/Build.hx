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
		target.addPath("src/example");
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
