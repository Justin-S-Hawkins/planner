// const taskLists = document.getElementById("task-lists");
// const newListBtn = document.getElementById("new-list-btn");
// const activeListTitle = document.getElementById("active-list-title");
// const todoItems = document.getElementById("todo-items");
// const calendarGrid = document.getElementById("calendar-grid");
// const monthYearDisplay = document.getElementById("month-year");
// const prevMonthBtn = document.getElementById("prev-month");
// const nextMonthBtn = document.getElementById("next-month");
// const dailyTodoListBtn = document.getElementById("daily-list-btn");

// let lists = [];
// let virtualLists = {};
// let activeListId = null;
// let currentDate = new Date();

// const defaultList = {
//   id: "default",
//   name: "Today",
//   todos: [],
//   created: new Date().toISOString().split("T")[0],
// };
// lists.push(defaultList);
// activeListId = "default";

// // ✅ NEW FUNCTION TO HANDLE ACTIVE LIST HIGHLIGHTING
// function updateActiveListHighlight() {
//   const allListItems = taskLists.querySelectorAll("li");
//   allListItems.forEach((li) => {
//     if (li.dataset.id === activeListId) {
//       li.classList.add("active-list");
//     } else {
//       li.classList.remove("active-list");
//     }
//   });
// }

// // Render sidebar lists
// function renderLists() {
//   taskLists.innerHTML = "";
//   lists.forEach((list) => {
//     if (list.id === "default") return;
//     const li = document.createElement("li");
//     li.textContent = list.name;
//     li.dataset.id = list.id; // ✅ track list id for highlighting

//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "Delete";
//     deleteBtn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       const wasActive = activeListId === list.id;

//       lists = lists.filter((l) => l.id !== list.id);

//       if (wasActive) {
//         activeListId = "default";
//         activeListTitle.textContent = "Today";
//         renderTodos();
//       }

//       renderLists();
//       renderCalendar(currentDate);
//       updateActiveListHighlight(); // ✅ update highlighting
//     });
//     li.appendChild(deleteBtn);

//     li.addEventListener("click", () => {
//       activeListId = list.id;
//       activeListTitle.textContent = list.name;
//       renderTodos();
//       updateActiveListHighlight(); // ✅ update highlighting
//     });

//     taskLists.appendChild(li);
//   });

//   updateActiveListHighlight(); // ✅ highlight when re-rendering
// }

// // Render todos for the active list
// function renderTodos() {
//   todoItems.innerHTML = "";
//   const activeList =
//     lists.find((list) => list.id === activeListId) ||
//     virtualLists[activeListId];
//   if (activeList) {
//     activeListTitle.textContent = activeList.name;
//     activeList.todos.forEach((todo, index) => {
//       const li = document.createElement("li");

//       const circle = document.createElement("span");
//       circle.classList.add("todo-circle");

//       if (todo.completed) {
//         circle.classList.add("completed");
//       } else if (todo.deleted) {
//         circle.classList.add("deleted");
//       }

//       circle.addEventListener("click", () => {
//         if (!todo.completed && !todo.deleted) {
//           todo.completed = true;
//         } else if (todo.completed) {
//           todo.completed = false;
//           todo.deleted = true;
//         } else {
//           activeList.todos.splice(index, 1);
//         }
//         renderTodos();
//         renderCalendar(currentDate);
//       });

//       const todoText = document.createElement("span");
//       todoText.textContent = todo.text;
//       if (todo.completed) {
//         todoText.style.textDecoration = "line-through";
//       } else if (todo.deleted) {
//         todoText.style.opacity = "0.5";
//       }

//       li.appendChild(circle);
//       li.appendChild(todoText);
//       todoItems.appendChild(li);
//     });
//   }
// }

// // Handle new todo submission
// document.getElementById("todo-form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = document.getElementById("new-todo-input");
//   const newTodoText = input.value.trim();
//   if (newTodoText && activeListId) {
//     let activeList = lists.find((list) => list.id === activeListId);
//     if (!activeList) {
//       activeList = virtualLists[activeListId];
//       lists.push(activeList);
//       delete virtualLists[activeListId];
//       renderLists();
//     }
//     activeList.todos.push({
//       text: newTodoText,
//       completed: false,
//       deleted: false,
//     });
//     input.value = "";
//     renderTodos();
//     renderCalendar(currentDate);
//   }
// });

// // Manual new list creation
// newListBtn.addEventListener("click", () => {
//   const listName = prompt("Enter list name:");
//   if (listName && listName.trim() !== "") {
//     const newList = {
//       id: Date.now().toString(),
//       name: listName.trim(),
//       todos: [],
//       created: new Date().toISOString().split("T")[0],
//     };
//     lists.push(newList);
//     activeListId = newList.id;
//     renderLists();
//     renderTodos();
//   }
// });

// // ✅ Handle "Today" button click
// dailyTodoListBtn.addEventListener("click", () => {
//   if (activeListId !== "default") {
//     activeListId = "default";
//     activeListTitle.textContent = "Today";
//   }
//   renderLists();
//   renderTodos();
//   updateActiveListHighlight(); // ✅ clear highlight
// });

