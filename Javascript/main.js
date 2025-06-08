import { renderLists } from "./lists.js";
import { renderTodos } from "./todo.js";
import { renderCalendar } from "./calendar.js";
// export let lists = [];
export let virtualLists = {};
export let currentDate = new Date();
//All initial renders
renderLists();
renderTodos();
renderCalendar(currentDate);
