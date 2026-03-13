import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 290101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/290101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 290201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/290201/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 290301,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/290301/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
];