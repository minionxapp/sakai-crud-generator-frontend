
import custumFetch from '@/api';
import { useAuthStore } from '@/stores/authStores';
import { firstLower, firstUpper, replaceString } from '@/stores/util';
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


export const FrontViewV2 = async (tableId, tableName) => {
    await GetKoloms(tableId)
    const tablename = await replaceString(tableName)
    const tablenameV2 = await firstUpper(tableName)
    const tablenameLowerV2 = await firstLower(tableName)

    let frontViewV2 = '\nVersion V2\n' + tablenameV2 + 'View.vue\n\n'

    frontViewV2 = frontViewV2 + '<template>\n' +
        '<div>\n' +
        '<Toast />\n' +
        '<div class="card">\n' +
        '<Toolbar class="mb-6">\n' +
        ' <template #start>\n' +
        '    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />\n' +
        '</template>\n' +
        '<template #end>\n' +
        '    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />\n' +
        '</template>\n' +
        '</Toolbar>\n\n' +

        '<' + tablenameV2 + 'Table :items="results" :rowsPerPage="rowPerPage" :totalRecords="jmlRows"\n' +
        '   @page-change="handlePageChange" @edit="editItem" @delete="confirmDeleteItem" @search="searchData" />\n\n' +

        '<' + tablenameV2 + 'FormDialog v-model:visible="formDialog" :item="item" @save="handleSave" />\n\n' +

        '<DeleteConfirmationDialog v-model:visible="deleteDialog" :itemToDelete="itemToDelete"\n' +
        '   @confirm="deleteItem" />\n' +
        '</div>\n' +
        '</div>\n' +
        '</template>\n\n' +

        '<script setup>\n' +
        '// Import library dan komponen yang dibutuhkan\n' +
        'import custumFetch from \'@/api\';\n' +
        'import { useAuthStore } from \'@/stores/authStores\';\n' +
        'import { useToast } from \'primevue/usetoast\';\n' +
        'import { onMounted, ref } from \'vue\';\n\n' +

        '// Komponen-komponen child\n\n' +

        '// PrimeVue components\n' +
        'import Button from \'primevue/button\';\n' +
        'import Toast from \'primevue/toast\';\n' +
        'import Toolbar from \'primevue/toolbar\';\n\n' +

        '// Inisialisasi store dan hooks\n' +
        'const autStores = useAuthStore();\n' +
        'const { getToken } = autStores;\n' +
        'const toast = useToast();\n\n' +

        '// State reaktif\n' +
        'const formDialog = ref(false); // Mengontrol visibilitas dialog form\n' +
        'const deleteDialog = ref(false); // Mengontrol visibilitas dialog hapus\n' +
        'const results = ref([]); // Data yang ditampilkan di tabel\n' +
        'const item = ref({}); // Data item yang sedang di-edit atau akan dibuat\n' +
        'const itemToDelete = ref(null); // Data item yang akan dihapus\n' +
        'const pageNo = ref(1); // Halaman saat ini untuk pagination\n' +
        'const jmlRows = ref(0); // Total baris data dari API\n' +
        'const rowPerPage = ref(10); // Jumlah baris per halaman\n' +
        'const globalFilter = ref(null); // Nilai filter pencarian global\n\n' +

        '// Fungsi untuk mengambil data dari API\n' +
        'const searchData = async (filterValue) => {\n' +
        '    // Jika ada nilai filter baru, perbarui state\n' +
        '    if (filterValue !== undefined) {\n' +
        '        globalFilter.value = filterValue;\n' +
        '    }\n' +
        '    // Buat parameter URL untuk pencarian\n' +
        '    let urlParam = globalFilter.value ? `&name=${globalFilter.value}` : "";\n' +
        '    try {\n' +
        '        const { data } = await custumFetch.get(`/' + tablenameLowerV2 + 's/?page=${pageNo.value}&size=${rowPerPage.value}${urlParam}`, {\n' +
        '            withCredentials: true,\n' +
        '            headers: { "X-API-TOKEN": await getToken() },\n' +
        '        });\n' +
        '        results.value = data.data;\n' +
        '        jmlRows.value = data.paging.total_rows;\n' +
        '    } catch (error) {\n' +
        '        console.error(error);\n' +
        '    }\n' +
        '};\n\n' +

        '// Fungsi yang dipanggil saat halaman diubah\n' +
        'const handlePageChange = (event) => {\n' +
        '    pageNo.value = event.page + 1;\n' +
        '    rowPerPage.value = event.rows;\n' +
        '    searchData();\n' +
        '};\n\n' +

        '// Fungsi untuk membuka dialog form baru\n' +
        'const openNew = () => {\n' +
        '    item.value = {}; // Kosongkan data item\n' +
        '    formDialog.value = true;\n' +
        '};\n\n' +

        'const exportCSV = () => {\n' +
        '}\n\n' +

        '// Fungsi untuk membuka dialog form edit\n' +
        'const editItem = (dataRow) => {\n' +
        '    item.value = { ...dataRow }; // Isi data item dengan data yang dipilih\n' +
        '    formDialog.value = true;\n' +
        '};\n\n' +

        '// Fungsi untuk membuka dialog konfirmasi hapus\n' +
        'const confirmDeleteItem = (value) => {\n' +
        '    itemToDelete.value = value; // Simpan data item yang akan dihapus\n' +
        '    deleteDialog.value = true;\n' +
        '};\n\n' +

        '// Fungsi untuk menghapus item\n' +
        'const deleteItem = async () => {\n' +
        '    try {\n' +
        '        await custumFetch.delete(`/' + tablenameV2 + 's/${itemToDelete.value.id}`, {\n' +
        '            withCredentials: true,\n' +
        '            headers: { "X-API-TOKEN": await getToken() },\n' +
        '        });\n' +
        '        toast.add({ severity: \'success\', summary: \'Successful\', detail: \'' + tablenameV2 + ' Deleted\', life: 3000 });\n' +
        '        searchData();\n' +
        '    } catch (error) {\n' +
        '        console.error(error);\n' +
        '    } finally {\n' +
        '        deleteDialog.value = false;\n' +
        '        itemToDelete.value = null;\n' +
        '    }\n' +
        '};\n\n' +

        '// Fungsi yang dipanggil saat form disubmit (dari ' + tablenameV2 + 'FormDialog)\n' +
        'const handleSave = async (itemData) => {\n' +
        '    try {\n' +
        '        if (itemData.id) { // Jika ada ID, lakukan UPDATE\n' +
        '            await custumFetch.put(`/' + tablenameLowerV2 + 's/${itemData.id}`, itemData, {\n' +
        '                withCredentials: true,\n' +
        '                headers: { "X-API-TOKEN": await getToken() },\n' +
        '            });\n' +
        '            toast.add({ severity: \'success\', summary: \'Successful\', detail: \'' + tablenameV2 + ' Updated\', life: 3000 });\n' +
        '        } else { // Jika tidak ada ID, lakukan CREATE\n' +
        '            await custumFetch.post("/' + tablenameV2 + 's", itemData, {\n' +
        '                withCredentials: true,\n' +
        '                headers: { "X-API-TOKEN": await getToken() },\n' +
        '            });\n' +
        '            toast.add({ severity: \'success\', summary: \'Successful\', detail: \'' + tablenameV2 + ' Created\', life: 3000 });\n' +
        '        }\n' +
        '        searchData();\n' +
        '    } catch (error) {\n' +
        '        console.error(error);\n' +
        '        toast.add({ severity: \'error\', summary: \'Error\', detail: \'Failed to save ' + tablenameLowerV2 + '\', life: 3000 });\n' +
        '    } finally {\n' +
        '        formDialog.value = false;\n' +
        '        item.value = {};\n' +
        '    }\n' +
        '};\n\n' +

        '// Hook saat komponen dimount\n' +
        'onMounted(() => {\n' +
        '    searchData();\n' +
        '});\n\n' +
        '</script>'

    return frontViewV2.toString()
}



