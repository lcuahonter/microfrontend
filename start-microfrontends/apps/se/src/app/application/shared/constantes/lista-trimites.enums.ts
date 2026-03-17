import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
  {
    tramite: 80101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/80101/pages/paso-uno-cs/paso-uno-cs.component'
          ).then((m) => m.PasoUnoCsComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 120501,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/120501/pages/paso-solicitante/paso-solicitante.component'
          ).then((m) => m.PasoSolicitanteComponent),
        componentName: 'PasoSolicitanteComponent',
      },
    ],
  },
  {
    tramite: 140201,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/140201/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 80205,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80205/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 130110,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130110/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 130111,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130111/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 120602,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/120602/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },

  {
    tramite: 90201,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/90201/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 120101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/120101/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 80102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80102/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 120301,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/120301/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 80308,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80308/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/130102/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 110101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/110101/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 110102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110102/pages/datos-mercancia/datos-mercancia.component'
          ).then((m) => m.DatosMercanciaComponent),
        componentName: 'DatosMercanciaComponent',
      },
    ],
  },
  {
    tramite: 120402,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/120402/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 130119,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130119/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 80210,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80210/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/130102/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 130118,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130118/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 80207,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80207/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 140103,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/140103/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 120402,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/120402/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 90305,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/90305/pages/datos-90305/datos-90305.component'
          ).then((m) => m.Datos90305Component),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 120601,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/120601/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 120404,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/120404/pages/solicitante-asigncionTab/solicitante-entidad.component'
          ).then((m) => m.SolicitanteAsigncionComponent),
        componentName: 'SolicitanteAsigncionComponent',
      },
    ],
  },
  {
    tramite: 80208,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80208/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 120204,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/120204/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },

  {
    tramite: 90101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/90101/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130103,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130103/pages/pantallas/pantallas.component'
          ).then((m) => m.PantallasComponent),
        componentName: 'PantallasComponent',
      },
    ],
  },
  {
    tramite: 80202,
    listaComponentes: [{
        id: 'solicitud',
        componentPath: () => import('../../tramites/80202/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 80203,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80203/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 80211,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80211/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
   {
    tramite: 140104,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/140104/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 140105,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/140105/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110212,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110212/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130106,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/130106/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 110208,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110208/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 80306,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80306/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130217,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130217/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 140102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/140102/pages/pantallas/pantallas.component'
          ).then((m) => m.PantallasComponent),
        componentName: 'PantallasComponent',
      },
    ],
  },
  {
    tramite: 150102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/150102/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 150103,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/150103/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 80302,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80302/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110207,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110207/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110211,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/110211/page/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 90302,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/90302/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130301,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130301/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110201,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110201/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110223,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110223/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110221,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/110221/page/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      }]
  }, 
  {
    tramite: 110214,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110214/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130114,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130114/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130109,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130109/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130202,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/130202/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 110219,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110219/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 140101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/140101/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 80303,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/80303/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 120401,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/120401/pages/datos/datos.component').then(m => m.DatosComponent),
      componentName: 'DatosComponent',
    }]
  },
  {
    tramite: 110203,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/110203/pages/datos/datos.component').then(m => m.DatosComponent),
      componentName: 'DatosComponent',
    }]
  },
  {
    tramite: 130112,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130112/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',

    }]
  },
  {
    tramite: 80206,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/80206/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',

    }]
  },
  {
    tramite: 130115,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130115/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',

    }]
  },
  {
    tramite: 140101,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/140101/pages/datos/datos.component').then(m => m.DatosComponent),
      componentName: 'DatosComponent',
    }]
  },
  {
    tramite: 90303,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/90303/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]

  },
  {
    tramite: 130113,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130113/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',

    }]
  },
  {
    tramite: 110216,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/110216/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',

    }]
  },
  {
    tramite: 130203,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130203/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 130107,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130107/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 150101,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/150101/pages/datos/datos.component'
          ).then((m) => m.DatosComponent),
        componentName: 'DatosComponent',
      },
    ]
  },
  {
    tramite: 120201,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/120201/pages/datos/datos.component').then(m => m.DatosComponent),
      componentName: 'DatosComponent',
    }]
  },
  {
    tramite: 110217,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/110217/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ]
  },
  {
    tramite: 90102,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/90102/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 90202,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/90202/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      }]
  },
  {
    tramite: 120603,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/120603/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      }]
  },
  {
    tramite: 110222,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/110222/page/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      }]
  },
  {
    tramite: 110202,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/110202/pages/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      }]
  },
  {
        tramite: 120702,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/120702/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
  },
  {
    tramite: 120202,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/120202/pages/datos/datos.component'
          ).then((m) => m.DatosComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 110205,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/110205/page/paso-uno/paso-uno.component').then(
            (m) => m.PasoUnoComponent
          ),
        componentName: 'PasoUnoComponent',
      }]
  },
  {
   tramite: 130104,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130104/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
 },
{
   tramite: 130105,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130105/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
 },
    {
    tramite: 80103,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/80103/pages/paso-uno-cs/paso-uno-cs.component'
          ).then((m) => m.PasoUnoCsComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
   {
    tramite: 80104,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/80104/pages/paso-uno-cs/paso-uno-cs.component'
          ).then((m) => m.PasoUnoCsComponent),
        componentName: 'DatosComponent',
      },
    ],
  },
  {
    tramite: 110209,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/110209/pages/capturar-solicitud/capturar-solicitud.component').then(m => m.CapturarSolicitudComponent),
      componentName: 'CapturarSolicitudComponent',
    }]
  },
  {
    tramite: 110210,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/110210/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 110218,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/110218/pages/app-solicitante-tabs/app-solicitante-tabs.component').then(m => m.AppSolicitanteTabsComponent),
      componentName: 'AppSolicitanteTabsComponent',
    }]
  },
  {
        tramite: 80316,
      listaComponentes: [{
          id: 'solicitud',
          componentPath: () => import('../../tramites/80316/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
          componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 130401,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130401/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 120403,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/120403/pages/solicitante-asigncionTab/solicitante-entidad.component').then(m => m.SolicitanteAsigncionComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
{
    tramite: 90304,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import('../../tramites/90304/pages/datos/datos.component').then(
            (m) => m.DatosComponent
          ),
        componentName: 'datosComponent',
      }]
  },
  {
    tramite: 140205,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/140205/pages/paso-uno/paso-uno.component'
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ]
  },
  {
    tramite: 80105,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/80105/pages/paso-uno-cs/paso-uno-cs.component'  
          ).then((m) => m.PasoUnoCsComponent),
        componentName: 'PasoUnoCsComponent',
      },
    ],
  },
   {
    tramite: 80301,
    listaComponentes: [
      {
        id: 'solicitud',
        componentPath: () =>
          import(
            '../../tramites/80301/pages/paso-uno/paso-uno.component'  
          ).then((m) => m.PasoUnoComponent),
        componentName: 'PasoUnoComponent',
      },
    ],
  },
  {
    tramite: 130120,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/130120/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
        tramite: 130116,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/130116/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
            componentName: 'PasoUnoComponent',

        }]
    },
  {
    tramite: 110204,
    listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/110204/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
    }]
  },
  {
    tramite: 80314,
  listaComponentes: [{
      id: 'solicitud',
      componentPath: () => import('../../tramites/80314/pages/paso-uno/paso-uno.component').then(m => m.PasoUnoComponent),
      componentName: 'PasoUnoComponent',
}]
},
];
