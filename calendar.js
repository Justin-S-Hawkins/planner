export function renderCalendar(
  date,
  calendarGrid,
  lists,
  virtualLists,
  activeListIdRef,
  activeListTitle,
  renderTodos
) {
  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const monthYearDisplay = document.getElementById("month-year");

  const monthName = date.toLocaleString("default", { month: "long" });

  monthYearDisplay.textContent = `${monthName} ${year}`;

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty-cell");
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.classList.add("day-cell");
    cell.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const existingList = lists.find((list) => list.created === dateStr);

    if (existingList && existingList.todos.length > 0) {
      cell.classList.add("has-todos");
    }

    cell.addEventListener("click", () => {
      const weekday = new Date(year, month, day).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const formatted = `${weekday} ${day}`;

      if (existingList) {
        activeListIdRef.current = existingList.id;
        activeListTitle.textContent = existingList.name;
      } else {
        activeListIdRef.current = dateStr;
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
      renderTodos(
        activeListIdRef.current,
        lists,
        virtualLists,
        activeListTitle,
        document.getElementById("todo-items"),
        renderCalendar,
        date
      );
    });

    calendarGrid.appendChild(cell);
  }
}
