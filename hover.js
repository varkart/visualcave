(function () {
  // Add data-node="id" to node <g> elements.
  // Add data-connects="id1,id2" to arrow <g> elements.
  const nodes = document.querySelectorAll('[data-node]');
  const arrows = document.querySelectorAll('[data-connects]');

  nodes.forEach((node) => {
    node.style.cursor = 'pointer';
    node.addEventListener('mouseenter', () => {
      const id = node.dataset.node;
      nodes.forEach((n) => {
        n.style.opacity = n === node ? '1' : '0.2';
      });
      arrows.forEach((a) => {
        const connected = a.dataset.connects.split(',').includes(id);
        a.style.opacity = connected ? '1' : '0.1';
      });
    });
    node.addEventListener('mouseleave', () => {
      nodes.forEach((n) => {
        n.style.opacity = '1';
      });
      arrows.forEach((a) => {
        a.style.opacity = '1';
      });
    });
  });
})();
