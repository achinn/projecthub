export default async function (arr, predicate) {
  for (let i = 0; i < arr.length; i += 1) {
    if (!await predicate(arr[i])) return false // eslint-disable-line no-await-in-loop
  }
  return true
}
