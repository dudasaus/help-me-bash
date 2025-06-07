import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";

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
  console.log("stdout", new TextDecoder().decode(stdout));
  console.log("stderr", new TextDecoder().decode(stderr));
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

console.log(response.content);
console.log(response.tool_calls);

await toolNode.invoke({ messages: [response] });
