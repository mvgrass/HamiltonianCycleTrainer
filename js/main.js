var verticesButton = document.getElementById("num-verts");
var randomGraphButton = document.getElementById("randomGraph");
var stackButton = document.getElementById("stackButton");

var numInput = document.getElementById("input-verts");
var graphSVG = document.getElementById("graphSVG");

var stackDiv = document.getElementById("stack");
var vertsDiv = document.getElementById("vertsDiv");

var radioTrainer = document.getElementById("radioTrainer");
var radioControl = document.getElementById("radioControl");

var startButton = document.getElementById("startButton");

var stackSizeSpan = document.getElementById("stack-size");
var stackMaxSizeSpan = document.getElementById("stack-max");
var currentVertSpan = document.getElementById("current-vert");

var vertices;

var randomVertices = 8;//Количество вершин в режиме контроля

var percents = 20;//Отвечает за степень полноты генерируемого графа

var graph;

randomGraphButton.addEventListener("click", createRandomGraph);

//Обработка нажатия кнопки старт, очищение соответсвующих полей
startButton.addEventListener("click", function () {
    if(radioControl.checked){
        numInput.value = null;
        graphSVG.innerHTML = "";
        vertsDiv.innerHTML = "";
        stackDiv.innerHTML = "";

        document.getElementById("adj-matrix").innerHTML="";
        document.getElementById("adj-list").innerHTML="";
    }else{
        graphSVG.innerHTML = "";
        vertsDiv.innerHTML = "";
        stackDiv.innerHTML = "";
    }

    stackButton.disabled = false;
    startButton.disabled = true;
    currentVertSpan.textContent = "-";

    start();

});


//Очищение полей при смене режима на тренировку
radioTrainer.addEventListener("click", function () {
    verticesButton.disabled = false;
    randomGraphButton.disabled = true;
    startButton.disabled = true;
    stackButton.disabled = true;

    numInput.value = null;
    graphSVG.innerHTML = "";
    vertsDiv.innerHTML = "";
    stackDiv.innerHTML = "";

    stackSizeSpan.textContent = "-";
    stackMaxSizeSpan.textContent = "-";
    currentVertSpan.textContent = "-";

    document.getElementById("adj-matrix").innerHTML="";
    document.getElementById("adj-list").innerHTML="";
});

//Очищение полей при смене режима на контроль
radioControl.addEventListener("click",function () {
    verticesButton.disabled = true;
    randomGraphButton.disabled = true;
    startButton.disabled = false;
    stackButton.disabled = true;

    numInput.value = null;
    graphSVG.innerHTML = "";
    vertsDiv.innerHTML = "";
    stackDiv.innerHTML = "";

    stackSizeSpan.textContent = "-";
    stackMaxSizeSpan.textContent = "-";
    currentVertSpan.textContent = "-";

    document.getElementById("adj-matrix").innerHTML="";
    document.getElementById("adj-list").innerHTML="";
});

stackButton.addEventListener("click", stackPop);

//Инициализация полей для матрицы смежности и списка смежности
verticesButton.addEventListener("click", function (event) {
    if(numInput.value>0) {

        initializeFields();

        document.getElementById("collapseOne").classList.add("show");
        document.getElementById("collapseTwo").classList.add("show");

        graphSVG.innerHTML="";

        randomGraphButton.disabled = false;
        startButton.disabled = false;

    }else {
        swal({
            title: "Ошибка",
            text: "Количество вершин должно быть положительным числом",
            type: "error"
        });
        numInput.value = null;
    }

});

//Обработка нажатия на чекбокс в матрице смежности
function checkBoxClicked (event) {
    var pairElement = document.getElementById(event.target.j+"-"+event.target.i);
    pairElement.checked = event.target.checked;

    if(event.target.checked){
        var newButtonI = document.createElement("button");
        newButtonI.classList.add("btn");
        newButtonI.classList.add("btn-sm");
        newButtonI.classList.add("links");
        newButtonI.textContent = event.target.j;
        newButtonI.id = "btn-"+event.target.i+"-"+event.target.j;
        newButtonI.i = event.target.i;
        newButtonI.j = event.target.j;
        newButtonI.addEventListener("click", ButtonDelClicked);

        document.getElementById("adj-list").insertBefore(newButtonI, document.getElementById("line"+event.target.i));

        if(event.target.i!=event.target.j) {
            var newButtonJ = document.createElement("button");
            newButtonJ.classList.add("btn");
            newButtonJ.classList.add("btn-sm");
            newButtonJ.classList.add("links");
            newButtonJ.textContent = event.target.i;
            newButtonJ.id = "btn-" + event.target.j + "-" + event.target.i;
            newButtonJ.i = event.target.j;
            newButtonJ.j = event.target.i;
            newButtonJ.addEventListener("click", ButtonDelClicked);
            document.getElementById("adj-list").insertBefore(newButtonJ, document.getElementById("line" + event.target.j));
        }

    }else{
        document.getElementById("btn-"+event.target.i+"-"+event.target.j).remove();
        if(event.target.i!=event.target.j)
            document.getElementById("btn-"+event.target.j+"-"+event.target.i).remove();
    }
}


