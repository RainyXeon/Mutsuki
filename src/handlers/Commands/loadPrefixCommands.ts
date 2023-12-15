import chillout from "chillout";
import readdirRecursive from "recursive-readdir";
import { resolve, relative } from "node:path";
import { Manager } from "../../manager.js";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "url";
import { PrefixCommand } from "../../@types/Command.js";
import { KeyCheckerEnum } from "../../@types/KeyChecker.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export class loadPrefixCommands {
  client: Manager;
  constructor(client: Manager) {
    this.client = client;
    this.loader();
  }

  async loader() {
    let commandPath = resolve(
      join(__dirname, "..", "..", "commands", "prefix")
    );
    let commandFiles = await readdirRecursive(commandPath);

    await chillout.forEach(commandFiles, async (commandFile) => {
      await this.register(commandFile);
    });

    if (this.client.commands.size) {
      this.client.logger.loader(
        `${this.client.commands.size} Prefix Command Loaded!`
      );
    } else {
      this.client.logger.warn(`No prefix command loaded, is everything ok?`);
    }
  }

  async register(commandFile: string) {
    const rltPath = relative(__dirname, commandFile);
    const command = new (
      await import(pathToFileURL(commandFile).toString())
    ).default();

    if (!command.name?.length) {
      this.client.logger.warn(
        `"${rltPath}" The prefix command file does not have a name. Skipping...`
      );
      return;
    }

    if (this.client.commands.has(command.name)) {
      this.client.logger.warn(
        `"${command.name}" prefix command has already been installed. Skipping...`
      );
      return;
    }

    const checkRes = this.keyChecker(command);

    if (checkRes !== KeyCheckerEnum.Pass) {
      this.client.logger.warn(
        `"${command.name}" prefix command is not implements correctly [${checkRes}]. Skipping...`
      );
      return;
    }

    this.client.commands.set(command.name, command);

    if (command.aliases && command.aliases.length !== 0)
      command.aliases.forEach((a: string) =>
        this.client.aliases.set(a, command.name)
      );
  }

  keyChecker(obj: Record<string, any>): KeyCheckerEnum {
    const base = new PrefixCommand();
    const baseKeyArray = Object.keys(base);
    const check = Object.keys(obj);
    const checkedKey: string[] = [];

    if (baseKeyArray.length > check.length) return KeyCheckerEnum.MissingKey;
    if (baseKeyArray.length < check.length) return KeyCheckerEnum.TooMuchKey;
    if (obj.run == undefined) return KeyCheckerEnum.NoRunFunction;

    try {
      for (let i = 0; i < check.length; i++) {
        if (checkedKey.includes(check[i])) return KeyCheckerEnum.DuplicateKey;
        if (!(check[i] in base)) return KeyCheckerEnum.InvalidKey;
        checkedKey.push(check[i]);
      }
    } finally {
      checkedKey.length = 0;
      return KeyCheckerEnum.Pass;
    }
  }
}
