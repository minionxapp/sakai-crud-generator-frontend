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
                                @change="onChangeProject()"></Select>
                        </div>
                        <div class="field">
                            <label for="table" class="sr-only">Tabel</label>
                            <Select id="state" v-model="dropdownTableItem" :options="dropdownTableItems"
                                optionLabel="name" placeholder="Select Project" class="w-full"
                                @change="onChangeTable()"></Select>
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
                <Column field="id" header="Id" sortable style="min-width: 2rem"></Column>
                <Column field="name" header="Name Kolom" sortable style="min-width: 16rem"></Column>
                <Column field="type" header="Type" sortable style="min-width: 4 rem"></Column>
                <Column field="table_id" header="Id Table" sortable style="min-width: 4rem"></Column>
                <Column field="table_name" header="Nama Table" sortable style="min-width: 16rem"></Column>
                <Column field="desc" header="Desc" sortable style="min-width: 16rem"></Column>
                <Column field="length" header="Panjang" sortable style="min-width: 4 rem"></Column>
                <Column field="is_id" header="Set ID" sortable style="min-width: 4 rem"></Column>
                <Column field="is_null" header="Set Null" sortable style="min-width: 4 rem"></Column>
                <Column field="is_uniq" header="Set Unique" sortable style="min-width: 4 rem"></Column>
                <Column field="default" header="default" sortable style="min-width: 4 rem"></Column>
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
                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="name" class="block font-bold mb-0">Project ID</label>
                                    <InputText id="title" v-model.trim="item.project_id" required="false" fluid
                                        readonly />
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="table_id" class="block font-bold mb-0">Table ID</label>
                                    <InputText rows="5" id="table_id" v-model.trim="item.table_id" required="false"
                                        fluid readonly />
                                    <small v-if="submitted && !item.desc" class="text-red-500">table_id is
                                        required.</small>
                                </div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"
                                fluid readonly="true" hidden />
                        </div>

                        <div class="flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="table_name" class="block font-bold mb-0">Table Name</label>
                                    <InputText rows="5" id="table_name" v-model.trim="item.table_name" required="false"
                                        fluid readonly />
                                    <small v-if="submitted && !item.desc" class="text-red-500">table_id is
                                        required.</small>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="name" class="block font-bold mb-0">Kolom Name</label>
                                    <InputText rows="5" id="name" v-model.trim="item.name" required="false" fluid />
                                    <small v-if="submitted && !item.desc" class="text-red-500">table_id is
                                        required.</small>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="desc" class="block font-bold mb-0">Kolom Desc</label>
                                    <InputText rows="5" id="desc" v-model.trim="item.desc" required="false" fluid />
                                    <small v-if="submitted && !item.desc" class="text-red-500">table_id is
                                        required.</small>
                                </div>
                            </div>
                        </div>

                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="type" class="block font-bold mb-0">Type Kolom</label>
                                    <Select id="type" v-model="item.type" :options="types" optionLabel="name"
                                        optionValue="name" placeholder="Select Project" class="w-full"></Select>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="length" class="block font-bold mb-0">Table length</label>
                                    <InputText rows="5" id="length" v-model.trim="item.length" required="false" fluid />
                                </div>
                            </div>
                        </div>

                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="is_id" class="block font-bold mb-0">Is ID</label>
                                    <Select id="is_id" v-model="item.is_id" :options="yesNo" optionLabel="name"
                                        optionValue="code" placeholder="Select Project" class="w-full"></Select>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="is_null" class="block font-bold mb-0">Is Null</label>
                                    <Select id="is_null" v-model="item.is_null" :options="yesNo" optionLabel="name"
                                        optionValue="code" placeholder="Select Project" class="w-full"></Select>
                                </div>
                            </div>
                        </div>

                        <div class=" flex flex-col gap-0 mb-2">
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="is_uniq" class="block font-bold mb-0">Is Uniq</label>
                                    <Select id="is_uniq" v-model="item.is_uniq" :options="yesNo" optionLabel="name"
                                        optionValue="code" placeholder="Select Project" class="w-full"></Select>
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="default" class="block font-bold mb-0">Default</label>
                                    <InputText rows="5" id="default" v-model="item.default" required="false" fluid />
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
import { onMounted, ref } from 'vue';
//untuk tab
import { FilterMatchMode } from '@primevue/core/api';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import AlertMessage from '../../components/AlertMessage.vue';

