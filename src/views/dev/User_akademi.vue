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
                        <h4 class="m-0">Manage User_akademi</h4>
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
                <Column field="username" header="Username" sortable style="min-width: 4rem"></Column>
                <Column field="kode_akademi" header="Kode_akademi" sortable style="min-width: 4rem"></Column>
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
            <Dialog v-model:visible="formDialog" :style="{ width: '550px' }" header="User_akademi Details"
                :modal="true">
                <div class="flex flex-col gap-6">
                    <img v-if="product.image"
                        :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
                        :alt="product.image" class="block m-auto pb-4" />
                    <form @submit.prevent="handleSubmit">
                        <AlertMessage v-if="errorAlert" :message="errorMsg" />
                        <!-- <div class="card flex justify-center"> -->
                        <!-- <AutoComplete v-model="value" :suggestions="items" @complete="search" /> -->
                        <!-- <AutoComplete name="country.name" optionLabel="name" :suggestions="filteredCountries" @complete="search" /> -->
                        <!-- </div> -->
                        <div>
                            <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"
                                fluid readonly="true" hidden />
                        </div>
                        <div>
                            <label for="username" class="block font-bold mb-3">Username</label>
                            <InputText rows="5" id="username" v-model.trim="item.username" required="false" fluid
                                :readonly="isInputReadonly" />
                            <small v-if="submitted && !item.username" class="text-red-500">username is required.</small>
                        </div>
                        <div>
                            <label for="kode_akademi" class="block font-bold mb-3">Kode_akademi</label>
                            <!-- <InputText rows="5" id="kode_akademi" v-model.trim="item.kode_akademi" required="false"
                                fluid /> -->
                            <Select id="kode_akademi" v-model="item.kode_akademi" :options="akademis" optionLabel="nama"
                                optionValue="kode" placeholder="Akademi" class="w-full"></Select>
                            <small v-if="submitted && !item.kode_akademi" class="text-red-500">kode_akademi is
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
const akademis = ref()
const isInputReadonly = ref(false)


const value = ref(null);
const items = ref([]);
const itemx = ref([])
//unutk isi auto complete
// const search = (event) => {
//     alert("testtttt :: " + JSON.stringify(event))
//     items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
//     // items.value = itemx.map((item) => event.query + '-' + item);
//     console.log(items.value)
//     // items.value = search()
// }

async function onPageChange(event) {
    pageNo.value = event.page + 1
    rowPerPage.value = event.rows
    searchData()
}
function openNew() {
    item.value = ({})
    submitted.value = false;
    formDialog.value = true;
    isInputReadonly.value = false
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
        const { data } = await custumFetch.get("/Userakademis/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
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
    const myasetDelete = await custumFetch.delete('/Userakademis/' + itemDelete.value.id,
        {
            withCredentials: true,
            headers: {
                "X-API-TOKEN": await getToken()
            },
        }
    )
    deleteDialog.value = false;
    itemDelete.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User_akademi Deleted', life: 3000 });
    searchData()
}


function editItem(dataRow) {
    edit.value = true
    item.value = { ...dataRow };
    formDialog.value = true;
    isInputReadonly.value = true
}


//periksa unutk jenis update atau onsert
const handleSubmit = async () => {
    //untuk edit id sudah ada
    if (item.value.id) {
        try {
            const results = await custumFetch.put("/Userakademis/" + item.value.id,
                {
                    username: item.value.username,
                    kode_akademi: item.value.kode_akademi,
                }, {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
            )
            formDialog.value = false
            item.value = {}
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Update User_akademi Success', life: 3000 });
        } catch (error) {
            console.log(error)
        }

    } else {
        //cek user apakah ada atau tidak
        await searchByUsername()
        await searchUserakademi()
        if ((usernames.value).length > 0 && (userakademi.value).length < 1) {
            try {
                const results = await custumFetch.post("/Userakademis",
                    {
                        username: item.value.username,
                        kode_akademi: item.value.kode_akademi,
                    }, {
                    withCredentials: true,
                    headers: {
                        "X-API-TOKEN": await getToken()
                    },
                }
                )
                formDialog.value = false
                item.value = {}
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Create User_akademi Success', life: 3000 });
            } catch (error) {
                console.log(error)
            }
        } else {
            toast.add({ severity: 'error', summary: 'Gagal', detail: 'Set user akademi gagal...', life: 3000 });
        }
    }
    searchData()
}

const usernames = ref(null)
const searchByUsername = async () => {
    let urlParam = ""
    urlParam = '&username=' + item.value.username
    try {
        const { data } = await custumFetch.get("/users/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        usernames.value = data.data
        // console.log(usernames.value)
        jmlRows.value = data.paging.total_rows
    } catch (error) {
        console.log(error)
    }
}

//=====
const userakademi = ref(null)
const searchUserakademi = async () => {
    let urlParam = ""
    urlParam = '&username=' + item.value.username
    try {
        const { data } = await custumFetch.get("/userakademis/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        userakademi.value = data.data
        // console.log(userakademi.value)
        jmlRows.value = data.paging.total_rows
    } catch (error) {
        console.log(error)
    }
}







onMounted(async () => {
    pageNo.value = 1
    await searchData()
    // getUser()
    await getAkademi()

});
const getAkademi = async () => {
    const paramCari = ((JSON.parse(JSON.stringify(filters.value))).global.value)
    let urlParam = ""
    if (paramCari) {
        urlParam = '&name=' + paramCari
        //sesuaikan ya dengan nama kolom pencariannya
    }
    try {
        const { data } = await custumFetch.get("/akademis/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        akademis.value = data.data
        // console.log(akademis.value)
        jmlRows.value = data.paging.total_rows
    } catch (error) {
        console.log(error)
    }
}

const getUser = async () => {
    const paramCari = ((JSON.parse(JSON.stringify(filters.value))).global.value)
    let urlParam = ""
    if (paramCari) {
        urlParam = '&name=' + paramCari
        //sesuaikan ya dengan nama kolom pencariannya
    }
    try {
        const { data } = await custumFetch.get("/users/?page=" + pageNo.value + '&size=' + rowPerPage.value + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        itemx.value = data.data
        console.log(items.value)
        jmlRows.value = data.paging.total_rows
    } catch (error) {
        console.log(error)
    }
}



</script>