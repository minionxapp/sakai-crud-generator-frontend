<script setup>
import custumFetch from '@/api';
import { onMounted, ref } from 'vue';
//untuk tab
import { useAuthStore } from '@/stores/authStores';
import { Frontend, Index } from '@/stores/frontendStores';
const dropdownProjectItems = ref([]);
const dropdownProjectItem = ref(null);
const dropdownTableItems = ref([]);
const dropdownTableItem = ref(null);
const result = ref([])
async function onChange() {
    dropdownTableItems.value = null
    await getTablesByProject((this.dropdownProjectItem).id)

}
const autStores = useAuthStore();
const { currentUser, currentToken, getToken } = autStores

async function onTableChange() {
}

async function getTablesByProject(value) {
    try {
        const { data } = await custumFetch.get("/dev_tablexs/projectid/" + value,
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
const submit = async () => {
    const tableId = ((dropdownTableItem.value).id)
    const tableName = ((dropdownTableItem.value).name)

    result.value.front = await Frontend(tableId, tableName)
    result.value.index = await Index(tableId, tableName)
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
onMounted(async () => {
    await allProjects()
})
</script>



<template>
    <Fluid>
        <div class="">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Frontend</div>
                <div class="flex flex-wrap items-start gap-4">
                    <div class="field">
                        <label for="project" class="sr-only">Project</label>
                        <Select id="state" v-model="dropdownProjectItem" :options="dropdownProjectItems"
                            optionLabel="name" placeholder="Select Project" class="w-full"
                            @change="onChange()"></Select>
                    </div>
                    <div class="field">
                        <label for="table" class="sr-only">Table</label>
                        <!-- <InputText id="firstname1" type="text" placeholder="Firstname" /> -->
                        <Select id="state" v-model="dropdownTableItem" :options="dropdownTableItems" optionLabel="name"
                            placeholder="Select Table" class="w-full" @change="onTableChange()"></Select>
                    </div>
                    <Button label="Submit" :fluid="false" @click="submit()"></Button>
                </div>
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Frontend</Tab>
                        <Tab value="1">Index</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <pre>
                                <code> {{ result.front }} </code>
                            </pre>
                        </TabPanel>
                        <TabPanel value="1">
                            <pre>
                                <code> {{ result.index }} </code>
                            </pre>
                        </TabPanel>

                    </TabPanels>
                </Tabs>
            </div>

        </div>
    </Fluid>
</template>