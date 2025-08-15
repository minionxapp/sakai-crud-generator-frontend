import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/authStores';
import { createRouter, createWebHistory } from 'vue-router';
// import GroupsView from '../views/GroupsView.vue';
import GroupsView from '../views/dev/GroupView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dasboard',
            component: AppLayout,
            meta: {
                requiredAuth: true
            },
            children: [
                {
                    path: '/dev',
                    name: 'dev',
                    component: () => import('@/views/dev/Dev.vue')
                },
                {
                    path: '/dev/project',
                    name: 'project',
                    component: () => import('@/views/dev/Project.vue')
                },
                {
                    path: '/dev/table',
                    name: 'table',
                    component: () => import('@/views/dev/Table.vue')
                },
                {
                    path: '/dev/tablekolom',
                    name: 'tablekolom',
                    component: () => import('@/views/dev/Tabelkolom.vue')
                },
                {
                    path: '/dev/front',
                    name: 'front',
                    component: () => import('@/views/dev/Front.vue')
                },
                {
                    path: '/dev/coba',
                    name: 'coba',
                    component: () => import('@/views/dev/Coba.vue')
                },
                {
                    path: '/dev/testaja',
                    name: 'testaja',
                    component: () => import('@/views/dev/test_aja.vue')
                },
                {
                    path: '/dev/devdirektoris',
                    name: 'dev_direktori',
                    component: () => import('@/views/dev/dev_direktori.vue')
                },
                {
                    path: '/dev/group',
                    name: 'group',
                    component: () => import('@/views/dev/group.vue')
                },

                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'tablekit',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/dev/pmakai',
                    name: 'pmakai',
                    component: () => import('@/views/dev/pmakai.vue')
                },
                {
                    path: '/dev/Jobfamily',
                    name: 'Jobfamily',
                    component: () => import('@/views/dev/Job_family.vue')
                },
                {
                    path: '/dev/Subjobfamily',
                    name: 'Subjobfamily',
                    component: () => import('@/views/dev/Sub_job_family.vue')
                },
                {
                    path: '/dev/Kompetensi',
                    name: 'Kompetensi',
                    component: () => import('@/views/dev/Kompetensi.vue')
                },
                {
                    path: '/dev/akademi',
                    name: 'akademi',
                    component: () => import('@/views/dev/akademi.vue')
                },
                {
                    path: '/dev/user',
                    name: 'user',
                    component: () => import('@/views/dev/user.vue')
                },
                {
                    path: '/dev/Userakademi',
                    name: 'Userakademi',
                    component: () => import('@/views/dev/User_akademi.vue')
                },
                {
                    path: '/dev/Statustraining',
                    name: 'Statustraining',
                    component: () => import('@/views/dev/Status_training.vue')
                },
                {
                    path: '/dev/seq',
                    name: 'seq',
                    component: () => import('@/views/dev/seq.vue')
                },

                {
                    path: '/dev/Training',
                    name: 'Training',
                    component: () => import('@/views/dev/Training.vue')
                },
                {
                    path: '/dev/tipetraining',
                    name: 'tipetraining',
                    component: () => import('@/views/dev/Tipe_training.vue')
                },
                {
                    path: '/dev/Subkompetensi',
                    name: 'Subkompetensi',
                    component: () => import('@/views/dev/Sub_kompetensi.vue')
                },
                {
                    path: '/dev/Kompetensilevel',
                    name: 'Kompetensilevel',
                    component: () => import('@/views/dev/Kompetensi_level.vue')
                },
                {
                    path: '/dev/Checklist',
                    name: 'Checklist',
                    component: () => import('@/views/dev/Checklist.vue')
                },
                {
                    path: '/dev/Trainingchecklist',
                    name: 'Trainingchecklist',
                    component: () => import('@/views/dev/Training_checklist.vue')
                },
                {
                    // Rute untuk halaman manajemen grup
                    path: '/groups',
                    name: 'groups',
                    component: GroupsView // Menghubungkan URL '/groups' dengan komponen GroupsView
                },
                {
                    path: '/dev/frontnew',
                    name: 'frontnew',
                    component: () => import('@/views/dev/v2/FrontNew.vue')
                },
                {
                    path: '/dev/brand',
                    name: 'brand',
                    component: () => import('@/views/dev/BrandView.vue')
                },
                // Development
                // {
                //     path: '/dev/user',
                //     name: 'user',
                //     component: () => import('@/views/dev/user.vue')
                // },

                {
                    path: '/dev/Kosong',
                    name: 'Kosong',
                    component: () => import('@/views/pages/Kosong.vue')
                },

            ]

        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@/views/pages/auth/Logout.vue')
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to, from) => {
    const authStore = await useAuthStore()
    if (to.meta.requiredAuth && !authStore.currentUser) {
        // alert("Anda harus login dulu untuk mengakses halaman ini .........!")
        return {
            path: '/auth/access'
        }
    }
})

export default router;
