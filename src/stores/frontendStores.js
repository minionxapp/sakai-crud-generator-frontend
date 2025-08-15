
import custumFetch from '@/api';
import { useAuthStore } from '@/stores/authStores';
import { firstUpper, replaceString } from '@/stores/util';
import { ref } from 'vue';
const autStores = useAuthStore();
const { currentUser, currentToken, getToken } = autStores
const koloms = ref()
const tableName = ref()

export const GetKoloms = async (tableId) => {
    try {
        const { data } = await custumFetch.get("/devTableKoloms/tableid/" + tableId,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        koloms.value = data.data
    } catch (error) {
        console.log(error)
    }
}


export const Frontend = async (tableId, tableName) => {
    await GetKoloms(tableId)
    const tablename = await replaceString(tableName)

    let front = ''
    front = front +
        '\n<template>\n' +
        '<Toast />\n' +
        '<div>\n' +
        '    <div class="card">\n' +
        '        <Toolbar class="mb-6">\n' +
        '            <template #start>\n' +
        '                <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />\n' +
        '                <!-- <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteItem"\n' +
        '                    :disabled="!selectedProducts || !selectedProducts.length" /> -->\n' +
        '            </template>\n' +
        '            <template #end>\n' +
        '                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />\n' +
        '            </template>\n' +
        '        </Toolbar>\n' +
        '        <!-- //LIST TABLE -->\n' +
        '        <DataTable ref="dt" v-model:selection="selectedItems" :value="results" dataKey="id" :paginator="true"\n' +
        '            :rows=rowPerPage @page="onPageChange($event)" :totalRecords=jmlRows lazy\n' +
        '            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"\n' +
        '            :rowsPerPageOptions="[5, 10, 25]" :filters="filters"\n' +
        '            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">\n' +
        '            <template #header>\n' +
        '                <div class="flex flex-wrap gap-2 items-center justify-between">\n' +
        '                    <h4 class="m-0">Manage ' + tableName + '</h4>\n' +
        '                    <IconField>\n' +
        '                        <InputIcon @click="searchData()">\n' +
        '                            <i class=" pi pi-search" />\n' +
        '                        </InputIcon>\n' +
        '                        <InputText v-model="filters[\'global\'].value" placeholder="Search..." />\n' +
        '                    </IconField>\n' +
        '                </div>\n' +
        '            </template>\n\n' +
        '            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>\n' +
        '            <Column field="id" header="Id" sortable style="min-width: 4rem"></Column>\n'
    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Date') {
            front = front + '<Column field="' + element.name + '" header="' + await firstUpper(element.name) + '" sortable style="min-width: 4rem">\n' +
                '<template #body="slotProps">{{ ((slotProps.data.' + element.name + ') + "").substring(0, 10) }} </template>\n</Column>\n'
        } else {

            front = front + '<Column field="' + element.name + '" header="' + await firstUpper(element.name) + '" sortable style="min-width: 4rem"></Column>\n'
        }
    }
    front = front +
        '            <Column :exportable="false" style="min-width: 4rem">\n' +
        '                <template #body="slotProps">\n' +
        '                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editItem(slotProps.data)" />\n' +
        '                    <Button icon="pi pi-trash" outlined rounded severity="danger"\n' +
        '                        @click="confirmDeleteItem(slotProps.data)" />\n' +
        '                </template>\n' +
        '            </Column>\n' +
        '        </DataTable>\n' +
        '        <!-- //DELETE DIALOG -->\n' +
        '        <Dialog v-model:visible="deleteDialog" :style="{ width: \'450px\' }" header="Confirm" :modal="true">\n' +
        '            <div class="flex items-center gap-4">\n' +
        '                <i class="pi pi-exclamation-triangle !text-3xl" />\n' +
        '                <span v-if="itemDelete">Are you sure you want to delete <b>{{ itemDelete.name }}</b>?</span>\n' +
        '            </div>\n' +
        '            <template #footer>\n' +
        '                <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />\n' +
        '                <Button label="Yes" icon="pi pi-check" @click="deleteItem" />\n' +
        '            </template>\n' +
        '        </Dialog>\n' +

        '       <!-- //CREATE DIALOG -->\n' +
        '       <Dialog v-model:visible="formDialog" :style="{ width:\'550px\' }" header="' + tableName + ' Details" :modal="true">\n' +
        '            <div class="flex flex-col gap-6">\n' +
        '                <img v-if="product.image"\n' +
        '                    :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"\n' +
        '                    :alt="product.image" class="block m-auto pb-4" />\n' +
        '                <form @submit.prevent="handleSubmit">\n' +
        '                    <AlertMessage v-if="errorAlert" :message="errorMsg" />\n' +
        '                    <div>\n' +
        '                        <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"\n' +
        '                            fluid readonly="true" hidden />\n' +
        '                    </div>\n'
    front = front + ''
    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Varchar') {
            front = front + '<div>\n' +
                '                        <label for="' + element.name + '" class="block font-bold mb-3">' + await firstUpper(element.name) + '</label>\n' +
                '                        <InputText rows="5" id="' + element.name + '" v-model.trim="item.' + element.name + '" required="false" fluid />\n' +
                '                        <small v-if="submitted && !item.' + element.name + '" class="text-red-500">' + element.name + ' is required.</small>\n' +
                '                    </div>\n'
        }
        if (element.type == 'Date') {
            front = front + '<div>\n' +
                '                        <label for="' + element.name + '" class="block font-bold mb-3">' + await firstUpper(element.name) + '</label>\n' +
                '                        <DatePicker :showIcon="true" :showButtonBar="true"rows="5" id="' + element.name + '" v-model.trim="item.' + element.name +
                '" required="false" fluid ></DatePicker> \n' +
                '                        <small v-if="submitted && !item.' + element.name + '" class="text-red-500">' + element.name + ' is required.</small>\n' +
                '                    </div>\n'
        }
        if (element.type == 'Number') {
            front = front + '<div>\n' +
                '                        <label for="' + element.name + '" class="block font-bold mb-3">' + await firstUpper(element.name) + '</label>\n' +
                '                        <InputNumber :showIcon="true" :showButtonBar="true"rows="5" id="' + element.name + '" v-model.trim="item.' + element.name +
                '" required="false" fluid  showButtons mode="decimal"></InputNumber> \n' +
                '                        <small v-if="submitted && !item.' + element.name + '" class="text-red-500">' + element.name + ' is required.</small>\n' +
                '                    </div>\n'
        }
    }

    front = front +
        '                    <div class="flex align-items-center gap-3 mb-5"></div>\n' +
        '                    <div class="flex justify-content-end gap-2">\n' +
        '                        <Button type="button" label="Cancel" severity="secondary" @click="hideDialog()"></Button>\n' +
        '                        <Button type="submit" label="Submit"></Button>\n' +
        '                    </div>\n' +
        '                </form>\n' +
        '            </div>\n' +
        '        </Dialog>\n' +
        '   </div>\n' +
        '</div>\n' +
        '</template>'
    //Script

    front = front +
        '<script setup>\n' +
        'import custumFetch from \'@/api\';\n' +
        'import { useAuthStore } from \'@/stores/authStores\';\n import { dateFormat } from \'@/stores/util\';' +
        'import { FilterMatchMode } from \'@primevue/core/api\';\n' +
        'import { Toast } from \'primevue\';\n' +
        'import Column from \'primevue/column\';\n' +
        'import DataTable from \'primevue/datatable\';\n' +
        'import { useToast } from \'primevue/usetoast\';\n' +
        'import { onMounted, ref } from \'vue\';\n' +
        'import AlertMessage from \'../../components/AlertMessage.vue\';\n\n' +

        'const autStores = useAuthStore();\n' +
        'const { currentUser, currentToken, getToken } = autStores\n' +

        'const dt = ref();\n' +
        'const products = ref();\n' +
        'const formDialog = ref(false);\n' +
        'const deleteDialog = ref(false);\n' +
        'const product = ref({});\n' +
        'const selectedItems = ref();\n' +
        'const submitted = ref(false);\n' +
        'const filters = ref({' +
        '    global: { value: null, matchMode: FilterMatchMode.CONTAINS }' +
        '});\n' +
        'const results = ref()\n' +
        'const errorMsg = ref(false)\n' +
        'const errorAlert = ref("")\n' +
        'const edit = ref(false)\n' +
        'const toast = useToast();\n' +
        'const item = ref({});\n' +
        'const itemDelete = ref()\n' +
        'const pageNo = ref()\n' +
        'const jmlRows = ref(0)\n' +
        'const rowPerPage = ref(10)\n\n' +
        'async function onPageChange(event) {\n' +
        '    pageNo.value = event.page + 1\n' +
        '    rowPerPage.value = event.rows\n' +
        '    searchData()\n' +
        '}\n' +

        'function openNew() {\n' +
        '    item.value = ({})\n' +
        '    submitted.value = false;\n' +
        '    formDialog.value = true;\n' +
        '}\n' +
        'const hideDialog = () => {\n' +
        '    formDialog.value = false;\n' +
        '    submitted.value = false;\n' +
        '}\n' +
        '\n' +
        'const searchData = async () => {\n' +
        '    const paramCari = ((JSON.parse(JSON.stringify(filters.value))).global.value)\n' +
        '    let urlParam = ""\n' +
        '    if (paramCari) {\n' +
        '        urlParam = \'&name=\' + paramCari\n' + '//sesuaikan ya dengan nama kolom pencariannya\n' +
        '    }\n' +
        '    try {\n' +
        '        const { data } = await custumFetch.get("/' + tablename + 's/?page=" + pageNo.value + \'&size=\' + rowPerPage.value + urlParam,\n' +
        '            {\n' +
        '                withCredentials: true,\n' +
        '                headers: {\n' +
        '                    "X-API-TOKEN": await getToken()\n' +
        '                },\n' +
        '            }\n' +
        '        )\n' +
        '        results.value = data.data\n' +
        '        jmlRows.value = data.paging.total_rows\n' +
        '    } catch (error) {\n' +
        '        console.log(error)\n' +
        '    }\n' +
        '}\n' +
        'function confirmDeleteItem(value) {\n' +
        '    itemDelete.value = value\n' +
        '    deleteDialog.value = true;\n' +
        '}\n' +
        'async function deleteItem() {\n' +
        '    deleteDialog.value = false\n' +
        '    const myasetDelete = await custumFetch.delete(\'/' + tablename + 's/\' + itemDelete.value.id,\n' +
        '        {\n' +
        '            withCredentials: true,\n' +
        '            headers: {\n' +
        '                "X-API-TOKEN": await getToken()\n' +
        '            },\n' +
        '        }\n' +
        '    )\n' +
        '    deleteDialog.value = false;\n' +
        '    itemDelete.value = {};\n' +
        '    toast.add({ severity: \'success\', summary: \'Successful\', detail: \'' + tableName + ' Deleted\', life: 3000 });\n' +
        '    searchData()\n' +
        '}\n' +
        '\n' +
        '\n' +
        'function editItem(dataRow) {\n' +
        '    edit.value = true\n' +
        '    item.value = { ...dataRow };\n' +
        '    formDialog.value = true;\n' +
        '}\n' +
        '\n' +
        '\n' +
        '//periksa unutk jenis update atau onsert\n' +
        'const handleSubmit = async () => {\n'

    front = front +
        '    //untuk edit id sudah ada\n' +
        '    if (item.value.id) {\n'
    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Date') {
            front = front + 'let ' + element.name + '\n' +
                'try {\n' +
                '    ' + element.name + ' = await dateFormat(item.value.' + element.name + ')\n' +
                '} catch (error) {\n' +
                '   ' + element.name + ' = (item.value.' + element.name + ').substring(0, 10)\n' +
                '}'
        }
    }



    front = front + '        try {\n' +
        '            const results = await custumFetch.put("/' + tablename + 's/" + item.value.id,\n' +
        '                {\n'
    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Date') {
            front = front + '' + element.name + ': (' + element.name + '),\n'
        } else {
            front = front + ' ' + element.name + ' : ' + 'item.value.' + element.name + ',\n'
        }
    }
    front = front +
        '                }, {\n' +
        '                withCredentials: true,\n' +
        '                headers: {\n' +
        '                    "X-API-TOKEN": await getToken()\n' +
        '                },\n' +
        '            }\n' +
        '            )\n' +
        '            formDialog.value = false\n' +
        '            item.value = {}\n' +
        '            toast.add({ severity: \'success\', summary: \'Successful\', detail: \'Update ' + tableName + ' Success\', life: 3000 });\n' +
        '        } catch (error) {\n' +
        '            console.log(error)\n' +
        '        }\n' +
        '\n' +
        '    } else {\n'

    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Date') {
            front = front + 'let ' + element.name + ' = await dateFormat(item.value.' + element.name + ')\n'
        }
    }



    front = front + '        try {\n' +
        '            const results = await custumFetch.post("/' + tablename + 's",\n' +
        '                {\n'
    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Date') {
            front = front + '' + element.name + ': (' + element.name + '),\n'
        } else {
            front = front + ' ' + element.name + ' : ' + 'item.value.' + element.name + ',\n'
        }
    }
    front = front +
        '                }, {\n' +
        '                withCredentials: true,\n' +
        '                headers: {\n' +
        '                    "X-API-TOKEN": await getToken()\n' +
        '                },\n' +
        '            }\n' +
        '            )\n' +
        '            formDialog.value = false\n' +
        '            item.value = {}\n' +
        '            toast.add({ severity: \'success\', summary: \'Successful\', detail: \'Create ' + tableName + ' Success\', life: 3000 });\n' +
        '        } catch (error) {\n' +
        '            console.log(error)\n' +
        '        }\n' +
        '    }\n' +
        '    searchData()\n' +
        '}\n' +
        'onMounted(async () => {\n' +
        '    pageNo.value = 1\n' +
        '    searchData()\n' +
        '});\n' +
        '</script>'
    return front.toString()
}


