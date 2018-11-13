export const Wool: {
  name?: string
  color: {
    r: number,
    g: number,
    b: number
  },
  data: number
}[] = [
  {
    name: 'White wool',
    color: { r: 0xE9, g: 0xEC, b: 0xEC },
    data: 0x0
  },
  {
    name: 'Orange wool',
    color: { r: 0xF0, g: 0x76, b: 0x13 },
    data: 0x1
  },
  {
    name: 'Magenta wool',
    color: { r: 0xBD, g: 0x44, b: 0xB3 },
    data: 0x2
  },
  {
    name: 'Light blue wool',
    color: { r: 0x3A, g: 0xAF, b: 0xD9 },
    data: 0x3
  },
  {
    name: 'Yellow wool',
    color: { r: 0xF8, g: 0xC6, b: 0x27 },
    data: 0x4
  },
  {
    name: 'Lime wool',
    color: { r: 0x70, g: 0xB9, b: 0x19 },
    data: 0x5
  },
  {
    name: 'Pink wool',
    color: { r: 0xED, g: 0x8D, b: 0xAC },
    data: 0x6
  },
  {
    name: 'Gray wool',
    color: { r: 0x3E, g: 0x44, b: 0x47 },
    data: 0x7
  },
  {
    name: 'Light gray wool',
    color: { r: 0x8E, g: 0x8E, b: 0x86 },
    data: 0x8
  },
  {
    name: 'Cyan wool',
    color: { r: 0x15, g: 0x89, b: 0x91 },
    data: 0x9
  },
  {
    name: 'Purple wool',
    color: { r: 0x79, g: 0x2A, b: 0xAC },
    data: 0xA
  },
  {
    name: 'Blue wool',
    color: { r: 0x35, g: 0x39, b: 0x9D },
    data: 0xB
  },
  {
    name: 'Brown wool',
    color: { r: 0x72, g: 0x47, b: 0x28 },
    data: 0xC
  },
  {
    name: 'Green wool',
    color: { r: 0x54, g: 0x6D, b: 0x1B },
    data: 0xD
  },
  {
    name: 'Red wool',
    color: { r: 0xA1, g: 0x27, b: 0x22 },
    data: 0xE
  },
  {
    name: 'Black wool',
    color: { r: 0x14, g: 0x15, b: 0x19 },
    data: 0xF
  }
]

function getDistance(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }): number {
  return (color1.r - color2.r) ** 2 + (color1.g - color2.g) ** 2 + (color1.b - color2.b) ** 2
}

export function getData(color: { r: number, g: number, b: number }) {
  let best = Wool[0]
  let bestDist = getDistance(color, best.color)
  for(let wool of Wool) {
    let dist = getDistance(color, wool.color)
    if(dist < bestDist) {
      best = wool
      bestDist = dist
    }
  }
  return best.data
}