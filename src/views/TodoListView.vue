<template>
  <div class="todo-container">
    <div class="todo-header">
      <div class="header-content">
        <h1>TaskFlow</h1>
        <p class="subtitle">Streamline your workflow</p>
      </div>

      <div class="add-todo">
        <input
          v-model="newTodoTitle"
          @keyup.enter="handleAddTodo"
          placeholder="Add a new task..."
          :disabled="todoStore.loading"
          class="todo-input"
        />
        <button
          @click="handleAddTodo"
          :disabled="!newTodoTitle || todoStore.loading"
          class="primary-btn"
        >
          <span class="btn-content">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Add
          </span>
        </button>
      </div>
    </div>

    <div v-if="todoStore.loading" class="loading">
      <div class="loading-spinner"></div>
      Loading your tasks...
    </div>

    <div v-if="todoStore.error" class="error">
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ todoStore.error }}
    </div>

    <transition-group name="list" tag="div" class="todo-list" v-if="todos.length">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="todo-item"
        :class="{ 'is-completed': todo.completed }"
      >
        <div class="todo-content">
          <label class="checkbox-container">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="handleToggleTodo(todo)"
              :disabled="todoStore.loading"
            />
            <span class="checkmark"></span>
          </label>
          <div class="todo-info" @click="goToTodoDetail(todo.id)">
            <span class="todo-title">{{ todo.title }}</span>
            <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
          </div>
        </div>
        <button
          @click="handleDeleteTodo(todo.id)"
          class="delete-btn"
          :disabled="todoStore.loading"
          title="Delete task"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </transition-group>

    <div v-else class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p>Your task list is empty</p>
      <span class="empty-hint">Start by adding a new task above</span>
    </div>
  </div>
</template>

<script>
import { useTodoStore } from '@/stores/todo'
import { useRouter } from 'vue-router'

export default {
  name: 'TodoListView',

  data() {
    return {
      newTodoTitle: '',
      todoStore: useTodoStore(),
      router: useRouter(),
    }
  },

  computed: {
    todos() {
      return this.todoStore.getTodos
    },
  },

  async mounted() {
    await this.todoStore.fetchTodos()
  },

  methods: {
    async handleAddTodo() {
      if (!this.newTodoTitle.trim()) return
      await this.todoStore.addTodo(this.newTodoTitle.trim())
      this.newTodoTitle = ''
    },

    async handleToggleTodo(todo) {
      await this.todoStore.updateTodo(todo.id, { completed: !todo.completed })
    },

    async handleDeleteTodo(id) {
      await this.todoStore.deleteTodo(id)
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },

    goToTodoDetail(id) {
      this.router.push(`/todo/${id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.todo-container {
  @include container(800px);
  @include fade-in;
  padding-top: $spacing-2xl;
  padding-bottom: $spacing-2xl;
}

.todo-header {
  margin-bottom: $spacing-2xl;
}

.header-content {
  text-align: center;
  margin-bottom: $spacing-xl;

  h1 {
    @include heading-1;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: $spacing-xs;
  }

  .subtitle {
    color: $text-muted;
    font-size: $font-size-lg;
  }
}

.add-todo {
  @include flex(row, center, center, $spacing-base);
  margin-top: $spacing-lg;

  @include responsive($breakpoint-sm) {
    flex-direction: column;
    gap: $spacing-base;
  }
}

.todo-input {
  flex: 1;
  padding: $spacing-base;
  border: 1px solid $border-color;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  background: rgba($background-light, 0.8);
  backdrop-filter: blur(8px);
  transition: all $transition-fast;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  &:disabled {
    background: $background-dark;
    cursor: not-allowed;
  }

  @include responsive($breakpoint-sm) {
    width: 100%;
  }
}

.primary-btn {
  @include button-primary;
  min-width: 120px;

  .btn-content {
    @include flex(row, center, center, $spacing-sm);
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  @include responsive($breakpoint-sm) {
    width: 100%;
  }
}

.todo-list {
  @include flex(column, flex-start, stretch, $spacing-base);
}

.todo-item {
  @include card;
  @include flex(row, space-between, center);
  transition: all $transition-base;
  cursor: pointer;
  padding: $spacing-lg;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-xl;
  }

  &.is-completed {
    background: rgba($background-dark, 0.8);

    .todo-title {
      color: $text-muted;
      text-decoration: line-through;
    }
  }
}

.todo-content {
  @include flex(row, flex-start, center, $spacing-base);
  flex: 1;
  min-width: 0; // For text truncation
}

.checkbox-container {
  position: relative;
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: transparent;
    border: 2px solid $accent;
    border-radius: $border-radius-sm;
    transition: all $transition-fast;

    &:after {
      content: '';
      position: absolute;
      display: none;
      left: 8px;
      top: 4px;
      width: 5px;
      height: 10px;
      border: solid $text-light;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  input:checked ~ .checkmark {
    background-color: $success;
    border-color: $success;

    &:after {
      display: block;
    }
  }

  &:hover input ~ .checkmark {
    border-color: darken($accent, 10%);
  }

  input:disabled ~ .checkmark {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.todo-info {
  @include flex(column, center, flex-start, $spacing-xs);
  flex: 1;
  min-width: 0; // For text truncation
}

.todo-title {
  @include truncate;
  font-weight: $font-weight-medium;
  color: $text;
  transition: all $transition-fast;
}

.todo-date {
  font-size: $font-size-sm;
  color: $text-muted;
}

.delete-btn {
  @include button-reset;
  padding: $spacing-xs;
  color: $text-muted;
  transition: all $transition-fast;

  &:hover:not(:disabled) {
    color: $danger;
    transform: scale(1.1);
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}

.empty-state {
  @include flex(column, center, center, $spacing-base);
  padding: $spacing-2xl;
  text-align: center;
  color: $text-muted;

  .empty-icon {
    width: 48px;
    height: 48px;
    color: $accent;
    margin-bottom: $spacing-base;
  }

  p {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-xs;
  }

  .empty-hint {
    font-size: $font-size-sm;
  }
}

.loading {
  @include loading-state;
}

.error {
  @include error-state;
  margin-top: $spacing-xl;
}

// List transition animations
.list-enter-active,
.list-leave-active {
  transition: all $transition-base;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
