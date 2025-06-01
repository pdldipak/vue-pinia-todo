import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../todo'
import axios from 'axios'

vi.mock('axios')

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('State', () => {
    it('initializes with empty todos', () => {
      const store = useTodoStore()
      expect(store.todos).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('getTodos returns all todos', () => {
      const store = useTodoStore()
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
        { id: 2, title: 'Another Todo', completed: true },
      ]
      store.todos = mockTodos
      expect(store.getTodos).toEqual(mockTodos)
    })

    it('getTodoById returns correct todo', () => {
      const store = useTodoStore()
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
        { id: 2, title: 'Another Todo', completed: true },
      ]
      store.todos = mockTodos
      expect(store.getTodoById(1)).toEqual(mockTodos[0])
      expect(store.getTodoById(3)).toBeUndefined()
    })
  })

  describe('Actions', () => {
    describe('fetchTodos', () => {
      it('fetches todos successfully', async () => {
        const mockTodos = [{ id: 1, title: 'Test Todo', completed: false }]
        axios.get.mockResolvedValueOnce({ data: mockTodos })

        const store = useTodoStore()
        await store.fetchTodos()

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.todos[0].title).toBe(mockTodos[0].title)
        expect(store.todos[0].completed).toBe(mockTodos[0].completed)
        expect(store.todos[0].createdAt).toBeDefined()
      })

      it('handles fetch error', async () => {
        const errorMessage = 'Network Error'
        axios.get.mockRejectedValueOnce(new Error(errorMessage))

        const store = useTodoStore()
        await store.fetchTodos()

        expect(store.loading).toBe(false)
        expect(store.error).toBe('Failed to fetch todos')
        expect(store.todos).toEqual([])
      })
    })

    describe('addTodo', () => {
      it('adds todo successfully', async () => {
        const newTodo = {
          id: 1,
          title: 'New Todo',
          completed: false,
        }
        axios.post.mockResolvedValueOnce({ data: newTodo })

        const store = useTodoStore()
        await store.addTodo('New Todo')

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.todos[0].title).toBe(newTodo.title)
        expect(store.todos[0].completed).toBe(false)
        expect(store.todos[0].createdAt).toBeDefined()
      })

      it('handles add error', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'))

        const store = useTodoStore()
        await store.addTodo('New Todo')

        expect(store.loading).toBe(false)
        expect(store.error).toBe('Failed to add todo')
        expect(store.todos).toEqual([])
      })
    })

    describe('updateTodo', () => {
      it('updates todo successfully', async () => {
        const store = useTodoStore()
        store.todos = [{ id: 1, title: 'Old Title', completed: false }]

        const updatedTodo = { id: 1, title: 'Updated Title', completed: true }
        axios.patch.mockResolvedValueOnce({ data: updatedTodo })

        await store.updateTodo(1, { completed: true })

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.todos[0].completed).toBe(true)
      })

      it('handles update error', async () => {
        const store = useTodoStore()
        store.todos = [{ id: 1, title: 'Old Title', completed: false }]

        axios.patch.mockRejectedValueOnce(new Error('Network Error'))

        await store.updateTodo(1, { completed: true })

        expect(store.loading).toBe(false)
        expect(store.error).toBe('Failed to update todo')
        expect(store.todos[0].completed).toBe(false)
      })
    })

    describe('deleteTodo', () => {
      it('deletes todo successfully', async () => {
        const store = useTodoStore()
        store.todos = [{ id: 1, title: 'Test Todo', completed: false }]

        axios.delete.mockResolvedValueOnce({})

        await store.deleteTodo(1)

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.todos).toEqual([])
      })

      it('handles delete error', async () => {
        const store = useTodoStore()
        const initialTodos = [{ id: 1, title: 'Test Todo', completed: false }]
        store.todos = [...initialTodos]

        axios.delete.mockRejectedValueOnce(new Error('Network Error'))

        await store.deleteTodo(1)

        expect(store.loading).toBe(false)
        expect(store.error).toBe('Failed to delete todo')
        expect(store.todos).toEqual(initialTodos)
      })
    })
  })
})
