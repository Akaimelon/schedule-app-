export const WEEKDAYS = ["月", "火", "水", "木", "金"];

export const TRANSPORT_OPTIONS = [
  { key: "am", label: "午前", mark: "前" },
  { key: "pm", label: "午後", mark: "後" },
  { key: "pickup", label: "送り", mark: "送" },
  { key: "dropoff", label: "迎え", mark: "迎" },
];

export const TIME_OPTIONS = [
  { value: "", label: "なし" },
  { value: "am", label: "午前" },
  { value: "pm", label: "午後" },
];

//契約上の利用定員が10のため
export const MAX_PER_DAY = 10;

export const CHILD_COLORS = ["black", "#C44040", "#185FA5", "#1D9E75"];

export const HOLIDAY_API = "https://holidays-jp.github.io/api/v1";

export const STORAGE_KEY = "himawari-store";

export const SAMPLE_CHILDREN = [
  {
    id: 1,
    name: "はると",
    color: "#185FA5",
    contractDays: 10,
    defaultTimeFrame: "am",
  },
  {
    id: 2,
    name: "ゆい",
    color: "#C44040",
    contractDays: 8,
    defaultTimeFrame: "pm",
  },
  {
    id: 3,
    name: "けんと",
    color: "#1D9E75",
    contractDays: 12,
    defaultTimeFrame: "",
  },
];
