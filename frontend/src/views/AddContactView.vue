<script setup lang="ts">
import ContactForm from '../components/ContactForm.vue'
</script>

<template>
    <div class="page-container">
        <h1>
            Novo Contato
            <ContactForm />
        </h1>
    </div>
</template>

<style scoped>
 .page-container {
    padding-top: 20px;
 }
</style>