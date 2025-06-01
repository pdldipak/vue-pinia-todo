import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useTodoStore } from '@/stores/todo'
import TodoDetailView from '../TodoDetailView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/todo/:id',
      name: 'todo-detail',
      component: TodoDetailView,
    },
    {
      path: '/',
      name: 'home',
      component: { template: '<div>Home</div>' },
    },
  ],
})

describe('TodoDetailView', () => {
  let wrapper
  let store

  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    createdAt: new Date('2024-01-01T12:00:00').toISOString(),
  }

  const createWrapper = async (route = '/todo/1') => {
    await router.push(route)
    await router.isReady()
    wrapper = mount(TodoDetailView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              todo: {
                todos: [mockTodo],
              },
            },
          }),
          router,
        ],
      },
    })
    store = useTodoStore()
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    await router.push('/')
    await router.isReady()
    await createWrapper()
  })

  it('renders correctly with todo data', async () => {
    const title = wrapper.find('.todo-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Test Todo')
    const badge = wrapper.find('.status-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Pending')
  })

  it('shows loading state', async () => {
    store.loading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading task details...')
  })

  it('shows error state when todo not found', async () => {
    await createWrapper('/todo/999')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Task not found')
  })

  it('toggles todo completion status', async () => {
    const btn = wrapper.find('.primary-btn')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(store.updateTodo).toHaveBeenCalledWith('1', { completed: true })
  })

  it('deletes todo and navigates back', async () => {
    const routerPush = vi.spyOn(router, 'push')
    const btn = wrapper.find('.delete-btn')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(store.deleteTodo).toHaveBeenCalledWith('1')
    expect(routerPush).toHaveBeenCalledWith('/')
  })

  it('navigates back when clicking back button', async () => {
    const routerPush = vi.spyOn(router, 'push')
    await wrapper.find('.back-btn').trigger('click')
    expect(routerPush).toHaveBeenCalledWith('/')
  })

  it('shows completed status when todo is completed', async () => {
    store.todos = [
      {
        ...mockTodo,
        completed: true,
      },
    ]
    await wrapper.vm.$nextTick()
    const badge = wrapper.find('.status-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Completed')
    expect(badge.classes()).toContain('completed')
    const btn = wrapper.find('.primary-btn')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('Mark as Pending')
  })

  it('formats date correctly', () => {
    const formatted = wrapper.vm.formatDate(mockTodo.createdAt)
    expect(formatted).toMatch(/Monday, January 1, 2024 at 12:00 PM/)
  })

  it('handles todo updates correctly', async () => {
    const btn = wrapper.find('.primary-btn')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(store.updateTodo).toHaveBeenCalledWith('1', { completed: true })
    // Simulate successful update
    store.todos = [
      {
        ...mockTodo,
        completed: true,
      },
    ]
    await wrapper.vm.$nextTick()
    const badge = wrapper.find('.status-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Completed')
    const btn2 = wrapper.find('.primary-btn')
    expect(btn2.exists()).toBe(true)
    expect(btn2.text()).toBe('Mark as Pending')
  })
})
