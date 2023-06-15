class Process {
    constructor(name, arrivalTime, cpuBurstTimes = [], ioTimes = []) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.cpuBurstTimes = cpuBurstTimes;
        this.ioTimes = ioTimes;
        this.currentCpu = cpuBurstTimes.shift();
        this.pushedReady_Time = arrivalTime;
        this.responseTime = 0;
        this.waitingTime = 0;
        this.TurnAroundTime = 0;
    }
}

let processes = [];
let Outputtable = document.getElementById("tableOutput");
let timeCoutTable = document.getElementById("timeCoutTable");
let readyQueue = [];
let waitingQueues = [];
let sumOfProcess;
let currentTime;
let processesCopy;
let tempProcess = [];

function getData() {
    let processes = [];
    let processTable = document.getElementById('tableInput');
    let rows = processTable.getElementsByTagName('tr');
    let rowsLength = rows.length;
    let columnCount = table.rows[0].cells.length;
    let inputs = document.getElementsByClassName('inputcell');

    for (let i = 1; i < rowsLength; i++) {
        let row = rows[i];
        let name = row.getElementsByTagName('th')[0].innerText;
        let arrivalTime = inputs[(i - 1) * (columnCount - 1) + 0].value;
        let cpuBurstTimes = [];
        let ioTimes = [];

        for (let j = 1; j <= columnCount - 2; j++) {
            let temp = inputs[j + (i - 1) * (columnCount - 1)].value;
            if (temp > 0) {
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
    return processes;
}

function setOutputForm(sumOfTime) {
    //resetTable
    Outputtable.innerHTML = '';
    timeCoutTable.innerHTML = '';

    let tableInput = document.getElementById("tableInput");
    let processCount = tableInput.rows.length - 1;
    let headerRow = document.createElement("tr");
    let th = document.createElement("th");
    headerRow.appendChild(th);

    for (let i = 0; i < sumOfTime; i++) {
        let th = document.createElement("th");
        th.textContent = i;
        headerRow.appendChild(th);
    }
    Outputtable.appendChild(headerRow);
    for (let i = 0; i < processCount; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j <= sumOfTime; j++) {
            let cell = document.createElement("td");
            cell.className = "outputCell";
            if (j == 0) {
                cell.textContent = "P" + (i + 1);
            }
            if (i == processCount - 1)
                cell.style.borderBottom = "1px solid black";
            row.appendChild(cell);
        }
        Outputtable.appendChild(row);
    }
    for (let i = 0; i < processCount; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j <= sumOfTime; j++) {
            let cell = document.createElement("td");
            cell.className = "outputCell";
            if (j == 0) {
                cell.textContent = "I/O" + (i + 1);
            }
            if (i == processCount - 1)
                cell.style.borderBottom = "1px solid black";
            row.appendChild(cell);
        }
        Outputtable.appendChild(row);
    }
    for (let i = 0; i < processCount; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j <= sumOfTime; j++) {
            let cell = document.createElement("td");
            cell.className = "readyCell";
            if (j == 0 && i == 0) {
                cell.textContent = "Ready";
            }
            row.appendChild(cell);
        }
        Outputtable.appendChild(row);
    }
    //bảng tính time
    for (let i = 0; i <= processCount; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 3; j++) {
            let cell = document.createElement("td");
            cell.className = "outputCell";
            row.appendChild(cell);
        }
        timeCoutTable.appendChild(row);
    }
}

function pushReadyQueue(readyQueue, arrivalTime, processes) {
    let RP = []//RP: Ready Process
    let processLength = processes.length

    for (let i = 0; i < processLength; i++) {
        if (processes[i].arrivalTime == arrivalTime) {
            readyQueue.push(processes[i]);
            RP.push(i);
        }
    }
    let sumOfRP = RP.length;
    for (let i = sumOfRP - 1; i >= 0; i--) {
        processes.splice(RP[i], 1);
    }
}

