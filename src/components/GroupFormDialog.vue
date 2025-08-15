<template>
    <Dialog :visible="visible" :style="{ width: '450px' }" :header="dialogHeader" :modal="true">
        <form @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="formData.name" fluid />
                    <small v-if="submitted && !formData.name" class="text-red-500">name is required.</small>
                </div>
                <div>
                    <label for="desc" class="block font-bold mb-3">Desc</label>
                    <InputText id="desc" v-model.trim="formData.desc" fluid />
                    <small v-if="submitted && !formData.desc" class="text-red-500">desc is required.</small>
                </div>
                <div>
                    <label for="pic" class="block font-bold mb-3">Pic</label>
                    <InputText id="pic" v-model.trim="formData.pic" fluid />
                    <small v-if="submitted && !formData.pic" class="text-red-500">pic is required.</small>
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <InputText id="status" v-model.trim="formData.status" fluid />
                    <small v-if="submitted && !formData.status" class="text-red-500">status is required.</small>
                </div>
                <div class="flex justify-content-end gap-2 mt-4">
                    <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />
                    <Button type="submit" label="Submit" />
                </div>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { defineEmits, defineProps, ref, watch } from 'vue';

// // Menerima props dari parent
const props = defineProps({
    visible: Boolean,
    item: Object
});

// // Mendefinisikan event yang akan dikirim ke parent
const emit = defineEmits(['update:visible', 'save']); // Event untuk memberitahu parent bahwa `visible` harus diubah

// State reaktif
const formData = ref({}); // Data form yang diisi pengguna
const submitted = ref(false); // Status submit untuk validasi
const dialogHeader = ref(''); // Judul dialog (New/Edit)

// Watcher untuk memantau perubahan props.item
// Saat item berubah, salin data ke formData dan perbarui judul dialog
watch(() => props.item, (newItem) => {
    if (newItem) {
        formData.value = { ...newItem };
        dialogHeader.value = newItem.id ? 'Edit Group' : 'New Group';
    }
}, { immediate: true });

// Watcher untuk reset state submitted saat dialog ditutup
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        submitted.value = false;
    }
});

// Fungsi untuk menutup dialog
// const closeDialog = () => {
//     emit('update:visible', false);
// };

const closeDialog = () => {
    // Panggil emit untuk memberitahu parent agar mengubah nilai visible menjadi false
    emit('update:visible', false);
};



// Fungsi untuk menangani submit form
const handleSubmit = () => {
    submitted.value = true;
    // Lakukan validasi sederhana
    if (formData.value.name && formData.value.desc && formData.value.pic && formData.value.status) {
        // Kirim event 'save' ke parent dengan data form
        emit('save', formData.value);
        closeDialog();
    }
};
</script>