export function required(val: any, args: any) {
  if (
    val === undefined ||
    val === null ||
    val === "undefined" ||
    val === "null" ||
    val === null ||
    Number.isNaN(val)
  ) {
    return false;
  }

  if (typeof val === "string") {
    const tmp = val.replace(/\s/g, "");
    return tmp.length > 0;
  }
  if (typeof val === "object") {
    return val.length > 0;
  }

  return true;
}
