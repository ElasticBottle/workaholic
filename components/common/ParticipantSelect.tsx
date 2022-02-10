import { useAtom } from "jotai";
import React from "react";
import { participantAtom, participantsAtom } from "../../atoms/graph";
import TimeTracker from "./TimeTracker";

export default function ParticipantSelect({
  className,
}: {
  className: string;
}) {
  const [participant, setParticipant] = useAtom(participantAtom);
  const [participants] = useAtom(participantsAtom);

  return (
    <div className={`w-full ${className}`}>
      <h3 className="mb-2 font-bold">Track Your Time (Not working yet)</h3>
      <select
        className="w-full p-2 border-0 rounded-md dark:bg-slate-700 bg-slate-200 focus:ring-3"
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
      <TimeTracker />
    </div>
  );
}
