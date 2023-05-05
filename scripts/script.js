// // Вспомогательные функции

// /**
//  * Возвращает рандомное целое число в интервале min-max.
//  * @param {Number} min - Минимальное число интервала
//  * @param {Number} max - Максимальное число интервала
//  * @returns {Number}
//  */
// const getRandomInt = (min, max) => {
//     return Math.floor(Math.random() * (max - min) + min);
// };

// // END Вспомогательные функции

// let ns;

// const containerSelector = '.graph-container';
// let lastGraph = null;
// let lastTrie = null;
// let lastTrueNodesIndexList = null;
// let nowShowFinded = false;

// const drawTrie = (trie) => {
//     ns = [];
//     lastTrueNodesIndexList = null;
//     nowShowFinded = false;
//     const data = generateDataForDraw(trie);

//     let graph = Viva.Graph.graph(),
//     nodePositions = data.positions,
//     graphics = Viva.Graph.View.svgGraphics(),
//     layout = Viva.Graph.Layout.constant(graph),
//     nodeSize = 24,
//     renderer = Viva.Graph.View.renderer(graph, {
//         graphics: graphics,
//         layout : layout,
//         container: document.querySelector(containerSelector)
//     });
    
//     let i, nodesCount = nodePositions.length;
    
//     data.nodes.forEach(node => {
//         graph.addNode(node.id, node.data);
//     })
    
//     data.links.forEach(link => {
//         graph.addLink(link.from, link.to);
//     })
    
//     graphics.link(function(link){
//         ui = Viva.Graph.svg('line')
//             .attr('stroke', 'red')
//             .attr('fill', 'red')
//             .attr('id', `${link.fromId}-${link.toId}`);
//         return ui;
//     })
    
//     graphics.node(function(node){
//         ns.push(node);
//         const ui = Viva.Graph.svg('g')
//            .attr('id', `n-${node.id}`),
//            svgText = Viva.Graph.svg('text')
//            .attr('y', '-4px')
//            .attr('x', '0px')
//            .attr('fill', 'red')
//            .text(node.data),
//            svgRect = Viva.Graph.svg('rect')
//            .attr('width', 10)
//            .attr('height', 10)
//            .attr('fill', '#00d635');

//        ui.append(svgText)
//        ui.append(svgRect)
//        return ui;
//     })
//     .placeNode(function(nodeUI, pos) {
//         nodeUI.attr('transform', `translate(${pos.x - nodeSize / 4}, ${pos.y - nodeSize / 2})`);
//     });
    
//     layout.placeNode(function(node) {
//         return nodePositions[node.id];
//     });

//     renderer.run();

//     // Zoom to fit hack
//     const graphRect = layout.getGraphRect();
//     const graphSize = Math.min(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1) + 500;
//     const screenSize = Math.min(document.body.clientWidth, document.body.clientHeight);

//     const desiredScale = screenSize / graphSize;
//     zoomOut(desiredScale, 1);

//     function zoomOut(desiredScale, currentScale) {
//         if (desiredScale < currentScale) {
//             currentScale = renderer.zoomOut();
//             setTimeout(function () {
//                 zoomOut(desiredScale, currentScale);
//             }, 16);
//         }
//     }
//     return graph;
// }

// const generateDataForDraw = (trie) => {
//     let indexNode = 0;
//     let dethDeviation = [0, 150, 70, 30, 15];

//     const positions = [];
//     const nodes = [];
//     const links = [];
    
//     nodes.push({id: 0, data: '*'});
//     positions.push({x: 0, y: 0});

//     const checkTree = (tree, deth = 0, deviation = 0, parentIndex = 0) => {
//         const children = [];
        
//         if (tree['0']) {
//             nodes.push({id: indexNode + 1, data: '0'});
//             links.push({from: parentIndex, to: indexNode + 1});
//             positions.push({x: deviation - dethDeviation[deth + 1], y: (deth + 1) * 50});
//             children.push({tree: tree['0'], deviation: deviation - dethDeviation[deth + 1], parentIndex: ++indexNode});
//         }
//         if (tree['1']) {
//             nodes.push({id: indexNode + 1, data: '1'});
//             links.push({from: parentIndex, to: indexNode + 1});
//             positions.push({x: deviation + dethDeviation[deth + 1] , y: (deth + 1) * 50});
//             children.push({tree: tree['1'], deviation: deviation + dethDeviation[deth + 1], parentIndex: ++indexNode});
//         }
//         if (children.length != 0) children.forEach(tree => checkTree(tree.tree, deth + 1, tree.deviation, tree.parentIndex));
//     };
    
