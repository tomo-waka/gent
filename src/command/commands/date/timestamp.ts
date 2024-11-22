import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import type {
  ContextualStringOut,
  DocumentContext,
  DocumentOptions,
  SharedDocumentOptions,
} from "../../../document/index.js";
import { parseString } from "../../../utils.js";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

const NO_DATE = "NO_DATE";
const ERROR_DATE = "ERROR_DATE";

class TimestampCommandImpl implements ProgrammableCommand {
  public readonly name = "timestamp";

  private dateTimeArray: DateTime[] | undefined;
  private sharedDocumentOptions: SharedDocumentOptions | undefined;

  public build(
    commandOptions: Readonly<CommandOptions> | undefined,
    documentOptions: DocumentOptions,
  ): ContextualStringOut {
    // initialize date values

    const sharedDocumentOptions = documentOptions.shared;
    const mySharedDocumentOptions = this.sharedDocumentOptions;
    if (mySharedDocumentOptions === undefined) {
      this.sharedDocumentOptions = sharedDocumentOptions;
    } else if (mySharedDocumentOptions !== sharedDocumentOptions) {
      console.error(
        "call timestamp build with the different shared document options, which is unexpected.",
      );
    }

    // process option

    const format = parseString(commandOptions?.["format"]);

    if (format !== undefined) {
      return (context: DocumentContext): string => {
        const dateTime = this.getDateTime(context);
        if (dateTime === undefined) {
          return NO_DATE;
        } else {
          return dateTime.toFormat(format);
        }
      };
    } else {
      return (context: DocumentContext): string => {
        const dateTime = this.getDateTime(context);
        if (dateTime === undefined) {
          return NO_DATE;
        } else {
          return dateTime.toISO() ?? ERROR_DATE;
        }
      };
    }
  }

  private getDateTime(context: DocumentContext): DateTime | undefined {
    let dateTimeArray = this.dateTimeArray;
    if (dateTimeArray === undefined) {
      const sharedDocumentOptions = this.sharedDocumentOptions;
      if (sharedDocumentOptions === undefined) {
        console.error("run timestamp command before build.");
        return undefined;
      }
      const options = {
        from: sharedDocumentOptions.from,
        to: sharedDocumentOptions.to,
        count: sharedDocumentOptions.total,
      };
      dateTimeArray = faker.date
        .betweens(options)
        .map((date) => DateTime.fromJSDate(date));
      this.dateTimeArray = dateTimeArray;
    }
    return dateTimeArray[context.index];
  }
}

export const timestampCommand: ProgrammableCommand = new TimestampCommandImpl();
