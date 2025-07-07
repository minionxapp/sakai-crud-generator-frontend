<script setup>
import { useAuthStore } from '@/stores/authStores';
import { onMounted } from 'vue';
const autStores = useAuthStore();
const { logoutUser } = autStores

onMounted(async () => {
    await logoutUser()
})

</script>
<template>
    <h1>Logout</h1>
    <a href="/login">Login</a>
</template>