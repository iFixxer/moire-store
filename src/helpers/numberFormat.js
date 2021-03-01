export default function numberFormat(value) {
  if (!parseInt(value)) {
    return null;
  } else {
    return new Intl.NumberFormat().format(value);
  }
}