//Обработка добавления вершины в список смежности
function ButtonAddClicked(event) {

    var inputLine = document.getElementById("line"+event.target.row);

    if(+inputLine.value<=+vertices&&+inputLine.value>0){
        if(document.getElementById("btn-"+event.target.row+"-"+inputLine.value)===null){

            var newButtonI = document.createElement("button");
            newButtonI.classList.add("btn");
            newButtonI.classList.add("btn-sm");
            newButtonI.classList.add("links");
            newButtonI.textContent = inputLine.value;
            newButtonI.id = "btn-"+event.target.row+"-"+inputLine.value;
            newButtonI.i = event.target.row;
            newButtonI.j = inputLine.value;
            newButtonI.addEventListener("click", ButtonDelClicked);
            document.getElementById("adj-list").insertBefore(newButtonI, document.getElementById("line"+event.target.row));
            var checkBox_i_j = document.getElementById(event.target.row+"-"+inputLine.value);
            checkBox_i_j.checked = true;

            if(event.target.row!=inputLine.value) {
                var newButtonJ = document.createElement("button");
                newButtonJ.classList.add("btn");
                newButtonJ.classList.add("btn-sm");
                newButtonJ.classList.add("links");
                newButtonJ.textContent = event.target.row;
                newButtonJ.id = "btn-" + inputLine.value + "-" + event.target.row;
                newButtonJ.i = inputLine.value;
                newButtonJ.j = event.target.row;
                newButtonJ.addEventListener("click", ButtonDelClicked);

                document.getElementById("adj-list").insertBefore(newButtonJ, document.getElementById("line" + inputLine.value));


                var checkBox_j_i = document.getElementById(inputLine.value + "-" + event.target.row);
                checkBox_j_i.checked = true;
            }

        }
    } else{
        swal({
            title:"Ошибка",
            text:"Номер вершины должен быть положительным и не превышать: "+vertices,
            type: "error"
        });
    }


    inputLine.value = null;
}

//Обработка удаления вершины из списка смежности
function ButtonDelClicked(event) {
    var checkBox_i_j = document.getElementById(event.target.i+"-"+event.target.j);
    var checkBox_j_i = document.getElementById(event.target.j+"-"+event.target.i);

    checkBox_i_j.checked = false;
    checkBox_j_i.checked = false;

    document.getElementById("btn-"+event.target.j+"-"+event.target.i).remove();
    event.target.remove();
}


//Функция отвечающая за создание визуализации графа при помощи библиотеки d3.js
function createGraph() {

    graphSVG.innerHTML="";

    var width = 380;
    var height = 380;

    var links = [];
    var nodes = [];

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    for(var iter = 0; iter<vertices; iter++)
        nodes.push({index: iter});


    var temp = document.getElementsByClassName("links");
    for(iter = 0; iter<temp.length ; iter++)
        links.push({source: temp[iter].i - 1, target: temp[iter].j - 1});

    var force = d3.layout.force()
        .size([height, width])
        .nodes(nodes)
        .charge(-600)
        .links(links)
        .linkStrength(0.0);

    var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr("id", function (d) {return ("link-"+(+d.source+1)+"-"+(+d.target+1))});

    var node = svg.selectAll('.node')
        .data(nodes)
        .enter().append("g").append('circle')
        .attr('class', 'node')
        .attr("r", width/80)
        .attr("id", function (d) {return ("circle-"+(+d.index+1))});

    force.on("tick", function () {
        node.attr("cx", function (d) { return d.x;})
            .attr("cy", function (d) { return d.y;});

        link.attr("x1", function (d) { return d.source.x;})
            .attr("x2", function (d) { return d.target.x;})
            .attr("y1", function (d) { return d.source.y;})
            .attr("y2", function (d) { return d.target.y;});

    });

    force.start();
}


