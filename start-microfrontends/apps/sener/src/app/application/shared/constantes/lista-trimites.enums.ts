import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 130108,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/130108/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
     {
        tramite: 130121,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/130121/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
     {
        tramite: 130201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/130201/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 300105,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/300105/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
     {
        tramite: 130204,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/130204/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 130302,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/130302/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 140216,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/140216/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 140111,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/140111/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

    }]
    },
    {
        tramite: 140112,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/140112/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 140218,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/140218/pages/paso-uno-pages/paso-uno-pages.component').then(m => m.PasoUnoPagesComponent),
            componentName: 'PasoUnoPagesComponent',

        }]
    },
];