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
                        <h4 class="m-0">Manage Training</h4>
                        <IconField>
                            <InputIcon @click="searchData()">
                                <i class=" pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <!-- <Column field="id" header="Id" sortable style="min-width: 4rem"></Column> -->
                <Column field="kode" header="Kode" sortable style="min-width: 4rem"></Column>
                <Column field="nama" header="Nama" sortable style="min-width: 4rem"></Column>
                <Column field="akademi" header="Akademi" sortable style="min-width: 4rem"></Column>
                <Column field="tipe" header="Tipe" sortable style="min-width: 4rem"></Column>
                <!-- <Column field="pic" header="Pic" sortable style="min-width: 4rem"></Column> -->
                <Column field="desc" header="Desc" sortable style="min-width: 4rem"></Column>
                <Column field="kompetensi" header="Kompetensi" sortable style="min-width: 4rem"></Column>
                <Column field="tgl_mulai" header="Tgl_mulai" sortable style="min-width: 4rem">
                    <template #body="slotProps">{{ ((slotProps.data.tgl_mulai) + "").substring(0, 10) }} </template>
                </Column>
                <Column field="tgl_akhir" header="Tgl_akhir" sortable style="min-width: 4rem">
                    <template #body="slotProps">{{ ((slotProps.data.tgl_akhir) + "").substring(0, 10) }} </template>
                </Column>
                <!-- <Column field="sub_kompetensi" header="Sub_kompetensi" sortable style="min-width: 4rem"></Column> -->
                <Column field="status_training" header="Status_training" sortable style="min-width: 4rem"></Column>
                <!-- <Column field="kode_job_family" header="Kode_job_family" sortable style="min-width: 4rem"></Column> -->
                <!-- <Column field="kode_sub_job_family" header="Kode_sub_job_family" sortable style="min-width: 4rem"> </Column> -->
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
            <Dialog v-model:visible="formDialog" :style="{ width: '60%' }" header="Training Details" :modal="true">
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
                            <InputText rows="5" id="kode" v-model.trim="item.kode" required="false" fluid
                                readonly="true" />
                            <small v-if="submitted && !item.kode" class="text-red-500">kode is required.</small>
                        </div>
                        <div>
                            <label for="nama" class="block font-bold mb-3">Nama</label>
                            <InputText rows="5" id="nama" v-model.trim="item.nama" required="false" fluid />
                            <small v-if="submitted && !item.nama" class="text-red-500">nama is required.</small>
                        </div>

                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="akademi" class="block font-bold mb-3">Akademi</label>
                                    <Select id="akademi" v-model="item.akademi" :options="akademiUser"
                                        optionLabel="nama" optionValue="kode" placeholder="Akademi"
                                        class="w-full"></Select>
                                    <small v-if="submitted && !item.akademi" class="text-red-500">akademi is
                                        required.</small>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="tipe" class="block font-bold mb-3">Tipe</label>
                                    <Select id="tipe" v-model="item.tipe" :options="tipes" optionLabel="nama"
                                        optionValue="kode" placeholder="Tipe Training" class="w-full"></Select>
                                    <small v-if="submitted && !item.tipe" class="text-red-500">tipe is required.</small>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label for="desc" class="block font-bold mb-3">Desc</label>
                            <InputText rows="5" id="desc" v-model.trim="item.desc" required="false" fluid />
                            <small v-if="submitted && !item.desc" class="text-red-500">desc is required.</small>
                        </div>
                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="tgl_mulai" class="block font-bold mb-3">Tgl_mulai</label>
                                    <DatePicker :showIcon="true" :showButtonBar="true" rows="5" id="tgl_mulai"
                                        v-model.trim="item.tgl_mulai" required="false" fluid></DatePicker>
                                    <small v-if="submitted && !item.tgl_mulai" class="text-red-500">tgl_mulai is
                                        required.</small>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="tgl_akhir" class="block font-bold mb-3">Tgl_akhir</label>
                                    <DatePicker :showIcon="true" :showButtonBar="true" rows="5" id="tgl_akhir"
                                        v-model.trim="item.tgl_akhir" required="false" fluid></DatePicker>
                                    <small v-if="submitted && !item.tgl_akhir" class="text-red-500">tgl_akhir is
                                        required.</small>
                                </div>
                            </div>
                        </div>
                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="kode_job_family" class="block font-bold mb-3">Job family</label>
                                    <!-- <InputText rows="5" id="kode_job_family" v-model.trim="item.kode_job_family"
                                        required="false" fluid /> -->
                                    <Select id="kode_job_family" v-model="item.kode_job_family" :options="jonfamilys"
                                        optionLabel="nama" optionValue="kode" placeholder="Job Family" class="w-full"
                                        @change="getSubJobFamily()"></Select>
                                    <small v-if="submitted && !item.kode_job_family"
                                        class="text-red-500">kode_job_family is
                                        required.</small>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="kode_sub_job_family" class="block font-bold mb-3">Sub Job Family</label>
                                    <!-- <InputText rows="5" id="kode_sub_job_family" v-model.trim="item.kode_sub_job_family"
                                        required="false" fluid /> -->
                                    <Select id="kode_sub_job_family" v-model="item.kode_sub_job_family"
                                        :options="subjobfamilys" optionLabel="nama" optionValue="kode"
                                        placeholder="Sub Job Family" class="w-full" @change="getKompetensi()"></Select>
                                    <small v-if="submitted && !item.kode_sub_job_family"
                                        class="text-red-500">kode_sub_job_family is
                                        required.</small>
                                </div>
                            </div>
                        </div>

                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="kompetensi" class="block font-bold mb-3">Kompetensi</label>
                                    <!-- <InputText rows="5" id="kompetensi" v-model.trim="item.kompetensi" required="false"
                                        fluid /> -->
                                    <Select id="kompetensi" v-model="item.kompetensi" :options="kompetensis"
                                        optionLabel="nama" optionValue="kode" placeholder="Kompetensi"
                                        class="w-full"></Select>
                                    <small v-if="submitted && !item.kompetensi" class="text-red-500">kompetensi is
                                        required.</small>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="sub_kompetensi" class="block font-bold mb-3">Level</label>
                                    <!-- <InputText rows="5" id="sub_kompetensi" v-model.trim="item.sub_kompetensi"
                                        required="false" fluid /> -->
                                    <Select id="sub_kompetensi" v-model="item.sub_kompetensi" :options="levels"
                                        optionLabel="nama" optionValue="kode" placeholder="Level"
                                        class="w-full"></Select>
                                    <small v-if="submitted && !item.sub_kompetensi" class="text-red-500">sub_kompetensi
                                        is required.</small>
                                </div>
                            </div>
                        </div>

                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="pic" class="block font-bold mb-3">Pic</label>
                                    <InputText rows="5" id="pic" v-model.trim="item.pic" required="false" fluid />
                                    <small v-if="submitted && !item.pic" class="text-red-500">pic is required.</small>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="status_training" class="block font-bold mb-3">Status_training</label>
                                    <!-- <InputText rows="5" id="status_training" v-model.trim="item.status_training"
                                        required="false" fluid /> -->
                                    <Select id="status_training" v-model="item.status_training"
                                        :options="status_trainings" optionLabel="nama" optionValue="kode"
                                        placeholder="Status" class="w-full" @change="getStatusStraining()"></Select>
                                    <small v-if="submitted && !item.status_training"
                                        class="text-red-500">status_training is
                                        required.</small>
                                </div>
                            </div>
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
import { dateFormat } from '@/stores/util';
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
const jonfamilys = ref()
const akademiUser = ref()
const kompetensis = ref()


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
        const { data } = await custumFetch.get("/Trainings/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
    const myasetDelete = await custumFetch.delete('/Trainings/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    itemDelete.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Training Deleted', life: 3000 });
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
        let tgl_mulai
        try {
            tgl_mulai = await dateFormat(item.value.tgl_mulai)
        } catch (error) {
            tgl_mulai = (item.value.tgl_mulai).substring(0, 10)
        } let tgl_akhir
        try {
            tgl_akhir = await dateFormat(item.value.tgl_akhir)
        } catch (error) {
            tgl_akhir = (item.value.tgl_akhir).substring(0, 10)
        } try {
            const results = await custumFetch.put("/Trainings/" + item.value.id,
                {
                    kode: item.value.kode,
                    nama: item.value.nama,
                    akademi: item.value.akademi,
                    tipe: item.value.tipe,
                    pic: item.value.pic,
                    desc: item.value.desc,
                    kompetensi: item.value.kompetensi,
                    tgl_mulai: (tgl_mulai), tgl_akhir: (tgl_akhir), sub_kompetensi: item.value.sub_kompetensi,
                    status_training: item.value.status_training,
                    kode_job_family: item.value.kode_job_family,
                    kode_sub_job_family: item.value.kode_sub_job_family,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update Training Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }

    } else {
        let tgl_mulai = await dateFormat(item.value.tgl_mulai)
        let tgl_akhir = await dateFormat(item.value.tgl_akhir)
        try {
            const results = await custumFetch.post("/Trainings",
                {
                    kode: "system",
                    nama: item.value.nama,
                    akademi: item.value.akademi,
                    tipe: item.value.tipe,
                    pic: item.value.pic,
                    desc: item.value.desc,
                    kompetensi: item.value.kompetensi,
                    tgl_mulai: (tgl_mulai), tgl_akhir: (tgl_akhir),
                    sub_kompetensi: item.value.sub_kompetensi,
                    status_training: item.value.status_training,
                    kode_job_family: item.value.kode_job_family,
                    kode_sub_job_family: item.value.kode_sub_job_family,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create Training Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }
    }
    searchData()
}
onMounted(async () => {
    pageNo.value = 1
    await searchData()//bi perbaii hanya sesuai akademinya saja
    await getAkademiByUsernamse()
    await getJobFamily()
    await getTipe()
    await getStatusStraining()
    await getlevel()
});

const getAkademiByUsernamse = async () => {
    try {
        const { data } = await custumFetch.get("/akademibyuser/" + autStores.currentUser.username,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        akademiUser.value = data.data
    } catch (error) {
        console.log(error)
    }
}

const getJobFamily = async () => {
    try {
        const { data } = await custumFetch.get("/jobfamilys/" + "?size=99",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        jonfamilys.value = data.data
    } catch (error) {
        console.log(error)
    }
}

const subjobfamilys = ref()
const getSubJobFamily = async () => {
    try {
        const { data } = await custumFetch.get("/subjobfamilys/" + "?size=99&kode_job_family=" + item.value.kode_job_family,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        subjobfamilys.value = data.data
    } catch (error) {
        console.log(error)
    }
}


const tipes = ref()
const getTipe = async () => {
    try {
        const { data } = await custumFetch.get("/tipetrainings/" + "?size=99",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        tipes.value = data.data
    } catch (error) {
        console.log(error)
    }
}




const getKompetensi = async () => {
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
const levels = ref()
const getlevel = async () => {
    try {
        const { data } = await custumFetch.get("/kompetensilevels/" + "?size=99",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        levels.value = data.data
        // console.log(levels.value)
    } catch (error) {
        console.log(error)
    }
}



const status_trainings = ref()
// getStatusStraining()
const getStatusStraining = async () => {
    try {
        const { data } = await custumFetch.get("/statustrainings/" + "?size=99",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        status_trainings.value = data.data
        // console.log(status_trainings.value)
    } catch (error) {
        console.log(error)
    }
}
//apiRouter.get("/api/akademibyuser/:username", AkademiController.getAkademiByUsername)


</script>