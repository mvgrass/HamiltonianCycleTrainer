function GraphException(message, vert) {
    this.message = message;

    this.vert = vert;
}

function Graph(vertices, list) {
    this.vertices = vertices; //Количество вершин в графе
    this.adjList = list;//Список смежности графа

    this.stack = [];//Стек вершин
    this.used = [];//Массив отметок посещенияя вершины
    
    this.currentVert = 0;//Номер текущей вершины

    this.used.push(0);
    this.possibleVerts = [];//Список вершин, в которые можно выйти из текущей вершины на данном шаге
    for(var i = 1;i<=this.vertices; i++) {
        this.possibleVerts.push({"value":i, "visited":0});
        this.used.push(0);
    }

    this.visited = [];//Двумерный массив, хранящий уже посещенные вершины, при помощи которых уже
                      //уже пытались дополнить частичное решение
    this.visited.push([]);
    for(i = 1;i<=this.vertices; i++) {
        this.visited.push([]);
    }

    //Обработка добавления новой вершины
    //возвращает 1 в случае успеха и 0 в случае завершения алгоритма
    //при ошибке выбрасывается исключение GraphException
    this.nextStep = function (nextVert) {
        if(!this.used[nextVert]) {
            this.stack.push(nextVert);
            this.used[nextVert] = 1;
            this.visited[this.currentVert].push(nextVert);

            this.possibleVerts = [];

            for(i = 0;i<this.adjList[nextVert].length;i++) {
                this.possibleVerts.push({"value":this.adjList[nextVert][i],
                    "visited":(this.visited[this.currentVert].indexOf(""+this.adjList[nextVert][i])!=-1)});
            }

            this.currentVert = nextVert;

            return 1;
        }else if(this.stack.length == this.vertices && this.stack[0] == nextVert)
            return 0;
        else
            throw new GraphException("Повторное посещение вершины ", nextVert);
    };


    //Обработка снятия вершины со стека
    //возвращает 1 в случае успеха и 0 в случае завершения алгоритма
    //при ошибке выбрасывается исключение GraphException
    this.stackPop = function () {
        for(i = 0;i< this.adjList[this.currentVert].length; i++){
            if(!this.used[this.adjList[this.currentVert][i]]
                &&this.visited[this.currentVert].indexOf(""+this.adjList[this.currentVert][i])==-1)
                throw new GraphException("Вы пытаетесь снять вершину со стека," +
                    " не пройдя всех ее подпутей ", this.currentVert);
        }

        if(this.stack.length == +this.vertices
            &&this.adjList[this.currentVert].indexOf(+this.stack[0])!=-1)
            throw new GraphException("Вы пытаетесь снять вершину со стека, " +
                "хотя должны были замкнуть гамильтонов цикл ", this.currentVert);


        if(this.stack.length != 0){
            if(this.stack.length !=1) {

                this.used[this.currentVert] = 0;
                this.visited[this.currentVert] = [];
                this.stack.pop();

                this.currentVert = this.stack[this.stack.length - 1];

                this.possibleVerts = [];

                for (i = 0; i < this.adjList[this.currentVert].length; i++) {
                    this.possibleVerts.push({
                        "value": this.adjList[this.currentVert][i],
                        "visited": (this.visited[this.currentVert].indexOf("" + this.adjList[this.currentVert][i]) != -1)
                    });
                }

                return 1;

            }
            else
                return 0;
        }else
            throw new GraphException("Стек пуст", 0);
    };

    this.getPossibleVerts = function () {return this.possibleVerts;};


}