<script setup lang="ts">
import ContactForm from './components/ContactForm.vue';
import ContactList from './components/ContactList.vue'; 
</script>

<template>
  <main>
    <ContactForm />

    <ContactList />
  </main>
</template>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
</style>