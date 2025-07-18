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
                        <h4 class="m-0">Manage pmakai</h4>
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
                <Column field="username" header="Username" sortable style="min-width: 12rem"></Column>
                <!-- <Column field="password" header="Password" sortable style="min-width: 12rem"></Column> -->
                <Column field="name" header="Name" sortable style="min-width: 12rem"></Column>
                <Column field="token" header="Token" sortable style="min-width: 12rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 6rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 12rem"></Column>
                <Column field="group" header="Group" sortable style="min-width: 6rem"></Column>
                <Column field="expired" header="Expired" sortable style="min-width: 6rem">
                    <template #body="slotProps">{{ ((slotProps.data.expired) + "").substring(0, 10) }} </template>
                </Column>
                <Column :exportable="false" style="min-width: 6rem">
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
            <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="pmakai Details" :modal="true">
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
                            <label for="username" class="block font-bold mb-3">Username</label>
                            <InputText rows="5" id="username" v-model.trim="item.username" required="false" fluid />
                            <small v-if="submitted && !item.username" class="text-red-500">username is required.</small>
                        </div>
                        <div v-if="!item.id">
                            <label for="password" class="block font-bold mb-3">Password</label>
                            <InputText rows="5" id="password" v-model.trim="item.password" required="false" fluid />
                            <!-- <small v-if="submitted && !item.password" class="text-red-500">password is required.</small> -->
                        </div>
                        <div>
                            <label for="name" class="block font-bold mb-3">Name</label>
                            <InputText rows="5" id="name" v-model.trim="item.name" required="false" fluid />
                            <small v-if="submitted && !item.name" class="text-red-500">name is required.</small>
                        </div>
                        <div>
                            <label for="token" class="block font-bold mb-3">Token</label>
                            <InputText rows="5" id="token" v-model.trim="item.token" required="false" fluid />
                            <small v-if="submitted && !item.token" class="text-red-500">token is required.</small>
                        </div>
                        <div>
                            <label for="status" class="block font-bold mb-3">Status</label>
                            <!-- <InputText rows="5" id="status" v-model.trim="item.status" required="false" fluid /> -->
                            <Select id="status" v-model="item.status" :options="yesNo" optionLabel="name"
                                optionValue="code" placeholder="status" class="w-full"></Select>
                            <small v-if="submitted && !item.status" class="text-red-500">status is required.</small>
                        </div>
                        <div>
                            <label for="email" class="block font-bold mb-3">Email</label>
                            <InputText rows="5" id="email" v-model.trim="item.email" required="false" fluid />
                            <small v-if="submitted && !item.email" class="text-red-500">email is required.</small>
                        </div>
                        <div>
                            <label for="group" class="block font-bold mb-3">Group</label>
                            <!-- <InputText rows="5" id="group" v-model.trim="item.group" required="false" fluid /> -->
                            <Select id="group" v-model="item.group" :options="groupItems" optionLabel="name"
                                optionValue="name" placeholder="group" class="w-full"></Select>
                            <small v-if="submitted && !item.group" class="text-red-500">group is required.</small>
                        </div>
                        <div>
                            <label for="expired" class="block font-bold mb-3">Expired</label>
                            <DatePicker :showIcon="true" :showButtonBar="true" rows="5" id="expired"
                                v-model.trim="item.expired" required="false" fluid></DatePicker>
                            <small v-if="submitted && !item.expired" class="text-red-500">expired is required.</small>
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
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
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

const yesNo = ref([{ name: 'Yes', code: 'Y' }, { name: 'No', code: 'N' }])
const groupItems = ref([]);





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
    }

    //cek jika row data 9999 apa yg akan dilakukan
    try {
        const { data } = await custumFetch.get("/pmakais/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
    const myasetDelete = await custumFetch.delete('/pmakais/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    itemDelete.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Pmakai Deleted', life: 3000 });
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
        let expired
        try {
            expired = await dateFormat(item.value.expired)
        } catch (error) {
            expired = (item.value.expired).substring(0, 10)
        } try {
            const results = await custumFetch.put("/pmakais/" + item.value.id,
                {
                    username: item.value.username,
                    // password: item.value.password,
                    name: item.value.name,
                    token: item.value.token,
                    status: item.value.status,
                    email: item.value.email,
                    group: item.value.group,
                    expired: (expired)
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update pmakai Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }
    } else {
        let expired = await dateFormat(item.value.expired)
        try {
            const results = await custumFetch.post("/pmakais",
                {
                    username: item.value.username,
                    password: item.value.password,
                    name: item.value.name,
                    token: item.value.token,
                    status: item.value.status,
                    email: item.value.email,
                    group: item.value.group,
                    expired: (expired)
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Create pmakai Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }
    }
    searchData()
}
onMounted(async () => {
    pageNo.value = 1
    // rowPerPage.value = 200 //unutk menentukan jumlah size perpagenya, sesuai dengan validation nya
    searchData()
    await getGroupItems()
});



const getGroupItems = async () => {
    try {
        const { data } = await custumFetch.get("/groups" + '?size=99',
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        groupItems.value = data.data
        // console.log(groupItems.value)
    } catch (error) {
        console.log(error)
    }
}




</script>