import { commandManager } from "../commandManager/commandManager.js";
import { anytimeCommand } from "./date/anytime.js";
import { timestampCommand } from "./date/timestamp.js";
import { creditCardCVV } from "./finance/creditCardCVV.js";
import { creditCardIssuer } from "./finance/creditCardIssuer.js";
import { creditCardNumber } from "./finance/creditCardNumber.js";
import { hackerNounCommand } from "./hacker/hacker.noun.js";
import { domainName } from "./internet/domainName.js";
import { email } from "./internet/email.js";
import { httpMethod } from "./internet/httpMethod.js";
import { httpStatusCode } from "./internet/httpStatusCode.js";
import { ipCommand } from "./internet/ip.js";
import { ipv4Command } from "./internet/ipv4.js";
import { ipv6Command } from "./internet/ipv6.js";
import { mac } from "./internet/mac.js";
import { password } from "./internet/password.js";
import { priCommand } from "./internet/pri.js";
import { url } from "./internet/url.js";
import { userAgent } from "./internet/userAgent.js";
import { username } from "./internet/username.js";
import { hyakuninIsshu } from "./japan/hyakuninIsshu.js";
import { shogun } from "./japan/shogun.js";
import { country } from "./location/country.js";
import { countryCode } from "./location/countryCode.js";
import { timeZone } from "./location/timeZone.js";
import { loremSentencesCommand } from "./lorem/lorem.sentences.js";
import { intCommand } from "./number/int.js";
import { pidCommand } from "./number/pid.js";
import { lengthCommand } from "./others/length.js";
import { imei } from "./phone/imei.js";
import { phoneNumber } from "./phone/phone.number.js";
import { alpha } from "./string/alpha.js";
import { alphanumeric } from "./string/alphanumeric.js";
import { binary } from "./string/binary.js";
import { hexadecimal } from "./string/hexadecimal.js";
import { numeric } from "./string/numeric.js";
import { octal } from "./string/octal.js";
import { ulid } from "./string/ulid.js";
import { uuid } from "./string/uuid.js";
import { directoryPath } from "./system/directoryPath.js";
import { filePath } from "./system/filePath.js";
import { mimeType } from "./system/mimeType.js";
import { networkInterface } from "./system/networkInterface.js";
import { semver } from "./system/semver.js";

// date
commandManager.setCommand(anytimeCommand);
commandManager.setCommand(timestampCommand);
// finance
commandManager.setCommand(creditCardCVV);
commandManager.setCommand(creditCardIssuer);
commandManager.setCommand(creditCardNumber);
// hacker
commandManager.setCommand(hackerNounCommand);
// internet
commandManager.setCommand(domainName);
commandManager.setCommand(email);
commandManager.setCommand(httpMethod);
commandManager.setCommand(httpStatusCode);
commandManager.setCommand(ipCommand);
commandManager.setCommand(ipv4Command);
commandManager.setCommand(ipv6Command);
commandManager.setCommand(mac);
commandManager.setCommand(password);
commandManager.setCommand(priCommand);
commandManager.setCommand(url);
commandManager.setCommand(userAgent);
commandManager.setCommand(username);
// japan
commandManager.setCommand(hyakuninIsshu);
commandManager.setCommand(shogun);
// location
commandManager.setCommand(country);
commandManager.setCommand(countryCode);
commandManager.setCommand(timeZone);
// lorem
commandManager.setCommand(loremSentencesCommand);
// number
commandManager.setCommand(intCommand);
commandManager.setCommand(pidCommand);
// phone
commandManager.setCommand(imei);
commandManager.setCommand(phoneNumber);
// string
commandManager.setCommand(alpha);
commandManager.setCommand(alphanumeric);
commandManager.setCommand(binary);
commandManager.setCommand(hexadecimal);
commandManager.setCommand(numeric);
commandManager.setCommand(octal);
commandManager.setCommand(ulid);
commandManager.setCommand(uuid);
// system
commandManager.setCommand(directoryPath);
commandManager.setCommand(filePath);
commandManager.setCommand(mimeType);
commandManager.setCommand(networkInterface);
commandManager.setCommand(semver);
// others
commandManager.setCommand(lengthCommand);