//     checkTree(trie.trie);

//     return {
//         positions: positions,
//         nodes: nodes,
//         links: links
//     };
// }

// const clearGraph = (graph = lastGraph) => {
//     graph.clear();
//     document.querySelector(`${containerSelector} svg`)?.remove();
// }

// const getRandomNodeList = (deth, countNodes) => {
//     const result = []
    
//     for (let j = 0; j < countNodes; j++) {
//         let nodeStr = '';
        
//         for (let i = 0; i < getRandomInt(2, 5); i++) {
//             nodeStr += Math.floor(Math.random() * 2);
//         }
//         result.push(nodeStr);
//     }

//     return result;
// };

// const startPostOrder = () => {
//     const arrayData = [];
//     ns.forEach(a => {
//         const child = [];
//         a.links.forEach(link => {
//             const values = link.id.split('👉 ');
//             if (values[0] == a.id) {
//                 child.push(values[1]);
//             }
//         })
//         arrayData.push({id: a.id, child: child, value: a.data, checked: false})
//     })


//     const buildTreeObj = (id, parentId = -1) => {
//         const res = {id: id, parentId: parentId};
//         if (arrayData[id].child) {
//             arrayData[id].child.forEach((item, i) => {
//                 res[arrayData[item].value] = buildTreeObj(item, id);
//             })
//         }
//         return res;
//     }
//     const obj = buildTreeObj(0);
    
//     const setParentValue = (id) => {
//         if (arrayData[id].child) {
//             arrayData[id].child.forEach((item, i) => {
//                 arrayData[item].parentId = id;
//                 setParentValue(item);
//             })
//         }
//     }
//     setParentValue(0);
//     let lastLeftId;
//     const findLastLeftId = (obj) => {
//         if (!obj[0]) lastLeftId = obj.id;
//         else findLastLeftId(obj[0])
//     }
//     findLastLeftId(obj);

//     const childChecked = (id) => {
//         let result = true;
//         if (arrayData[id].child.length > 0) {
//             arrayData[id].child.forEach(child => {
//                 if (arrayData[child].checked == false) {
//                     result = false;
//                 };
//             })
//         }
//         return result;
//     }

//     const traverseTree = (id) => {
//         if (childChecked(id)) {
//             if (arrayData[id].value > -1) {
//                 arrayData[id].checked = true;
//                 queue.push([() => {
//                     const $node = document.querySelector(`svg > g > g#n-${id}`);
//                     $node.setAttribute('data-showed', '');
//                     $node.querySelector('rect').setAttribute('fill', 'blue');
//                 }]);
//                 if (arrayData[id].value == '0') {
//                     if (arrayData[arrayData[id].parentId].child[1]) {
//                         traverseTree(arrayData[arrayData[id].parentId].child[1]);
//                     } else {
//                         traverseTree(arrayData[id].parentId);
//                     }
//                 } else {
//                     traverseTree(arrayData[id].parentId);
//                 }
//             }
//         } else {
//             traverseTree(arrayData[id].child[0]);
//         }
//     }
//     traverseTree(lastLeftId);

//     queue.push([() => {
//         const $node = document.querySelector(`svg > g > g#n-0`);
//         $node.setAttribute('data-showed', '');
//         $node.querySelector('rect').setAttribute('fill', 'blue');
//     }]);

//     queue.push([() => {
//         setTimeout(() => {
//             document.querySelectorAll(`svg > g > g[data-showed]`).forEach($node => {
//                 $node.querySelector('rect').setAttribute('fill', '#00d635');
//             });
//         }, 2000)
//     }]);

// }

// lastGraph = drawTrie(lastTrie = new Trie(getRandomNodeList(4, 8)));

// // algor-postorder-traversal

// // - DOM - //

