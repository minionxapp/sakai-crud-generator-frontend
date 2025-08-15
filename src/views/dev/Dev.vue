<script setup>
import custumFetch from '@/api';
import { onMounted, ref } from 'vue';
//untuk tab
import { useAuthStore } from '@/stores/authStores';
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

//membuat script tanpa membuat file
const submit = async () => {
    const tableId = ((dropdownTableItem.value).id)
    try {
        const { data } = await custumFetch.get("/dev/schema/" + tableId + "?createFile=false",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        result.value = data.data
    } catch (error) {
        console.log(error)
    }
}

//membuat file 
const submit2 = async () => {
    const tableId = ((dropdownTableItem.value).id)
    try {
        const { data } = await custumFetch.get("/dev/schema/" + tableId + "?createFile=true",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": await getToken()
                },
            }
        )
        result.value = data.data
        alert("Create Success.......")
    } catch (error) {
        console.log(error)
    }
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
                <div class="font-semibold text-xl">Project Name</div>
                <div class="flex flex-wrap items-start gap-4">
                    <div class="field">
                        <label for="project" class="sr-only">Project</label>
                        <Select id="state" v-model="dropdownProjectItem" :options="dropdownProjectItems"
                            optionLabel="name" placeholder="Select Project" class="w-full"
                            @change="onChange()"></Select>
                    </div>
                    <div class="field">
                        <label for="table" class="sr-only">Table</label>
                        <Select id="state" v-model="dropdownTableItem" :options="dropdownTableItems" optionLabel="name"
                            placeholder="Select Table" class="w-full" @change="onTableChange()"></Select>
                    </div>
                    <Button label="File Script" :fluid="false" @click="submit()"></Button>
                    <Button label="Create File" :fluid="false" @click="submit2()"></Button>
                </div>
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Schema</Tab>
                        <Tab value="1">Model</Tab>
                        <Tab value="2">Validation</Tab>
                        <Tab value="3">Service</Tab>
                        <Tab value="4">Controller</Tab>
                        <Tab value="5">Route</Tab>
                        <Tab value="6">Util Test</Tab>
                        <Tab value="7">Test</Tab>
                        <Tab value="8">File</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <pre>
                                <code> {{ result.schema }} </code>
                            </pre>
                        </TabPanel>
                        <TabPanel value="1">
                            <pre>
                            <code>
                                {{ result.model }}
                            </code>
                        </pre>
                        </TabPanel>
                        <TabPanel value="2">
                            <pre>
                            <code>
                                {{ result.validate }}
                            </code>
                        </pre>
                        </TabPanel>
                        <TabPanel value="3">
                            <pre>
                            <code>
                                {{ result.service }}
                            </code>
                        </pre>
                        </TabPanel>

                        <TabPanel value="4">
                            <pre>
                            <code>
                                {{ result.controller }}
                            </code>
                        </pre>
                        </TabPanel>
                        <TabPanel value="5">
                            <pre>
                            <code>
                                {{ result.route }}
                            </code>
                        </pre>
                        </TabPanel>
                        <TabPanel value="6">
                            <pre>
                            <code>
                                {{ result.utiltest }}
                            </code>
                        </pre>
                        </TabPanel>
                        <TabPanel value="7">
                            <pre>
                            <code>
                                {{ result.test }}
                            </code>
                        </pre>
                        </TabPanel>
                        <TabPanel value="8">
                            <pre>
                            <code>
                                {{ result.file }}
                            </code>
                        </pre>
                        </TabPanel>


                    </TabPanels>
                </Tabs>
            </div>

        </div>
    </Fluid>
</template>