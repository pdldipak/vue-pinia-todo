import { createRouter, createWebHistory } from 'vue-router'
import TodoListView from '@/views/TodoListView.vue'
import TodoDetailView from '@/views/TodoDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: TodoListView,
  },
  {
    path: '/todo/:id',
    name: 'todo-detail',
    component: TodoDetailView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
