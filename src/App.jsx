import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState('MEDIUM')
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos')
      return raw ? JSON.parse(raw) : []
    } catch (_) {
      return []
    }
  })

  const [theme, setTheme] = useState("dark") // default theme

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Apply theme to <body>
  useEffect(() => {
    document.body.className = theme + "-mode"
  }, [theme])

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  )

  // Sort todos by priority (HIGH > MEDIUM > LOW) and then by creation time
  const sortedTodos = useMemo(() => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    return [...todos].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.createdAt - a.createdAt
    })
  }, [todos])

  function handleAddTodo(event) {
    event.preventDefault()
    const text = newTodoText.trim()
    if (!text) return
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      priority: newTodoPriority,
      done: false,
      createdAt: Date.now(),
    }
    setTodos((current) => [newTodo, ...current])
    setNewTodoText('')
    setNewTodoPriority('MEDIUM') // Reset to default priority
  }

  function handleToggleTodo(id) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  function handleDeleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function handleClearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.done))
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'HIGH':
        return '#ff4444'
      case 'MEDIUM':
        return '#ffaa00'
      case 'LOW':
        return '#44aa44'
      default:
        return '#666666'
    }
  }

  function getPriorityLabel(priority) {
    return priority.charAt(0) + priority.slice(1).toLowerCase()
  }

  return (
    <div className="app">
      {/* Theme toggle button - moved to top */}
      <button 
        className="theme-toggle-btn"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <h1 className="title">To-Do List</h1>

      <form onSubmit={handleAddTodo} className="new-todo-form" aria-label="Add a new to-do">
        <input
          type="text"
          className="new-todo-input"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          aria-label="New to-do"
        />
        <select
          className="priority-select"
          value={newTodoPriority}
          onChange={(e) => setNewTodoPriority(e.target.value)}
          aria-label="Priority level"
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>
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
        {sortedTodos.map((todo) => (
          <li key={todo.id} className={`todo ${todo.done ? 'done' : ''}`}>
            <label className="todo-item">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggleTodo(todo.id)}
                aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
              />
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}
                  title={`Priority: ${getPriorityLabel(todo.priority)}`}
                >
                  {getPriorityLabel(todo.priority)}
                </span>
              </div>
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