export const Index = async (tableId, tableName) => {
    const tablename = await replaceString(tableName)
    let index = ''
    index = index +
        '\n//index.js\n\n{\n' +
        'path: \'/dev/' + tablename + '\',\n' +
        'name: \'' + await firstUpper(tablename) + '\',\n' +
        'component: () => import(\'@/views/dev/' + await firstUpper(tableName) + '.vue\')\n' +
        '},\n\n\n\n\n' +
        '//AppMenu.vue \n\n{ label: \'' + await firstUpper(tablename) + '\', icon: \'pi pi-fw pi-car\', to: { name: \'' + tablename + '\' } }\n'



    //cretae  file
    const paramCari = 'tester'
    let urlParam = ""
    const folderFrontend = ref()
    if (paramCari) {
        urlParam = '&username=' + paramCari
    }
    try {
        const { data } = await custumFetch.get("/devdirektoris/?" + tableId + urlParam,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        folderFrontend.value = data.data[0].frontend
        // console.log(folderFrontend.value)
    } catch (error) {
        console.log(error)
    }

    const frontProject = folderFrontend.value + "src" //"/Users/macbook/Mugi_data/workspace/typescript/sakai-vue-crud-generator/src"
    const viewFolder = '/views'
    index = index + 'touch ' + frontProject + viewFolder + '/dev/' + await firstUpper(tableName) + '.vue\n\n'

    index = index + '//tambahan untuk select option\n. const yesNo = ref([{ name: \'Yes\', code: \'Y\' }, { name: \'No\', code: \'N\' }])\n' +
        '<Select id="aktive" v-model="item.aktive" :options="yesNo" optionLabel="name"\n' +
        'optionValue="code" placeholder="Aktive" class="w-full"></Select>\n'
    return index
}