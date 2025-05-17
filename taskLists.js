export function renderLists(
  lists,
  activeListId,
  taskListsElement,
  activeListTitle,
  renderTodos,
  renderCalendar,
  currentDate
) {
  taskListsElement.innerHTML = "";
  lists.forEach((list) => {
    if (list.id === "default") return;

    const li = document.createElement("li");
    li.textContent = list.name;
    li.dataset.id = list.id;

    if (list.id === activeListId) {
      li.classList.add("active-list");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      lists = lists.filter((l) => l.id !== list.id);
      if (activeListId === list.id) {
        activeListId = "default";
        activeListTitle.textContent = "Today";
        renderTodos();
      }
      renderLists(
        lists,
        activeListId,
        taskListsElement,
        activeListTitle,
        renderTodos,
        renderCalendar,
        currentDate
      );
      renderCalendar(currentDate);
    });
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
      activeListId = list.id;
      activeListTitle.textContent = list.name;
      renderTodos();
      renderLists(
        lists,
        activeListId,
        taskListsElement,
        activeListTitle,
        renderTodos,
        renderCalendar,
        currentDate
      );
    });

    taskListsElement.appendChild(li);
  });

  return activeListId; // So we can update main
}