function checkCurrentCPU_toPush(process, currentProcess) {
    if (process.currentCpu == 0) {
        let row = Outputtable.rows;
        row[currentProcess + sumOfProcess].cells[currentTime + 1].textContent = "|";
        waitingQueues[currentProcess - 1] = process.ioTimes.shift();
        process.currentCpu = process.cpuBurstTimes.shift();
        tempProcess[currentProcess - 1] = process;
    } else {
        process.pushedReady_Time = currentTime;
        readyQueue.push(process);
    }
}

function getProcessIndex(process) {
    let currentProcess;
    for (let i = 1; i <= sumOfProcess; i++) {
        if (process.name == "P" + i) {
            currentProcess = i;
            break;
        }
    }
    return currentProcess;
}

function runIO() {
    let row = Outputtable.rows;
    for (let i = 0; i < sumOfProcess; i++) {
        if (waitingQueues[i] != null) {
            waitingQueues[i]--;
            row[i + 1 + sumOfProcess].cells[currentTime + 1].textContent += "────";
            if (waitingQueues[i] == 0) {
                row[i + 1 + sumOfProcess].cells[currentTime + 1].textContent += "|";
                tempProcess[i].pushedReady_Time = currentTime + 1;
                readyQueue.push(tempProcess[i]);
                waitingQueues[i] = null;
            }
        }
    }
}

function runCPU(cpuBursting, currentProcess, process) {
    let outputProcessRow = Outputtable.rows[currentProcess];
    for (let i = 1; i <= cpuBursting; i++) {
        if (i == 1)
            outputProcessRow.cells[currentTime + 1].textContent = "|";
        outputProcessRow.cells[currentTime + 1].textContent += "────";
        process.currentCpu--;
        //Kiểm tra tiến độ I/O của mỗi process qua mỗi lần Time tăng
        runIO();
        currentTime++;
        //Check queue chưa vào
        if (processesCopy.length > 0)
            pushReadyQueue(readyQueue, currentTime, processesCopy);
        printOutReadyQueue();
    }
    outputProcessRow.cells[currentTime].textContent += "|";
}

function checkCompletedProcess(process, currentProcess) {
    let outputProcessRow = Outputtable.rows[currentProcess];
    if (process.cpuBurstTimes.length == 0 && process.currentCpu == 0) {
        outputProcessRow.cells[currentTime + 1].textContent = "X";
        process.TurnAroundTime = currentTime - process.arrivalTime;
        return 1;
    }
    return 0;
}

function printOutReadyQueue() {
    let rows = Outputtable.rows;
    let readyQueueLength = readyQueue.length;
    for (let i = 0; i < readyQueueLength; i++) {
        rows[i + 1 + sumOfProcess * 2].cells[currentTime + 1].textContent = readyQueue[i].name + readyQueue[i].currentCpu;
    }
}

function perform_WaitingTime(process, currentProcess) {
    let Row = Outputtable.rows;
    let PR_Time = parseInt(process.pushedReady_Time);
    if (PR_Time < currentTime) {
        if (PR_Time == process.arrivalTime) {
            process.responseTime = currentTime - PR_Time;
        }
        process.waitingTime += currentTime - PR_Time;
        for (let i = PR_Time; i < currentTime; i++) {
            Row[currentProcess].cells[i + 1].textContent = "!!!!!!!!";
            Row[currentProcess].cells[i + 1].style.color = "rgba(67, 67, 173, 1)";
            Row[currentProcess].cells[i + 1].style.fontWeight = "700";
        }
    }
}

function calculateAverage(array) {
    if (array.length == 0) {
        return 0;
    }

    const sum = array.reduce((acc, num) => acc + num, 0);
    const average = sum / array.length;
    return average.toFixed(2);
}

