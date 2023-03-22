export function vDijk (valueX, valueY, graph) {
    const visited = new Set();
    let unvisitedNodes = new Map();
    let visitedNodes = new Map();
    let nNodes = graph.vertices.length;
    for (let vertex of graph.vertices) {
      if (vertex === valueX) unvisitedNodes.set(vertex, [0, null]);
      else unvisitedNodes.set(vertex, [Infinity, null]);
    }
    for (let i = 0; i < nNodes; i++) {
      let currentNode = [-1, [Infinity, -1]];
      unvisitedNodes.forEach((value, key) => {
        if (value[0] < currentNode[1][0]) currentNode = [key, value];
      })
      visited.add(currentNode[0]);
      if (currentNode[0] === valueX) {
        visitedNodes.set(currentNode[0], [currentNode[1][0], -1]);
      } else {
        visitedNodes.set(currentNode[0], currentNode[1]);
      }
      if (currentNode[0] === valueY) break;
      if (currentNode[1][0] === Infinity) return false;
      let neighbors = graph.neighbors(currentNode[0]).map(neighbor => Number(neighbor));
      for (let neighbor of neighbors) {
        if (visited.has(neighbor)) continue;
        let weight = graph.getEdgeValue(currentNode[0], neighbor);
        let sum = currentNode[1][0] + (weight);
        let neighborCurrent = unvisitedNodes.get(neighbor);
        if (sum < neighborCurrent[0]) unvisitedNodes.set(neighbor, [sum, currentNode[0]]);
      }
      unvisitedNodes.delete(currentNode[0]);
    }
    return {path: path.slice(1), visited: Array.from(visited)}
  }