// // Render the calendar grid
// function renderCalendar(date) {
//   calendarGrid.innerHTML = "";

//   // ✅ Add weekday initials row
//   const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   weekdays.forEach((day) => {
//     const dayHeader = document.createElement("div");
//     dayHeader.classList.add("day-header");
//     dayHeader.textContent = day;
//     calendarGrid.appendChild(dayHeader);
//   });

//   const year = date.getFullYear();
//   const month = date.getMonth();

//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);

//   const startDay = firstDay.getDay();
//   const totalDays = lastDay.getDate();

//   const monthName = firstDay.toLocaleString("default", { month: "long" });
//   monthYearDisplay.textContent = `${monthName} ${year}`;

//   for (let i = 0; i < startDay; i++) {
//     const emptyCell = document.createElement("div");
//     emptyCell.classList.add("empty-cell");
//     calendarGrid.appendChild(emptyCell);
//   }

//   for (let day = 1; day <= totalDays; day++) {
//     const dayCell = document.createElement("div");
//     dayCell.classList.add("day-cell");
//     dayCell.textContent = day;

//     const today = new Date();
//     if (
//       day === today.getDate() &&
//       month === today.getMonth() &&
//       year === today.getFullYear()
//     ) {
//       dayCell.classList.add("today");
//     }

//     const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
//       day
//     ).padStart(2, "0")}`;

//     const found = lists.find((list) => list.created === dateStr);
//     if (found && found.todos.length > 0) {
//       dayCell.classList.add("has-todos");
//     }

//     dayCell.addEventListener("click", () => {
//       const dateObj = new Date(year, month, day);
//       const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
//       const formatted = `${weekday} ${day}`;

//       const existingList = lists.find((list) => list.created === dateStr);
//       if (existingList) {
//         activeListId = existingList.id;
//         activeListTitle.textContent = existingList.name;
//       } else {
//         activeListId = dateStr;
//         activeListTitle.textContent = formatted;
//         if (!virtualLists[dateStr]) {
//           virtualLists[dateStr] = {
//             id: dateStr,
//             name: formatted,
//             todos: [],
//             created: dateStr,
//           };
//         }
//       }
//       renderTodos();
//       updateActiveListHighlight(); // ✅ ensure calendar-linked lists don’t mess up highlighting
//     });

//     calendarGrid.appendChild(dayCell);
//   }
// }

// // Month navigation
// prevMonthBtn.addEventListener("click", () => {
//   currentDate.setMonth(currentDate.getMonth() - 1);
//   renderCalendar(currentDate);
// });
// nextMonthBtn.addEventListener("click", () => {
//   currentDate.setMonth(currentDate.getMonth() + 1);
//   renderCalendar(currentDate);
// });

// // Initialize
// renderLists();
// renderTodos();
// renderCalendar(currentDate);

import { renderLists } from "./taskLists.js";
import { renderTodos } from "./todos.js";
import { renderCalendar } from "./calendar.js";

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
let currentDate = new Date();
const activeListIdRef = { current: "default" };

lists.push({
  id: "default",
  name: "Today",
  todos: [],
  created: new Date().toISOString().split("T")[0],
});

function updateAll() {
  renderLists(
    lists,
    activeListIdRef.current,
    taskLists,
    activeListTitle,
    () =>
      renderTodos(
        activeListIdRef.current,
        lists,
        virtualLists,
        activeListTitle,
        todoItems,
        renderCalendar,
        currentDate
      ),
    renderCalendar,
    currentDate
  );
  renderTodos(
    activeListIdRef.current,
    lists,
    virtualLists,
    activeListTitle,
    todoItems,
    renderCalendar,
    currentDate
  );
  renderCalendar(
    currentDate,
    calendarGrid,
    lists,
    virtualLists,
    activeListIdRef,
    activeListTitle,
    renderTodos
  );
}

// New list button
newListBtn.addEventListener("click", () => {
  const name = prompt("Enter list name:");
  if (name) {
    const newList = {
      id: Date.now().toString(),
      name: name.trim(),
      todos: [],
      created: new Date().toISOString().split("T")[0],
    };
    lists.push(newList);
    activeListIdRef.current = newList.id;
    updateAll();
  }
});

// Daily list button
dailyTodoListBtn.addEventListener("click", () => {
  activeListIdRef.current = "default";
  updateAll();
});

// Handle new todo
document.getElementById("todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("new-todo-input");
  const text = input.value.trim();
  if (text) {
    let list = lists.find((l) => l.id === activeListIdRef.current);
    if (!list) {
      list = virtualLists[activeListIdRef.current];
      lists.push(list);
      delete virtualLists[activeListIdRef.current];
    }
    list.todos.push({ text, completed: false, deleted: false });
    input.value = "";
    updateAll();
  }
});

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateAll();
});
nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateAll();
});

updateAll();
