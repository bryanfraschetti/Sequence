export const removeAllChildren = (elementId) => {
  //takes in parent element id, as long as it has a child, the child is removed
  let node = document.getElementById(elementId);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
