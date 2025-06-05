import { currentDate } from "./main.js";
import { renderTodos } from "./todo.js";
import { renderCalendar } from "./calendar.js";
const taskLists = document.getElementById("task-lists");
export const state = {
  activeListId: null,
};
export let lists = [];
export const activeListTitle = document.getElementById("active-list-title");
const defaultList = {
  id: "default",
  name: "Today",
  todos: [],
  created: new Date().toISOString().split("T")[0],
};
lists.push(defaultList);
state.activeListId = "default";

//🟦 3. Utility: Highlight Active List
//ensures the correct list is visually highlighted in the sidebar when selected
export function updateActiveListHighlight() {
  const allListItems = taskLists.querySelectorAll("li");
  allListItems.forEach((li) => {
    if (li.dataset.id === state.activeListId) {
      li.classList.add("active-list");
    } else {
      li.classList.remove("active-list");
    }
  });
}

//🟦 4. Sidebar: Render List
//Renders your sidebar lists and attaches event listeners for selecting and deleting lists.
export function renderLists() {
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
      const wasActive = state.activeListId === list.id;

      lists = lists.filter((l) => l.id !== list.id);

      if (wasActive) {
        state.activeListId = "default";
        activeListTitle.textContent = "Today";
        renderTodos();
      }

      renderLists();
      renderCalendar(currentDate);
      updateActiveListHighlight();
    });
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
      state.activeListId = list.id;
      activeListTitle.textContent = list.name;
      renderTodos();
      updateActiveListHighlight();
    });

    taskLists.appendChild(li);
  });

  updateActiveListHighlight();
}
