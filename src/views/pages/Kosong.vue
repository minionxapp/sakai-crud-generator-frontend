<template>
    <Toast />
    <div>
        <h1>halaman kosong</h1>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <InputText v-model="filters['global'].value" placeholder="Search..." class="mr-2" />
                    <Button label="Search" icon="pi pi-search" severity="secondary" class="mr-2"
                        @click="searchData()" />


                </template>
                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
                <template>

                </template>
            </Toolbar>


            <Tabs value="0">
                <TabList>
                    <Tab value="0" :visible="trainingDetail">Training</Tab>
                    <Tab value="1" :visible="trainingDetail">trainingCeklist</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0" v-if="trainingDetail">
                        <pre> <code> {{ training }} </code> </pre>
                        <form>
                            <div class=" flex flex-col gap-0 mb-2 col-6">
                                <div class="flex flex-wrap gap-4">
                                    <div class="flex flex-col grow basis-0 gap-2 ">
                                        <label for="kode" class="block font-bold mb-3">Kode</label>
                                        <InputText rows="5" id="kode" v-model="training.kode" required="false" fluid
                                            readonly="true" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel value="1" v-if="trainingDetail">
                        <h1>rubah pake Prop, kirim kode training</h1>
                        <Training_checklist :data=data ref="testRef" />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </div>
    </div>

</template>

<script setup>
import custumFetch from '@/api';
import { useAuthStore } from '@/stores/authStores';
import { FilterMatchMode } from '@primevue/core/api';
import { Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Training_checklist from '../dev/Training_checklist.vue';
const training = ref('')
const toast = useToast();
const trainingDetail = ref(false)
const data = ref('sssssssss')
const testRef = ref(null)

const autStores = useAuthStore();
const { currentUser, currentToken, getToken } = autStores

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const openNew = () => {

}
const searchData = async () => {
    // training.value = ''
    // await $refs.Training_checklist.TestMugi()
    // Training_checklist.test()
    const paramCari = ((JSON.parse(JSON.stringify(filters.value))).global.value)
    data.value = paramCari
    if (paramCari == null || paramCari == '') {
        toast.add({ severity: 'warn', summary: 'Fail', detail: 'Tidak boleh kosong', life: 3000 });
    } else {
        try {
            const results = await custumFetch.get("/trainings/?kode=" + paramCari.toUpperCase(),
                {
                    withCredentials: true,
                    headers: {
                        "X-API-TOKEN": await getToken()
                    },
                }
            )
            training.value = results.data.data[0]
            trainingDetail.value = true
            data.value = await training.value.kode
            alert("kosong searchData::" + JSON.stringify(results) + "llll " + data.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Update Training Success', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'warn', summary: 'Fail', detail: 'Data tidak ditemukan', life: 3000 });
            console.log(error)
        }
    }

}
onMounted(async () => {
    filters.value.global.value = 'AIF2025008'
    // pageNo.value = 1
    // training.value = null
    // searchData()
});
</script>