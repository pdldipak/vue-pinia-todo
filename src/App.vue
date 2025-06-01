<template>
  <div class="app">
    <div class="container">
      <router-view />
    </div>
    <footer class="footer">
      <p>Made with ❤️ by Dipak Poudel</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
@import './styles/variables';
@import './styles/mixins';

body {
  margin: 0;
  min-height: 100vh;
  background: $background;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 0% 0%, $primary 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, $secondary 0%, transparent 50%);
    opacity: 0.1;
    z-index: -1;
  }
}

.app {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text;
  min-height: 100vh;
  @include flex(column, center, center);
}

.container {
  width: 800px;
  padding: $spacing-xl;

  @include responsive($breakpoint-sm) {
    width: 100%;
    padding: $spacing-base;
  }
}

.footer {
  text-align: center;
  padding: $spacing-base;
  font-size: $font-size-sm;
  color: $accent;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  transition: background-color $transition-fast;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  p {
    opacity: 1;
  }
}

/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

button {
  font: inherit;
}

input {
  font: inherit;
}
</style>
