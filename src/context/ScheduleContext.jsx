import { useContext, createContext } from "react";

export const ScheduleContext = createContext(null);

export const useSchedule = () => useContext(ScheduleContext);
