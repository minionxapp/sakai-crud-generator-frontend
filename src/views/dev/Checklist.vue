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
                        <h4 class="m-0">Manage Checklist</h4>
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
                <Column field="nama" header="Nama" sortable style="min-width: 4rem"></Column>
                <Column field="urut" header="Urut" sortable style="min-width: 4rem"></Column>
                <Column field="desc" header="Desc" sortable style="min-width: 4rem"></Column>
                <Column field="kode" header="Kode" sortable style="min-width: 4rem"></Column>
                <Column field="group" header="Group" sortable style="min-width: 4rem"></Column>
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
            <Dialog v-model:visible="formDialog" :style="{ width: '550px' }" header="Checklist Details" :modal="true">
                <div class="flex flex-col gap-6">
                    <img v-if="product.image"
                        :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
                        :alt="product.image" class="block m-auto pb-4" />
                    <form @submit.prevent="handleSubmit">
                        <AlertMessage v-if="errorAlert" :message="errorMsg" />
                        <div>
                            <label for="group" class="block font-bold mb-3">Group</label>
                            <InputText rows="5" id="group" v-model.trim="item.group" required="false" fluid />
                            <small v-if="submitted && !item.group" class="text-red-500">group is required.</small>
                        </div>
                        <div>
                            <label for="kode" class="block font-bold mb-3">Kode</label>
                            <InputText rows="5" id="kode" v-model.trim="item.kode" required="false" fluid />
                            <small v-if="submitted && !item.kode" class="text-red-500">kode is required.</small>
                        </div>
                        <div>
                            <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"
                                fluid readonly="true" hidden />
                        </div>
                        <div>
                            <label for="nama" class="block font-bold mb-3">Nama</label>
                            <InputText rows="5" id="nama" v-model.trim="item.nama" required="false" fluid />
                            <small v-if="submitted && !item.nama" class="text-red-500">nama is required.</small>
                        </div>
                        <div>
                            <label for="urut" class="block font-bold mb-3">Urut</label>
                            <InputNumber :showIcon="true" :showButtonBar="true" rows="5" id="urut"
                                v-model.trim="item.urut" required="false" fluid showButtons mode="decimal">
                            </InputNumber>
                            <small v-if="submitted && !item.urut" class="text-red-500">urut is required.</small>
                        </div>
                        <div>
                            <label for="desc" class="block font-bold mb-3">Desc</label>
                            <InputText rows="5" id="desc" v-model.trim="item.desc" required="false" fluid />
                            <small v-if="submitted && !item.desc" class="text-red-500">desc is required.</small>
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
        const { data } = await custumFetch.get("/Checklists/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
    const myasetDelete = await custumFetch.delete('/Checklists/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    itemDelete.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Checklist Deleted', life: 3000 });
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
            const results = await custumFetch.put("/Checklists/" + item.value.id,
                {
                    nama: item.value.nama,
                    urut: item.value.urut,
                    desc: item.value.desc,
                    kode: item.value.kode,
                    group: item.value.group,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update Checklist Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }

    } else {
        try {
            const results = await custumFetch.post("/Checklists",
                {
                    nama: item.value.nama,
                    urut: item.value.urut,
                    desc: item.value.desc,
                    kode: item.value.kode,
                    group: item.value.group,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create Checklist Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }
    }
    searchData()
}
onMounted(async () => {
    pageNo.value = 1
    searchData()
});
</script>