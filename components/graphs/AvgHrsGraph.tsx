import * as echarts from "echarts";
import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import {
  avgTimePerDayAtom,
  parsedDataAtom,
  ParticipantDailyData,
} from "../../atoms/graph";
import { getAvgTimeByDay } from "../../lib/graph/getAvgTimeByDay";

export default function AvgHrsGraph() {
  const graphRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  //   const [participant] = useAtom(participantAtom);
  const [parsedData] = useAtom(parsedDataAtom);
  const [avgTimePerDay, setAvgTimePerDay] = useAtom(avgTimePerDayAtom);

  useEffect(() => {
    const result: ParticipantDailyData = {};
    Object.keys(parsedData).map((key) => {
      result[key] = getAvgTimeByDay(parsedData[key]);
    });
    setAvgTimePerDay(result);
  }, [parsedData]);

  const data = Object.keys(avgTimePerDay).map((participant) => {
    return {
      name: participant,
      type: "bar",
      barGap: 0,
      data: avgTimePerDay[participant]?.map((timePerDay) => {
        return (
          Math.round(
            (timePerDay.minutes / (timePerDay.daysCounted || 1) / 60) * 100
          ) / 100
        );
      }),
    };
  });

  useEffect(() => {
    const chart = echarts.init(graphRef.current, "light");

    const option = {
      legend: {
        textStyle: {
          color: "#777",
        },
      },
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
      series: [...data],
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
      <label className="font-bold" htmlFor="average-hours-per-day-worked-graph">
        Average Hours per day
      </label>
      <div
        id="average-hours-per-day-worked-graph"
        className="w-full h-[300px] md:h-[500px] pt-5"
        ref={graphRef}
      />
    </div>
  );
}
