import { Manager } from "../manager.js";
import { loadCommand } from "./loadCommand.js";
import { loadMainEvents } from "./loadEvents.js";

export class initHandler {
  constructor(client: Manager) {
    new loadMainEvents(client);
    new loadCommand(client);
  }
}
