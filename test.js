// Create a function that takes a number (in nanos) as an argument and returns a text in format of the least, like "1d 2h 3m 4s 10ms 10ns"
function formatNano(nanos) {
  const units = [
    {
      name: "ns",
      divider: 1,
    },
    {
      name: "μs",
      divider: 1000,
    },
    {
      name: "ms",
      divider: 1000000,
    },
    {
      name: "s",
      divider: 1000000000,
    },
    {
      name: "m",
      divider: 60000000000,
    },
    {
      name: "h",
      divider: 3600000000000,
    },
    {
      name: "d",
      divider: 86400000000000,
    },
  ];
  let result = "";
  for (const unit of units) {
    const value = nanos / unit.divider;
    if (value > 0) {
      result += `${value} ${unit.name} `;
    }
    nanos %= unit.divider;
  }
  return result;
}

// Create a function that takes string (1d 3h 3m 6s 90ms 500ns) as an argument and returns a number of nanoseconds
function parseNano(str) {
  const units = [
    {
      name: "ns",
      divider: 1,
    },
    {
      name: "μs",
      divider: 1000,
    },
    {
      name: "ms",
      divider: 1000000,
    },
    {
      name: "s",
      divider: 1000000000,
    },
    {
      name: "m",
      divider: 60000000000,
    },
    {
      name: "h",
      divider: 3600000000000,
    },
    {
      name: "d",
      divider: 86400000000000,
    },
  ];
  let result = 0;
  for (const unit of units) {
    const match = str.match(new RegExp(`(\\d+)${unit.name}`));
    if (match) {
      result += parseInt(match[1]) * unit.divider;
    }
  }
  return result;
}
