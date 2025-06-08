import { virtualLists, currentDate } from "./main.js";
import { renderTodos } from "./todo.js";
import {
  updateActiveListHighlight,
  activeListTitle,
  lists,
  state,
  renderLists,
} from "./lists.js";

const calendarGrid = document.getElementById("calendar-grid");
const monthYearDisplay = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

//🟦 9. Calendar Rendering & Day Selection
//Dynamically generates the monthly calendar grid, marks days with todos, and lets you select a day to see or create a list for it.
export function renderCalendar(date) {
  calendarGrid.innerHTML = ""; //clears grid on render to prevent duplication

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // weekday labels
  weekdays.forEach((day) => {
    // for each weekday value day
    const dayHeader = document.createElement("div"); //create a div element to contain the weekday
    dayHeader.classList.add("day-header"); //add class for styles
    dayHeader.textContent = day; // fill the each div with each value
    calendarGrid.appendChild(dayHeader); //append it to the calendar grid.
  });

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1); //getting the year,month, and the "1"st day of the month
  const lastDay = new Date(year, month + 1, 0); // getting the year, and skipping to next month, and then backtracking a day wiht "0" to get the last day of the month we want to be on.

  const startDay = firstDay.getDay(); //further specifiying the exact day to get the beggining of the month by DAY monday, tuesday ect. not 1,2,3 ect. (getDay)
  const totalDays = lastDay.getDate(); // and the end of the month, the last day will be to total number of days. (getDate)

  const monthName = firstDay.toLocaleString("default", { month: "long" }); //creating the month name by grabing the month in long formant
  monthYearDisplay.textContent = `${monthName} ${year}`; //combining month Name and year variables to get the center label for our calendar.

  for (let i = 0; i < startDay; i++) {
    // for loop that created the empty cells for out calendar
    const emptyCell = document.createElement("div"); //creating the div
    emptyCell.classList.add("empty-cell"); //adding the class for styles
    calendarGrid.appendChild(emptyCell); //appending the empty cells to the calendar grid
  }

  for (let day = 1; day <= totalDays; day++) {
    //for loop for day cell creation and addition to calendar
    const dayCell = document.createElement("div"); // creating the div
    dayCell.classList.add("day-cell"); //adding class for styles.
    dayCell.textContent = day; // filling the day cells with the day let we intialized in the for loop as long as its less than or equal to the toal number of days.

    if (
      // if the day, month, and year, match the currentDate
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear()
    ) {
      dayCell.classList.add("today"); //attach the today class for styles (yellow highlight)
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      //
      day
    ).padStart(2, "0")}`; // creating the formated date "YYYY-MM-DD" in string form for each day for identificantion and organization purpopses.

    const found = lists.find((list) => list.created === dateStr); // found, finds the lists that were created on a specific date using dateStr
    if (found && found.todos.length > 0) {
      // if found is true and has todos, then
      dayCell.classList.add("has-todos"); // add this class for styles to your daycell (lightgray)
    }

    dayCell.addEventListener("click", () => {
      //adding the event listener
      const dateObj = new Date(year, month, day); //the dateObj represents the newDates year,month, and day when its applied
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" }); // long format of the weekday to get the full name monday, wednesday ect.
      const formatted = `${weekday} ${day}`; // formatted will be used in helping name our lists and combines day from the for loop let variable
      const createListName = prompt("create List Name"); //the prompt for creating the a list name to go along with the formatted date, when clicking a date on the
      //calendar to create a list.

      if (found) {
        // if found is true
        state.activeListId = found.id; // founds id becomes the active id
        activeListTitle.textContent = found.created; // the titles becomes the created date of found
      } else {
        // this is where virtual lists is introduced
        state.activeListId = dateStr; // if found is not true, then the active id == dateStr, DO I NEED THIS PART ? REVIEW
        activeListTitle.textContent = formatted; // and the list title == formatted
        if (!virtualLists[dateStr]) {
          // if virtualLists doesnt have a dateStr value create one using the current dateStr, and use the list creation format.
          virtualLists[dateStr] = {
            id: dateStr, // date string used as the id
            name: !createListName
              ? formatted
              : `${formatted}: ${createListName} `, //conditional to avoid null value on list title when choosing from calendar.
            todos: [],
            created: dateStr, // date string used as the created value
          };
        }
      }
      // renderLists(); //re-render all lists.
      renderTodos(); //re-render todos every selection
      updateActiveListHighlight(); // update highlights every selection.
    });

    calendarGrid.appendChild(dayCell); // append the day-cells to the calendar( style them in a 7, 1fr format with grid.)
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
