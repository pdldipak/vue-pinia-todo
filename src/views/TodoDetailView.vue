<template>
  <div class="todo-detail">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 12H5M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Back to List
      </button>
      <h1>Task Details</h1>
    </div>

    <div v-if="todoStore.loading" class="loading">
      <div class="loading-spinner"></div>
      Loading task details...
    </div>

    <div v-else-if="todo" class="detail-content">
      <div class="detail-card">
        <div class="status-badge" :class="{ completed: todo.completed }">
          {{ todo.completed ? 'Completed' : 'Pending' }}
        </div>

        <h2 class="todo-title">{{ todo.title }}</h2>
        <div class="todo-meta">
          <p class="created-at">Created: {{ formatDate(todo.createdAt) }}</p>
        </div>

        <div class="actions">
          <button
            class="primary-btn"
            @click="handleToggleTodo"
            :class="{ completed: todo.completed }"
          >
            {{ todo.completed ? 'Mark as Pending' : 'Mark as Complete' }}
          </button>
          <button class="delete-btn" @click="handleDelete">Delete Task</button>
        </div>
      </div>
    </div>

    <div v-else class="error">
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Task not found
    </div>
  </div>
</template>

<script>
import { useTodoStore } from '@/stores/todo'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'TodoDetailView',

  data() {
    return {
      todoStore: useTodoStore(),
      router: useRouter(),
      route: useRoute(),
    }
  },

  computed: {
    todo() {
      return this.todoStore.getTodoById(this.route.params.id)
    },
  },

  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },

    goBack() {
      this.router.push('/')
    },

    async handleToggleTodo() {
      await this.todoStore.updateTodo(this.todo.id, { completed: !this.todo.completed })
    },

    async handleDelete() {
      await this.todoStore.deleteTodo(this.todo.id)
      this.router.push('/')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.todo-detail {
  @include container(800px);
  @include slide-in-up;
  padding-top: $spacing-2xl;
  padding-bottom: $spacing-2xl;
}

.detail-header {
  @include flex(row, flex-start, center, $spacing-lg);
  margin-bottom: $spacing-xl;

  h1 {
    @include heading-1;
    margin: 0;
  }
}

.back-btn {
  @include button-reset;
  @include flex(row, center, center, $spacing-sm);
  color: $accent;
  font-weight: $font-weight-medium;
  transition: all $transition-fast;

  &:hover {
    color: $primary;
    transform: translateX(-2px);
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}

.detail-card {
  @include card;
  @include glass-effect;
}

.status-badge {
  display: inline-block;
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-full;
  background: $warning;
  color: $text-light;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  margin-bottom: $spacing-base;
  box-shadow: $shadow-sm;

  &.completed {
    background: $success;
  }
}

.todo-title {
  @include heading-2;
  margin: 0 0 $spacing-base;
}

.todo-meta {
  @include body-text;
  color: $text-muted;
  margin-bottom: $spacing-xl;
}

.actions {
  @include flex(row, flex-start, center, $spacing-base);
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1px solid $border-color;

  @include responsive($breakpoint-sm) {
    flex-direction: column;
    width: 100%;

    button {
      width: 100%;
    }
  }
}

.primary-btn {
  @include button-primary;

  &.completed {
    background: $warning;

    &:hover:not(:disabled) {
      background: darken($warning, 5%);
    }
  }
}

.delete-btn {
  @include button-danger;
}

.loading {
  @include loading-state;
}

.error {
  @include error-state;
  margin-top: $spacing-xl;
}
</style>
