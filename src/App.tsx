import { useEffect, useState } from "react";
import "./App.css";

interface Todo {
  id: number;
  title: string;
}

const App = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real Time Update POC</h1>
      </header>

      {todos.map((todo) => (
        <h3 key={todo.id}>{todo.title}</h3>
      ))}
    </div>
  );
};

export default App;
