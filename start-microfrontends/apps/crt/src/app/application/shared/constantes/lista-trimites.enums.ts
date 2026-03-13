import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [
    {
        tramite: 220102,
        listaComponentes: [{
            id: 'solicitud',
            componentPath: () => import('../../seleccion-tramite/seleccion-tramite.component').then(m => m.SeleccionTramiteComponent),
            componentName: 'SeleccionTramiteComponent',
        },]
    },
];