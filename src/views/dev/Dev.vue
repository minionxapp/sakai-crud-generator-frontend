<script setup>
import custumFetch from '@/api';
import { onMounted, ref } from 'vue';
//untuk tab
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';

const dropdownProjectItems = ref([]);
const dropdownProjectItem = ref(null);
const dropdownTableItems = ref([]);
const dropdownTableItem = ref(null);
const result = ref([])
async function onChange() {
    dropdownTableItems.value = null
    await getTablesByProject((this.dropdownProjectItem).id)

}


async function onTableChange() {
}

async function getTablesByProject(value) {
    try {
        const { data } = await custumFetch.get("/dev_tablexs/projectid/" + value,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": 'test'
                },
            }
        )
        dropdownTableItems.value = data.data
        console.log(dropdownTableItems)
    } catch (error) {
        console.log(error)
    }
}
const submit = async () => {
    const tableId = ((dropdownTableItem.value).id)
    // "/api/dev/schema/:tableId"
    try {
        const { data } = await custumFetch.get("/dev/schema/" + tableId,
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": 'test'
                },
            }
        )
        result.value = data.data
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}
const allProjects = async () => {
    try {
        // const { data } = await custumFetch.get("/dev_tablexs/" + value,
        const { data } = await custumFetch.get("/dev_projects/",
            {
                withCredentials: true,
                headers: {
                    "X-API-TOKEN": 'test'
                },
            }
        )
        dropdownProjectItems.value = data.data
        console.log(dropdownProjectItems)
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
                        <!-- <InputText id="firstname1" type="text" placeholder="Firstname" /> -->
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
                    <!-- <div class="field">
                        <label for="lastname1" class="sr-only">Lastname</label>
                        <InputText id="lastname1" type="text" placeholder="Lastname" />
                    </div> -->
                    <Button label="Submit" :fluid="false" @click="submit()"></Button>
                </div>

                <TabView>
                    <TabPanel header="Schema">
                        <pre>
                            <code>
                                {{ result.schema }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Model">
                        <pre>
                            <code>
                                {{ result.model }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Validation">
                        <pre>
                            <code>
                                {{ result.validate }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Service">
                        <pre>
                            <code>
                                {{ result.service }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Controller">
                        <pre>
                            <code>
                                {{ result.controller }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Route">
                        <pre>
                            <code>
                                {{ result.route }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Test">
                        <pre>
                            <code>
                                {{ result.test }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="Util Test">
                        <pre>
                            <code>
                                {{ result.utiltest }}
                            </code>
                        </pre>
                    </TabPanel>
                    <TabPanel header="File">
                        <pre>
                            <code>
                                {{ result.file }}
                            </code>
                        </pre>
                    </TabPanel>
                </TabView>

            </div>
            <!-- <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Project Name</div>
                <div class="flex flex-wrap items-start gap-4">
                    <div>
                        <pre>
                            <code>
                                {{ result.schema }}
                            </code>
                        </pre>

                        <pre>
                            <code>
                                {{ result.model }}
                            </code>
                        </pre>
                        <pre>
                            <code>
                                {{ result.validate }}
                            </code>
                        </pre>
                        <pre>
                            <code>
                                {{ result.service }}
                            </code>
                        </pre>
                        <pre>
                            <code>
                                {{ result.controller }}
                            </code>
                        </pre>
                        <pre>
                            <code>
                                {{ result.route }}
                            </code>
                        </pre>
                        <pre>
                            <code>
                                {{ result.test }}
                            </code>
                        </pre>
                        <pre>
                            <code>
                                {{ result.utiltest }}
                            </code>
                        </pre>
                    </div>

                </div>
            </div> -->


        </div>
    </Fluid>
</template>