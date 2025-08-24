import { useEffect, useMemo, useState } from 'react' /* usestate- store input/theme (todos), effect-saving to local storage and all basically side effects, memo- memory to count total todos */
import './App.css'

function App() {
  const [newTodoText, setNewTodoText] = useState('')
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos')
      return raw ? JSON.parse(raw) : []
    } catch (_) {
      return []
    }
  })

  const [theme, setTheme] = useState("light") 

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)) /* stors in browserr*/
  }, [todos])

  // Apply theme to <body>
  useEffect(() => {
    document.body.className = theme + "-mode"
  }, [theme])

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.done).length, //coutninf the number of todos
    [todos]
  )

  function handleAddTodo(event) { //add
    event.preventDefault()
    const text = newTodoText.trim()
    if (!text) return
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      done: false,
      createdAt: Date.now(),
    }
    setTodos((current) => [newTodo, ...current])
    setNewTodoText('')
  }

  function handleToggleTodo(id) { //finishing the todo
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  function handleDeleteTodo(id) { //deleting the todo
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function handleClearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.done))
  }

  return (
    <div className="app">
      <h1 className="title">To-Do List</h1>

      <button 
        className="theme-toggle-btn"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")} //theme button
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <form onSubmit={handleAddTodo} className="new-todo-form" aria-label="Add a new to-do">
        <input
          type="text"
          className="new-todo-input"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          aria-label="New to-do"
        />
        <button type="submit" className="add-btn" disabled={!newTodoText.trim()}>
          Add
        </button>
      </form>

      <div className="toolbar">
        <span>
          {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
        </span>
        <button className="clear-btn" onClick={handleClearCompleted} disabled={todos.every((t) => !t.done)}>
          Clear completed
        </button>
      </div>

      <ul className="todo-list" role="list">
        {todos.length === 0 && (
          <li className="empty">No to-dos yet. Add one above!</li>
        )}
        {todos.map((todo) => (
          <li key={todo.id} className={`todo ${todo.done ? 'done' : ''}`}>
            <label className="todo-item">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggleTodo(todo.id)}
                aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
              />
              <span className="todo-text">{todo.text}</span>
            </label>
            <button
              className="delete-btn"
              aria-label={`Delete ${todo.text}`}
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