export const FrontTableV2 = async (tableId, tableName) => {
    await GetKoloms(tableId)
    const tablename = await replaceString(tableName)
    const tablenameV2 = await firstUpper(tableName)
    const tablenameLowerV2 = await firstLower(tableName)
    let frontTableV2 = '\nVersion V2\n' + tablenameV2 + 'Table.vue\n\n'

    frontTableV2 = frontTableV2 + " \n" +
        '<template>\n' +
        '    <DataTable :value="items" :paginator="true" :rows="rowsPerPage" :totalRecords="totalRecords" lazy\n' +
        '        @page="$emit(\'page-change\', $event)"\n' +
        '        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"\n' +
        '        :rowsPerPageOptions="[5, 10, 25]" :filters="filters"\n' +
        '        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">\n\n' +

        '        <template #header>\n' +
        '            <div class="flex flex-wrap gap-2 items-center justify-between">\n' +
        '                <h4 class="m-0">Manage ' + tablenameV2 + '</h4>\n' +
        '                <IconField>\n' +
        '                    <InputIcon @click="$emit(\'search\', filters.global.value)">\n' +
        '                        <i class="pi pi-search" />\n' +
        '                    </InputIcon>\n' +
        '                    <InputText v-model="filters.global.value" placeholder="Search..."\n' +
        '                        @keyup.enter="$emit(\'search\', filters.global.value)" />\n' +
        '                </IconField>\n' +
        '            </div>\n' +
        '        </template>\n\n' +

        '       <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>\n' +
        '       <Column field="id" header="Id" sortable style="min-width: 12rem"></Column>\n'


    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Date') {
            frontTableV2 = frontTableV2 + '<Column field="' + element.name + '" header="' + await firstUpper(element.name) + '" sortable style="min-width: 4rem">\n' +
                '<template #body="slotProps">{{ ((slotProps.data.' + element.name + ') + "").substring(0, 10) }} </template>\n</Column>\n'
        } else {

            frontTableV2 = frontTableV2 + '<Column field="' + element.name + '" header="' + await firstUpper(element.name) + '" sortable style="min-width: 4rem"></Column>\n'
        }
    }

    frontTableV2 = frontTableV2 +
        '        <Column :exportable="false" style="min-width: 12rem">\n' +
        '            <template #body="slotProps">\n' +
        '                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="$emit(\'edit\', slotProps.data)" />\n' +
        '                <Button icon="pi pi-trash" outlined rounded severity="danger"\n' +
        '                    @click="$emit(\'delete\', slotProps.data)" />\n' +
        '            </template>\n' +
        '        </Column>\n' +
        '    </DataTable>\n' +
        '</template>\n\n' +

        '<script setup>\n' +
        'import { FilterMatchMode } from \'@primevue/core/api\';\n' +
        'import Button from \'primevue/button\';\n' +
        'import Column from \'primevue/column\';\n' +
        'import DataTable from \'primevue/datatable\';\n' +
        'import InputText from \'primevue/inputtext\';\n' +
        'import { defineEmits, defineProps, ref } from \'vue\';\n\n' +

        '// Menerima props dari parent\n' +
        'const props = defineProps({\n' +
        '    items: {\n' +
        '        type: Array,\n' +
        '        required: true\n' +
        '    },\n' +
        '    rowsPerPage: {\n' +
        '        type: Number,\n' +
        '        required: true\n' +
        '    },\n' +
        '    totalRecords: {\n' +
        '        type: Number,\n' +
        '        required: true\n' +
        '    }\n' +
        '});\n\n' +

        '// Mendefinisikan event yang akan dikirim ke parent\n' +
        'const emit = defineEmits([\'page-change\', \'edit\', \'delete\', \'search\']);\n\n' +

        '// State untuk filter pencarian\n' +
        'const filters = ref({\n' +
        '    global: { value: null, matchMode: FilterMatchMode.CONTAINS }\n' +
        '});\n' +
        '</script>'

    return frontTableV2.toString() + ''





    //=====================end FrontTableV2 ===========
}


