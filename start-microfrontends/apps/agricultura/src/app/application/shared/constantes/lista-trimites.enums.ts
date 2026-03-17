import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 220102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',
        },]
    },
    {
        tramite: 220501,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220501/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 220401,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220401/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
    {
        tramite: 220203,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220203/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',
        },]
    },
    {
        tramite: 220202,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220202/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        },]
    },
       {
        tramite: 220201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220201/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',
        },]
    },  
    {
    tramite: 220701,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () =>import('../../tramites/220701/pages/paso-uno/paso-uno.component').then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
     {
    tramite: 221601,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/221601/pages/datos/datos.component').then(m => m.DatosComponent) ,
            componentName: 'DatosComponent',

        }]
  },
    {
        tramite: 220502,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220502/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },

    		{
		    tramite: 221603,
		    listaComponentes: [
		      {
		        id: 'solicitud',
		        componentPath: () =>
		          import('../../tramites/221603/pages/datos/datos.component').then(
		            (m) => m.DatosComponent
		          ),
		        componentName: 'DatosComponent',
		      },
		    ],
		  },

    {
        tramite: 220702,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220702/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
    {
        tramite: 220404,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220404/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 220403,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220403/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
     {
        tramite: 220503,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220503/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 220102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 220103,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220103/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    }, {
           tramite: 221602,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/221602/pages/datos/datos.component').then(m => m.DatosComponent) ,
            componentName: 'DatosComponent',

        }] 
    },
    {
        tramite: 220402,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220402/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    },
    {
        tramite: 220703,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/220703/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',
        }]
    }
];
