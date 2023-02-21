class Graph {
  constructor() {
    this.vertices = {} // список смежности графа
  }

  addVertex(value) {
    if (!this.vertices[value]) {
      this.vertices[value] = []
    }
  }

  addEdge(vertex1, vertex2) {
    if (!(vertex1 in this.vertices) || !(vertex2 in this.vertices)) {
      throw new Error("В графе нет таких вершин")
    }

    if (!this.vertices[vertex1].includes(vertex2)) {
      this.vertices[vertex1].push(vertex2)
    }
    if (!this.vertices[vertex2].includes(vertex1)) {
      this.vertices[vertex2].push(vertex1)
    }
  }
  dfs(startVertex, callback) {
    let list = this.vertices // список смежности
    let stack = [startVertex] // стек вершин для перебора
    let visited = { [startVertex]: 1 } // посещенные вершины

    function handleVertex(vertex) {
      // вызываем коллбэк для посещенной вершины
      callback(vertex)

      // получаем список смежных вершин
      let reversedNeighboursList = [...list[vertex]].reverse()

      reversedNeighboursList.forEach((neighbour) => {
        if (!visited[neighbour]) {
          // отмечаем вершину как посещенную
          visited[neighbour] = 1
          // добавляем в стек
          stack.push(neighbour)
        }
      })
    }

    // перебираем вершины из стека, пока он не опустеет
    while (stack.length) {
      let activeVertex = stack.pop()
      handleVertex(activeVertex)
    }

    // проверка на изолированные фрагменты
    stack = Object.keys(this.vertices)

    while (stack.length) {
      let activeVertex = stack.pop()
      if (!visited[activeVertex]) {
        visited[activeVertex] = 1
        handleVertex(activeVertex)
      }
    }
  }
  bfs(startVertex, callback) {
    let list = this.vertices // список смежности
    let queue = [startVertex] // очередь вершин для перебора
    let visited = { [startVertex]: 1 } // посещенные вершины

    function handleVertex(vertex) {
      // вызываем коллбэк для посещенной вершины
      callback(vertex)

      // получаем список смежных вершин
      let neighboursList = list[vertex]

      neighboursList.forEach((neighbour) => {
        if (!visited[neighbour]) {
          visited[neighbour] = 1
          queue.push(neighbour)
        }
      })
    }

    // перебираем вершины из очереди, пока она не опустеет
    while (queue.length) {
      let activeVertex = queue.shift()
      handleVertex(activeVertex)
    }

    queue = Object.keys(this.vertices)

    // Повторяем цикл для незатронутых вершин
    while (queue.length) {
      let activeVertex = queue.shift()
      if (!visited[activeVertex]) {
        visited[activeVertex] = 1
        handleVertex(activeVertex)
      }
    }
  }
  bfs2(startVertex) {
    let list = this.vertices
    let queue = [startVertex]
    let visited = { [startVertex]: 1 }

    // кратчайшее расстояние от стартовой вершины
    let distance = { [startVertex]: 0 }
    // предыдущая вершина в цепочке
    let previous = { [startVertex]: null }

    function handleVertex(vertex) {
      let neighboursList = list[vertex]

      neighboursList.forEach((neighbour) => {
        if (!visited[neighbour]) {
          visited[neighbour] = 1
          queue.push(neighbour)
          // сохраняем предыдущую вершину
          previous[neighbour] = vertex
          // сохраняем расстояние
          distance[neighbour] = distance[vertex] + 1
        }
      })
    }

    // перебираем вершины из очереди, пока она не опустеет
    while (queue.length) {
      let activeVertex = queue.shift()
      handleVertex(activeVertex)
    }

    return { distance, previous }
  }
  findShortestPath(startVertex, finishVertex) {
    let result = this.bfs2(startVertex)

    if (!(finishVertex in result.previous))
      throw new Error(
        `Нет пути из вершины ${startVertex} в вершину ${finishVertex}`
      )

    let path = []

    let currentVertex = finishVertex

    while (currentVertex !== startVertex) {
      path.unshift(currentVertex)
      currentVertex = result.previous[currentVertex]
    }

    path.unshift(startVertex)

    return path
  }
}

//Вспомогательная функция
function findNearestVertex(distances, visited) {
  let minDistance = Infinity
  let nearestVertex = null

  Object.keys(distances).forEach((vertex) => {
    if (!visited[vertex] && distances[vertex] < minDistance) {
      minDistance = distances[vertex]
      nearestVertex = vertex
    }
  })

  return nearestVertex
}
//Алгоритм Дейкстры
function dijkstra(graph, startVertex) {
  let visited = {}
  let distances = {} // кратчайшие пути из стартовой вершины
  let previous = {} // предыдущие вершины

  let vertices = Object.keys(graph) // список вершин графа

  // по умолчанию все расстояния неизвестны (бесконечны)
  vertices.forEach((vertex) => {
    distances[vertex] = Infinity
    previous[vertex] = null
  })

  // расстояние до стартовой вершины равно 0
  distances[startVertex] = 0

  function handleVertex(vertex) {
    // расстояние до вершины
    let activeVertexDistance = distances[vertex]

    // смежные вершины (с расстоянием до них)
    let neighbours = graph[activeVertex]

    // для всех смежных вершин пересчитать расстояния
    Object.keys(neighbours).forEach((neighbourVertex) => {
      // известное на данный момент расстояние
      let currentNeighbourDistance = distances[neighbourVertex]
      // вычисленное расстояние
      let newNeighbourDistance =
        activeVertexDistance + neighbours[neighbourVertex]

      if (newNeighbourDistance < currentNeighbourDistance) {
        distances[neighbourVertex] = newNeighbourDistance
        previous[neighbourVertex] = vertex
      }
    })

    // пометить вершину как посещенную
    visited[vertex] = 1
  }

  // ищем самую близкую вершину из необработанных
  let activeVertex = findNearestVertex(distances, visited)

  // продолжаем цикл, пока остаются необработанные вершины
  while (activeVertex) {
    handleVertex(activeVertex)
    activeVertex = findNearestVertex(distances, visited)
  }

  return { distances, previous }
}
