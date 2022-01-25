import { ParticipantDailyData } from "../../atoms/graph";

export function getAvgHoursInADay(data: ParticipantDailyData) {
  const avgWorkDayHours: { [participant: string]: number } = {};
  let winner = "";
  let winnerHours = 0;
  const leaderBoard: [string, number][] = [];
  for (let participant of Object.keys(data)) {
    const days = data[participant].reduce((prevVal, currVal) => {
      return currVal.daysCounted + prevVal;
    }, 0);
    const avgHoursInDayDayMinutes =
      data[participant].reduce((prevVal, currVal) => {
        return currVal.minutes + prevVal;
      }, 0) / days;
    avgWorkDayHours[participant] =
      Math.round((avgHoursInDayDayMinutes / 60) * 100) / 100;

    if (avgWorkDayHours[participant] > winnerHours) {
      winner = participant;
      winnerHours = avgWorkDayHours[participant];
    }
    leaderBoard.push([participant, avgWorkDayHours[participant]]);
  }
  leaderBoard.sort((a, b) => {
    return b[1] - a[1];
  });

  return { winner, winnerHours, avgWorkDayHours, leaderBoard };
}
