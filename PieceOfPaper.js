//Из прямоугольного листа клетчатой бумаги (M строк, N столбцов) удалили некоторые клетки. На сколько кусков распадётся оставшаяся часть листа? Две клетки не распадаются, если они имеют общую сторону.

// Входные данные
// В первой строке находятся числа M и N, в следующих M строках - по N символов. Если клетка не была вырезана, этому соответствует знак #, если вырезана - точка. 1 <= M, N <= 100.

// Выходные данные
// Вывести одно число.

// Примеры

// входные данные
// 5 10
// ##..#####.
// .#.#.#....
// ###..##.#.
// ..##.....#
// .###.#####

// выходные данные
// 5
//Входные данные для удобства преобразованы в двумерный массив, где #-это 1, точка - 0
const pieceOfPaper = [
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1]
];

//Находит все вершины, их координаты и нумерует, начиная с 1
const defineVertexes = (matrix) => {
    let counter = 1
    const vertexes = {}
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j]) {
                matrix[i][j] = counter
                vertexes[counter++] = [i, j]
            }
        }
    }
    return vertexes;
};
//По сути, каждый отдельный кусочек листа будет являться графом
//В результате массив graph будет заполнен списками смежностей отдельных графов
const graphs = [];
const findAllGraphs = (matrix) => {
    //Очередь вершин, которые предстоит посетить
    let queue = [];
    //Посещенные вершины
    const visited = [];
    //Список смежности текущего графа {vertex:[vertexes]}
    let list = {};
    const allVertexes = defineVertexes(matrix);

    const findNeighbors = ([i, j]) => {
        const neighbors = []
        if (i - 1 >= 0 && matrix[i - 1][j]) neighbors.push(matrix[i - 1][j])
        if (i + 1 < matrix.length && matrix[i + 1][j]) neighbors.push(matrix[i + 1][j])
        if (j - 1 >= 0 && matrix[i][j - 1]) neighbors.push(matrix[i][j - 1])
        if (j + 1 < matrix[0].length && matrix[i][j + 1]) neighbors.push(matrix[i][j + 1])
        return neighbors
    }
    Object.keys(allVertexes).forEach((key) => {
        if (!visited[key]) {
            queue.push(key);
            visited[key] = key;
            //Ищем соседей и делаем их обход в ширину
            while (queue.length) {
                const currentVertex = queue.shift();
                visited[currentVertex] = currentVertex
                const neighbors = findNeighbors(allVertexes[currentVertex]);
                list[currentVertex] = neighbors;
                neighbors.forEach((vertex) => {
                    if (!visited[vertex]) queue.push(vertex);
                })
            }
            graphs.push(list)
            list = {}
        }
    });
}
findAllGraphs(pieceOfPaper)
console.log(graphs.length)
//Эту задачу можно решить другим способом. Если представить входные данные в виде единого графа 
//и посчитать количество компонент связности в нем. Но для этого потребуется сначала составить 
//список или матрицу смежностей, имрортировать или написать класс Graph с методом обхода, что
//значительно увеличит объем кода.

