export const lengthUnits = [
  { name: "Metre", symbol: "m", conversionFactor: 1 },
  { name: "Kilometre", symbol: "km", conversionFactor: 0.001 },
  { name: "Centimeter", symbol: "cm", conversionFactor: 100 },
  { name: "Millimeter", symbol: "mm", conversionFactor: 1000 },
  { name: "Inch", symbol: "in", conversionFactor: 39.3701 },
  { name: "Foot", symbol: "ft", conversionFactor: 3.28084 },
  { name: "Yard", symbol: "yd", conversionFactor: 1.09361 },
  { name: "Mile", symbol: "mi", conversionFactor: 0.000621371 },
];

export const weightUnits = [
  { name: "Kilogram", symbol: "kg", conversionFactor: 1 },
  { name: "Gram", symbol: "g", conversionFactor: 1000 },
  { name: "Milligram", symbol: "mg", conversionFactor: 1000000 },
  { name: "Metric Ton", symbol: "t", conversionFactor: 0.001 },
  { name: "Pound", symbol: "lb", conversionFactor: 2.20462 },
  { name: "Ounce", symbol: "oz", conversionFactor: 35.274 },
];

export const temperatureUnits = [
  {
    name: "Celsius",
    symbol: "°C",
    conversionFactor: 1, // Not used for temperature
    toBase: (value: number) => value,
    fromBase: (value: number) => value,
  },
  {
    name: "Fahrenheit",
    symbol: "°F",
    conversionFactor: 1, // Not used for temperature
    toBase: (value: number) => ((value - 32) * 5) / 9,
    fromBase: (value: number) => (value * 9) / 5 + 32,
  },
  {
    name: "Kelvin",
    symbol: "K",
    conversionFactor: 1, // Not used for temperature
    toBase: (value: number) => value - 273.15,
    fromBase: (value: number) => value + 273.15,
  },
];

export const areaUnits = [
  { name: "Square Meter", symbol: "m²", conversionFactor: 1 },
  { name: "Square Kilometer", symbol: "km²", conversionFactor: 0.000001 },
  { name: "Square Centimeter", symbol: "cm²", conversionFactor: 10000 },
  { name: "Square Foot", symbol: "ft²", conversionFactor: 10.7639 },
  { name: "Square Yard", symbol: "yd²", conversionFactor: 1.19599 },
  { name: "Acre", symbol: "ac", conversionFactor: 0.000247105 },
  { name: "Hectare", symbol: "ha", conversionFactor: 0.0001 },
];

export const volumeUnits = [
  { name: "Cubic Meter", symbol: "m³", conversionFactor: 1 },
  { name: "Liter", symbol: "L", conversionFactor: 1000 },
  { name: "Milliliter", symbol: "mL", conversionFactor: 1000000 },
  { name: "Cubic Foot", symbol: "ft³", conversionFactor: 35.3147 },
  { name: "US Gallon", symbol: "gal", conversionFactor: 264.172 },
  { name: "US Fluid Ounce", symbol: "fl oz", conversionFactor: 33814 },
];

export const timeUnits = [
  { name: "Second", symbol: "s", conversionFactor: 1 },
  { name: "Millisecond", symbol: "ms", conversionFactor: 1000 },
  { name: "Minute", symbol: "min", conversionFactor: 1 / 60 },
  { name: "Hour", symbol: "h", conversionFactor: 1 / 3600 },
  { name: "Day", symbol: "d", conversionFactor: 1 / 86400 },
  { name: "Week", symbol: "wk", conversionFactor: 1 / 604800 },
  { name: "Month (30 days)", symbol: "mo", conversionFactor: 1 / 2592000 },
  { name: "Year (365 days)", symbol: "yr", conversionFactor: 1 / 31536000 },
];

export const speedUnits = [
  { name: "Meters per second", symbol: "m/s", conversionFactor: 1 },
  { name: "Kilometers per hour", symbol: "km/h", conversionFactor: 3.6 },
  { name: "Miles per hour", symbol: "mph", conversionFactor: 2.23694 },
  { name: "Feet per second", symbol: "ft/s", conversionFactor: 3.28084 },
  { name: "Knots", symbol: "kn", conversionFactor: 1.94384 },
];

export const dataUnits = [
  { name: "Byte", symbol: "B", conversionFactor: 1 },
  { name: "Kilobyte", symbol: "KB", conversionFactor: 1 / 1024 },
  { name: "Megabyte", symbol: "MB", conversionFactor: 1 / 1048576 },
  { name: "Gigabyte", symbol: "GB", conversionFactor: 1 / 1073741824 },
  { name: "Terabyte", symbol: "TB", conversionFactor: 1 / 1099511627776 },
  { name: "Bit", symbol: "bit", conversionFactor: 8 },
  { name: "Kilobit", symbol: "Kbit", conversionFactor: 8 / 1024 },
  { name: "Megabit", symbol: "Mbit", conversionFactor: 8 / 1048576 },
];
export const powerUnits = [
  { name: "Watt", symbol: "W", conversionFactor: 1 },
  { name: "Kilowatt", symbol: "kW", conversionFactor: 0.001 },
  { name: "Megawatt", symbol: "MW", conversionFactor: 0.000001 },
  {
    name: "Horsepower (mechanical)",
    symbol: "hp",
    conversionFactor: 0.00134102,
  },
  {
    name: "Foot-pound per second",
    symbol: "ft·lb/s",
    conversionFactor: 0.737562,
  },
  { name: "BTU per hour", symbol: "BTU/h", conversionFactor: 3.41214 },
  { name: "Calorie per second", symbol: "cal/s", conversionFactor: 0.239006 },
  { name: "Joule per second", symbol: "J/s", conversionFactor: 1 },
];

export const pressureUnits = [
  { name: "Pascal", symbol: "Pa", conversionFactor: 1 },
  { name: "Kilopascal", symbol: "kPa", conversionFactor: 0.001 },
  { name: "Bar", symbol: "bar", conversionFactor: 0.00001 },
  {
    name: "Pound per square inch",
    symbol: "psi",
    conversionFactor: 0.000145038,
  },
  { name: "Atmosphere", symbol: "atm", conversionFactor: 9.86923e-6 },
  { name: "Torr", symbol: "Torr", conversionFactor: 0.00750062 },
  {
    name: "Millimeter of mercury",
    symbol: "mmHg",
    conversionFactor: 0.00750062,
  },
  { name: "Inch of mercury", symbol: "inHg", conversionFactor: 0.000295301 },
];

export const energyUnits = [
  { name: "Joule", symbol: "J", conversionFactor: 1 },
  { name: "Kilojoule", symbol: "kJ", conversionFactor: 0.001 },
  { name: "Calorie", symbol: "cal", conversionFactor: 0.239006 },
  { name: "Kilocalorie", symbol: "kcal", conversionFactor: 0.000239006 },
  { name: "Watt-hour", symbol: "Wh", conversionFactor: 0.000277778 },
  { name: "Kilowatt-hour", symbol: "kWh", conversionFactor: 2.77778e-7 },
  { name: "Electron volt", symbol: "eV", conversionFactor: 6.242e18 },
  {
    name: "British thermal unit",
    symbol: "BTU",
    conversionFactor: 0.000947817,
  },
  { name: "US therm", symbol: "thm", conversionFactor: 9.4804e-9 },
  { name: "Foot-pound", symbol: "ft⋅lb", conversionFactor: 0.737562 },
];
