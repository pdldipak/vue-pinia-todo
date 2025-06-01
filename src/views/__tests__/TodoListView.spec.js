import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useTodoStore } from '@/stores/todo'
import TodoListView from '../TodoListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Create a router instance for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/todo/:id',
      name: 'todo-detail',
      component: { template: '<div>Todo Detail</div>' },
    },
  ],
})

describe('TodoListView', () => {
  let wrapper
  let store

  const createWrapper = () => {
    wrapper = mount(TodoListView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          router,
        ],
      },
    })
    store = useTodoStore()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    createWrapper()
  })

  it('renders correctly', () => {
    expect(wrapper.find('h1').text()).toBe('TaskFlow')
    expect(wrapper.find('.subtitle').text()).toBe('Streamline your workflow')
  })

  it('shows loading state', async () => {
    store.loading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading your tasks...')
  })

  it('shows error state', async () => {
    store.error = 'Failed to fetch todos'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to fetch todos')
  })

  it('shows empty state when no todos', async () => {
    store.todos = []
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Your task list is empty')
  })

  it('renders todo list when todos exist', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo', completed: false, createdAt: new Date().toISOString() },
    ]
    store.todos = mockTodos
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.todo-list').exists()).toBe(true)
    expect(wrapper.find('.todo-title').text()).toBe('Test Todo')
  })

  it('adds new todo', async () => {
    const input = wrapper.find('.todo-input')
    await input.setValue('New Todo')
    await wrapper.find('.primary-btn').trigger('click')

    expect(store.addTodo).toHaveBeenCalledWith('New Todo')
    expect(input.element.value).toBe('')
  })

  it('toggles todo completion', async () => {
    const mockTodo = { id: 1, title: 'Test Todo', completed: false }
    store.todos = [mockTodo]
    await wrapper.vm.$nextTick()

    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(store.updateTodo).toHaveBeenCalledWith(1, { completed: true })
  })

  it('deletes todo', async () => {
    const mockTodo = { id: 1, title: 'Test Todo', completed: false }
    store.todos = [mockTodo]
    await wrapper.vm.$nextTick()

    await wrapper.find('.delete-btn').trigger('click')
    expect(store.deleteTodo).toHaveBeenCalledWith(1)
  })

  it('navigates to todo detail view when clicking todo', async () => {
    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString(),
    }
    store.todos = [mockTodo]
    await wrapper.vm.$nextTick()

    const routerPush = vi.spyOn(router, 'push')
    await wrapper.find('.todo-info').trigger('click')
    expect(routerPush).toHaveBeenCalledWith('/todo/1')
  })

  it('formats date correctly', () => {
    const date = new Date('2024-01-01T12:00:00')
    const formatted = wrapper.vm.formatDate(date.toISOString())
    expect(formatted).toMatch(/[A-Za-z]{3} \d{1,2}, \d{1,2}:\d{2} [AP]M/)
  })
})
