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
- Use the `--verbose` flag to print model messages.

## Example

```
$ help-me-bash.exe
Describe what you want to do, and I will try to create a bash command for it:
 Tell me the status of my current git repository.
Do you want to run the following command?
git status
 [y/N] y
✅ Granted run access to "git".
Command exit code: 0
stdout:

 On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   deno.json
        modified:   deno.lock
        modified:   main.ts

no changes added to commit (use "git add" and/or "git commit -a")
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
