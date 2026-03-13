import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 270101,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/270101/pages/pantallas/pantallas.component').then(m => m.PantallasComponent),
            componentName: 'PantallasComponent',

        }]
    },
      {
        tramite: 270201,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/270201/pages/datos-270201/datos-270201.component').then(m => m.Datos270201Component),
            componentName: 'DatosComponent',

        }]
    },
     {
        tramite: 270301,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../tramites/270301/pages/datos/datos.component').then(m => m.DatosComponent),
            componentName: 'DatosComponent',

        }]
    },
];