import { add, differenceInMinutes, getDay, isAfter, isSameDay } from "date-fns";
import { DailyData } from "../../atoms/graph";

export function getAvgTimeByDay(data: Date[][] | undefined) {
  const dayToMinutes: DailyData[] = [
    { dayOfWeek: "Sunday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Monday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Tuesday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Wednesday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Thursday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Friday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Saturday", minutes: 0, daysCounted: 0 },
  ];

  if (!data) {
    return dayToMinutes;
  }

  let currentDate = data[0][0];
  let currentTimeInMinutes = 0;

  for (let dateRange of data) {
    // if we study till midnight the next day, we record as 21st Jan: 2200 - 0000
    // so we push the date back
    if (isAfter(dateRange[0], dateRange[1])) {
      dateRange[1] = add(dateRange[1], { days: 1 });
    }
    const timeDiff = Math.abs(
      differenceInMinutes(dateRange[0], dateRange[1], {
        roundingMethod: "floor",
      })
    );
    if (isSameDay(currentDate, dateRange[0])) {
      currentTimeInMinutes += timeDiff;
    } else {
      const toUpdate = dayToMinutes[getDay(currentDate)];
      toUpdate.daysCounted += 1;
      toUpdate.minutes += currentTimeInMinutes;
      currentDate = dateRange[0];
      currentTimeInMinutes = timeDiff;
    }
  }
  const finalUpdate = dayToMinutes[getDay(currentDate)];
  finalUpdate.daysCounted += 1;
  finalUpdate.minutes += currentTimeInMinutes;

  return dayToMinutes;
}
