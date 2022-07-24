import { min } from "./min";
import { max } from "./max";

export function between(val: number, args: number[]): boolean {
  return min(val, [args[0]]) && max(val, [args[1]]);
}