export const FrontFormDialogV2 = async (tableId, tableName) => {
    await GetKoloms(tableId)
    const tablename = await replaceString(tableName)
    const tablenameV2 = await firstUpper(tableName)
    const tablenameLowerV2 = await firstLower(tableName)
    let FrontFormDialogV2 = '\nVersion V2\n' + tablenameV2 + 'FormDialog.vue\n\n'

    FrontFormDialogV2 = FrontFormDialogV2 +
        '<template>\n' +
        '    <Dialog :visible="visible" :style="{ width: \'450px\' }" :header="dialogHeader" :modal="true">\n' +
        '        <form @submit.prevent="handleSubmit">\n' +
        '            <div class="flex flex-col gap-6">\n' +
        '                    <AlertMessage v-if="errorAlert" :message="errorMsg" />\n' +
        '                    <div>\n' +
        '                        <InputText id="id" v-model.trim="item.id" required="false" :invalid="submitted && !item.id"\n' +
        '                            fluid readonly="true" hidden />\n' +
        '                    </div>\n'
    FrontFormDialogV2 = FrontFormDialogV2 + ''
    for (let index = 0; index < koloms.value.length; index++) {
        const element = koloms.value[index];
        if (element.type == 'Varchar') {
            FrontFormDialogV2 = FrontFormDialogV2 + '<div>\n' +
                '                        <label for="' + element.name + '" class="block font-bold mb-3">' + await firstUpper(element.name) + '</label>\n' +
                '                        <InputText rows="5" id="' + element.name + '" v-model.trim="item.' + element.name + '" required="false" fluid />\n' +
                '                        <small v-if="submitted && !item.' + element.name + '" class="text-red-500">' + element.name + ' is required.</small>\n' +
                '                    </div>\n'
        }
        if (element.type == 'Date') {
            FrontFormDialogV2 = FrontFormDialogV2 + '<div>\n' +
                '                        <label for="' + element.name + '" class="block font-bold mb-3">' + await firstUpper(element.name) + '</label>\n' +
                '                        <DatePicker :showIcon="true" :showButtonBar="true"rows="5" id="' + element.name + '" v-model.trim="item.' + element.name +
                '" required="false" fluid ></DatePicker> \n' +
                '                        <small v-if="submitted && !item.' + element.name + '" class="text-red-500">' + element.name + ' is required.</small>\n' +
                '                    </div>\n'
        }
        if (element.type == 'Number') {
            FrontFormDialogV2 = FrontFormDialogV2 + '<div>\n' +
                '                        <label for="' + element.name + '" class="block font-bold mb-3">' + await firstUpper(element.name) + '</label>\n' +
                '                        <InputNumber :showIcon="true" :showButtonBar="true"rows="5" id="' + element.name + '" v-model.trim="item.' + element.name +
                '" required="false" fluid  showButtons mode="decimal"></InputNumber> \n' +
                '                        <small v-if="submitted && !item.' + element.name + '" class="text-red-500">' + element.name + ' is required.</small>\n' +
                '                    </div>\n\n\n'
        }
    }
    FrontFormDialogV2 = FrontFormDialogV2 +
        '                <div class="flex justify-content-end gap-2 mt-4">\n' +
        '                    <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />\n' +
        '                    <Button type="submit" label="Submit" />\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </form>\n' +
        '    </Dialog>\n' +
        '</template>\n\n' +

        '<script setup>\n\n' +
        'import Button from \'primevue/button\';\n' +
        'import Dialog from \'primevue/dialog\';\n' +
        'import InputText from \'primevue/inputtext\';\n' +
        'import { defineEmits, defineProps, ref, watch } from \'vue\';\n' +
        'import AlertMessage from \'../components/AlertMessage.vue\';\n\n' +

        '// Menerima props dari parent\n' +
        'const props = defineProps({\n' +
        '    visible: Boolean,\n' +
        '    item: Object\n' +
        '});\n\n' +

        '//  Mendefinisikan event yang akan dikirim ke parent\n' +
        'const emit = defineEmits([\'update:visible\', \'save\']); // Event untuk memberitahu parent bahwa `visible` harus diubah\n\n' +

        '// State reaktif\n' +
        'const formData = ref({}); // Data form yang diisi pengguna\n' +
        'const submitted = ref(false); // Status submit untuk validasi\n' +
        'const dialogHeader = ref(\'\'); // Judul dialog (New/Edit)\n\n' +

        '// Watcher untuk memantau perubahan props.item\n' +
        '// Saat item berubah, salin data ke formData dan perbarui judul dialog\n' +
        'watch(() => props.item, (newItem) => {\n' +
        '    if (newItem) {\n' +
        '        formData.value = { ...newItem };\n' +
        '        dialogHeader.value = newItem.id ? \'Edit ' + tablenameV2 + '\' : \'New ' + tablenameV2 + '\';\n' +
        '    }\n' +
        '}, { immediate: true });\n\n' +

        '// Watcher untuk reset state submitted saat dialog ditutup\n' +
        'watch(() => props.visible, (newVal) => {\n' +
        '    if (!newVal) {\n' +
        '        submitted.value = false;\n' +
        '    }\n' +
        '});\n\n' +

        '// Fungsi untuk menutup dialog\n' +
        '// const closeDialog = () => {\n' +
        '//     emit(\'update:visible\', false);\n' +
        '// };\n\n' +

        'const closeDialog = () => {\n' +
        '    // Panggil emit untuk memberitahu parent agar mengubah nilai visible menjadi false\n' +
        '    emit(\'update:visible\', false);\n' +
        '};\n\n' +

        '// Fungsi untuk menangani submit form\n' +
        'const handleSubmit = () => {\n' +
        '    submitted.value = true;\n' +
        '    // Lakukan validasi sederhana\n' +
        '    if (formData.value.name && formData.value.desc && formData.value.pic && formData.value.status) {\n' +
        '        // Kirim event \'save\' ke parent dengan data form\n' +
        '        emit(\'save\', formData.value);\n' +
        '        closeDialog();\n' +
        '    }\n' +
        '};\n\n' +
        '</script>\n\n\n\n' +

        '<!-- //tambahan untuk select option\n' +
        '// const yesNo = ref([{ name: \'Yes\', code: \'Y\' }, { name: \'No\', code: \'N\' }])\n' +
        '//<Select id="aktive" v-model="item.aktive" :options="yesNo" optionLabel="name"\n' +
        '//optionValue="code" placeholder="Aktive" class="w-full"></Select>\n-->'


    return FrontFormDialogV2.toString() + ''
    //================end FormDialog


}

