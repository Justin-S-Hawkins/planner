import { currentDate, virtualLists } from "./main.js";
import { renderCalendar } from "./calendar.js";
import {
  activeListTitle,
  renderLists,
  updateActiveListHighlight,
  lists,
  state,
} from "./lists.js";

const newListBtn = document.getElementById("new-list-btn");
const todoItems = document.getElementById("todo-items");
const dailyTodoListBtn = document.getElementById("daily-list-btn");

export function renderTodos() {
  todoItems.innerHTML = ""; //clear todoItems to avoid duplicates
  const activeList = // find the list that
    lists.find((list) => list.id === state.activeListId) || // has an active list id eual to the lists id
    virtualLists[state.activeListId]; //or a virtualList actived id ( this would tbe the dateStr)

  if (activeList) {
    // if an active list is found
    activeListTitle.textContent = activeList.name; // then fill the title with the lists name

    activeList.todos.forEach((todo, index) => {
      //for each todo
      const li = document.createElement("li"); //create a new li element in the dom to hold the todo

      const circle = document.createElement("span"); // circle that will register completed/uncompleted & deleted
      circle.classList.add("todo-circle"); //add class for styles
      if (todo.completed) {
        // if this value is found in the object then  add the completed class
        circle.classList.add("completed");
      } else if (todo.deleted) {
        circle.classList.add("deleted"); // else  if its the deleteed value, then add the deleteed class
      }
      /////////////////////////////////////////////////////////////////// necesary ? we have the edit / delete icon now
      circle.addEventListener("click", () => {
        //additions and redaction of values and splicing of todo depending on the click amounnt on the circle
        if (!todo.completed && !todo.deleted) {
          todo.completed = true; // green
        } else if (todo.completed) {
          todo.completed = false;
          todo.deleted = true; //red
        } else {
          activeList.todos.splice(index, 1); //delete from list
        }
        renderTodos();
        renderCalendar(currentDate);
      });
      /////////////////////////////////////////////////////////////////
      const todoText = document.createElement("span"); // create span to hold the todo text in the li
      todoText.textContent = todo.text; //fill the span
      ///////////////////////////////////////////////////////////////// necesary ? we have the edit / delete icon now
      if (todo.completed) {
        // adding styles
        todoText.style.textDecoration = "line-through";
      } else if (todo.deleted) {
        todoText.style.opacity = "0.5"; // adding styles
      }
      /////////////////////////////////////////////////////////////////
      // 🟦 Menu Toggle Icon (⋯)
      const todoEdit = document.createElement("span"); // createing the span for the edit option  icon
      todoEdit.classList.add("todo-edit"); //add class for styles
      todoEdit.textContent = "⋯"; // fill with the icon

      // 🟦 Options Menu
      const iconContainer = document.createElement("div"); //creating the div to hold the buttons
      iconContainer.classList.add("icon-container"); // adding class for styles
      iconContainer.style.display = "none"; // hide the div until the icon is clicked

      const editBtn = document.createElement("button"); //create the edit button
      editBtn.classList.add("fa-solid", "fa-pen-to-square"); // fun font awomse icons
      editBtn.addEventListener("click", () => {
        //event listener for edit icon
        const input = document.createElement("input"); //create an input
        input.type = "text"; // give it a type
        input.value = todo.text; //fill it with the todo.text, so it appears to edit the current txt
        input.classList.add("edit-input"); // add class for styles

        // Replace the text element with the input field
        li.replaceChild(input, todoText); // replace the todoText with the input field
        input.focus(); // focus for auto cursor

        const saveEdit = () => {
          // save Edit
          const newText = input.value.trim(); // newText is the input value trimmed ()
          if (newText !== "") {
            // making sure there is an input value
            todo.text = newText; // making the todo's text  equal the input value
          }
          renderTodos(); // re-render to reflect change
        };

        const cancelEdit = () => {
          renderTodos(); // just re-render without saving
        };

        input.addEventListener("keydown", (e) => {
          //selecting the keys for saving and cancelling
          if (e.key === "Enter") saveEdit(); //saves
          if (e.key === "Escape") cancelEdit(); // cancels edit and remains the same
        });

        input.addEventListener("blur", cancelEdit); // click anywhere off the edit bar and it cancels the edit
      });

      const deleteBtn = document.createElement("button"); //adding delete button
      deleteBtn.classList.add("fas", "fa-trash"); //adding the classes for font Awseome
      deleteBtn.addEventListener("click", () => {
        // the delete button will splice the todo from the list on clicking
        activeList.todos.splice(index, 1);
        renderTodos();
        renderCalendar(currentDate);
      });

      iconContainer.appendChild(editBtn); //append the edit btn
      iconContainer.appendChild(deleteBtn); //append the delete btn

      // Toggle menu visibility
      todoEdit.addEventListener("click", (e) => {
        //
        e.stopPropagation(); // blocking bubbling up baring any future event / click events added to the todos
        iconContainer.style.display =
          iconContainer.style.display === "none" ? "block" : "none";
      });
      // add the new Dom elements in order you want them layed out
      li.appendChild(circle);
      li.appendChild(todoText);
      li.appendChild(todoEdit);
      li.appendChild(iconContainer);
      todoItems.appendChild(li); // append them to the parent todo
    });
  }
}

//🟦 6. Add New Todo
//captures user input to add anew todo to the active list.
document.getElementById("todo-form").addEventListener("submit", (e) => {
  e.preventDefault(); //prevents the page reload issue
  const input = document.getElementById("new-todo-input"); // create the input field where todos will be created
  const newTodoText = input.value.trim(); // newTodoText  = input tesxt value
  if (newTodoText && state.activeListId) {
    // there is an active id'p and todo text
    let activeList = lists.find((list) => list.id === state.activeListId); // creting the element to represent a list with an acitve id
    if (!activeList) {
      // if the list cant be found in the main lists array
      activeList = virtualLists[state.activeListId]; // look to the virtual list id for the list
      lists.push(activeList); //push the active list to lists if found
      delete virtualLists[state.activeListId]; // delete it from virtual lists
      renderLists(); // re-render effected areas
    }
    activeList.todos.push({
      //push the todos that are associated with the active LIst
      text: newTodoText, // text
      completed: false, //green
      deleted: false, //red
    });
    input.value = ""; // reset for next user input
    renderTodos(); //re-render after each todo
    renderCalendar(currentDate); // re-render effected area
  }
});

//🟦 7. Add New List (Manual)
//allows the user to manually create a new list by name

//ADD TO LISTS JS FILE>>>>>>>
newListBtn.addEventListener("click", () => {
  //creating a new list
  const listName = prompt("Enter list name:"); //prompt
  if (listName && listName.trim() !== "") {
    // if the name is not equal to an empty string and is true (has a value )
    const newList = {
      //new list format
      id: Date.now().toString(),
      name: listName.trim(),
      todos: [],
      created: new Date().toISOString().split("T")[0],
    };
    lists.push(newList); //push the new list to the lists array
    state.activeListId = newList.id; // make the active id the new lists id
    renderLists(); // re-render effected area
    renderTodos(); //re-render effected area
    renderCalendar(); // re-render effected area
  }
});
//🟦 8. Switch to ‘Today’ View
//switches the user back to the default "Today" list
dailyTodoListBtn.addEventListener("click", () => {
  // takes the user to the current day (today ) home todo list
  if (state.activeListId !== "default") {
    state.activeListId = "default";
    activeListTitle.textContent = "Today";
  }
  renderLists(); // re-render effected area
  renderTodos(); // re-render effected area
  updateActiveListHighlight(); // re-render effected area
});
