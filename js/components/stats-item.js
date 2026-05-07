function StatsItem(value, label) {
  return (
    '<div class="stat">' +
    "<strong>" +
    value +
    "</strong>" +
    "<span>" +
    label +
    "</span>" +
    "</div>"
  );
}

export { StatsItem };
