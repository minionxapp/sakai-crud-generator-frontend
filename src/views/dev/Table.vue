<template>
    <Toast />
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <div class="flex flex-wrap items-start gap-4">
                        <div class="field">
                            <label for="project" class="sr-only">Project</label>
                            <Select id="state" v-model="dropdownProjectItem" :options="dropdownProjectItems"
                                optionLabel="name" placeholder="Select Project" class="w-full"
                                @change="onChange()"></Select>
                        </div>
                        <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    </div>
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
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tables">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Table</h4>
                        <IconField>
                            <InputIcon @click="searchData()">
                                <i class=" pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="Id" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name Table" sortable style="min-width: 16rem"></Column>
                <Column field="desc" header="Description" sortable style="min-width: 16rem"></Column>
                <Column field="project_id" header="Project Id" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
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
            <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="Project Details" :modal="true">
                <div class="flex flex-col gap-6">
                    <img v-if="item.image" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`"
                        :alt="product.image" class="block m-auto pb-4" />
                    <form @submit.prevent="handleSubmit">
                        <AlertMessage v-if="errorAlert" :message="errorMsg" />
                        <div>
                            <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"
                                fluid readonly="true" hidden />
                        </div>

                        <div>
                            <label for="name" class="block font-bold mb-3">Project ID</label>
                            <InputText rows="5" id="title" v-model.trim="item.project_id" required="false" fluid
                                readonly />
                            <small v-if="submitted && !item.title" class="text-red-500">Nama Table is required.</small>
                        </div>

                        <div>
                            <label for="name" class="block font-bold mb-3">Nama Table</label>
                            <InputText rows="5" id="title" v-model.trim="item.name" required="false" fluid />
                            <small v-if="submitted && !item.title" class="text-red-500">Nama Table is required.</small>
                        </div>
                        <div>
                            <label for="desc" class="block font-bold mb-3">Description</label>
                            <InputText rows="5" id="title" v-model.trim="item.desc" required="false" fluid />
                            <small v-if="submitted && !item.desc" class="text-red-500">Descripstion is required.</small>
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
import { onMounted, ref } from 'vue';
//untuk tab
import { FilterMatchMode } from '@primevue/core/api';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import AlertMessage from '../../components/AlertMessage.vue';

const dropdownProjectItems = ref([]);
const dropdownProjectItem = ref(null);
// const dropdownTableItems = ref([]);
// const dropdownTableItem = ref(null);
const autStores = useAuthStore();
const toast = useToast();
const { currentUser, currentToken, getToken } = autStores
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
// const result = ref([])
const formDialog = ref(false);
const results = ref()
const pageNo = ref()
const jmlRows = ref(0)
const rowPerPage = ref(10)
const selectedItems = ref();
const itemDelete = ref()
const item = ref({});
const deleteDialog = ref(false);
const submitted = ref(false);
const errorAlert = ref("")
const edit = ref(false)

onMounted(async () => {
    pageNo.value = 1
    await allProjects()
})

async function onChange() {
    await searchTable()
}

const searchTable = async () => {
    let urlParam = ""
    urlParam = '&project_id=' + JSON.stringify(dropdownProjectItem.value.id)
    try {
        const { data } = await custumFetch.get("/dev_tablexs/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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

function openNew() {
    item.value = ({})
    submitted.value = false;
    formDialog.value = true;
    item.value.project_id = dropdownProjectItem.value.id
}
const hideDialog = () => {
    formDialog.value = false;
    submitted.value = false;
}


//unutk data Datatable ganti menggunakan search yooooiii
//yang saat ini tidak pakai pagging
async function onPageChange(event) {
    pageNo.value = event.page + 1
    rowPerPage.value = event.rows
    searchTable()
}

const allProjects = async () => {
    try {
        const { data } = await custumFetch.get("/dev_projects/",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        dropdownProjectItems.value = data.data
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
    const myasetDelete = await custumFetch.delete('/dev_tablexs/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Tablex Deleted', life: 3000 });
    itemDelete.value = {};
    searchTable()
}
function editItem(dataRow) {
    edit.value = true
    item.value = { ...dataRow };
    formDialog.value = true;
}
//periksa unutk jenis update atau onsert
const handleSubmit = async () => {
    if (item.value.id) {
        try {
            const results = await custumFetch.put("/dev_tablexs/" + item.value.id,
                {
                    name: item.value.name,
                    desc: item.value.desc,
                    project_id: item.value.project_id
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create Project Success', life: 3000 });
            searchTable()
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const results = await custumFetch.post("/dev_tablexs",
                {
                    name: item.value.name,
                    desc: item.value.desc,
                    project_id: item.value.project_id
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create Project Success', life: 3000 });
            searchTable()
        } catch (error) {
            console.log(error)
        }
    }

}

</script>