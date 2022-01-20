import {
  add,
  differenceInMinutes,
  getDay,
  isAfter,
  isSameDay,
  isValid,
  parse,
} from "date-fns";
import * as echarts from "echarts";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

// // Combine an Option type with only required components and charts via ComposeOption
// type ECOption = echarts.ComposeOption<
//   | BarSeriesOption
//   | LineSeriesOption
//   | TitleComponentOption
//   | TooltipComponentOption
//   | GridComponentOption
//   | DatasetComponentOption
// >;

// // Register the required components
// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   DatasetComponent,
//   TransformComponent,
//   BarChart,
//   LabelLayout,
//   UniversalTransition,
//   CanvasRenderer,
// ]);

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

function parseDataFromString(data: string, participant: string) {
  try {
    let result: string[][] = JSON.parse(data);
    let formattedData: Date[][] = [];

    for (let tracked of result) {
      if (tracked[0].trim() !== participant) {
        continue;
      }
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
          formattedData.push(parsedTime);
        }
      }
    }

    return formattedData;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function findAvgTimePerDay(data: Date[][]) {
  const dayToMinutes: {
    dayOfWeek: string;
    minutes: number;
    daysCounted: number;
  }[] = [
    { dayOfWeek: "Sunday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Monday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Tuesday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Wednesday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Thursday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Friday", minutes: 0, daysCounted: 0 },
    { dayOfWeek: "Saturday", minutes: 0, daysCounted: 0 },
  ];

  if (data.length === 0) {
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

function findHoursPerDay(data: Date[][]) {
  throw new Error("Function not implemented.");
}

function findProductiveTime(data: Date[][]) {
  throw new Error("Function not implemented.");
}

const Home: NextPage = () => {
  const graphRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "",
    fetchTimeData
  );
  const participants = useMemo(() => {
    if (!data) {
      return [];
    }
    return JSON.parse(data).map((value: string[]) => value[0]);
  }, [data]);
  const [participant, setParticipant] = useState("");
  const parsedData = useMemo(() => {
    return parseDataFromString(data || "[]", participant);
  }, [data, participant]);
  const avgTimePerDay = useMemo(() => {
    console.log("parseData", parsedData);
    return findAvgTimePerDay(parsedData);
  }, [parsedData]);

  console.log("avgTimePerDay", avgTimePerDay);
  // const hoursPerDay = findHoursPerDay(parsedData);
  // const productiveTime = findProductiveTime(parsedData);
  console.log("parsedData", parsedData);

  useEffect(() => {
    const chart = echarts.init(graphRef.current, "light", {
      width: 600,
      height: 400,
    });
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Avg Hours per Day",
          type: "bar",
          barWidth: "60%",
          data: avgTimePerDay.map(
            (timePerDay) => timePerDay.minutes / timePerDay.daysCounted / 60
          ),
        },
      ],
    };
    chart.setOption(option);
    const handleResize = function () {
      chart.resize();
    };
    window.onresize = handleResize;

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [avgTimePerDay]);

  return (
    <div>
      <Head>
        <title>Who&apos;s the biggest workaholic</title>
        <meta name="description" content="visualizing how we spend our time" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main>
        <h1>The data might be lying</h1>
        <h2>The current biggest workaholic: </h2>
        <h2>View your stats</h2>
        <select
          name="participant"
          value={participant}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setParticipant(e.target.value);
          }}
        >
          <option disabled value="">
            -- select an option --
          </option>
          {participants.map((participant: string) => {
            return (
              <option key={participant} value={participant}>
                {participant}
              </option>
            );
          })}
        </select>
        <div id="graph" ref={graphRef} />
      </main>

      <footer>
        <span className="font-semibold">
          © ? Who&apos;s the biggest workaholic
        </span>
      </footer>
    </div>
  );
};

export default Home;
