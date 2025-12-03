import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ContactsView from '../views/ContactsView.vue'
import AddContactView from '../views/AddContactView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),


routes: [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },

    {
        path: '/meus-contatos',
        name: 'contacts',
        component: ContactsView
    },
    {
        path: '/novo-contato',
        name: 'add',
        component: AddContactView
    },
    {
        path: '/editar/:id',
        name: 'edit',
        component: () => import('../views/EditContactView.vue')
    }
    
    
]
})
export default router