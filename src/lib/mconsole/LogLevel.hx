// See the file "LICENSE" for the full license governing this code

package mconsole;

/**
	Log levels are a way for developers to group and filter log messages 
	depending on the kind of information being logged.
**/
enum LogLevel
{
	/**
		A generic log level.
	**/
	log;

	/**
		Logs important for following the current state of a program.
	**/
	info;

	/**
		Logs important for debugging problems with a program.
	**/
	debug;

	/**
		Logs indicating unexpected but not fatal program behavior.
	**/
	warn;

	/**
		Logs indicating a program error.
	**/
	error;
}