//Функция создания случайного графа
function createRandomGraph() {

    initializeFields();

    //Генерация перестоновки, обеспечивающая наличие гамильтонова графа
    var permutation = [];
    for(var i = 0; i<vertices;i++)
        permutation.push(i+1);

    shuffle(permutation);

    var checkBox;
    var changeEvent = new Event("change");

    for(i = 0;i<vertices;i++){
        checkBox = document.getElementById(permutation[i]+"-"+permutation[(i+1)%vertices]);
        checkBox.checked = true;
        checkBox.dispatchEvent(changeEvent);
    }

    for(i = 1; i<=vertices; i++)
        for(var j = 1; j<i;j++){
            if(Math.random()*100<30){
                checkBox = document.getElementById(i+"-"+j);
                if(!checkBox.checked) {
                    checkBox.checked = true;
                    checkBox.dispatchEvent(changeEvent);
                }
            }
        }

}

function shuffle(mas) {
    mas.sort(function (a, b) { return Math.random() - 0.5; })
}


//Добавление на страницу полей для матрицы и списка смежности
function initializeFields() {
    var divAdjMatrix = document.getElementById("adj-matrix");

    vertices = numInput.value;

    divAdjMatrix.innerHTML = "";

    var table = document.createElement("table");

    divAdjMatrix.appendChild(table);

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var td;

    table.appendChild(tr);
    table.appendChild(th);
    for (var i = 1; i <= vertices; i++) {
        th = document.createElement("th");
        th.textContent = i;
        th.classList.add("text-center");
        table.appendChild(th);
    }

    for (i = 1; i <= vertices; i++) {
        tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.textContent = i;
        td.classList.add("font-weight-bold");
        table.appendChild(td)
        for (var j = 1; j <= vertices; j++) {
            var checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.id = i + "-" + j;
            checkBox.i = i;
            checkBox.j = j;

            checkBox.addEventListener("change", checkBoxClicked);

            td = document.createElement("td");
            td.appendChild(checkBox);
            table.appendChild(td)

        }

    }


    var divAdjList = document.getElementById("adj-list");

    divAdjList.innerHTML = "";

    for (i = 1; i <= numInput.value; i++) {
        var inputLine = document.createElement("input");
        inputLine.type = "number";
        inputLine.id = "line" + i;
        inputLine.style = "width: 50px";

        var label = document.createElement("label");
        label.textContent = i + ": ";
        label.for = inputLine.id;

        var buttonAdd = document.createElement("button");
        buttonAdd.classList.add("btn");
        buttonAdd.classList.add("btn-primary");
        buttonAdd.classList.add("btn-sm");
        buttonAdd.textContent = "+";
        buttonAdd.addEventListener("click", ButtonAddClicked);
        buttonAdd.row = i;

        divAdjList.appendChild(label);
        divAdjList.appendChild(inputLine);
        divAdjList.appendChild(buttonAdd);
        divAdjList.appendChild(document.createElement("br"));
    }
}

function start() {

    if(radioControl.checked) {
        numInput.value = randomVertices;
        createRandomGraph();
        document.getElementById("collapseTwo").classList.add("show");
    }

    createGraph();

    var list = [];
    for(var i = 0; i<=vertices; i++)
        list.push([]);


    var checkBox;

    for(i = 1; i<=vertices; i++){
        document.getElementById("line"+i).disabled = true;
        for(var j = 1; j<=i; j++) {
            checkBox = document.getElementById(i + "-" + j);
            if(radioControl.checked) {
                checkBox.disabled = true;
                document.getElementById(j + "-" + i).disabled = true;
            }
            if (checkBox.checked ) {
                if(radioControl.checked) {
                    document.getElementById("btn-" + i + "-" + j).disabled = true;
                    document.getElementById("btn-" + j + "-" + i).disabled = true;
                }

                list[i].push(j);

                if(i!=j)
                    list[j].push(i);
            }
        }
    }

    graph = new Graph(vertices, list);

    var possibleVerts = graph.getPossibleVerts();

    for(i = 0; i<possibleVerts.length; i++){
        var button = document.createElement("button");
        button.classList.add("btn");

        button.vertNum = possibleVerts[i].value;
        button.textContent = possibleVerts[i].value;
        button.addEventListener("click", nextStep);

        vertsDiv.appendChild(button);
    }

    stackMaxSizeSpan.textContent = vertices;
    stackSizeSpan.textContent = "0";
}


