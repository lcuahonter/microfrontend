import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
  {
    tramite: 260101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260101/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },

  {
    tramite: 260211,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260211/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },

  {
    tramite: 260604,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260604/pages/contenedor-de-paso/contenedor-de-pasos.component').then(
            (m) => m.ContenedorDePasosComponent
          ),
        componentName: 'ContenedorDePasosComponent',
      },
    ],
  },
  {
    tramite: 260512,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260512/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260514,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260514/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260701,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260701/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260603,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260603/pages/datos-page/datos-page.component'
          ).then((m) => m.DatosPageComponent),
        componentName: 'DatosPageComponent',
      },
    ],
  },
  {
    tramite: 260215,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260215/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260210,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260210/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260303,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260303/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260911,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260911/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260101/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },

  {
    tramite: 260211,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260211/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },

  {
    tramite: 260512,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260512/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260514,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260514/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260701,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260701/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260212,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260212/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260215,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260215/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260210,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260210/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260303,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260303/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260911,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260911/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260912,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260912/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260502,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260502/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260501,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260501/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 261701,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/261701/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260402,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260402/pages/datos-260402/datos-260402.component'
          ).then((m) => m.Datos260402Component),
        componentName: 'Datos260402Component',
      },
    ],
  },
  {
    tramite: 260503,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260503/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260504,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260504/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260204,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260204/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260201,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260201/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260202,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260202/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260605,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/260605/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260501,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260501/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 261701,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/261701/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260402,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260402/pages/datos-260402/datos-260402.component'
          ).then((m) => m.Datos260402Component),
        componentName: 'Datos260402Component',
      },
    ],
  },
    {
        tramite: 260703,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/260703/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'Datos260402Component',
        }]
    },
  {
    tramite: 260904,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260904/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 261702,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/261702/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260402,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260402/pages/datos-260402/datos-260402.component'
          ).then((m) => m.Datos260402Component),
        componentName: 'Datos260402Component',
      },
    ],
  },
  {
    tramite: 260401,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260401/pages/datos-territorio.component/datos-territorio.component'
          ).then((m) => m.DatosTerritorioComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260505,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260505/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260508,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260508/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260509,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260509/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260510,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260510/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
        tramite: 260704,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/260704/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'DatosComponent',

        }]
    },
   {
        tramite: 260905,
        listaComponentes: [{
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260905/pages/datos-260905/datos-260905.component'
          ).then((m) => m.Datos260905Component),
        componentName: 'Datos260905Component',
      },
    ],
  },
  {
    tramite: 260511,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260511/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260513,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260513/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260104,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260104/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260203,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260203/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260205,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260205/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260515,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260515/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260516,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260516/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260901,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260901/pages/paso-uno-pages/paso-uno-pages.component'
          ).then((m) => m.PasoUnoPagesComponent),
        componentName: 'PasoUnoPagesComponent',
      },
    ],
  },
  {
    tramite: 260907,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260907/pages/paso-uno-pages/paso-uno-pages.component'
          ).then((m) => m.PasoUnoPagesComponent),
        componentName: 'PasoUnoPagesComponent',
      },
    ],
  },
  {
    tramite: 260908,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260908/pages/paso-uno-pages/paso-uno-pages.component'
          ).then((m) => m.PasoUnoPagesComponent),
        componentName: 'PasoUnoPagesComponent',
      },
    ],
  },
  {
    tramite: 260213,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260213/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260214,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260214/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260216,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260216/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260206,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260206/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
   {
        tramite: 260909,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/260909/pages/paso-uno-pages/paso-uno-pages.component').then(m => m.PasoUnoPagesComponent),
            componentName: 'PasoUnoPagesComponent',
             }]
  },
  {
    tramite: 260913,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260913/pages/datos/datos.component').then(m => m.DatosComponent),
        componentName: 'DatosComponent',
    }]
  },
  {
        tramite: 260914,
        listaComponentes: [{
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260914/pages/datos-260914/datos-260914.component'
          ).then((m) => m.Datos260914Component),
        componentName: 'Datos260914Component',
      },
    ],
  },
  {
    tramite: 260217,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260217/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
   {
        tramite: 260902,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/260902/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
      {
        tramite: 260903,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/260903/pages/datos-260903/datos-260903.component').then(m => m.Datos260903Component),
            componentName: 'Datos260903Component',

        }]
    },
  {
    tramite: 260218,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260218/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260915,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260915/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260918,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260918/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260304,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260304/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260601,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260601/pages/datos/datos.component'
          ).then((m) => m.DatosComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 261601,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/261601/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260302,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260302/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
   {
    tramite: 260102,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260102/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
{
    tramite: 260208,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260208/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },{
    tramite: 260207,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260207/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260209,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260209/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260301,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260301/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260103,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260103/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260219,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260219/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260919,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260919/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
      tramite: 260916,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260916/pages/datos-260916/datos-260916.component'
          ).then((m) => m.Datos260916Component),
        componentName: 'PasoUnoPagesComponent',
      },
    ],
  },
  {
    tramite: 260906,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260906/pages/datos/datos.component').then(m => m.DatosComponent),
      componentName: 'DatosComponent',
    }]
  },
  {
    tramite: 261101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/261101/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 260703,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260703/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 261103,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/261103/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 261401,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/261401/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 261402,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/261402/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
   {
    tramite: 260917,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260917/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260507,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/260507/pages/datos/datos.component'
          ).then((m) => m.DatosComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 260702,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/260702/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 260910,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/260910/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
     tramite: 261402,
     listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/261402/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
        }]
  },
   {
    tramite: 261401,
      listaComponentes: [{
        id: 'solicitud',
        componentPath: () =>import('../../tramites/261401/pages/paso-uno/paso-uno.component').then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      }]
  }
];
