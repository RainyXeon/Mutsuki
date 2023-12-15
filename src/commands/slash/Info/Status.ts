import { CommandInteraction, EmbedBuilder, version } from "discord.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";
import { Manager } from "../../../manager.js";
import os from "os";
import ms from "pretty-ms";
import { stripIndents } from "common-tags";

export default class implements SlashCommand {
  name = ["info", "status"];
  description = "Display the bot status";
  accessableby = Accessableby.Member;
  category = "Info";
  options = [];

  async run(interaction: CommandInteraction, client: Manager) {
    await interaction.deferReply({ ephemeral: false });

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
    - Response time: ${Date.now() - interaction.createdTimestamp}ms
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

    return interaction.editReply({ embeds: [embed] });
  }
}
