let draggedElem=null;
let rightClicked = null;
document.addEventListener("DOMContentLoaded",loadTasksFromLocalStorage)

function addTask(coloumId){
    let inputElement=document.getElementById(`${coloumId}-input`);
    let value= inputElement.value;

    if(value===" " || value==null || value===""){
        return ;
    }

    let taskDate=new Date().toLocaleString();

    let taskElement = createElement(value,taskDate);
    
    document.getElementById(`${coloumId}-tasks`).appendChild(taskElement);
    
    updateTasksCount(coloumId);
    saveTasksToLocalStorage(coloumId,value,taskDate);
    inputElement.value="";
    
}

function createElement(text,taskDate) {
    let element = document.createElement('div');
    element.classList.add('card');
    element.innerHTML = `<span>${text}</span><br><small class="time">${taskDate}</small>`;
    element.draggable="true";
    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragend',dragEnd);
    element.addEventListener('contextmenu',function (event) {
        event.preventDefault();
        showContextMenu(event.pageX,event.pageY);
        rightClicked=this;
        
    } );
    return element;
    
}
let context=document.querySelector(".context-menu");
function showContextMenu(x,y){
    context.style.top = `${y}px`;
    context.style.left = `${x}px`;
    context.style.display= 'block';

}
document.addEventListener("click",()=>{
    context.style.display="none";
})

function dragStart() {
    this.classList.add('dragging');
    draggedElem = this;

    
}
function dragEnd() {
    this.classList.remove('dragging');
    draggedElem = null;
    ["todo","doing","done"].forEach((elem)=>{
        updateTasksCount(elem);
    })
    updateTasksAtLocalStorage();
}

document.querySelectorAll(".tasks").forEach((elem)=>{
    elem.addEventListener('dragover', dragOver);
})
function dragOver(e) {
    e.preventDefault();
    let afterElement= getDragAfterElement(this,e.clientY);
    if (afterElement == null) {
        this.appendChild(draggedElem);
    }else{
        this.insertBefore(draggedElem,afterElement);
    }
}

function getDragAfterElement(container,y) {
    
    const draggableElements=[...container.querySelectorAll(".card:not(.dragging)")];
    let result = draggableElements.reduce((closest,current)=>{
        let box=current.getBoundingClientRect();
        let offset=y-box.height/2 - box.top;
        if(offset < 0 && offset > closest.offset){
            return {offset:offset,element:current};
        }else{
            return closest;
        }
    },{offset : Number.NEGATIVE_INFINITY});
    


    return result.element;
    
}
function editTask() {
    
    
    let text = prompt("Enter edited task",rightClicked.innerText);
    if(text !== null && text !== " " && text !== "") {
        rightClicked.innerText = text;
    }
    updateTasksAtLocalStorage();
    
}
function deleteTask() {
    rightClicked.remove();
    ["todo","doing","done"].forEach((elem)=>{
        updateTasksCount(elem);
    })
    updateTasksAtLocalStorage();
}
function updateTasksCount(coloumId) {
    let count = document.querySelectorAll(`#${coloumId}-tasks .card`).length;
    document.getElementById(`${coloumId}-count`).innerText=count;
    
}

function saveTasksToLocalStorage(coloumId,task,taskDate) {
    let tasks = JSON.parse(localStorage.getItem(`${coloumId}-tasks`)) || [];
    tasks.push({task,taskDate});
    localStorage.setItem(`${coloumId}-tasks`,JSON.stringify(tasks));
    
}
function loadTasksFromLocalStorage() {
    ["todo","done","doing"].forEach((coloumId)=>{
        let tasks = JSON.parse(localStorage.getItem(`${coloumId}-tasks`)) || [];
        tasks.forEach(({task,taskDate})=>{
            let elem= createElement(task,taskDate);
            document.getElementById(`${coloumId}-tasks`).appendChild(elem);
    })
    updateTasksCount(coloumId);
    })
    
}
function updateTasksAtLocalStorage() {
    ["todo","doing","done"].forEach((coloumId)=>{

        let tasks = document.querySelectorAll(`#${coloumId}-tasks .card`);
        let localTasks=[];
        tasks.forEach((task)=>{
            let taskDate = task.querySelector("small").innerText;
            let taskText = task.querySelector("span").innerText;
            localTasks.push({task:taskText,taskDate:taskDate});
        })
        localStorage.setItem(`${coloumId}-tasks`,JSON.stringify(localTasks));
    })
    
}