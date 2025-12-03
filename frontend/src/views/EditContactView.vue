<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();   
const router = useRouter(); 

const API_URL = 'http://localhost:3000/api/contacts';


const formData = ref({
  name: '',
  email: '',
  phone: ''
});


const getContact = async () => {
  try {
    const id = route.params.id;
    
    const response = await axios.get(`${API_URL}/${id}`);
    
    formData.value = response.data;
    
  } catch (error) {
    alert('Erro ao buscar contato. Ele pode não existir.');
    router.push('/meus-contatos'); 
  }
};


const updateContact = async () => {
  try {
    const id = route.params.id;
    
    await axios.put(`${API_URL}/${id}`, formData.value);
    
    alert('Contato atualizado com sucesso!');
    
    router.push('/meus-contatos');
    
  } catch (error) {
    console.error(error);
    alert('Erro ao atualizar.');
  }
};


onMounted(() => {
  getContact();
});
</script>