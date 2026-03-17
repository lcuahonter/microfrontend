/**
 * Representa los datos necesarios para cancelar un permiso.
 */
interface PersmisoCancelar {
    /**
     * Folio único del trámite.
     */
    folioTramite: string;

    /**
     * Tipo de solicitud realizada.
     */
    tipoSolicitud: string;

    /**
     * Régimen asociado al trámite.
     */
    regimen: string;

    /**
     * Clasificación del régimen.
     */
    clasificacionRegimen: string;

    /**
     * Condición de la mercancía involucrada.
     */
    condicionDeLaMercancia: string;

    /**
     * Fracción arancelaria correspondiente.
     */
    fraccionArancelaria: string;
}
export const PERSMISO_CANCELAR_TABLE = [
    {
      encabezado: 'Folio trámite',
      clave: (ele: PersmisoCancelar): string => ele.folioTramite,
      orden: 1
    },
    {
      encabezado: 'Tipo solicitud',
      clave: (ele: PersmisoCancelar): string => ele.tipoSolicitud,
      orden: 2
    },
    {
      encabezado: 'Régimen',
      clave: (ele: PersmisoCancelar): string => ele.regimen,
      orden: 3
    },
    {
      encabezado: 'Clasificación régimen',
      clave: (ele: PersmisoCancelar): string => ele.clasificacionRegimen,
      orden: 4
    },
    {
      encabezado: 'Condición de la mercancía',
      clave: (ele: PersmisoCancelar): string => ele.condicionDeLaMercancia,
      orden: 5
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: PersmisoCancelar): string => ele.fraccionArancelaria,
      orden: 6
    }
]