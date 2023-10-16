import { ChangeEvent, useEffect, useState } from "react";
import { Todo } from "../types";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  async function fetchData() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.submitBtn.disabled = true;

    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        task: e.currentTarget.task.value,
        who: e.currentTarget.who.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setTodos([{ ...data, id: todos.length + 1000 }, ...todos]);

    // @ts-ignore
    e.target.submitBtn.disabled = false;
    // @ts-ignore
    e.target.reset();
  }

  async function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const done = e.target.checked;
    e.target.disabled = true;

    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ done }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const idx = todos.findIndex(todo => todo.id === id);
    const newTodos = [...todos]
    newTodos[idx].done = done;
    setTodos(newTodos);

    e.target.disabled = false;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real Time Update POC</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Task" name="task" />
        <input type="text" placeholder="Assignee" name="who" />

        <button type="submit" name="submitBtn">Add Todo</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={(evt) => handleCheckboxChange(evt, todo.id)}
              />
              <strong>{todo.task}</strong>
            </label>

            <br />
            <span>Assigned to: <strong>{todo.who}</strong></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
