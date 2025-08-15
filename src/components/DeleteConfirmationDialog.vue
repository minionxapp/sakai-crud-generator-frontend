<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" :style="{ width: '450px' }"
        header="Confirm" :modal="true">
        <!-- <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" -->
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="itemToDelete">Are you sure you want to delete <b>{{ itemToDelete.name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog" />
            <Button label="Yes" icon="pi pi-check" @click="confirmDelete" />
        </template>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { defineEmits, defineProps } from 'vue';

// Menerima props dari parent
const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    }, // Kontrol visibilitas dialog
    itemToDelete: Object // Data item yang akan dihapus
});
// const props = defineProps({
//   visible: {
//     type: Boolean,
//     required: true
//   }
// });

// Mendefinisikan event yang akan dikirim ke parent
const emit = defineEmits(['update:visible', 'confirm']);

// Fungsi untuk menutup dialog
const closeDialog = () => {
    emit('update:visible', false);
};

// Fungsi untuk mengirim event konfirmasi hapus ke parent
const confirmDelete = () => {
    emit('confirm');
    closeDialog();
};
</script>