const dropdownProjectItems = ref([]);
// const koloms = ref(["Varchar", "Number"])
const types = ref([
    { name: 'Varchar', code: 'Varchar' },
    { name: 'Number', code: 'Number' },
    { name: 'Date', code: 'Date' }
]);

const yesNo = ref([{ name: 'Yes', code: 'Y' }, { name: 'No', code: 'N' }])
const dropdownProjectItem = ref(null);
const dropdownTableItem = ref()
const dropdownTableItems = ref([])
const autStores = useAuthStore();
const toast = useToast();
const { currentUser, currentToken, getToken } = autStores
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
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

async function onChangeProject() {
    // await searchKolomByTable()
    await tablesByProject()
    results.value = null
}

async function onChangeTable() {
    // alert(JSON.stringify(dropdownTableItem.value))
    await searchKolomByTable()
}

const tablesByProject = async () => {
    const projectId = await JSON.stringify(dropdownProjectItem.value.id)
    try {
        const { data } = await custumFetch.get("/dev_tablexs/projectid/" + projectId,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        dropdownTableItems.value = data.data
    } catch (error) {
        console.log(error)
    }
}



const searchKolomByTable = async () => {
    // alert(await JSON.stringify(dropdownTableItem.value.id))
    let urlParam = ""
    urlParam = '&table_id=' + JSON.stringify(dropdownTableItem.value.id)
    try {
        const { data } = await custumFetch.get("/devTableKoloms/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
    item.value.table_id = JSON.stringify(dropdownTableItem.value.id)
    item.value.table_name = (dropdownTableItem.value.name)
    // item.value.desc = (dropdownTableItem.value.desc)
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
    searchKolomByTable()
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
    const myasetDelete = await custumFetch.delete('/devTableKoloms/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Table Kolom Deleted', life: 3000 });
    itemDelete.value = {};
    searchKolomByTable()
}
function editItem(dataRow) {
    edit.value = true
    item.value = { ...dataRow };
    formDialog.value = true;
}
//periksa unutk jenis update atau onsert
const handleSubmit = async () => {
    // console.log(JSON.stringify(item.value))
    if (item.value.id) {
        try {
            const results = await custumFetch.put("/devTableKoloms/" + item.value.id,
                {
                    project_id: Number(item.value.project_id),
                    name: item.value.name,
                    table_name: item.value.table_name,
                    desc: item.value.desc,
                    is_id: item.value.is_id,
                    is_null: item.value.is_null,
                    is_uniq: item.value.is_uniq,
                    default: item.value.default,
                    type: item.value.type,
                    length: Number(item.value.length),
                    table_id: Number(item.value.table_id),
                    default: item.value.default
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update Kolom Success', life: 3000 });
            searchKolomByTable()
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const results = await custumFetch.post("/devTableKoloms",
                {
                    name: item.value.name,
                    desc: item.value.desc,
                    project_id: item.value.project_id,
                    table_name: item.value.table_name,
                    is_id: item.value.is_id,
                    is_null: item.value.is_null,
                    is_uniq: item.value.is_uniq,
                    default: item.value.default,
                    type: item.value.type,
                    table_id: Number(item.value.table_id),
                    length: Number(item.value.length),
                    default: item.value.default
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            console.log(results)
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Simpan Kolom Success', life: 3000 });
            searchKolomByTable()
        } catch (error) {
            console.log(error)
        }
    }

}

</script>