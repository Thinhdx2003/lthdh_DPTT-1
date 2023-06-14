class Process {
    constructor(name, arrivalTime, cpuBurstTimes = [], ioTimes = []) {
      this.name = name;
      this.arrivalTime = arrivalTime;
      this.cpuBurstTimes = cpuBurstTimes;
      this.ioTimes = ioTimes;
      this.currentCpu = cpuBurstTimes.shift();
      this.pushedReady_Time = arrivalTime;
    }
}
let processes = [];
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
        let temp = inputs[j+(i-1)*(columnCount-1)].value;
        if(temp > 0){
          if (j % 2 !== 0) {
              cpuBurstTimes.push(temp);
          } else {
            ioTimes.push(temp);
          }
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

  for(let i = 0; i < sumOfTime; i++){
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

function checkCurrentCPU_toPush(process,currentProcess){
  if(process.currentCpu == 0){
    let row = Outputtable.rows;
    row[currentProcess+sumOfProcess].cells[currentTime+1].textContent ="|";
    waitingQueues[currentProcess - 1] = process.ioTimes.shift();
    process.currentCpu = process.cpuBurstTimes.shift();
    tempProcess[currentProcess - 1] = process;
  }else{
    process.pushedReady_Time = currentTime;
    readyQueue.push(process);
  }
}

function getProcessIndex(process){
  let currentProcess;
  for(let i = 1; i<=sumOfProcess; i++){
    if(process.name == "P"+i){
      currentProcess = i;
      break;
    }
  }
  return currentProcess;
}

function runIO(){
  let row = Outputtable.rows;
  for(let i = 0; i < sumOfProcess ; i++){
    if(waitingQueues[i] != null){
      waitingQueues[i]--;
      row[i+1+sumOfProcess].cells[currentTime+1].textContent +="─────";
      if(waitingQueues[i]== 0){
        row[i+1+sumOfProcess].cells[currentTime+1].textContent +="|";
        tempProcess[i].pushReadyQueue = currentTime;
        readyQueue.push(tempProcess[i]);
        waitingQueues[i] = null;
      }
    }
  }
}

function runCPU(cpuBursting,currentProcess,process){
  let outputProcessRow = Outputtable.rows[currentProcess];
  for(let i = 1; i <= cpuBursting; i++){
    if(i == 1)
      outputProcessRow.cells[currentTime+1].textContent = "|";
    outputProcessRow.cells[currentTime+1].textContent +="─────";
    process.currentCpu--;
    //Kiểm tra tiến độ I/O của mỗi process qua mỗi lần Time tăng
    runIO();
    currentTime++;
    //Check queue chưa vào
    if(processes.length>0)
      pushReadyQueue(readyQueue,currentTime,processesCopy);
    printOutReadyQueue();
  }
  outputProcessRow.cells[currentTime].textContent += "|";
}

function checkCompletedProcess(process,currentProcess){
  let outputProcessRow = Outputtable.rows[currentProcess];
  if (process.cpuBurstTimes.length == 0 && process.currentCpu == 0) {
    outputProcessRow.cells[currentTime+1].textContent="X";
    return 1;
  }
  return 0;
}

function printOutReadyQueue(){
  let rows = Outputtable.rows;
  let readyQueueLength = readyQueue.length;
  for(let i = 0; i < readyQueueLength; i++){
    rows[i+1+sumOfProcess*2].cells[currentTime+1].textContent = readyQueue[i].name+readyQueue[i].currentCpu;
  }
}

// function perform_WaitingTime(process,currentProcess){
//   let outputProcessRow = Outputtable.rows[currentProcess];
//   if(process.pushedReady_Time < currentTime){
//     for(let i = process.pushedReady_Time; i < currentTime; i++){
//       console.log(i);
//       console.log(currentTime);
//       if(i == process.pushedReady_Time)
//         outputProcessRow.cells[i+1].textContent = "|";
//       outputProcessRow.cells[i+1].textContent += "-----";
//     }
//   }
// }

let Outputtable = document.getElementById("tableOutput");
let readyQueue = [];
let waitingQueues = [];
let sumOfProcess; 
let currentTime;
let processesCopy; 
let tempProcess = [];
function roundRobin(timeQuantum) {
  //Khởi tạo ready queue
  let minArvTime = Math.min(...processes.map(process => process.arrivalTime));
  pushReadyQueue(readyQueue,minArvTime,processesCopy);
  //Khởi tạo thời gian hiện tại
  currentTime = minArvTime;
  //Thực hiện RR
  while (readyQueue.length > 0 ||  waitingQueues.some(Element => Element !== null)) {
    printOutReadyQueue();
    if(readyQueue.length > 0){
      let rows = Outputtable.rows; 
      rows[1+sumOfProcess*2].cells[currentTime+1].style.color ="red";
      let process = readyQueue.shift();
      let currentProcess = getProcessIndex(process);
      // perform_WaitingTime(process,currentProcess);
      // Thực thi CPU
      let cpuBursting = Math.min(timeQuantum,process.currentCpu);
      runCPU(cpuBursting,currentProcess,process);
      // Kiểm tra tiến trình đã hoàn thành hay chưa
      if(checkCompletedProcess(process,currentProcess))
        continue;
      // Dưa I/O vào waiting queue
      checkCurrentCPU_toPush(process,currentProcess);
    }else{
      //thực thi I/O khi readyQueue trống
      if(readyQueue.length == 0){
        runIO();
        currentTime++;
        //Check queue chưa vào
        if(processes.length>0)
          pushReadyQueue(readyQueue,currentTime,processesCopy);
        printOutReadyQueue();
      }
    }
  }
}
let solveBtn = document.getElementById('solve');
solveBtn.addEventListener('click', function() {
  getData();
  sumOfProcess = processes.length; 
  processesCopy = [...processes];
  setOutputForm(35);
  roundRobin(5);
});