//Обработка хода работы алгоритма при добавлении новой вершины в частичное решение
function nextStep(event) {
    try{
        if(graph.nextStep(event.target.textContent)){
            var possibleVerts = graph.getPossibleVerts();

            vertsDiv.innerHTML = "";

            for(i = 0; i<possibleVerts.length; i++){
                var button = document.createElement("button");
                button.classList.add("btn");

                button.vertNum = possibleVerts[i].value;
                button.textContent = possibleVerts[i].value;
                button.addEventListener("click", nextStep);

                vertsDiv.appendChild(button);
            }

            colorVert(event.target.textContent);
            colorLink(event.target.textContent);

            stackSizeSpan.textContent++;
            currentVertSpan.textContent = event.target.textContent;

            var div = document.createElement("div");
            div.textContent = event.target.textContent;

            stackDiv.appendChild(div);
        }else{
            colorLink(event.target.textContent);
            var hamCycle = "";
            stackDiv.childNodes.forEach(function (node) { hamCycle+=node.textContent+" - " });
            hamCycle+= stackDiv.firstChild.textContent;
            swal({
                title:"Победа! "+((radioControl.checked)?"Контроль пройден":"Тренировка пройдена"),
                text:"Гамильтонов цикл построен: "+hamCycle,
                type: (radioControl.checked)?"success":"info"
            });
            stackButton.disabled = true;
            startButton.disabled = false;
            vertsDiv.innerHTML = "";
        }

    }catch(error){
        swal({
            title: (radioControl.checked)?"Ошибка":"Внимание",
            text: error.message + error.vert,
            type: (radioControl.checked)?"error":"warning"
        });
        if(radioControl.checked) {
            stackButton.disabled = true;
            startButton.disabled = false;
            vertsDiv.innerHTML = "";
        }
    }

}


//Покраска вершины в поле "Граф"
function colorVert(number) {
    document.getElementById("circle-"+number).classList.add("chosenCircle");
}

//Покараска ребра в поле "Граф"
function colorLink(number) {
    if(stackDiv.lastChild!=null){
        document.getElementById("link-"+number+"-"+stackDiv.lastChild.textContent)
            .classList.add("chosenLink");
        document.getElementById("link-"+stackDiv.lastChild.textContent+"-"+number)
            .classList.add("chosenLink");
    }
}


//Обработка хода работы алгоритма при снятии вершины со стека
function stackPop() {
    try {
        if(graph.stackPop()) {
            uncolorLink(stackDiv.lastChild.textContent);
            uncolorVert(stackDiv.lastChild.textContent);
            stackDiv.removeChild(stackDiv.lastChild);

            currentVertSpan.textContent = stackDiv.lastChild.textContent;

            var possibleVerts = graph.getPossibleVerts();

            vertsDiv.innerHTML = "";

            for (i = 0; i < possibleVerts.length; i++) {
                var button = document.createElement("button");
                button.classList.add("btn");

                button.vertNum = possibleVerts[i].value;
                button.textContent = possibleVerts[i].value;
                button.addEventListener("click", nextStep);
                if(possibleVerts[i].visited)
                    button.classList.add("btn-warning");

                vertsDiv.appendChild(button);
            }
        }else{
            uncolorVert(stackDiv.lastChild.textContent);
            stackDiv.removeChild(stackDiv.lastChild);
            swal({
                title:"Победа! "+((radioControl.checked)?"Контроль пройден":"Тренировка пройдена"),
                text:"Гамильтонова цикла нет",
                type:(radioControl.checked)?"success":"info"
            });
            stackButton.disabled = true;
            startButton.disabled = false;
            vertsDiv.innerHTML = "";
        }

        stackSizeSpan.textContent--;

    }catch (error){
        swal({
            title:(radioControl.checked)?"Ошибка":"Внимание",
            text:error.message,
            type:(radioControl.checked)?"error":"warning"
        });
        if(radioControl.checked) {
            stackButton.disabled = true;
            startButton.disabled = false;
            vertsDiv.innerHTML = "";
        }
    }
}

//Отмена покраски вершины
function uncolorVert(number) {
    document.getElementById("circle-"+number).classList.remove("chosenCircle");
}


//Отмена покраски ребра
function uncolorLink(number) {
    document.getElementById("link-"+number+"-"+stackDiv.lastChild.previousSibling.textContent)
        .classList.remove("chosenLink");

    document.getElementById("link-"+stackDiv.lastChild.previousSibling.textContent+"-"+number)
        .classList.remove("chosenLink");
}

graphSVG.addEventListener("wheel", function (event) {
    alert("something");
})
