import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { parseArgs } from "@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
  boolean: ["verbose"],
});

function verboseMessage(...args: any[]) {
  if (flags.verbose) {
    console.log(args);
  }
}

const executeBash = tool((input) => {
  if (
    !confirm(
      `Do you want to run the following command?\n${input.bashCommand}\n`,
    )
  ) {
    return;
  }
  const args = input.bashCommand.split(" ");
  const cmd = args.splice(0, 1);
  const command = new Deno.Command(cmd[0], { args });
  const { code, stdout, stderr } = command.outputSync();
  console.log("Command exit code:", code);
  if (code === 0) {
    console.log("stdout:\n\n", new TextDecoder().decode(stdout));
  } else {
    console.log("stderr\n\n", new TextDecoder().decode(stderr));
  }
  return;
}, {
  name: "execute_bash_command",
  description:
    "Executes the given bash command. The user will be prompted first for verification.",
  schema: z.object({
    bashCommand: z.string(),
  }),
});

const tools = [executeBash];

const toolNode = new ToolNode(tools);

const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "qwen3:latest",
  temperature: 0.1,
}).bindTools(tools);

const message = prompt(
  "Describe what you want to do, and I will try to create a bash command for it:\n",
);

if (!message) Deno.exit(1);

const response = await model.invoke(
  `Run a bash command to will accomplish the following task. Don't use pipes.\n\n${message}`,
);

verboseMessage(response.content);
verboseMessage(response.tool_calls);

await toolNode.invoke({ messages: [response] });
