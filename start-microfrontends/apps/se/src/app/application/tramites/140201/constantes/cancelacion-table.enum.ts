import { CancelacionDeAutorizaciones } from "../models/cancelacions.model";

export const CANCELACION_DE_AUTORIZACIONES=[
    {
        encabezado: 'Folio de programa',
        clave: (ele: CancelacionDeAutorizaciones): string => ele.folioDePrograma,
        orden: 1,
      },
      {
        encabezado: 'Tipo programa',
        clave: (ele: CancelacionDeAutorizaciones): string => ele.tipoPrograma,
        orden: 2,
      },
      {
        encabezado: 'Selecciona la modalidad',
        clave: (ele: CancelacionDeAutorizaciones): string => ele.seleccionaLaModalidad,
        orden: 3,
      },
      {
        encabezado: 'Estatus',
        clave: (ele: CancelacionDeAutorizaciones): string => ele.estatus,
        orden: 4,
      }

]