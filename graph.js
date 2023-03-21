let maze;
let selector = "bfs";
let previousAjdacents = {};
let mouseDown = false;
let found = false;
class SquareMaze {
  constructor(width, height) {
    this.width = Number(width);
    this.height = Number(height);
    this.verticesNum = width * height;
    this.vertices = this.createVertices();
  }
  addAdjacent(source, destination) {
    source.setAdjacent(destination);
    destination.setAdjacent(source);
  }
  createVertices() {
    let arr = [];
    //create cells with ids
    var count = 1;
    for (let x = 1; x <= this.height; x++) {
      $(".maze").append(`<tr class="row${x}"></tr>`);
      for (let y = 1; y <= this.width; y++) {
        let cell = new Cell(count);
        arr[count] = cell;
        $(`.row${x}`).append(`<td id="${cell.id}" class = "w"></td>`);
        $(`#${cell.id}`).on("click", function () {
          
            selectAction(selector, cell.id);
  
        });
        $(`#${cell.id}`).on("mouseover", function () {
          if(selector==='wall'&&mouseDown){
            selectAction('wall',cell.id)
          }
        });
        count++;
      }
    }
    return arr;
  }
  addNodes() {
    //*create nodes
    let num = Number(this.width);
    //all cells connect to its cell in front and bottom
    for (let i = 1; i <= this.verticesNum - this.width; i++) {
      if (i % this.width !== 0)
        this.addAdjacent(this.vertices[i], this.vertices[i + 1]);
      this.addAdjacent(this.vertices[i], this.vertices[i + num]);
    }
    for (let i = this.verticesNum - this.width + 1; i < this.verticesNum; i++) {
      this.addAdjacent(this.vertices[i], this.vertices[i + 1]);
    }
  }
  async bfs(from, destination) {
    var visited = {};
    var q = [];
    found = false;
    let count = 0;
    visited[this.vertices[from].id] = true;
    q.unshift(this.vertices[from]);

    let prev = {};
    while (q.length && !found) {
      count++;
      var getQueueElement = q.pop();
      // addProperty(getQueueElement,'v')
      $(`#${getQueueElement.id}`).addClass("v");
      if (count > 5) {
        count = 0;
        await delay(0);
      }
      //$(`#${getQueueElement.id}`).addClass("v");
      var get_List = getQueueElement.getAdjacents();
      for (var i in get_List) {
        var neigh = get_List[i];
        if (!visited[neigh.id]) {
          visited[neigh.id] = true;
          q.unshift(neigh);

          prev[neigh.id] = getQueueElement;
          if (neigh === this.vertices[destination]) {
            found = true;
          }
        }
      }
    }
    if(!found) return
    
    for (let i = this.vertices[destination]; i !== undefined; i = prev[i.id]) {
      $(`#${i.id}`).removeClass("v");
      $(`#${i.id}`).addClass("b");

      await delay(20);
      found = false;
      //   path.push(i);
    }
    /*path.reverse();
    if (path[0] == from) return path;
    */
  }
  dfs(from, to) {
    var visited = {};
    found = false;
    this.DFSUtil(from, visited, to);
    found = false;
  }

