const PT_PER_PX = 1;
const PT_PER_REM = 12;

export function round(value: number) {
  return Math.round(value * 1e6) / 1e6;
}

export function isNumeric(value: string) {
  if (value.startsWith(".")) {
    value = `0${value}`;
  }
  return Number(value).toString() === value;
}

export function capitalize(string: string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
}

export function rem(value: number) {
  return round(PT_PER_REM * value);
}

export function px(value: number) {
  return round(PT_PER_PX * value);
}
