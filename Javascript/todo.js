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
  todoItems.innerHTML = "";
  const activeList =
    lists.find((list) => list.id === state.activeListId) ||
    virtualLists[state.activeListId];

  if (activeList) {
    activeListTitle.textContent = activeList.name;

    activeList.todos.forEach((todo, index) => {
      const li = document.createElement("li");

      const circle = document.createElement("span");
      circle.classList.add("todo-circle");
      if (todo.completed) {
        circle.classList.add("completed");
      } else if (todo.deleted) {
        circle.classList.add("deleted");
      }

      circle.addEventListener("click", () => {
        if (!todo.completed && !todo.deleted) {
          todo.completed = true;
        } else if (todo.completed) {
          todo.completed = false;
          todo.deleted = true;
        } else {
          activeList.todos.splice(index, 1);
        }
        renderTodos();
        renderCalendar(currentDate);
      });

      const todoText = document.createElement("span");
      todoText.textContent = todo.text;
      if (todo.completed) {
        todoText.style.textDecoration = "line-through";
      } else if (todo.deleted) {
        todoText.style.opacity = "0.5";
      }

      // 🟦 Menu Toggle Icon (⋯)
      const todoEdit = document.createElement("span");
      todoEdit.classList.add("todo-edit");
      todoEdit.textContent = "⋯";

      // 🟦 Options Menu
      const iconContainer = document.createElement("div");
      iconContainer.classList.add("icon-container");
      iconContainer.style.display = "none"; // hidden by default

      const editBtn = document.createElement("button");
      editBtn.classList.add("fa-solid", "fa-pen-to-square");
      editBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = todo.text;
        input.classList.add("edit-input");

        // Replace the text element with the input field
        li.replaceChild(input, todoText);
        input.focus();

        const saveEdit = () => {
          const newText = input.value.trim();
          if (newText !== "") {
            todo.text = newText;
          }
          renderTodos(); // re-render to reflect change
        };

        const cancelEdit = () => {
          renderTodos(); // just re-render without saving
        };

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") saveEdit();
          if (e.key === "Escape") cancelEdit();
        });

        input.addEventListener("blur", cancelEdit);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("fas", "fa-trash");
      deleteBtn.addEventListener("click", () => {
        activeList.todos.splice(index, 1);
        renderTodos();
        renderCalendar(currentDate);
      });

      iconContainer.appendChild(editBtn);
      iconContainer.appendChild(deleteBtn);

      // Toggle menu visibility
      todoEdit.addEventListener("click", (e) => {
        e.stopPropagation();
        iconContainer.style.display =
          iconContainer.style.display === "none" ? "block" : "none";
      });

      li.appendChild(circle);
      li.appendChild(todoText);
      li.appendChild(todoEdit);
      li.appendChild(iconContainer);
      todoItems.appendChild(li);
    });
  }
}

//🟦 6. Add New Todo
//captures user input to add anew todo to the active list.
document.getElementById("todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("new-todo-input");
  const newTodoText = input.value.trim();
  if (newTodoText && state.activeListId) {
    let activeList = lists.find((list) => list.id === state.activeListId);
    if (!activeList) {
      activeList = virtualLists[state.activeListId];
      lists.push(activeList);
      delete virtualLists[state.activeListId];
      renderLists();
    }
    activeList.todos.push({
      text: newTodoText,
      completed: false,
      deleted: false,
    });
    input.value = "";
    renderTodos();
    renderCalendar(currentDate);
  }
});

//🟦 7. Add New List (Manual)
//allows the user to manually create a new list by name
newListBtn.addEventListener("click", () => {
  const listName = prompt("Enter list name:");
  if (listName && listName.trim() !== "") {
    const newList = {
      id: Date.now().toString(),
      name: listName.trim(),
      todos: [],
      created: new Date().toISOString().split("T")[0],
    };
    lists.push(newList);
    state.activeListId = newList.id;
    renderLists();
    renderTodos();
    renderCalendar();
  }
});
//🟦 8. Switch to ‘Today’ View
//switches the user back to the default "Today" list
dailyTodoListBtn.addEventListener("click", () => {
  if (state.activeListId !== "default") {
    state.activeListId = "default";
    activeListTitle.textContent = "Today";
  }
  renderLists();
  renderTodos();
  updateActiveListHighlight();
});