  async DFSUtil(vertex, visited, to) {

    visited[this.vertices[vertex].id] = true;
    if(found) return
    // $(`#${this.vertices[vertex].id}`).addClass("v");
    // await delay(100);

    var get_neighbours = this.vertices[vertex].getAdjacents();
    let num = get_neighbours.length;
    let count = 0;
    let val = Math.floor(Math.random() * num);
    while (count !== num && !found) {
      var get_elem = get_neighbours[val];

      $(`#${get_elem.id}`).addClass("v");
      await delay(0);
      if (get_elem.id === to){
        found = true;
      }
        
      if (!visited[get_elem.id]) {
        await this.DFSUtil(get_elem.id, visited, to);
      }
      val++;
      count++;
      val = val % num;
    }
  }
  async createMaze() {
    for(let i = 1;i<=this.width;i++){
      let node = this.vertices[i];
      let adjacents = node.getAdjacents();
        for (let adj in adjacents) {
          adjacents[adj].deleteAdjacentNode(node);
        }
        node.deleteAllAdjacents();
      $(`#${i}`).toggleClass("wall");
      await delay(0);
    }
    for(let i = this.width*2;i<=this.verticesNum;i+=Number(this.width)){
      let node = this.vertices[i];
      let adjacents = node.getAdjacents();
        for (let adj in adjacents) {
          adjacents[adj].deleteAdjacentNode(node);
        }
        node.deleteAllAdjacents();
      $(`#${i}`).toggleClass("wall");
      await delay(0);
    }
    for(let i=this.verticesNum-1;i>this.verticesNum-this.width;i--){
      let node = this.vertices[i];
      let adjacents = node.getAdjacents();
        for (let adj in adjacents) {
          adjacents[adj].deleteAdjacentNode(node);
        }
        node.deleteAllAdjacents();
      $(`#${i}`).toggleClass("wall");
      await delay(0);
    }
    for(let i = this.verticesNum-Number(this.width)*2+1;i>Number(this.width)+1;i=i-Number(this.width)){
      let node = this.vertices[i];
      let adjacents = node.getAdjacents();
        for (let adj in adjacents) {
          adjacents[adj].deleteAdjacentNode(node);
        }
        node.deleteAllAdjacents();
      $(`#${i}`).toggleClass("wall");
      await delay(0);
    }
  }
}
class Cell {
  constructor(id) {
    this.id = id;
    this.adjacents = [];
  }
  getAdjacents() {
    return this.adjacents;
  }
  setAdjacent(node) {
    this.adjacents.push(node);
  }
  deleteAdjacentNode(node) {
    let index = this.adjacents.indexOf(node);
    this.adjacents.splice(index, 1);
  }
  deleteAllAdjacents() {
    let newArr = [];
    this.adjacents = newArr;
  }
}

async function selectAction(selector, id) {
  switch (selector) {
    case "bfs":
      maze.bfs(maze.width+1, id);
      break;
    case "dfs":
      maze.dfs(maze.width+1,id);
      break;
    case "wall":
      let node = maze.vertices[id];
      let adjacents = node.getAdjacents();
      if (!adjacents) {
        for (let adj in previousAjdacents[id]) {
          node.setAdjacent(previousAjdacents[id][adj]);
          previousAjdacents[id][adj].setAdjacent(node);
        }
      } else {
        previousAjdacents[id] = adjacents;
        for (let adj in adjacents) {
          adjacents[adj].deleteAdjacentNode(node);
        }
        node.deleteAllAdjacents();
      }
      $(`#${id}`).toggleClass("wall");
      await delay(10);
      break;
  }
}

function delay(time) {
  return new Promise((res) => setTimeout(res, time));
}

$("document").ready(function () {
  $(".DisplayMaze").click(function () {
    $(".container").empty();
    $(".container").append('<table class="maze tight"></table>');

    let height = $("#heigh").val();
    let width = $("#width").val();
    maze = new SquareMaze(width, height);

    maze.addNodes();
  });
  $('body').mousedown(function() {
    mouseDown = true;
    //if(selector==='wall') selectAction('wall',this)      // When mouse goes down, set isDown to true
  })
  .mouseup(function() {
    mouseDown = false;    // When mouse goes up, set isDown to false
  });

  $(".CreateMaze").click(function () {
    if (!maze) {
      alert("Create the maze first!");
    } else {
      maze.createMaze();
    }
  });
  $(".DFS").click(function () {
    if (!maze) {
      alert("Create the maze first!");
    } else {
      selector = "dfs";
    }
  });
  $(".BFS").click(function () {
    if (!maze) {
      alert("Create the maze first!");
    } else {
      selector = "bfs";
    }
  });
  $(".Wall").click(function () {
    if (!maze) {
      alert("Create the maze first!");
    } else {
      selector = "wall";
    }
  });
});
