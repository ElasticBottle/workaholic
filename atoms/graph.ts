import { atom } from "jotai";
import { atomWithHash } from "jotai/utils";

export type DailyData = {
  dayOfWeek: string;
  minutes: number;
  daysCounted: number;
};

export type ParticipantDailyData = {
  [participant: string]: DailyData[];
};

export type ParsedData = { [participant: string]: Date[][] };

export const parsedDataAtom = atom<ParsedData>({});
export const avgTimePerDayAtom = atom<ParticipantDailyData>({});

export const participantAtom = atomWithHash<string>("participant", "");
export const participantsAtom = atom<string[]>([]);
