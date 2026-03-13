
import { Complimentaria, DomicilioInfo, Federetarios } from "./plantas-consulta.model";

/**
 * @interface ConfiguracionColumna
 * Configuración de columna genérica para tablas
 */
export interface ConfiguracionColumna<T> {
  /** Título de la columna */
  encabezado: string;
  /** Función que devuelve el valor de la columna para cada fila */
  clave: (ele: T) => string | number | undefined | boolean;
  /** Orden de la columna en la tabla */
  orden: number;
}

/**
 * @interface Operacions
 * Operaciones que extiende múltiples interfaces
 * @extends Complimentaria
 * @extends Federetarios
 * @extends DomicilioInfo
 */
export interface Operacions extends Complimentaria, Federetarios, DomicilioInfo {
    /** Razón social de la empresa */
    razonSocial?: string;
    /** RFC del solicitante fiscal */
    fiscalSolicitante?: string;

    /** Registro Federal de Contribuyentes */
    rfc?: string;
    /** Nombre del representante */
    nombre?: string;
    /** Primer apellido */
    apellidoPrimer?: string;
    /** Segundo apellido */
    apellidoSegundo?: string;

    /** Número del acta constitutiva */
    numeroActa?: string;
    /** Fecha del acta */
    fetchActa?: string;
    /** Número de la notaría */
    numeroNotaria?: string;
    /** Municipio o delegación */
    municipioDelegacion?: string;
    /** Estado */
    estado?: string;

    /** Identificador único del domicilio */
    id?: number;
    /** Calle de la dirección */
    calle?: string;
    /** Número exterior de la dirección */
    numeroExterior?: string;
    /** Número interior de la dirección */
    numeroInterior?: string;
    /** Código postal */
    codigoPostal?: string;
    /** Localidad */
    localidad?: string;
    /** Colonia */
    colonia?: string;
    /** Delegación o municipio */
    delegacionMunicipio?: string;
    /** Entidad federativa */
    entidadFederativa?: string;
    /** País */
    pais?: string;
    /** Teléfono */
    telefono?: string;
    /** ID de la planta (como cadena de texto) */
    idPlanta?: string;
    /** ID de la solicitud (opcional, puede estar indefinido) */
    idSolicitud?: string;
    /** Estado que puede ser 'Baja' o 'Activada' */
    desEstatus?: 'Baja' | 'Activada';
    /** Valor booleano para el estado */
    estatus?: boolean;
}
  