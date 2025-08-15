<template>
    <div>
        <Toast />
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                </template>
                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
                </template>
            </Toolbar>

            <GroupTable :items="results" :rowsPerPage="rowPerPage" :totalRecords="jmlRows"
                @page-change="handlePageChange" @edit="editItem" @delete="confirmDeleteItem" @search="searchData" />

            <GroupFormDialog v-model:visible="formDialog" :item="item" @save="handleSave" />

            <DeleteConfirmationDialog v-model:visible="deleteDialog" :itemToDelete="itemToDelete"
                @confirm="deleteItem" />
        </div>
    </div>
</template>

<script setup>
// Import library dan komponen yang dibutuhkan
import custumFetch from '@/api';
import { useAuthStore } from '@/stores/authStores';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// Komponen-komponen child

// PrimeVue components
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';

// Inisialisasi store dan hooks
const autStores = useAuthStore();
const { getToken } = autStores;
const toast = useToast();

// State reaktif
const formDialog = ref(false); // Mengontrol visibilitas dialog form
const deleteDialog = ref(false); // Mengontrol visibilitas dialog hapus
const results = ref([]); // Data yang ditampilkan di tabel
const item = ref({}); // Data item yang sedang di-edit atau akan dibuat
const itemToDelete = ref(null); // Data item yang akan dihapus
const pageNo = ref(1); // Halaman saat ini untuk pagination
const jmlRows = ref(0); // Total baris data dari API
const rowPerPage = ref(10); // Jumlah baris per halaman
const globalFilter = ref(null); // Nilai filter pencarian global

// Fungsi untuk mengambil data dari API
const searchData = async (filterValue) => {
    // Jika ada nilai filter baru, perbarui state
    if (filterValue !== undefined) {
        globalFilter.value = filterValue;
    }
    // Buat parameter URL untuk pencarian
    let urlParam = globalFilter.value ? `&name=${globalFilter.value}` : "";
    try {
        const { data } = await custumFetch.get(`/groups/?page=${pageNo.value}&size=${rowPerPage.value}${urlParam}`, {
            withCredentials: true,
            headers: { "X-API-TOKEN": await getToken() },
        });
        results.value = data.data;
        jmlRows.value = data.paging.total_rows;
    } catch (error) {
        console.error(error);
    }
};

// Fungsi yang dipanggil saat halaman diubah
const handlePageChange = (event) => {
    pageNo.value = event.page + 1;
    rowPerPage.value = event.rows;
    searchData();
};

// Fungsi untuk membuka dialog form baru
const openNew = () => {
    item.value = {}; // Kosongkan data item
    formDialog.value = true;
};

const exportCSV = () => {

}
// Fungsi untuk membuka dialog form edit
const editItem = (dataRow) => {
    item.value = { ...dataRow }; // Isi data item dengan data yang dipilih
    formDialog.value = true;
};

// Fungsi untuk membuka dialog konfirmasi hapus
const confirmDeleteItem = (value) => {
    itemToDelete.value = value; // Simpan data item yang akan dihapus
    deleteDialog.value = true;
};

// Fungsi untuk menghapus item
const deleteItem = async () => {
    try {
        await custumFetch.delete(`/groups/${itemToDelete.value.id}`, {
            withCredentials: true,
            headers: { "X-API-TOKEN": await getToken() },
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Group Deleted', life: 3000 });
        searchData();
    } catch (error) {
        console.error(error);
    } finally {
        deleteDialog.value = false;
        itemToDelete.value = null;
    }
};

// Fungsi yang dipanggil saat form disubmit (dari GroupFormDialog)
const handleSave = async (itemData) => {
    try {
        if (itemData.id) { // Jika ada ID, lakukan UPDATE
            await custumFetch.put(`/groups/${itemData.id}`, itemData, {
                withCredentials: true,
                headers: { "X-API-TOKEN": await getToken() },
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Group Updated', life: 3000 });
        } else { // Jika tidak ada ID, lakukan CREATE
            await custumFetch.post("/groups", itemData, {
                withCredentials: true,
                headers: { "X-API-TOKEN": await getToken() },
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Group Created', life: 3000 });
        }
        searchData();
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save group', life: 3000 });
    } finally {
        formDialog.value = false;
        item.value = {};
    }
};

// Hook saat komponen dimount
onMounted(() => {
    searchData();
});
</script>