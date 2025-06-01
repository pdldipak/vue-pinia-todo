import { defineStore } from 'pinia'
import axios from 'axios'

// Using JSONPlaceholder API for demo
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false,
    error: null,
  }),

  getters: {
    getTodos: (state) => state.todos,
    getTodoById: (state) => (id) => state.todos.find((todo) => todo.id === id),
  },

  actions: {
    // GET request to fetch todos
    async fetchTodos() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/todos?_limit=10`)
        this.todos = response.data.map((todo) => ({
          ...todo,
          createdAt: new Date().toISOString(), // Adding createdAt since it's not in the API response
        }))
      } catch (error) {
        this.error = 'Failed to fetch todos'
        console.error('Error fetching todos:', error)
      } finally {
        this.loading = false
      }
    },

    // POST request to add a todo
    async addTodo(title) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_BASE_URL}/todos`, {
          title,
          completed: false,
          userId: 1, // Required by the API
        })

        const newTodo = {
          ...response.data,
          createdAt: new Date().toISOString(),
        }

        this.todos.unshift(newTodo) // Add to the beginning of the list
        return newTodo
      } catch (error) {
        this.error = 'Failed to add todo'
        console.error('Error adding todo:', error)
      } finally {
        this.loading = false
      }
    },

    // PATCH request to update a todo
    async updateTodo(id, updates) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.patch(`${API_BASE_URL}/todos/${id}`, updates)

        const todoIndex = this.todos.findIndex((todo) => todo.id === id)
        if (todoIndex !== -1) {
          this.todos[todoIndex] = {
            ...this.todos[todoIndex],
            ...response.data,
          }
        }
        return this.todos[todoIndex]
      } catch (error) {
        this.error = 'Failed to update todo'
        console.error('Error updating todo:', error)
      } finally {
        this.loading = false
      }
    },

    // DELETE request to remove a todo
    async deleteTodo(id) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_BASE_URL}/todos/${id}`)
        this.todos = this.todos.filter((todo) => todo.id !== id)
      } catch (error) {
        this.error = 'Failed to delete todo'
        console.error('Error deleting todo:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
