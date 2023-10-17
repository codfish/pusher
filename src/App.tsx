import { ChangeEvent, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { Todo } from '../types';
import './App.css';

var pusher = new Pusher('aa6d877be6c6232da1fc', {
  cluster: 'us2'
});

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const data = await res.json();
  return data;
}

const App = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);


  useEffect(() => {
    fetchTodos().then(data => setTodos(data));

    pusher.subscribe('todos').bind('updated', () => {
      fetchTodos().then(data => setTodos(data));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.submitBtn.disabled = true;

    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({
        task: e.currentTarget.task.value,
        who: e.currentTarget.who.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If the request was successful, update the state or refetch the todos
    const data = await fetchTodos();
    setTodos(data);

    // @ts-ignore
    e.target.submitBtn.disabled = false;
    // @ts-ignore
    e.target.reset();
  }

  // @ts-ignore
  async function handleDelete(evt, id: number) {
    evt.preventDefault();

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      // If the request was successful, update the state or refetch the todos
      fetchTodos().then(data => setTodos(data));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  async function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const done = e.target.checked;
    e.target.disabled = true;

    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const idx = todos.findIndex(todo => todo.id === id);
    const newTodos = [...todos]
    newTodos[idx].done = done;
    setTodos(newTodos);

    e.target.disabled = false;
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Real Time Update POC</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Task' name='task' />
        <input type='text' placeholder='Assignee' name='who' />

        <button type='submit' name='submitBtn'>Add Todo</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type='checkbox'
                checked={todo.done}
                onChange={(evt) => handleCheckboxChange(evt, todo.id)}
              />
              <strong>{todo.task}</strong>
            </label>

            <br />
            <span>Assigned to: <strong>{todo.who}</strong></span>
            <br />
            <span><button onClick={(evt) => handleDelete(evt, todo.id)}>Delete</button></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