function printOutTimeCoutTable() {
    let row;
    for (let i = 0; i < sumOfProcess; i++) {
        row = timeCoutTable.rows[i];
        for (let j = 0; j < 3; j++) {
            switch (j) {
                case 0:
                    row.cells[j].textContent = "R" + (i + 1) + " = " + processes[i].responseTime;
                    break;
                case 1:
                    row.cells[j].textContent = "W" + (i + 1) + " = " + processes[i].waitingTime;
                    break;
                case 2:
                    row.cells[j].textContent = "T" + (i + 1) + " = " + processes[i].TurnAroundTime;
                    break;
            }
        }
    }
    row = timeCoutTable.rows[3];
    for (let j = 0; j < 3; j++) {
        switch (j) {
            case 0:
                row.cells[j].textContent = "Rtb = " + calculateAverage(processes.map(process => process.responseTime));
                break;
            case 1:
                row.cells[j].textContent = "Wtb = " + calculateAverage(processes.map(process => process.waitingTime));
                break;
            case 2:
                row.cells[j].textContent = "Ttb = " + calculateAverage(processes.map(process => process.TurnAroundTime));
                break;
        }
    }
}

function roundRobin(timeQuantum) {
    //Khởi tạo ready queue
    let minArvTime = Math.min(...processes.map(process => process.arrivalTime));
    pushReadyQueue(readyQueue, minArvTime, processesCopy);
    //Khởi tạo thời gian hiện tại
    currentTime = minArvTime;
    //Thực hiện RR
    while (readyQueue.length > 0 || waitingQueues.some(Element => Element !== null)) {
        printOutReadyQueue();
        if (readyQueue.length > 0) {
            let rows = Outputtable.rows;
            rows[1 + sumOfProcess * 2].cells[currentTime + 1].style.color = "red";
            let process = readyQueue.shift();
            let currentProcess = getProcessIndex(process);
            perform_WaitingTime(process, currentProcess);
            // Thực thi CPU
            let cpuBursting = Math.min(timeQuantum, process.currentCpu);
            runCPU(cpuBursting, currentProcess, process);
            // Kiểm tra tiến trình đã hoàn thành hay chưa
            if (checkCompletedProcess(process, currentProcess))
                continue;
            // Dưa I/O vào waiting queue
            checkCurrentCPU_toPush(process, currentProcess);
        } else {
            //thực thi I/O khi readyQueue trống
            if (readyQueue.length == 0) {
                runIO();
                currentTime++;
                //Check queue chưa vào
                if (processesCopy.length > 0)
                    pushReadyQueue(readyQueue, currentTime, processesCopy);
                printOutReadyQueue();
            }
        }
    }
}

//Xử lý nút
const algorithm = document.getElementById("Algorithms");

algorithm.addEventListener("change", function () {
    const selectedOption = algorithm.options[algorithm.selectedIndex];
    const selectedValue = selectedOption.value;
    let q = document.getElementById("quantum");
    switch (selectedValue) {
        case "3":
            q.style.display = "none";
            break;
        case "4": 
            q.style.display = "block";
            break;
    }
});

function deleteColumn(columnIndex) {
    let table = document.getElementById("tableOutput");
    let rowsLength = table.rows.length;
    for (let i = 0; i < rowsLength; i++) {
        let row = table.rows[i];
        row.deleteCell(columnIndex);
    }
}

let solveBtn = document.getElementById('solve');
solveBtn.addEventListener('click', function () {
    //khởi tạo cho thuật toán mới
    currentTime = 0;
    Outputtable = document.getElementById("tableOutput");
    processes = getData();
    sumOfProcess = processes.length;
    processesCopy = [...processes];
    setOutputForm(100);
    const selectedOption = algorithm.options[algorithm.selectedIndex];
    const selectedValue = selectedOption.value;
    switch (selectedValue) {
        case "4":
            const q = document.getElementById("quantum").value;
            roundRobin(q);
            break;
    }
    //xóa cột thừa của Output table
    let startDeleteColumn = currentTime + 2;
    for (let i = 100; i >= startDeleteColumn; i--) {
        deleteColumn(i);
    }
    printOutTimeCoutTable();
});