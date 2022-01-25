import { isValid, parse } from "date-fns";

export function parseDataFromString(data: string) {
  try {
    let result: string[][] = JSON.parse(data);
    let formattedData: { [participant: string]: Date[][] } = {};

    for (let tracked of result) {
      const participant = tracked[0].trim();
      formattedData[participant] = [];
      for (let date of tracked) {
        const strippedDateString = (date as unknown as string).replace(
          /(\s+|\([a-z]+\))/gi,
          ""
        );
        const dateTimeDuration = strippedDateString.split(":");
        if (dateTimeDuration.length !== 2) {
          continue;
        }
        const startEndTime = dateTimeDuration[1].split("-");
        const startDateTime = dateTimeDuration[0] + startEndTime[0];
        const endDateTime = dateTimeDuration[0] + startEndTime[1];
        const parsedDateStart = parse(startDateTime, "doMMMMHHmm", new Date());
        const parsedDateEnd = parse(endDateTime, "doMMMMHHmm", new Date());
        if (isValid(parsedDateStart) && isValid(parsedDateEnd)) {
          const parsedTime = [parsedDateStart, parsedDateEnd];
          formattedData[participant].push(parsedTime);
        }
      }
    }

    return formattedData;
  } catch (e) {
    console.error(e);
    return {};
  }
}
