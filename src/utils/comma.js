export default function comma(price) {
  let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return returnString;
}
