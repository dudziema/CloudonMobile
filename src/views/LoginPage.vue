<script lang="ts" setup></script>

<template>
  <div class="login-page">
    <div class="login-page__divider" />
    <div class="login-page__content">
      <h1>Enter the access code</h1>
      <p>
        To connect with your device, please enter the access code displayed in
        the mobile app.
      </p>
      <div class="login-page__inputs">
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </div>
      <button />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 8px 8px;
  height: 100vh;

  &__divider {
    background-color: #f5faff;
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: row10-end;
  }
  &__content {
    grid-column-start: 6;
    grid-column-end: 10;
    grid-row-start: 3;
    grid-row-end: 10;
  }
  &__inputs {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
}
input {
  height: 64px;
  width: 61px;
  left: 0px;
  top: 0px;
  border-radius: 8px;
  background-color: #f5f6f6;
}
button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 10px;
  width: 100%;
  height: 56px;
  background-color: #0e70f166;
  border-radius: 12px;
}
</style>
