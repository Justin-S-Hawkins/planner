import { virtualLists, currentDate } from "./main.js";
import { renderTodos } from "./todo.js";
import {
  updateActiveListHighlight,
  activeListTitle,
  lists,
  state,
} from "./lists.js";

const calendarGrid = document.getElementById("calendar-grid");
const monthYearDisplay = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

//🟦 9. Calendar Rendering & Day Selection
//Dynamically generates the monthly calendar grid, marks days with todos, and lets you select a day to see or create a list for it.
export function renderCalendar(date) {
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
      const createListName = prompt("create List Name");

      if (found) {
        //<------- null when prompt isn't entered - fixed
        state.activeListId = found.id;
        activeListTitle.textContent = found.created;
      } else {
        state.activeListId = dateStr;
        activeListTitle.textContent = formatted;
        if (!virtualLists[dateStr]) {
          virtualLists[dateStr] = {
            id: dateStr,
            name: !createListName
              ? formatted
              : `${formatted}: ${createListName} `,
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
