<template>
    <Toast />
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <!-- <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteItem"
                    :disabled="!selectedProducts || !selectedProducts.length" /> -->
                </template>
                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
            <!-- //LIST TABLE -->
            <DataTable ref="dt" v-model:selection="selectedItems" :value="results" dataKey="id" :paginator="true"
                :rows=rowPerPage @page="onPageChange($event)" :totalRecords=jmlRows lazy
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]" :filters="filters"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Sub_kompetensi</h4>
                        <IconField>
                            <InputIcon @click="searchData()">
                                <i class=" pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="Id" sortable style="min-width: 4rem"></Column>
                <Column field="kode" header="Kode" sortable style="min-width: 4rem"></Column>
                <Column field="kode_job_family" header="Kode_job_family" sortable style="min-width: 4rem"></Column>
                <Column field="kode_sub_job_family" header="Kode_sub_job_family" sortable style="min-width: 4rem">
                </Column>
                <Column field="nama" header="Nama" sortable style="min-width: 4rem"></Column>
                <Column field="desc" header="Desc" sortable style="min-width: 4rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 4rem"></Column>
                <Column field="kode_kompetensi" header="Kode_kompetensi" sortable style="min-width: 4rem"></Column>
                <Column :exportable="false" style="min-width: 4rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editItem(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteItem(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
            <!-- //DELETE DIALOG -->
            <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="itemDelete">Are you sure you want to delete <b>{{ itemDelete.name }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
                    <Button label="Yes" icon="pi pi-check" @click="deleteItem" />
                </template>
            </Dialog>
            <!-- //CREATE DIALOG -->
            <Dialog v-model:visible="formDialog" :style="{ width: '550px' }" header="Sub_kompetensi Details"
                :modal="true">
                <div class="flex flex-col gap-6">
                    <img v-if="product.image"
                        :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
                        :alt="product.image" class="block m-auto pb-4" />
                    <form @submit.prevent="handleSubmit">
                        <AlertMessage v-if="errorAlert" :message="errorMsg" />
                        <div>
                            <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"
                                fluid readonly="true" hidden />
                        </div>
                        <div>
                            <label for="kode" class="block font-bold mb-3">Kode</label>
                            <InputText rows="5" id="kode" v-model.trim="item.kode" required="false" fluid />
                            <small v-if="submitted && !item.kode" class="text-red-500">kode is required.</small>
                        </div>
                        <div>
                            <label for="kode_job_family" class="block font-bold mb-3">Kode_job_family</label>
                            <!-- <InputText rows="5" id="kode_job_family" v-model.trim="item.kode_job_family"
                                required="false" fluid /> -->
                            <Select id="kode_job_family" v-model="item.kode_job_family" :options="jobFamily"
                                optionLabel="nama" optionValue="kode" placeholder="Job Family" class="w-full"
                                @change="getSubJobFamily()">
                            </Select>
                            <small v-if="submitted && !item.kode_job_family" class="text-red-500">kode_job_family is
                                required.</small>
                        </div>
                        <div>
                            <label for="kode_sub_job_family" class="block font-bold mb-3">Kode_sub_job_family</label>
                            <!-- <InputText rows="5" id="kode_sub_job_family" v-model.trim="item.kode_sub_job_family"
                                required="false" fluid /> -->
                            <Select id="kode_sub_job_family" v-model="item.kode_sub_job_family" :options="subJobFamily"
                                optionLabel="nama" optionValue="kode" placeholder="Sub Job Family"
                                @change="getKompetensi()" class="w-full"></Select>
                            <small v-if="submitted && !item.kode_sub_job_family"
                                class="text-red-500">kode_sub_job_family is
                                required.</small>
                        </div>
                        <div>
                            <label for="kode_kompetensi" class="block font-bold mb-3">Kode_kompetensi</label>
                            <!-- <InputText rows="5" id="kode_kompetensi" v-model.trim="item.kode_kompetensi"
                                required="false" fluid /> -->
                            <Select id="kode_kompetensi" v-model="item.kode_kompetensi" :options="kompetensis"
                                optionLabel="nama" optionValue="kode" placeholder="Kompetensi" class="w-full"></Select>
                            <small v-if="submitted && !item.kode_kompetensi" class="text-red-500">kode_kompetensi is
                                required.</small>
                        </div>
                        <div>
                            <label for="nama" class="block font-bold mb-3">Nama</label>
                            <InputText rows="5" id="nama" v-model.trim="item.nama" required="false" fluid />
                            <small v-if="submitted && !item.nama" class="text-red-500">nama is required.</small>
                        </div>
                        <div>
                            <label for="desc" class="block font-bold mb-3">Desc</label>
                            <InputText rows="5" id="desc" v-model.trim="item.desc" required="false" fluid />
                            <small v-if="submitted && !item.desc" class="text-red-500">desc is required.</small>
                        </div>
                        <div>
                            <label for="status" class="block font-bold mb-3">Status</label>
                            <!-- <InputText rows="5" id="status" v-model.trim="item.status" required="false" fluid /> -->
                            <Select id="status" v-model="item.status" :options="yesNo" optionLabel="name"
                                optionValue="code" placeholder="status" class="w-full"></Select>
                            <small v-if="submitted && !item.status" class="text-red-500">status is required.</small>
                        </div>

                        <div class="flex align-items-center gap-3 mb-5"></div>
                        <div class="flex justify-content-end gap-2">
                            <Button type="button" label="Cancel" severity="secondary" @click="hideDialog()"></Button>
                            <Button type="submit" label="Submit"></Button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    </div>
</template>
<script setup>
import custumFetch from '@/api';
import { useAuthStore } from '@/stores/authStores';
import { FilterMatchMode } from '@primevue/core/api';
import { Toast } from 'primevue';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import AlertMessage from '../../components/AlertMessage.vue';

const autStores = useAuthStore();
const { currentUser, currentToken, getToken } = autStores
const dt = ref();
const products = ref();
const formDialog = ref(false);
const deleteDialog = ref(false);
const product = ref({});
const selectedItems = ref();
const submitted = ref(false);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const results = ref()
const errorMsg = ref(false)
const errorAlert = ref("")
const edit = ref(false)
const toast = useToast();
const item = ref({});
const itemDelete = ref()
const pageNo = ref()
const jmlRows = ref(0)
const rowPerPage = ref(10)
const kompetensis = ref()

const yesNo = ref([{ name: 'Yes', code: 'Y' }, { name: 'No', code: 'N' }])
const jobFamily = ref([])
const subJobFamily = ref([])

async function onPageChange(event) {
    pageNo.value = event.page + 1
    rowPerPage.value = event.rows
    searchData()
}
function openNew() {
    item.value = ({})
    submitted.value = false;
    formDialog.value = true;
}
const hideDialog = () => {
    formDialog.value = false;
    submitted.value = false;
}

const searchData = async () => {
    const paramCari = ((JSON.parse(JSON.stringify(filters.value))).global.value)
    let urlParam = ""
    if (paramCari) {
        urlParam = '&name=' + paramCari
        //sesuaikan ya dengan nama kolom pencariannya
    }
    try {
        const { data } = await custumFetch.get("/subkompetensis/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        results.value = data.data
        jmlRows.value = data.paging.total_rows
    } catch (error) {
        console.log(error)
    }
}
function confirmDeleteItem(value) {
    itemDelete.value = value
    deleteDialog.value = true;
}
async function deleteItem() {
    deleteDialog.value = false
    const myasetDelete = await custumFetch.delete('/subkompetensis/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    itemDelete.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Sub_kompetensi Deleted', life: 3000 });
    searchData()
}


function editItem(dataRow) {
    edit.value = true
    item.value = { ...dataRow };
    formDialog.value = true;
}


//periksa unutk jenis update atau onsert
const handleSubmit = async () => {
    //untuk edit id sudah ada
    if (item.value.id) {
        try {
            const results = await custumFetch.put("/subkompetensis/" + item.value.id,
                {
                    kode: item.value.kode,
                    kode_job_family: item.value.kode_job_family,
                    kode_sub_job_family: item.value.kode_sub_job_family,
                    nama: item.value.nama,
                    desc: item.value.desc,
                    status: item.value.status,
                    kode_kompetensi: item.value.kode_kompetensi,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update Sub_kompetensi Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }

    } else {
        try {
            const results = await custumFetch.post("/subkompetensis",
                {
                    kode: item.value.kode,
                    kode_job_family: item.value.kode_job_family,
                    kode_sub_job_family: item.value.kode_sub_job_family,
                    nama: item.value.nama,
                    desc: item.value.desc,
                    status: item.value.status,
                    kode_kompetensi: item.value.kode_kompetensi,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create Sub_kompetensi Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }
    }
    searchData()
}
onMounted(async () => {
    pageNo.value = 1
    searchData()
    getJobFamily()
    getSubJobFamily()
});






const getJobFamily = async () => {
    try {
        const { data } = await custumFetch.get("/jobfamilys" + '?size=99',
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        jobFamily.value = data.data
        // console.log(jobFamily.value)
    } catch (error) {
        console.log(error)
    }
}

const getSubJobFamily = async () => {
    let urlParam = ""
    if (item.value.kode_job_family) {
        urlParam = '&kode_job_family=' + item.value.kode_job_family
        //sesuaikan ya dengan nama kolom pencariannya
    } else {
        urlParam = '&kode_job_family=' + 'XXXXX'
    }
    try {
        const { data } = await custumFetch.get("/subjobfamilys" + '?size=99' + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        subJobFamily.value = data.data
        // console.log(subJobFamily.value)
    } catch (error) {
        console.log(error)
    }
}

const getKompetensi = async () => {
    alert("getKompetensi")
    try {
        const { data } = await custumFetch.get("/kompetensis/" + "?size=99&kode_sub_job_family=" + item.value.kode_sub_job_family,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        kompetensis.value = data.data
        // console.log(kompetensis.value)
    } catch (error) {
        console.log(error)
    }
}

// const subkompetensis = ref()
// const getSubKompetensi = async () => {
//     alert("getKompetensi ::: " + item.value.kompetensi)
//     try {
//         const { data } = await custumFetch.get("/subkompetensis/" + "?size=99&kode_kompetensi=" + item.value.kompetensi,
//             {
//                 withCredentials: true,
//                 headers: {
//                     "X-API-TOKEN": await getToken()
//                 },
//             }
//         )
//         subkompetensis.value = data.data
//         // console.log(kompetensis.value)
//     } catch (error) {
//         console.log(error)
//     }
// }
</script>