/**
 * Contiene textos de alerta o nota utilizados en la vista de la solicitud,
 * como instrucciones o advertencias relacionadas con domicilios y programas IMMEX.
 */
export const ALERTA_COM = {
    inst: `<h6>Nota: Si no encuadra en los sectores o los servicios de los catálogos, deberá seleccionar el más cercano a sus actividades.</h6>`,
    nota: `<h6>Nota:</h6> De contar con un programa IMMEX activo y vigente al momento de ingresar la solicitud, se mostrarán los domicilios registrados ante la Secretaria de Economía, es necesario eliminar aquellos domicilios que no tengan alguna relación con la presente solicitud. Así mismo, podrá incluir otros domicilios que se encuentren relacionados con el RFC del solicitante, dando click en el botón "Agregar" y seleccionado la Entidad Federativa.`,
    nota2: `Deberá anexar un archivo con el reporte de saldos de mercancía de importación temporal o de mercancías objeto de operaciones de comercio exterior, de un periodo de un mes, que se encuentre dentro de los tres meses anteriores a la presentación de la solicitud.`
  };
  
  /**
   * Opciones utilizadas en botones de selección tipo radio para respuestas "Sí" o "No".
   */
  export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
      label: 'Sí',
      value: '1',
    },
    {
      label: 'No',
      value: '0',
    }
  ];
  
  /**
   * Opciones de autorización del reconocimiento para el trámite.
   */
  export const OPCIONES_RECONOCIMIENTO = [
    {
      label: 'si Autorizo',
      value: '1',
    },
    {
      label: 'No Autorizo',
      value: '0',
    }
  ];
  
  /**
   * Opciones para definir si la información proporcionada es pública o privada.
   */
  export const OPCIONES_INFORMACION = [
    {
      label: 'Pública',
      value: '1',
    },
    {
      label: 'Privada',
      value: '0',
    }
  ];
  
  /**
   * Configuración para el campo de fecha de factura (etiqueta, requerido, habilitación).
   */
  export const FECHA_DE_FACTURA = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: true,
  };
  