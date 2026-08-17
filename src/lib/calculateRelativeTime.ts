import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

export const calculateRelativeTime = (time: string) => {
  if (!time?.trim()) return;

  dayjs.extend(utc);
  dayjs.extend(relativeTime);

  const timeAgo = dayjs.utc(time).fromNow();
  return timeAgo;
};
