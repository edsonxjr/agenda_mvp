<script setup lang="ts">
// Define que este componente pode emitir um evento chamado 'close'
const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-backdrop" @click="$emit('close')">
    
    <div class="modal-content" @click.stop>
      
      <button class="btn-close" @click="$emit('close')">✖</button>
      
      <slot/>
      
    </div>
  </div>
</template>

<style scoped>
/* Fundo escuro que cobre a tela toda */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Preto 50% transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Fica por cima de tudo */
  backdrop-filter: blur(3px); /* Desfoque chique no fundo */
}

/* A caixa branca */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 16px;
  width: 90%;
  max-width: 850px; /* Largura máxima */
  max-height: 90vh; /* Altura máxima (90% da tela) */
  overflow-y: auto; /* Barra de rolagem se for muito grande */
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: slideUp 0.3s ease;
}

/* Botão X */
.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  z-index: 10;
}
.btn-close:hover { color: #ef4444; }

/* Animação de entrada */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>