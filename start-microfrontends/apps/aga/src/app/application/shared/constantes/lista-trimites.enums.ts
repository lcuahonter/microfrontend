import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';

export const LISTA_TRIMITES: AccuseComponentes[] = [

 
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
  ]


