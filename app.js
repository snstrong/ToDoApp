
// Global Variables
//
const form = document.querySelector('form');
const newToDo = document.querySelector('input[name="newToDo"]');
const toDoList = document.querySelector('#toDoList'); // ul
let count = JSON.parse(localStorage.getItem("count")) || 0;

// Retrieve list from localStorage
const savedTodos = JSON.parse(localStorage.getItem("todos")) || []; // creates array of to-do list items

for (let i = 0; i < savedTodos.length; i++) {
  const savedToDo = createNewToDo(savedTodos[i].task);
  savedToDo.isCompleted = savedTodos[i].isCompleted;
  if (savedToDo.isCompleted) {
    savedToDo.style.textDecoration = "line-through";
  }
  savedToDo.dataset.itemKey = savedTodos[i].itemKey;
  toDoList.appendChild(savedToDo);
}

// Creates new to-do list item from passed-in string
// Appends item to to-do list
// Returns item
function createNewToDo(toDoText) {
    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.innerText = toDoText;
    li.appendChild(span);
    
    const removal = document.createElement('button');
    removal.innerText = " X ";
    li.appendChild(removal);

    li.dataset.itemKey = "item" + count;

    count++;
   
    toDoList.appendChild(li);
   
    return li;
}

// On form submit, calls createNewToDo, appends new item to list, creates object from item, adds object to local storage
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const li = createNewToDo(newToDo.value); 
    
    newToDo.value = ""; // resets input, could also use newToDo.reset()

    const todo = ({ task: li.firstChild.innerText, isCompleted: false, itemKey: "item" + count }) ; // saves data for list item
    
    savedTodos.push(todo); // adds item to array
    localStorage.setItem("todos", JSON.stringify(savedTodos)); // saves array to localStorage

    //localStorage.setItem(todo.itemKey, JSON.stringify(todo));
    localStorage.setItem('count', count);
    
})

// Listens for clicks on the To-Do list
// If text is clicked, alters text decoration
// If button is clicked, removes item
// Updates localStorage
toDoList.addEventListener('click', function(e) {
    if (e.target.tagName === 'SPAN') {
        let clickedListItem = e.target.parentElement;
        if (!clickedListItem.isCompleted) {
            clickedListItem.style.textDecoration = "line-through";
            clickedListItem.isCompleted = true;
        } else {
            clickedListItem.style.textDecoration = "none";
            clickedListItem.isCompleted = false;
        }

        for (let s of savedTodos) {
            if (s.itemKey === clickedListItem.dataset.itemKey) {
                savedTodos[savedTodos.indexOf(s)].isCompleted = clickedListItem.isCompleted;
                localStorage.setItem("todos", JSON.stringify(savedTodos));
            }
        }
    }

    if (e.target.tagName === 'BUTTON') {
        for (let s of savedTodos) {
            if (s.itemKey === e.target.parentElement.dataset.itemKey) {
                //Remove from array
                savedTodos.splice(savedTodos.indexOf(s), 1);
                // // Refresh array in localStorage
                localStorage.setItem("todos", JSON.stringify(savedTodos));
            }
        }
        e.target.parentElement.remove();
    }
})
