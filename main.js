//🟦 1. DOM Element References
// References to key HTML elements you'll mamipulate
//The main application state variables lists,activeListId,and currentDate
const taskLists = document.getElementById("task-lists");
const newListBtn = document.getElementById("new-list-btn");
const activeListTitle = document.getElementById("active-list-title");
const todoItems = document.getElementById("todo-items");
const calendarGrid = document.getElementById("calendar-grid");
const monthYearDisplay = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const dailyTodoListBtn = document.getElementById("daily-list-btn");

let lists = [];
let virtualLists = {};
let activeListId = null;
let currentDate = new Date();

//🟦 2. Default List Initialization
//this sets up the default "Today" list that acts as your baseline todo list.
const defaultList = {
  id: "default",
  name: "Today",
  todos: [],
  created: new Date().toISOString().split("T")[0],
};
lists.push(defaultList);
activeListId = "default";

//🟦 3. Utility: Highlight Active List
//ensures the correct list is visually highlighted in the sidebar when selected
function updateActiveListHighlight() {
  const allListItems = taskLists.querySelectorAll("li");
  allListItems.forEach((li) => {
    if (li.dataset.id === activeListId) {
      li.classList.add("active-list");
    } else {
      li.classList.remove("active-list");
    }
  });
}

//🟦 4. Sidebar: Render List
//Renders your sidebar lists and attaches event listeners for selecting and deleting lists.
function renderLists() {
  taskLists.innerHTML = "";
  lists.forEach((list) => {
    if (list.id === "default") return;
    const li = document.createElement("li");
    li.textContent = list.name;
    li.dataset.id = list.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasActive = activeListId === list.id;

      lists = lists.filter((l) => l.id !== list.id);

      if (wasActive) {
        activeListId = "default";
        activeListTitle.textContent = "Today";
        renderTodos();
      }

      renderLists();
      renderCalendar(currentDate);
      updateActiveListHighlight();
    });
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
      activeListId = list.id;
      activeListTitle.textContent = list.name;
      renderTodos();
      updateActiveListHighlight();
    });

    taskLists.appendChild(li);
  });

  updateActiveListHighlight();
}

//🟦 5. Main View: Render Todos
//Displays todos associated with the active list, and sets up interaction for marking them completed or deleted.
function renderTodos() {
  todoItems.innerHTML = "";
  const activeList =
    lists.find((list) => list.id === activeListId) ||
    virtualLists[activeListId];
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

      li.appendChild(circle);
      li.appendChild(todoText);
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
  if (newTodoText && activeListId) {
    let activeList = lists.find((list) => list.id === activeListId);
    if (!activeList) {
      activeList = virtualLists[activeListId];
      lists.push(activeList);
      delete virtualLists[activeListId];
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
    activeListId = newList.id;
    renderLists();
    renderTodos();
  }
});
//🟦 8. Switch to ‘Today’ View
//switches the user back to the default "Today" list
dailyTodoListBtn.addEventListener("click", () => {
  if (activeListId !== "default") {
    activeListId = "default";
    activeListTitle.textContent = "Today";
  }
  renderLists();
  renderTodos();
  updateActiveListHighlight();
});

//🟦 9. Calendar Rendering & Day Selection
//Dynamically generates the monthly calendar grid, marks days with todos, and lets you select a day to see or create a list for it.
function renderCalendar(date) {
  calendarGrid.innerHTML = "";

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const monthName = firstDay.toLocaleString("default", { month: "long" });
  monthYearDisplay.textContent = `${monthName} ${year}`;

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty-cell");
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-cell");
    dayCell.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayCell.classList.add("today");
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const found = lists.find((list) => list.created === dateStr);
    if (found && found.todos.length > 0) {
      dayCell.classList.add("has-todos");
    }

    dayCell.addEventListener("click", () => {
      const dateObj = new Date(year, month, day);
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      const formatted = `${weekday} ${day}`;

      const existingList = lists.find((list) => list.created === dateStr);
      if (existingList) {
        activeListId = existingList.id;
        activeListTitle.textContent = existingList.name;
      } else {
        activeListId = dateStr;
        activeListTitle.textContent = formatted;
        if (!virtualLists[dateStr]) {
          virtualLists[dateStr] = {
            id: dateStr,
            name: formatted,
            todos: [],
            created: dateStr,
          };
        }
      }
      renderTodos();
      updateActiveListHighlight();
    });

    calendarGrid.appendChild(dayCell);
  }
}

//🟦 10. Calendar Month Navigation
//Allows switching between months while keeping your calendar view dynamic.
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});
nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

//🟦 11. Initial Render Call
// On page load, these initialize your sidebar, main todos, and calendar display
renderLists();
renderTodos();
renderCalendar(currentDate);
