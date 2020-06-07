export function getCoord(svg, e) {
  let pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  pt = pt.matrixTransform(svg.getScreenCTM().inverse());
  return [pt.x, pt.y];
}
