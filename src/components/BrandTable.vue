<template>
    <DataTable :value="items" :paginator="true" :rows="rowsPerPage" :totalRecords="totalRecords" lazy
        @page="$emit('page-change', $event)"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]" :filters="filters"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">

        <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0">Manage Brand</h4>
                <IconField>
                    <InputIcon @click="$emit('search', filters.global.value)">
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters.global.value" placeholder="Search..."
                        @keyup.enter="$emit('search', filters.global.value)" />
                </IconField>
            </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="id" header="Id" sortable style="min-width: 12rem"></Column>
        <Column field="kode" header="Kode" sortable style="min-width: 4rem"></Column>
        <Column field="nama" header="Nama" sortable style="min-width: 4rem"></Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="$emit('edit', slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger"
                    @click="$emit('delete', slotProps.data)" />
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import { defineEmits, defineProps, ref } from 'vue';

// Menerima props dari parent
const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    rowsPerPage: {
        type: Number,
        required: true
    },
    totalRecords: {
        type: Number,
        required: true
    }
});

// Mendefinisikan event yang akan dikirim ke parent
const emit = defineEmits(['page-change', 'edit', 'delete', 'search']);

// State untuk filter pencarian
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>
