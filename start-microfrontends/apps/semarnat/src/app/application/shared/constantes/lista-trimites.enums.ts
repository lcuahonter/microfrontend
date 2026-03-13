import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 230101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 230902,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230902/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 230401,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230401/pages/paso-uno-cs/paso-uno-cs.component').then(m => m.PasoUnoCsComponent),
            componentName: 'PasoUnoCsComponent',

        }]
    },
    {
        tramite: 230501,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230501/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 230202,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230202/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 230301,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230301/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 230201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230201/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 231001,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/231001/pages/solicitante-datos-tabs/solicitante-datos-tabs.component').then(m => m.SolicitanteDatosTabsComponent),
            componentName: 'SolicitanteDatosTabsComponent',
        }]
    },
    {
        tramite: 231002,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/231002/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 231003,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/231003/pages/paso-uno/paso-uno-t231003.component').then(m => m.PasoUnoT231003Component),
            componentName: 'PasoUnoT231003Component',
        }]
    },
    {
        tramite: 230901,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/230901/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
];