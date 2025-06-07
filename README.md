# Help Me Bash

A script that translates natural language into a bash command, and safely
executes it with user permission.

Tools:

- Deno
- Ollama for local LLMs
  - qwen3 as a local model with tool calling support
- LangChain/LangGraph for model & tool calling

## Requirements

- [Deno](https://deno.com)
- [Ollama](https://ollama.com)
  - [qwen3:latest model](https://ollama.com/library/qwen3:latest)

## Usage

- `deno task run` to run the script once.
- `deno task compile` to create the `help-me-bash` executable.

## Example

```
$ ./help-me-bash.exe 
Describe what you want to do, and I will try to create a bash command for it:
 Tell me what directory I am currently running this script from.

... model thinking text and response message ...

Do you want to run the following command?
pwd
 [y/N] y
✅ Granted run access to "pwd".
Command exit code: 0
stdout /c/Users/dudas/Documents/help-me-bash

stderr
```

## Safety

1. The tool asks the user if they want to run the generated command before
   trying.
1. The tool **does not have run permissions by default.**

Even after the user confirms they want to run the command, they are prompted
again by Deno permissions:

```
┏ ⚠️  Deno requests run access to "ls".
┠─ Requested by `Deno.Command().outputSync()` API.
┠─ To see a stack trace for this prompt, set the DENO_TRACE_PERMISSIONS environmental variable.        
┠─ Learn more at: https://docs.deno.com/go/--allow-run
┠─ Specify the required permissions during compile time using `deno compile --allow-run`.
┗ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all run permissions) >
```