// document.querySelector('#buttonCreateRandomTrie')?.addEventListener('click', () => {
//     clearGraph();
//     lastGraph = drawTrie(lastTrie = new Trie(getRandomNodeList(4, 8)));
// })

// document.querySelector('#buttonFindTrie')?.addEventListener('click', () => {
//     startPostOrder();
// })

// let queue = [];
// let arrayToQueue = [];

// const addToQueue = (fn) => {
//     queue.push(fn);
// }

// setInterval(() => {
//     if (queue.length > 0) {
//         if (queue[0].length > 0) {
//             queue[0].forEach(item => item());
//             queue.shift();
//         }
//     }
// }, 700)

// // Задаем граф
// var graph = Viva.Graph.graph();

// // Добавляем вершины
// graph.addNode('s');
// graph.addNode('a');
// graph.addNode('b');
// graph.addNode('c');
// graph.addNode('d');
// graph.addNode('t');
// graph.addNode('l');

// // Добавляем ребра
// graph.addLink('s', 'a', 31);
// graph.addLink('s', 'b', 21);
// graph.addLink('a', 'c', 31);
// graph.addLink('b', 'c', 21);
// graph.addLink('b', 'd', 31);
// graph.addLink('c', 't', 41);
// graph.addLink('d', 't', 21);

// // Запускаем алгоритм KCM
// var maxFlow = kcm(graph, 's', 't');

// // Выводим результат
// console.log('Максимальный поток:', maxFlow);

// // Функция для реализации алгоритма KCM
// function kcm(graph, source, sink) {
//   var flow = 0;
//   var path = findAugmentingPath(graph, source, sink);

//   while (path.length > 0) {
//     var bottleneck = Infinity;

//     // Находим узкое место в пути
//     for (var i = 0; i < path.length - 1; i++) {
//       var from = path[i];
//       var to = path[i + 1];
//       var link = graph.getLink(from, to);

//       if (link.data < bottleneck) {
//         bottleneck = link.data;
//       }
//     }

//     // Увеличиваем поток вдоль пути
//     for (var i = 0; i < path.length - 1; i++) {
//       var from = path[i];
//       var to = path[i + 1];
//       var link = graph.getLink(from, to);

//       link.data -= bottleneck;

//       if (graph.hasLink(to, from)) {
//         graph.getLink(to, from).data += bottleneck;
//       } else {
//         graph.addLink(to, from, bottleneck);
//       }
//     }

//     flow += bottleneck;
//     path = findAugmentingPath(graph, source, sink);
//   }

//   return flow;
// }

// // Функция для поиска увеличивающего пути
// function findAugmentingPath(graph, source, sink) {
//     var queue = [source];
//     var visited = {};
  
//     while (queue.length > 0) {
//       var node = queue.shift();
  
//       if (visited[node]) {
//         continue;
//       }
  
//       visited[node] = true;
  
//       if (node === sink) {
//         return reconstructPath(graph, source, sink, visited);
//       }
  
//       graph.forEachLinkedNode(node, function(to) {
//         if (visited[to]) {
//           return;
//         }
        
//         if (graph.hasLink(node, to) && graph.getLink(node, to).data > 0) {
//           queue.push(to);
//         } else if (graph.hasLink(to, node) && graph.getLink(to, node).data < 0) {
//           queue.push(to);
//         }
//       });
//     }
  
//     return [];
// }

// // Функция для восстановления пути
// function reconstructPath(graph, source, sink, visited) {
//   var path = [sink];
//   var node = sink;

//   while (node !== source) {
//     graph.forEachLinkedNode(node, function(to) {
//       var link = graph.getLink(node, to);

//       if (link && link.data < 0 && visited[to]) {
//         path.unshift(to);
//         node = to;
//       }
//     });
//   }

//   path.unshift(source);

//   return path;
// }

// // Создаем контейнер для графа
// var container = document.querySelector('.graph-container');

// // Создаем граф на основе контейнера
// var graphics = Viva.Graph.View.svgGraphics();
// var renderer = Viva.Graph.View.renderer(graph, {
//   graphics: graphics,
//   container: container
// });

