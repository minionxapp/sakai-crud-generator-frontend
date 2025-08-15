import custumFetch from '@/api';
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useRouter } from "vue-router";
export const useAuthStore = defineStore('user', () => {
    const router = useRouter()
    const currentUser = ref(localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")) : null)

    const getToken = async () => {
        return JSON.parse(localStorage.getItem("user")).token
    }


    const loginUser = async (inputData) => {
        try {
            const { data } = await custumFetch.post('/users/login', {
                username: inputData.username,
                password: inputData.password
            })
            currentUser.value = data.data
            localStorage.setItem("user", JSON.stringify(data.data))
            router.push('/')

        } catch (error) {
            console.log(error)
            errorAlert.value = true
            errorMsg.value = error.response.data.message
        }
    }
    const logoutUser = async () => {
        try {
            await custumFetch.delete('/users/current',
                {
                    withCredentials: true,
                    headers: {
                        "X-API-TOKEN": await getToken()
                    },
                }
            )
            localStorage.setItem('user', null)
            localStorage.removeItem('user')
            currentUser.value = null
            router.push({ name: 'login' })
        } catch (error) {
            console.log(error)
        }
    }



    return { loginUser, currentUser, logoutUser, getToken }
}
)