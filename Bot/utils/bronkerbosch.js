module.exports = function getAllCliquesFromAllies(allies) {
  const edges = alliesToList(allies)
  const vertices = edges.reduce((verticesMap, edge) => (verticesMap[edge[0]] = 1, verticesMap[edge[1]] = 1, verticesMap), {});
  const neighbours = edges.reduce((verticesMap, edge) => (
      verticesMap[edge[0]] = (verticesMap[edge[0]] || []).concat(edge[1]),
          verticesMap[edge[1]] = (verticesMap[edge[1]] || []).concat(edge[0]),
          verticesMap
  ), {});

  const graph = {
      neighboursOf: vertex => neighbours[vertex],
      vertices: () => Object.keys(vertices),
  };

  return allCliques(graph);
}

function alliesToList(allies) {
  return Object.values(allies).map(a => a.map(p => p.id))
}

function bronKerbosch(g, r, p, x, cliques) {
  if (p.length === 0 && x.length === 0) {
      cliques.push(r);
  }

  const isNeighbourOf = v => vertex => g.neighboursOf(v).includes(vertex);

  p.forEach((v, index) => bronKerbosch(
      g,
      r.concat([v]),
      p.slice(index).filter(isNeighbourOf(v)),
      x.concat(p.slice(0, index)).filter(isNeighbourOf(v)),
      cliques
  ));
}



function allCliques(g) {
  const cliques = [];
  const r = [];
  const p = g.vertices();
  const x = [];

  if (p.length === 0) {
      // prevent empty cliques in empty graphs
      return cliques;
  }
  bronKerbosch(
      g,
      r,
      p,
      x,
      cliques
  );
  return cliques;
};
