import { useAtom } from "jotai";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import useSWR from "swr";
import { parsedDataAtom, participantsAtom } from "../atoms/graph";
import { LeaderBoard } from "../components/common/LeaderBoard";
import ParticipantSelect from "../components/common/ParticipantSelect";
import AvgHrsGraph from "../components/graphs/AvgHrsGraph";
import Layout from "../components/layout/Layout";
import { NextPageWithLayout } from "../interface/NextPageWithLayout";
import { parseDataFromString } from "../lib/data/parseDataFromString";

async function fetchTimeData(sheetId: string) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${process.env.NEXT_PUBLIC_SHEET_NAME}?dateTimeRenderOption=FORMATTED_STRING&majorDimension=COLUMNS&valueRenderOption=FORMATTED_VALUE&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  );
  if (!response.ok) {
    throw Error(await response.text());
  }
  let result: string[][] = (await response.json()).values;
  // removing excess arrays
  for (let i = 0; i < result.length; ++i) {
    if (result[i].length == 0) {
      result = result.slice(0, i);
    }
  }
  return JSON.stringify(result);
}

function findHoursPerDay(data: Date[][]) {
  throw new Error("Function not implemented.");
}

function findProductiveTime(data: Date[][]) {
  throw new Error("Function not implemented.");
}

const Home: NextPage = () => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "",
    fetchTimeData
  );

  const [parsedData, setParsedData] = useAtom(parsedDataAtom);
  const [, setParticipants] = useAtom(participantsAtom);

  useEffect(() => {
    if (!data) {
      setParticipants([]);
      return setParsedData(parseDataFromString(data || "[]"));
    }
    setParticipants(JSON.parse(data).map((value: string[]) => value[0]));
    setParsedData(parseDataFromString(data));
  }, [data]);

  // const hoursPerDay = findHoursPerDay(parsedData);
  // const productiveTime = findProductiveTime(parsedData);
  console.log("parsedData", parsedData);

  // most consecutive hours in a week.
  // all time and 7 day window graph for each option.
  // hours per day.
  // most productive hours in a day.
  // start stop button to record time.

  return (
    <>
      <main className="grid gap-5 auto-rows-min grow">
        <h2 className="text-xl font-bold">The current biggest workaholic: </h2>
        <LeaderBoard />
        <AvgHrsGraph />
        <ParticipantSelect className="pt-4" />
      </main>
    </>
  );
};

(Home as NextPageWithLayout).getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
