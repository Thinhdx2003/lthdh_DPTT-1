class Process {
    constructor(name, arrivalTime, cpuBurstTimes = [], ioTimes = []) {
      this.name = name;
      this.arrivalTime = arrivalTime;
      this.cpuBurstTimes = cpuBurstTimes;
      this.ioTimes = ioTimes;
      this.currentCpu = cpuBurstTimes.shift();
    }
}

function getData() {
    let processTable = document.getElementById('tableInput');
    let rows = processTable.getElementsByTagName('tr');
    let rowsLength = rows.length;
    let columnCount = table.rows[0].cells.length;
    let inputs = document.getElementsByClassName('inputcell');
  
    for (let i = 1; i < rowsLength; i++) {
      let row = rows[i];
      let name = row.getElementsByTagName('th')[0].innerText;
      let arrivalTime = inputs[(i-1)*(columnCount-1)+0].value;
      let cpuBurstTimes = [];
      let ioTimes = [];

      for (let j = 1; j <= columnCount-2; j++) {
        if (j % 2 !== 0) {
          cpuBurstTimes.push(inputs[j+(i-1)*(columnCount-1)].value);
        } else {
          ioTimes.push(inputs[j+(i-1)*(columnCount-1)].value);
        }
      }
  
      let process = new Process(name, arrivalTime, cpuBurstTimes, ioTimes);
      processes.push(process);
    }
}

function setOutputForm(sumOfTime) {
  let tableInput = document.getElementById("tableInput");
  let processCount = tableInput.rows.length - 1;
  let table = document.getElementById("tableOutput");
  let headerRow = document.createElement("tr");
  let th = document.createElement("th");
  headerRow.appendChild(th);

  for(let i = 0; i < sumOfTime - 1; i++){
    let th = document.createElement("th");
    th.textContent = i;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);
  for(let i = 0; i < processCount; i++){
    let row = document.createElement("tr");
    for(let j = 0; j<= sumOfTime; j++){
        let cell = document.createElement("td");
        cell.className = "outputCell";
        if(j == 0){
          cell.textContent = "P"+(i+1);
        }
        if(i == processCount - 1)
          cell.style.borderBottom = "1px solid black";
        row.appendChild(cell);
    }
    table.appendChild(row);
  }
  for(let i = 0; i < processCount; i++){
    let row = document.createElement("tr");
    for(let j = 0; j<= sumOfTime; j++){
        let cell = document.createElement("td");
        cell.className = "outputCell";
        if(j == 0){
          cell.textContent = "I/O"+(i+1);
        }
        row.appendChild(cell);
    }
    table.appendChild(row);
  }
  for(let i = 0; i < processCount; i++){
    let row = document.createElement("tr");
    for(let j = 0; j<= sumOfTime; j++){
        let cell = document.createElement("td");
        cell.className = "outputCell";
        if(j == 0 && i == 0){
          cell.textContent = "Ready";
        }
        row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function pushReadyQueue(readyQueue,arrivalTime,processes){
  let RP = []//RP: Ready Process
  let processLength = processes.length
  
  for(let i = 0; i < processLength; i++){
    if(processes[i].arrivalTime == arrivalTime){
      readyQueue.push(processes[i]);
      RP.push(i);
    }
  }
  let sumOfRP = RP.length;
  for(let i = sumOfRP -1; i >= 0 ; i--){
    processes.splice(RP[i],1);
  }
}

let processes = [];


function roundRobin(timeQuantum) {
  let table = document.getElementById("tableOutput");
  let sumOfProcess = processes.length; 
  let readyQueue = [];
  let waitingQueues = [];
  //Khởi tạo ready queue
  let minArvTime = Math.min(...processes.map(process => process.arrivalTime));
  pushReadyQueue(readyQueue,minArvTime,processes);
  //Khởi tạo thời gian hiện tại
  let currentTime = minArvTime;
  let tempProcess = [];
  //Thực hiện RR
  while (readyQueue.length > 0 ||  waitingQueues.some(Element => Element !== null)) {
    if(readyQueue.length > 0){
      let process = readyQueue.shift();
      let currentProcess = null;
        for(let i = 1; i<=sumOfProcess; i++){
          if(process.name == "P"+i){
            currentProcess = i;
            break;
          }
        }
      // Thực thi CPU
      let outputProcessRow = table.rows[currentProcess];
      let outputIORow = table.rows;
      let cpuBursting = Math.min(timeQuantum,process.currentCpu);
      for(let i = 1; i <= cpuBursting; i++){
        if(i == 1)
          outputProcessRow.cells[currentTime+1].textContent = "|";
        outputProcessRow.cells[currentTime+1].textContent +="─────";
        process.currentCpu--;
        //Kiểm tra tiến độ I/O của mỗi process qua mỗi lần Time tăng
        for(let i = 0; i < sumOfProcess ; i++){
            if(waitingQueues[i] != null){
              waitingQueues[i]--;
              outputIORow[i+1+sumOfProcess].cells[currentTime+1].textContent ="─────";
              if(waitingQueues[i]== 0){
                readyQueue.push(tempProcess[i]);
                waitingQueues[i] = null;
              }
            }
        }
        currentTime++;
        //Check queue chưa vào
        if(processes.length>0)
          pushReadyQueue(readyQueue,currentTime,processes);
      }
      outputProcessRow.cells[currentTime].textContent += "|";

      // Kiểm tra tiến trình đã hoàn thành hay chưa
      if (process.cpuBurstTimes.length == 0 && process.currentCpu == 0) {
        outputProcessRow.cells[currentTime+1].textContent="X";
        continue;
      }

      // Dưa I/O vào waiting queue
      if(process.currentCpu == 0){
        waitingQueues[currentProcess - 1] = process.ioTimes.shift();
        process.currentCpu = process.cpuBurstTimes.shift();
        tempProcess[currentProcess - 1] = process;
      }else{
        readyQueue.push(process);
      }
    }else{
      //thực thi I/O khi readyQueue trống
      let outputIORow = table.rows;
      if(readyQueue.length == 0){
        for(let i = 0; i < sumOfProcess ; i++){
          if(waitingQueues[i] != null){
            waitingQueues[i]--;
            outputIORow[i+1+sumOfProcess].cells[currentTime+1].textContent ="─────";
            if(waitingQueues[i]==0){
              readyQueue.push(tempProcess[i]);
              waitingQueues[i] = null;
            }
          }
        }
        currentTime++;
        //Check queue chưa vào
        if(processes.length>0)
          pushReadyQueue(readyQueue,currentTime,processes);
      }
    }
  }
}
let solveBtn = document.getElementById('solve');
solveBtn.addEventListener('click', function() {
  getData();
  setOutputForm(20);
  roundRobin(2);
});