const BG_COLORS = Object.freeze([
  'bg-red',
  'bg-yellow',
  'bg-yellow-dark',
  'bg-white',
  'bg-gray-dark',
])

function removeAllColors(el) {
  el.classList.remove(...BG_COLORS)
}
export function colorRed(el) {
  removeAllColors(el)
  el.classList.add('bg-red')
}

export function colorYellow(el) {
  removeAllColors(el)
  el.classList.add('bg-yellow')
}

export function colorOrange(el) {
  removeAllColors(el)
  el.classList.add('bg-yellow-dark')
}

export function colorWhite(el) {
  removeAllColors(el)
  el.classList.add('bg-white')
}

export function colorBlack(el) {
  removeAllColors(el)
  el.classList.add('bg-gray-dark')
}
