import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Message,
} from "discord.js";
import { Manager } from "../manager.js";
import { GlobalInteraction } from "./Interaction.js";

export enum Accessableby {
  Member = "Member",
  Owner = "Owner",
  Premium = "Premium",
  Manager = "Manager",
  Admin = "Admin",
}

export class PrefixCommand {
  name: string = "";
  description: string = "";
  category: string = "";
  accessableby: Accessableby = Accessableby.Member;
  usage: string = "";
  aliases: string[] = [];
  async run(
    client: Manager,
    message: Message,
    args: string[],
    prefix: string
  ): Promise<any> {}
}

export type CommandOptionChoiceInterface = {
  name: string;
  value: string;
};

export type CommandOptionInterface = {
  name: string;
  description: string;
  required?: boolean;
  type: ApplicationCommandOptionType | undefined;
  autocomplete?: boolean;
  options?: CommandOptionInterface[];
  choices?: CommandOptionChoiceInterface[];
};

export class SlashCommand {
  name: string[] = [];
  description: string = "";
  category: string = "";
  accessableby: Accessableby = Accessableby.Member;
  options: CommandOptionInterface[] = [];
  async run(interaction: GlobalInteraction, client: Manager): Promise<any> {}
}

export class ContextCommand {
  name: string[] = [];
  type?: ApplicationCommandType = undefined;
  category: string = "";
  accessableby: Accessableby = Accessableby.Member;

  async run(
    interaction: GlobalInteraction,
    client: Manager,
    language: string
  ): Promise<any> {}
}
