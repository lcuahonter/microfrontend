import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 301,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/301/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 40401,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40401/pages/paso-uno/paso-uno.component')
                .then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 40403,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40403/pages/paso-uno/paso-uno.component')
                .then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 40103,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40103/pages/paso-uno/paso-uno.component')
                .then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 10301,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/10301/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 40102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 11201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/11201/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 103,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/103/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },     
    {
        tramite: 10302,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/10302/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 30901,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/30901/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 104,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/104/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
         tramite: 302,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/302/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]   
    },
     {
        tramite: 105,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/105/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 10303,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/10303/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
     {
        tramite: 319,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/319/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 31907,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31907/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 31908,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31908/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 31910,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31910/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 40302,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40302/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 40301,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40301/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 40101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 420101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/420101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 6502,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/6502/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 11202,
        listaComponentes: [
            {
                id: 'solicitud',
                componentPath: () => import('../../tramites/11202/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
                componentName: 'PasoUnoComponent',
            }
        ]
    },
    {
        tramite: 10703,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/10703/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 6101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/6101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 6102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/6102/components/solicitud/Solicitud.component').then(m => m.SolicitudComponent),
            componentName: 'SolicitudComponent',

        }]
    },
    {
        tramite: 31201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31201/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',
        }]
    },
    {
        tramite: 40402,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40402/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 6402,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/6402/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 31202,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31202/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 202,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/202/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 31203,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31203/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',
        }]
    },
    {
        tramite: 5601,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/5601/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 11102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/11102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 40202,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40202/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 420102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/420102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 324,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/324/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 630103,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/630103/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 40201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/40201/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',
 
        }]
    },
    {
        tramite: 31910,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/31910/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 420103,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/420103/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
   {
        tramite: 630104,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/630104/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 630303,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/630303/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 630307,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/630307/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 6403,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/6403/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 11105,
        listaComponentes: [
            {
                id: 'solicitud',
                componentPath: () => import('../../tramites/11105/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
                componentName: 'PasoUnoComponent',
            }
        ]
    },
    {
        tramite: 570102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/570102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 11101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/11101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
     {
        tramite: 30401,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/30401/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 701,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/701/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
 
        }]
    },
    {
        tramite: 11204,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/11204/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 5701,
        listaComponentes: [
        {
            id: 'solicitud',
            componentPath: () =>
                import(
                    '../../../application/tramites/5701/pages/paso-uno/paso-uno.component'
                ).then((m) => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        },
        ],
    },
    {
        tramite: 570101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/570101/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
];
