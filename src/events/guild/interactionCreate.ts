import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import { Manager } from "../../manager.js";
import { GlobalInteraction } from "../../@types/Interaction.js";

/**
 * @param {GlobalInteraction} interaction
 */

export default class {
  async execute(client: Manager, interaction: GlobalInteraction) {
    if (
      interaction.isCommand() ||
      interaction.isContextMenuCommand() ||
      interaction.isModalSubmit() ||
      interaction.isChatInputCommand() ||
      interaction.isAutocomplete()
    ) {
      if (!interaction.guild || interaction.user.bot) return;

      let subCommandName = "";
      try {
        subCommandName = (
          (interaction as CommandInteraction)
            .options as CommandInteractionOptionResolver
        ).getSubcommand();
      } catch {}
      let subCommandGroupName = "";
      try {
        subCommandGroupName = (
          (interaction as CommandInteraction)
            .options as CommandInteractionOptionResolver
        ).getSubcommandGroup()!;
      } catch {}

      const command = client.slash.find((command) => {
        switch (command.name.length) {
          case 1:
            return (
              command.name[0] == (interaction as CommandInteraction).commandName
            );
          case 2:
            return (
              command.name[0] ==
                (interaction as CommandInteraction).commandName &&
              command.name[1] == subCommandName
            );
          case 3:
            return (
              command.name[0] ==
                (interaction as CommandInteraction).commandName &&
              command.name[1] == subCommandGroupName &&
              command.name[2] == subCommandName
            );
        }
      });

      if (!command) return;

      const msg_cmd = [
        `[COMMAND] ${command.name[0]}`,
        `${command.name[1] || ""}`,
        `${command.name[2] || ""}`,
        `used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`,
      ];

      client.logger.info(`${msg_cmd.join(" ")}`);

      if (!command) return;
      if (command) {
        try {
          command.run(interaction, client);
        } catch (error) {
          client.logger.log({
            level: "error",
            message: error,
          });
        }
      }
    }
  }
}