// // Настраиваем отображение вершин
// graphics.node(function(node) {
//   return Viva.Graph.svg('circle')
//     .attr('r', 10)
//     .attr('fill', '#999');
// });

// // Настраиваем отображение ребер
// graphics.link(function(link) {
//   return Viva.Graph.svg('line')
//     .attr('stroke', '#333')
//     .attr('stroke-width', link.data);
// });

// // Запускаем рендерер
// renderer.run();


const createRundomData = (n) => {
    const data = [
        [{ v: 1, w: 2 }, { v: 2, w: 3 }, { v: 3, w: 1 }],
        [{ v: 0, w: 2 }, { v: 2, w: 4 }, { v: 4, w: 5 }],
        [{ v: 0, w: 3 }, { v: 1, w: 4 }, { v: 3, w: 6 }, { v: 4, w: 7 }],
        [{ v: 0, w: 1 }, { v: 2, w: 6 }, { v: 4, w: 8 }],
        [{ v: 1, w: 5 }, { v: 2, w: 7 }, { v: 3, w: 8 }],
    ];
    return data;
}

function generateRandomIncidenceMatrix(numNodes, numEdges) {
    let a = 0,b = 0,c = 0;
    var matrix = [];
    var usedWeights = {}; // объект для хранения использованных весов
    for (var i = 0; i < numNodes; i++) {
        var nodeEdges = [];
        while (nodeEdges.length < numEdges) { // замена вложенного цикла
            var node = Math.floor(Math.random() * numNodes);
            
            while ((node === i) || (nodeEdges.find(x => x.v == node))) {
                node = Math.floor(Math.random() * numNodes);
                if (a++ > 100) {
                    console.log('a');
                    return false;
                }
                
            }
            var weight = Math.floor(Math.random() * 10) + 1;
            while (usedWeights[i] && usedWeights[i][weight] || usedWeights[node] && usedWeights[node][weight]) {
                weight = Math.floor(Math.random() * 10) + 1;
                if (b++ > 100) {
                    console.log('b');
                    return false;
                }
            }
            if (!usedWeights[i]) {
                usedWeights[i] = {};
            }
            usedWeights[i][weight] = true;
            if (!usedWeights[node]) {
                usedWeights[node] = {};
            }
            usedWeights[node][weight] = true;
            var edge = { v: node, w: weight };
            nodeEdges.push(edge);
        }
        matrix.push(nodeEdges);
    }
    return matrix;
}


// РАБОТАЕТ


function kcm(graph) {
    const n = graph.length; // количество вершин
    const m = graph[0].length; // количество ребер
  
    const tree = []; // массив ребер остовного дерева
    const visited = new Array(n).fill(false); // массив посещенных вершин
  
    // начинаем с произвольной вершины
    visited[0] = true;
  
    // ищем минимальное ребро, соединяющее посещенную и непосещенную вершины
    while (tree.length < n - 1) {
      let minWeight = Infinity;
      let minRow = -1;
      let minCol = -1;
  
      for (let i = 0; i < n; i++) {
        if (visited[i]) {
          for (let j = 0; j < m; j++) {
            if (!visited[graph[i][j].v] && graph[i][j].w < minWeight) {
              minWeight = graph[i][j].w;
              minRow = i;
              minCol = j;
            }
          }
        }
      }
  
      // добавляем ребро в дерево и отмечаем вершину как посещенную
      tree.push(graph[minRow][minCol]);
      visited[graph[minRow][minCol].v] = true;
    }
  
    return tree;
}