export const Index = async (tableId, tableName) => {
    const tablename = await replaceString(tableName)
    let index = ''
    index = index +
        '\n//index.js\n\n{\n' +
        'path: \'/dev/' + tablename + '\',\n' +
        'name: \'' + await firstUpper(tablename) + '\',\n' +
        'component: () => import(\'@/views/dev/' + await firstUpper(tableName) + 'View.vue\')\n' +
        '},\n\n' +
        '//AppMenu.vue \n{ label: \'' + await firstUpper(tablename) + '\', icon: \'pi pi-fw pi-car\', to: { name: \'' + tablename + '\' } }\n\n'



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
    index = index + '//Create file' + '\ntouch ' + frontProject + viewFolder + '/dev/' + await firstUpper(tableName) + 'View.vue\n' +
        'touch ' + frontProject + '/components' + '/' + await firstUpper(tableName) + 'Table.vue\n' +
        'touch ' + frontProject + '/components' + '/' + await firstUpper(tableName) + 'FormDialog.vue\n\n'

    index = index + '//tambahan untuk select option \nconst yesNo = ref([{ name: \'Yes\', code: \'Y\' }, { name: \'No\', code: \'N\' }])\n' +
        '<Select id="aktive" v-model="item.aktive" :options="yesNo" optionLabel="name"\n' +
        'optionValue="code" placeholder="Aktive" class="w-full"></Select>\n'
    return index
}