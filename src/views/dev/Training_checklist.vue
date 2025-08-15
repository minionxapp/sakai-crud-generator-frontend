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
                        <h4 class="m-0">Manage Training_checklist</h4>
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
                <Column field="training_kode" header="Training_kode" sortable style="min-width: 4rem"></Column>
                <Column field="checklist_kode" header="Checklist_kode" sortable style="min-width: 4rem"></Column>
                <Column field="file_1" header="File_1" sortable style="min-width: 4rem"></Column>
                <Column field="file_2" header="File_2" sortable style="min-width: 4rem"></Column>
                <Column field="file_3" header="File_3" sortable style="min-width: 4rem"></Column>
                <Column field="file_4" header="File_4" sortable style="min-width: 4rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 4rem"></Column>
                <Column field="checklist_name" header="Checklist_name" sortable style="min-width: 4rem"></Column>
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
            <Dialog v-model:visible="formDialog" :style="{ width: '550px' }" header="Training_checklist Details"
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
                            <label for="training_kode" class="block font-bold mb-3">Training_kode</label>
                            <InputText rows="5" id="training_kode" v-model.trim="item.training_kode" required="false"
                                fluid />
                            <small v-if="submitted && !item.training_kode" class="text-red-500">training_kode is
                                required.</small>
                        </div>
                        <div>
                            <label for="checklist_kode" class="block font-bold mb-3">Checklist_kode</label>
                            <InputText rows="5" id="checklist_kode" v-model.trim="item.checklist_kode" required="false"
                                fluid />
                            <small v-if="submitted && !item.checklist_kode" class="text-red-500">checklist_kode is
                                required.</small>
                        </div>
                        <div>
                            <label for="file_1" class="block font-bold mb-3">File_1</label>
                            <InputText rows="5" id="file_1" v-model.trim="item.file_1" required="false" fluid />
                            <small v-if="submitted && !item.file_1" class="text-red-500">file_1 is required.</small>
                        </div>
                        <div>
                            <label for="file_2" class="block font-bold mb-3">File_2</label>
                            <InputText rows="5" id="file_2" v-model.trim="item.file_2" required="false" fluid />
                            <small v-if="submitted && !item.file_2" class="text-red-500">file_2 is required.</small>
                        </div>
                        <div>
                            <label for="file_3" class="block font-bold mb-3">File_3</label>
                            <InputText rows="5" id="file_3" v-model.trim="item.file_3" required="false" fluid />
                            <small v-if="submitted && !item.file_3" class="text-red-500">file_3 is required.</small>
                        </div>
                        <div>
                            <label for="file_4" class="block font-bold mb-3">File_4</label>
                            <InputText rows="5" id="file_4" v-model.trim="item.file_4" required="false" fluid />
                            <small v-if="submitted && !item.file_4" class="text-red-500">file_4 is required.</small>
                        </div>
                        <div>
                            <label for="status" class="block font-bold mb-3">Status</label>
                            <InputText rows="5" id="status" v-model.trim="item.status" required="false" fluid />
                            <small v-if="submitted && !item.status" class="text-red-500">status is required.</small>
                        </div>
                        <div>
                            <label for="checklist_name" class="block font-bold mb-3">Checklist_name</label>
                            <InputText rows="5" id="checklist_name" v-model.trim="item.checklist_name" required="false"
                                fluid />
                            <small v-if="submitted && !item.checklist_name" class="text-red-500">checklist_name is
                                required.</small>
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
import { defineProps, onMounted, ref, watch } from 'vue';
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

const propsx = defineProps(['data'])



// watch([propsx.data], () => {
//     alert("kkkkkkkkkk......")
//     // chartData.value = setChartData();
//     // chartOptions.value = setChartOptions();
// });
const x = ref(0)
const y = ref(0)
watch(propsx.data, (newX) => {
    alert("kkkkkkkkkk......")
    console.log(`x is ${newX}`)
})

async function onPageChange(event) {
    pageNo.value = event.page + 1
    rowPerPage.value = event.rows
    searchData()
}
function openNew() {
    alert(propsx.data)
    item.value = ({})
    submitted.value = false;
    formDialog.value = true;
}
const hideDialog = () => {
    formDialog.value = false;
    submitted.value = false;
}

const TestMugi = () => {
    alert("yeueiuriueyriueyiruerere")
}
const searchData = async () => {
    const paramCari = ((JSON.parse(JSON.stringify(filters.value))).global.value)
    let urlParam = ""
    if (paramCari) {
        urlParam = '&name=' + paramCari
        //sesuaikan ya dengan nama kolom pencariannya
    }
    try {
        const { data } = await custumFetch.get("/Trainingchecklists/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
    const myasetDelete = await custumFetch.delete('/Trainingchecklists/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    itemDelete.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Training_checklist Deleted', life: 3000 });
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
            const results = await custumFetch.put("/Trainingchecklists/" + item.value.id,
                {
                    training_kode: item.value.training_kode,
                    checklist_kode: item.value.checklist_kode,
                    file_1: item.value.file_1,
                    file_2: item.value.file_2,
                    file_3: item.value.file_3,
                    file_4: item.value.file_4,
                    status: item.value.status,
                    checklist_name: item.value.checklist_name,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update Training_checklist Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }

    } else {
        try {
            const results = await custumFetch.post("/Trainingchecklists",
                {
                    training_kode: item.value.training_kode,
                    checklist_kode: item.value.checklist_kode,
                    file_1: item.value.file_1,
                    file_2: item.value.file_2,
                    file_3: item.value.file_3,
                    file_4: item.value.file_4,
                    status: item.value.status,
                    checklist_name: item.value.checklist_name,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create Training_checklist Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }
    }
    searchData()
}
onMounted(async () => {
    alert("training ceklist" + propsx.data)
    if (propsx.data === undefined) {
        pageNo.value = 1
        searchData()
    } else {
        pageNo.value = 1
        const paramCari = propsx.data//((JSON.parse(JSON.stringify(filters.value))).global.value)
        let urlParam = ""
        urlParam = '&training_kode=' + paramCari
        try {
            const { data } = await custumFetch.get("/Trainingchecklists/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
});
function test() {
    alert("tetstststststststsststststkjsahd skjdh ksdjhs kjskajh ")
}
defineExpose({
    test
});
</script>