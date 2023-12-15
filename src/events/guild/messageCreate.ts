import { ChannelType, Message } from "discord.js";
import { Manager } from "../../manager.js";

export default class {
  async execute(client: Manager, message: Message) {
    if (message.author.bot || message.channel.type == ChannelType.DM) return;

    let PREFIX = client.prefix;

    const mention = new RegExp(`^<@!?${client.user!.id}>( |)$`);

    if (message.content.match(mention)) {
      await message.reply(`${client.ws.ping}`);
      return;
    }
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user!.id}>|${escapeRegex(PREFIX)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(
      prefixRegex
    ) as RegExpMatchArray;
    const args = message.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift()!.toLowerCase();

    const command =
      client.commands.get(cmd) ||
      client.commands.get(client.aliases.get(cmd) as string);
    if (!command) return;

    if (command) {
      try {
        command.run(client, message, args, PREFIX);
      } catch (error) {
        client.logger.error(error);
      }
    }
  }
}
