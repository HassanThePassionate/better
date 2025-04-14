export const formatValue = (value: number) => {
    if (value >= 1e9 || value <= 1e-9) {
      return value.toExponential(6)
    }
    return value.toString().includes(".")
    ? value.toFixed(Math.min(6, value.toString().split(".")[1].length))
    : value.toString()
}