import { currentDate } from "./main.js";
import { renderTodos } from "./todo.js";
import { renderCalendar } from "./calendar.js";
const taskLists = document.getElementById("task-lists");
export const state = {
  activeListId: null,
};
export let lists = []; // core list container
export const activeListTitle = document.getElementById("active-list-title"); // displayed list title in todo and tasklist sidebar
const defaultList = {
  //default todo ( goes by day )
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
  // creating the highlight function
  const allListItems = taskLists.querySelectorAll("li"); // selecting all li in tasik list sidebar
  allListItems.forEach((li) => {
    // for each li
    if (li.dataset.id === state.activeListId) {
      // if the id is == to acitve id
      li.classList.add("active-list"); // then add the class active list for highlight style
    } else {
      //otherwise
      li.classList.remove("active-list"); // remove the class from all the others not equal to the active id
    }
  });
}

//🟦 4. Sidebar: Render List
//Renders your sidebar lists and attaches event listeners for selecting and deleting lists.
export function renderLists() {
  taskLists.innerHTML = ""; // clear tasklist sidebar, so theres no duplicates
  lists.forEach((list) => {
    // for each list in lists
    if (list.id === "default") return; // early return in default is id
    const li = document.createElement("li"); //labeling the list with its title and assigning it the right id when stored in the tasklist sidebar
    li.textContent = list.name; //list name displayed
    li.dataset.id = list.id; // list id for identification

    const deleteBtn = document.createElement("button"); // creating "x delete button"
    deleteBtn.textContent = "✖"; //adding the context to the delete
    deleteBtn.classList.add("delete-btn"); //addding class for styles
    deleteBtn.addEventListener("click", (e) => {
      //event listener, if clicked the activeListId is === to list.id
      e.stopPropagation(); // stops the propogation of the parent element the delete-button is attached to
      const wasActive = state.activeListId === list.id; // if the list you deleted was the list you were currently on

      lists = lists.filter((l) => l.id !== list.id); //giving lists a new value of the "lists" that are still have active id's
      //WHY CANT I USE remove()?
      if (wasActive) {
        //return to home if was active is true ( if you deleted the list you were on)
        state.activeListId = "default";
        activeListTitle.textContent = "Today";
        renderTodos();
      }
      // re-render all effected areas
      renderLists();
      renderCalendar(currentDate);
      updateActiveListHighlight();
    });
    li.appendChild(deleteBtn); // appending the detete button the the li

    li.addEventListener("click", () => {
      // if you click on a list in the task bar it will populate the list in the center display area
      state.activeListId = list.id;
      activeListTitle.textContent = list.name;
      //re-render effected areas
      renderTodos();
      updateActiveListHighlight();
    });
    taskLists.appendChild(li); //append the li (Lists in lists) to the taskList
  });

  updateActiveListHighlight(); // rerender highlights
}
