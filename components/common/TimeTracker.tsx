import { format, parseISO } from "date-fns";
import React, { useState } from "react";

export default function TimeTracker() {
  const [isStart, setIsStart] = useState(true);
  const [startDate, setStartDate] = useState<Date>(new Date(2999, 12, 12));
  const [endDate, setEndDate] = useState<Date>(new Date(2999, 12, 12));

  const dateButtonClick = () => {
    if (isStart) {
      setStartDate(new Date());
    } else {
      setEndDate(new Date());
    }
    setIsStart((prev) => !prev);
  };

  return (
    <>
      <label htmlFor="start-date">Start date time</label>
      <input
        id="start-date"
        name="startDate"
        type="datetime-local"
        className="border-0 rounded-md bg-slate-200 dark:bg-slate-700"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setStartDate(parseISO(e.target.value));
        }}
        value={format(startDate, "yyyy-MM-dd'T'HH:mm")}
      />
      <label htmlFor="end-date">End date time</label>
      <input
        id="end-date"
        name="endDate"
        type="datetime-local"
        className="border-0 rounded-md bg-slate-200 dark:bg-slate-700"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEndDate(parseISO(e.target.value));
        }}
        value={format(endDate, "yyyy-MM-dd'T'HH:mm")}
      />
      <button
        className="px-5 py-1 bg-orange-200 rounded-lg shadow-sm dark:bg-orange-800 hover:bg-orange-400 hover:dark:bg-orange-700 active:bg-orange-300 active:dark:bg-orange-900"
        onClick={dateButtonClick}
      >
        {isStart ? "Start" : "End"}
      </button>
    </>
  );
}
