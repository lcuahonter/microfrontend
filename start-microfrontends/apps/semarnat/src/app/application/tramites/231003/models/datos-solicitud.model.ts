import { ResiduoPeligroso } from './../../231002/models/aviso-catalogo.model';

/**
 * Estado que representa los valores del formulario de reciclaje.
 */
export interface EstadoDatoSolicitud {
  /** RFC del solicitante */
  rfc_solicitante?: string;
  /** Indica si el formulario está en modo lectura */
  esLecutra?: boolean;
  /** ID de la solicitud */
  idSolicitud: number | null;
  /** Sección de datos de la solicitud */
  
  solicitudForm: {
    /** Número de registro ambiental */
    numeroRegistroAmbiental: string;

    /** Descripción genérica del residuo */
    descripcionGenerica1: string;

    /** Número de programa IMMEX asociado */
    numeroProgramaImmex: string;
  };

  /** Información de la empresa recicladora */
  empresaReciclaje: {
    /** Indicador de si se requiere empresa recicladora */
    requiereEmpresa: string;

    /** Nombre de la empresa recicladora */
    nombreEmpresa: string;

    /** Representante legal de la empresa */
    representanteLegal: string;

    /** Teléfono de contacto de la empresa */
    telefono: string;

    /** Correo electrónico de contacto */
    correoElectronico: string;
  };

  /** Información del lugar de reciclaje */
  lugarReciclaje: {
    /** Indicador si se realiza en instalaciones del generador */
    reciclajeInstalaciones: string;

    /** Ubicación del lugar de reciclaje */
    lugarReciclaje: string;

    /** Número de autorización de la empresa recicladora */
    numeroAutorizacionEmpresaReciclaje: string;
  };

  /** Datos de la empresa transportista */
  empresaTransportista: {
    /** Nombre de la empresa transportista de residuos */
    nombreEmpresaTransportistaResiduos: string;

    /** Número de autorización otorgado por SEMARNAT */
    numeroAutorizacionSemarnat: string;
  };

  /** Precauciones en el manejo del residuo */
  precaucionesManejo: {
    /** Descripción de las precauciones de manejo */
    precaucionesManejo: string;
  };

  residuos: ResiduoPeligroso[];
}

export const ADMINISTRAR_RESIDUOS = [
  {
    encabezado: 'Orígen del residuo',
    clave: (item: ResiduoPeligroso): string => item.origenResiduoGeneracion,
    orden: 1,
  },
  {
    encabezado: 'Fracción Arancelaria',
    clave: (item: ResiduoPeligroso): string => item.fraccionCve,
    orden: 2,
  },
  {
    encabezado: 'NICO',
    clave: (item: ResiduoPeligroso): string => item.nicoDesc,
    orden: 3,
  },
  {
    encabezado: 'Acotación',
    clave: (item: ResiduoPeligroso): string => item.acotacion,
    orden: 4,
  },
  {
    encabezado: 'Nombre Residuo Peligroso',
    clave: (item: ResiduoPeligroso): string => item.nombreResiduo,
    orden: 5,
  },
  {
    encabezado: 'Cantidad',
    clave: (item: ResiduoPeligroso): string => item.cantidad,
    orden: 6,
  },
  {
    encabezado: 'Cantidad letra',
    clave: (item: ResiduoPeligroso): string => item.cantidadLetra,
    orden: 7,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (item: ResiduoPeligroso): string => item.unidadMedidaDesc,
    orden: 8,
  },
  {
    encabezado: 'Clave Clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoCve,
    orden: 9,
  },
  {
    encabezado: 'Nombre Clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoNombreDesc,
    orden: 10,
  },
  {
    encabezado: 'Descripción clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoDescDesc,
    orden: 11,
  },
  {
    encabezado: 'Descripción otro Clasificación',
    clave: (item: ResiduoPeligroso): string => item.residuoOtro,
    orden: 12,
  },
  {
    encabezado: 'CRETI',
    clave: (item: ResiduoPeligroso): string => item.cretiDesc,
    orden: 13,
  },
  {
    encabezado: 'Estado físico',
    clave: (item: ResiduoPeligroso): string => item.estadoFisicoDesc,
    orden: 14,
  },
  {
    encabezado: 'Descripción otro estado físico',
    clave: (item: ResiduoPeligroso): string => item.estadoFisicoOtro,
    orden: 15,
  },
  {
    encabezado: 'Tipo de contenedor',
    clave: (item: ResiduoPeligroso): string => item.tipoContenedorDesc,
    orden: 17,
  },
  {
    encabezado: 'Descripción otro contenedor',
    clave: (item: ResiduoPeligroso): string => item.tipoContenedorOtro,
    orden: 18,
  },
  {
    encabezado: 'Capacidad',
    clave: (item: ResiduoPeligroso): string => item.capacidad,
    orden: 19,
  },
];
