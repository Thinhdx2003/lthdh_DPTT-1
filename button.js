const addTaskBtn = document.getElementById("addTask");
const addProcessBtn = document.getElementById("addProcess");
const clearBtn = document.getElementById("clear");
const table = document.getElementById("tableInput");

// Thêm cột CPU và I/O vào bảng
addTaskBtn.addEventListener("click", function() {
    const rowCount = table.rows.length;
    //I/O
    for (let i = 0; i < rowCount; i++) {
        const cell = document.createElement(i == 0 ? "th" : "td");
        const input = document.createElement("input");
        input.type = "int";
        input.style.width = "30px";
        input.style.height = "10px";
        input.style.padding = "5px";
        input.className = "inputcell";
        if(i == 0){
            cell.textContent = `I/O`;
        }
        else{
            cell.appendChild(input);
        }
        table.rows[i].appendChild(cell);
    }
    //CPU
    for (let i = 0; i < rowCount; i++) {
        const cell = document.createElement(i == 0 ? "th" : "td");
        const input = document.createElement("input");
        input.type = "int";
        input.style.width = "30px";
        input.style.height = "10px";
        input.style.padding = "5px";
        input.className = "inputcell";
        if(i == 0)
            cell.textContent = `CPU`;
        else{
            cell.appendChild(input);
        }
        table.rows[i].appendChild(cell);
    }
});

// Thêm một process vào bảng
addProcessBtn.addEventListener("click", function() {
    const rowCount = table.rows.length;
    const columnCount = table.rows[0].cells.length;
    const row = table.insertRow();

    for (let i = 0; i < columnCount; i++) {
        const input = document.createElement("input");
        input.type = "int";
        input.style.width = "30px";
        input.style.height = "10px";
        input.style.padding = "5px";
        input.className = "inputcell";
        if(i == 0){
            const cellhead = document.createElement("th");
            cellhead.textContent = `P` + rowCount;
            row.appendChild(cellhead);
        }
        else{
            const cell = document.createElement("td");
            cell.appendChild(input);
            row.appendChild(cell);
        }
    }
});

clearBtn.addEventListener("click",function(){
    const inputCell = document.getElementsByClassName("inputcell");
    const SumOfInput = inputCell.length;
    for (let i = 0; i < SumOfInput; i++) {
        inputCell[i].value = "";
      }
});