import { useAtom } from "jotai";
import { avgTimePerDayAtom } from "../../atoms/graph";
import { getAvgHoursInADay } from "../../lib/graph/getAvgHoursInADay";

export function LeaderBoard() {
  const [avgTimePerDay] = useAtom(avgTimePerDayAtom);

  const { winner, winnerHours, avgWorkDayHours, leaderBoard } =
    getAvgHoursInADay(avgTimePerDay || {});

  console.log("avgWorkDayHours", avgWorkDayHours);
  const tableHeader = ["Rank", "Name", "Hrs / Day (Avg)"];
  return (
    <>
      <div className="font-bold text-center text-orange-900 transition-transform dark:text-orange-200 motion-safe:animate-bounce">
        {!avgTimePerDay ? null : (
          <>
            <span className="text-xl ">{winner}</span>: {winnerHours} hrs / day
          </>
        )}
      </div>
      <table className="table-auto">
        <thead>
          <tr className="shadow-sm bg-slate-100 dark:bg-slate-700 shadow-slate-600">
            {tableHeader.map((header, index) => {
              return (
                <th
                  key={index}
                  className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase"
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {leaderBoard.map((person, index) => {
            return (
              <tr
                key={index}
                className={`${
                  index % 2 === 1 ? "bg-slate-200 dark:bg-slate-600" : ""
                } hover:bg-gray-400 hover:dark:bg-gray-500`}
              >
                <td className="px-6 py-1.5 text-md">{index + 1}</td>
                <td className="px-6 py-1.5 font-medium ">{person[0]}</td>
                <td className="px-6 py-1.5 font-medium ">{person[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