const drawGraph = (data) => {
    let graph = Viva.Graph.graph();
    data.forEach((item, i) => {
        graph.addNode(i);
    })
    
    data.forEach((item, i) => {
        item.forEach(subitem => {
            graph.addLink(i, subitem.v, {weight: subitem.w});
        })
    })
    
    var graphics = Viva.Graph.View.svgGraphics();
    
    graphics.link(function(link){
        ui = Viva.Graph.svg('line')
            .attr('stroke', 'red')
            .attr('stroke-width', 1 + +link.data.weight * .1)
            .attr('fill', 'red')
            .attr('data-from-id', link.fromId)
            .attr('data-to-id', link.toId)
            .attr('id', `l-${link.fromId}-${link.toId}`);
        return ui;
    })

    graphics.node(function(node){
        const ui = Viva.Graph.svg('g')
            .attr('id', `n-${node.id}`),
            svgText = Viva.Graph.svg('text')
            .attr('y', '-4px')
            .attr('x', '0px')
            .attr('fill', 'red'),
            svgRect = Viva.Graph.svg('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#00d635');

        ui.append(svgText)
        ui.append(svgRect)
        return ui;
    })
    .placeNode(function(nodeUI, pos) {
        nodeUI.attr('transform', `translate(${pos.x - 10 / 4}, ${pos.y - 10 / 2})`);
    });
    
    var layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength : 200,
        springCoeff : 0.0001,
        dragCoeff : 0.12,
        gravity : -11.1
    });
    
    var renderer = Viva.Graph.View.renderer(graph, {
        graphics: graphics,
        layout: layout,
        prerender: 300,
        container: document.querySelector('.graph-container')
    });
    renderer.run();
    
    // Zoom to fit hack
    const graphRect = layout.getGraphRect();
    const graphSize = Math.min(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1) + 500;
    const screenSize = Math.min(document.body.clientWidth, document.body.clientHeight);
    
    const desiredScale = screenSize / graphSize;
    zoomOut(desiredScale, 1);
    
    function zoomOut(desiredScale, currentScale) {
        if (desiredScale < currentScale) {
            currentScale = renderer.zoomOut();
            setTimeout(function () {
                zoomOut(desiredScale, currentScale);
            }, 16);
        }
    }
}

let data = false;
while (data == false) {
    data = generateRandomIncidenceMatrix(10,3);
}
drawGraph(data);

const showLeader = (tree) => {
    tree.forEach(i => {
      document.querySelector(`.graph-container svg g line[data-to-id="${i.v}"][stroke-width="${1 + i.w * .1}"]`).setAttribute('stroke', 'blue');
    })

    const candidates = [];
    for (let i = 0; i < data.length; i++) {
        const lines = document.querySelectorAll(`.graph-container svg g line[data-to-id="${i}"][stroke="blue"], .graph-container svg g line[data-from-id="${i}"][stroke="blue"]`);
        let sumWeights = 0;
        lines.forEach(line => {
            sumWeights += Math.round(((+line.getAttribute('stroke-width')) - 1) * 10);
        })
        candidates.push({id: i, count: lines.length, sum: sumWeights})
    }
    let leader = candidates[0];
    candidates.forEach((candidate, i) => {
        if (i != 0) {
            if ((leader.count < candidate.count) || ((leader.count == candidate.count) && (leader.sum < candidate.sum))) {
                leader = candidate;
            }
        }
    })
    setTimeout(() => {
        let $leaderNode = document.querySelector(`.graph-container svg g > g#n-${leader.id}`);
        $leaderNode.querySelector('rect').setAttribute('fill', '#fff')
        $leaderNode.querySelector('rect').setAttribute('width', '15')
        $leaderNode.querySelector('rect').setAttribute('height', '15')
        $leaderNode.querySelector('text').textContent = 'LEADER';
    }, 500)
}

const hideLeader = () => {
    document.querySelectorAll(`.graph-container svg g line[stroke="blue"]`).forEach($line => {$line.setAttribute('stroke', 'red')});
    let $leaderNode = document.querySelector(`.graph-container svg g > g rect[fill="#fff"]`).parentElement;
    $leaderNode.querySelector('rect').setAttribute('fill', '#00d635')
    $leaderNode.querySelector('rect').setAttribute('width', '10')
    $leaderNode.querySelector('rect').setAttribute('height', '10')
    $leaderNode.querySelector('text').textContent = '';
}

// DOM

document.querySelector('#buttonCreateRandomGraph').addEventListener('click', () => {
    document.querySelector(`.graph-container svg`).remove();
    data = false;
    while (data == false) {
        data = generateRandomIncidenceMatrix(10,3);
    }
    drawGraph(data);
})

document.querySelector('#buttonFindLeader').addEventListener('click', () => {
    const tree = kcm(data);
    showLeader(tree)

    setTimeout(() => {
        hideLeader()
    }, 4000)
})

