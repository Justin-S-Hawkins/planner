export function renderTodos(
  activeListId,
  lists,
  virtualLists,
  activeListTitle,
  todoItemsElement,
  renderCalendar,
  currentDate
) {
  todoItemsElement.innerHTML = "";

  const activeList =
    lists.find((list) => list.id === activeListId) ||
    virtualLists[activeListId];

  if (activeList) {
    activeListTitle.textContent = activeList.name;
    activeList.todos.forEach((todo, index) => {
      const li = document.createElement("li");

      const circle = document.createElement("span");
      circle.classList.add("todo-circle");
      if (todo.completed) circle.classList.add("completed");
      else if (todo.deleted) circle.classList.add("deleted");

      circle.addEventListener("click", () => {
        if (!todo.completed && !todo.deleted) todo.completed = true;
        else if (todo.completed) {
          todo.completed = false;
          todo.deleted = true;
        } else {
          activeList.todos.splice(index, 1);
        }
        renderTodos(
          activeListId,
          lists,
          virtualLists,
          activeListTitle,
          todoItemsElement,
          renderCalendar,
          currentDate
        );
        renderCalendar(currentDate);
      });

      const text = document.createElement("span");
      text.textContent = todo.text;
      if (todo.completed) text.style.textDecoration = "line-through";
      else if (todo.deleted) text.style.opacity = "0.5";

      li.appendChild(circle);
      li.appendChild(text);
      todoItemsElement.appendChild(li);
    });
  }
}
