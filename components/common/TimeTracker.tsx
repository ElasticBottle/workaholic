import { format, parseISO } from "date-fns";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { participantColumnAtom } from "../../atoms/graph";

export default function TimeTracker() {
  const [participantCol] = useAtom(participantColumnAtom);
  const [isStart, setIsStart] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const formattedStartDate = startDate
    ? format(startDate, "yyyy-MM-dd'T'HH:mm")
    : "";
  const formattedEndDate = endDate
    ? format(endDate || 0, "yyyy-MM-dd'T'HH:mm")
    : "";

  const dateButtonClick = () => {
    if (isStart) {
      setStartDate(new Date());
      if (endDate) {
        setShowSubmit(true);
      }
    } else {
      setEndDate(new Date());
      setShowSubmit(true);
    }
    setIsStart((prev) => !prev);
  };

  const resetClick = () => {
    setShowSubmit(false);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const submitTiming = () => {
    console.log("participanCol", participantCol);
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}/values/${process.env.NEXT_PUBLIC_SHEET_NAME}!${participantCol}:append?valueInputOption=USER_ENTERED&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      { method: "POST", body: "post from the web" }
    );
  };

  useEffect(() => {
    if (!startDate) {
      setIsStart(true);
      setShowSubmit(false);
    } else if (!endDate) {
      setIsStart(false);
      setShowSubmit(false);
    }
  }, [startDate, endDate]);

  return (
    <div className="grid grid-cols-1 gap-5 my-7">
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="start-date">Start date time</label>
        <input
          id="start-date"
          name="startDate"
          type="datetime-local"
          className="border-0 rounded-md bg-slate-200 dark:bg-slate-700"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setStartDate(e.target.value ? parseISO(e.target.value) : undefined);
          }}
          value={formattedStartDate}
        />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="end-date">End date time</label>
        <input
          id="end-date"
          name="endDate"
          type="datetime-local"
          className="border-0 rounded-md bg-slate-200 dark:bg-slate-700"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEndDate(e.target.value ? parseISO(e.target.value) : undefined);
          }}
          value={formattedEndDate}
        />
      </div>
      {showSubmit ? (
        <button
          className="px-5 py-1 bg-orange-200 rounded-lg shadow-sm dark:bg-orange-800 hover:bg-orange-400 hover:dark:bg-orange-700 active:bg-orange-300 active:dark:bg-orange-900"
          onClick={submitTiming}
        >
          Submit
        </button>
      ) : (
        <button
          className="px-5 py-1 bg-orange-200 rounded-lg shadow-sm dark:bg-orange-800 hover:bg-orange-400 hover:dark:bg-orange-700 active:bg-orange-300 active:dark:bg-orange-900"
          onClick={dateButtonClick}
        >
          {isStart ? "Start" : "End"}
        </button>
      )}
      {showSubmit && (
        <button
          className="px-5 py-1 bg-orange-200 rounded-lg shadow-sm dark:bg-orange-800 hover:bg-orange-400 hover:dark:bg-orange-700 active:bg-orange-300 active:dark:bg-orange-900"
          onClick={resetClick}
        >
          Reset
        </button>
      )}
    </div>
  );
}
