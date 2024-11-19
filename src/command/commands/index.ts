import { commandManager } from "../commandManager/commandManager.js";
import { anytimeCommand } from "./date/anytime.js";
import { timestampCommand } from "./date/timestamp.js";
import { hackerNounCommand } from "./hacker/hacker.noun.js";
import { ipCommand } from "./internet/ip.js";
import { ipv4Command } from "./internet/ipv4.js";
import { ipv6Command } from "./internet/ipv6.js";
import { priCommand } from "./internet/pri.js";
import { loremSentencesCommand } from "./lorem/lorem.sentences.js";
import { intCommand } from "./number/int.js";
import { pidCommand } from "./number/pid.js";
import { lengthCommand } from "./others/length.js";

// date
commandManager.setCommand(anytimeCommand);
commandManager.setCommand(timestampCommand);
// hacker
commandManager.setCommand(hackerNounCommand);
// internet
commandManager.setCommand(ipCommand);
commandManager.setCommand(ipv4Command);
commandManager.setCommand(ipv6Command);
commandManager.setCommand(priCommand);
// lorem
commandManager.setCommand(loremSentencesCommand);
// number
commandManager.setCommand(intCommand);
commandManager.setCommand(pidCommand);
// others
commandManager.setCommand(lengthCommand);
