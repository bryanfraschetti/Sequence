export const removeAllChildren = (elementId) => {
  // Takes parent element id as arg, as long as it has a child, the child is removed
  const node = document.getElementById(elementId);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
