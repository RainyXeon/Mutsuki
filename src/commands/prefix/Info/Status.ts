import { Message } from "discord.js";
import { Manager } from "../../../manager.js";
import { EmbedBuilder, version } from "discord.js";
import os from "os";
import ms from "pretty-ms";
import { stripIndents } from "common-tags";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";

export default class implements PrefixCommand {
  name = "status";
  description = "Shows the status information of the Bot";
  category = "Info";
  accessableby = Accessableby.Member;
  usage = "";
  aliases = [];

  async run(client: Manager, message: Message, args: string[], prefix: string) {
    const total = os.totalmem() / 1024 / 1024;
    const used = process.memoryUsage().rss / 1024 / 1024;

    const hostInfo = stripIndents`\`\`\`
    - OS: ${os.type()} ${os.release()} (${os.arch()})
    - CPU: ${os.cpus()[0].model}
    - Uptime: ${ms(client.uptime as number)}
    - RAM: ${(total / 1024).toFixed(2)} GB
    - Memory Usage: ${used.toFixed(2)}/${total.toFixed(2)} (MB)
    - Node.js: ${process.version}
    \`\`\``;

    const botInfo = stripIndents`\`\`\`
    - Codename: ${client.metadata.codename}
    - Bot version: ${client.metadata.version}
    - Discord.js: ${version}
    - WebSocket Ping: ${client.ws.ping}ms
    - Response time: ${Date.now() - message.createdTimestamp}ms
    - Guild Count: ${client.guilds.cache.size}
    - User count: ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}
    \`\`\``;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user!.tag + " Status",
        iconURL: String(client.user!.displayAvatarURL({ size: 2048 })),
      })
      .setColor(client.color)
      .addFields(
        { name: "Host info", value: hostInfo },
        { name: "Bot info", value: botInfo }
      )
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
}
