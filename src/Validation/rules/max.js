export function max (val, args) {
  const maxValue = parseFloat(args[0])
  val = val ? val : ''
  const value = isNaN(val) ? val.length : parseFloat(val)
  console.log(`value`, value)

  return isNaN(value) ? true : value <= maxValue
}
