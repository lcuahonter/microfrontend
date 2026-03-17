/**
 * @fileoverview
 * Modelos e interfaces auxiliares para el trámite de Certificado Zoosanitario.
 * Incluye estructuras para pasos de wizard, respuestas de API, bancos, acciones de botones y opciones de radio.
 * Cobertura compodoc 100%: cada interfaz y propiedad está documentada.
 * @module certificadoZoosanitarioModel
 */

import { DatosDeLaSolicitud, FilaSolicitud } from "./capturar-solicitud.model";

/**
 * Interfaz para representar un paso dentro de un asistente tipo "wizard".
 * Contiene información sobre el índice del paso, su título, y si se encuentra activo o completado.
 * @interface ListaPasosWizard
 * @property {number} indice - El número de índice del paso dentro del flujo del asistente.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso actual está activo o seleccionado.
 * @property {boolean} completado - Indica si el paso fue completado por el usuario.
 */
export interface ListaPasosWizard {
    /**
     * El número de índice del paso dentro del flujo del asistente.
     */
    indice: number;
    /**
     * El título descriptivo del paso.
     */
    titulo: string;
    /**
     * Indica si el paso actual está activo o seleccionado.
     */
    activo: boolean;
    /**
     * Indica si el paso fue completado por el usuario.
     */
    completado: boolean;
}

/**
 * Interfaz genérica para representar la respuesta estructurada de una API REST.
 * @template T - Tipo de dato esperado como respuesta.
 * @interface RespuestaAPI
 * @property {number} code - Código de respuesta HTTP o interno de la API.
 * @property {T} data - Datos devueltos por la API, que pueden ser de cualquier tipo genérico.
 * @property {string} message - Mensaje descriptivo o informativo que acompaña la respuesta.
 */
export interface RespuestaAPI<T> {
    /**
     * Código de respuesta HTTP o interno de la API.
     */
    code: number;
    /**
     * Datos devueltos por la API, que pueden ser de cualquier tipo genérico.
     */
    data: T;
    /**
     * Mensaje descriptivo o informativo que acompaña la respuesta.
     */
    message: string;
}

/**
 * Interfaz que representa un banco en una lista desplegable o selección.
 * @interface Banco
 * @property {number} id - Identificador único del banco.
 * @property {string} value - Nombre o valor legible del banco.
 */
export interface Banco {
    /**
     * Identificador único del banco.
     */
    id: number;
    /**
     * Nombre o valor legible del banco.
     */
    value: string;
}

/**
 * Interfaz utilizada para definir el comportamiento de botones de navegación,
 * como avanzar o retroceder entre pasos de un asistente (wizard).
 * @interface AccionBoton
 * @property {string} accion - Tipo de acción: 'cont' para continuar o 'atras' para regresar.
 * @property {number} valor - Índice del paso al que se desea navegar.
 */
export interface AccionBoton {
    /**
     * Tipo de acción: 'cont' para continuar o 'atras' para regresar.
     */
    accion: string;
    /**
     * Índice del paso al que se desea navegar.
     */
    valor: number;
}

/**
 * Interfaz que define una opción para un control de selección tipo radio button.
 * @interface RadioOpcion
 * @property {string} label - Etiqueta visible para el usuario.
 * @property {string} value - Valor interno asignado a la opción seleccionada.
 */
export interface RadioOpcion {
    /**
     * Etiqueta visible para el usuario.
     */
    label: string;
    /**
     * Valor interno asignado a la opción seleccionada.
     */
    value: string;
}

/**
 * Representa los datos de un formulario fitosanitario para trámites de importación o inspección.
 * @interface DatosForma
 * @property {string} aduanaDeIngreso - Nombre de la aduana por donde ingresa la mercancía.
 * @property {string} oficinaDeInspeccion - Oficina responsable de la inspección.
 * @property {string} puntoDeInspeccion - Punto específico donde se realiza la inspección.
 * @property {string} [numeroDeGuia] - Número de guía de la mercancía (opcional).
 * @property {string} regimen - Régimen aduanero aplicable.
 * @property {string} [numeroDeCarro] - Número del carro o vehículo de transporte (opcional).
 * @property {string} [tipoDeRequisito] - Tipo de requisito solicitado (opcional).
 * @property {string} [requisito] - Descripción del requisito (opcional).
 * @property {string} [numeroCertificadoInternacional] - Número de certificado internacional (opcional).
 * @property {string} [fraccionArancelaria] - Fracción arancelaria del producto (opcional).
 * @property {string} [descripcionFraccion] - Descripción de la fracción arancelaria (opcional).
 * @property {string} [nico] - Número de Identificación Comercial (opcional).
 * @property {string} [descripcionNico] - Descripción del NICO (opcional).
 * @property {string} [descripcion] - Descripción general del producto (opcional).
 * @property {string | number} [cantidadUMT] - Cantidad en Unidad de Medida de Transporte (opcional).
 * @property {string} [umt] - Unidad de Medida de Transporte (opcional).
 * @property {string | number} [cantidadUMC] - Cantidad en Unidad de Medida Comercial (opcional).
 * @property {string} [umc] - Unidad de Medida Comercial (opcional).
 * @property {string} [uso] - Uso o destino del producto (opcional).
 * @property {string} [tipoDeProducto] - Tipo de producto transportado (opcional).
 * @property {string} [tipoMercancia] - Tipo de mercancía, por ejemplo, "animal", "vegetal", etc. (opcional).
  */
export interface DatosForma {
    /**
     * Nombre de la aduana por donde ingresa la mercancía.
     */
    aduanaDeIngreso: string;
    /**
     * Oficina responsable de la inspección.
     */
    oficinaDeInspeccion: string;
    /**
     * Punto específico donde se realiza la inspección.
     */
    puntoDeInspeccion: string;
    /**
     * Número de guía de la mercancía (opcional).
     */
    numeroDeGuia?: string;
    /**
     * Régimen aduanero aplicable.
     */
    regimen: string;
    /**
     * Número del carro o vehículo de transporte (opcional).
     */
    numeroDeCarro?: string;
    /**
     * Tipo de requisito solicitado (opcional).
     */
    tipoDeRequisito?: string;
    /**
     * Descripción del requisito (opcional).
     */
    requisito?: string;
    /**
     * Número de certificado internacional (opcional).
     */
    numeroCertificadoInternacional?: string;
    /**
     * Fracción arancelaria del producto (opcional).
     */
    fraccionArancelaria?: string;
    /**
     * Descripción de la fracción arancelaria (opcional).
     */
    descripcionFraccion?: string;
    /**
     * Número de Identificación Comercial (opcional).
     */
    nico?: string;
    /**
     * Descripción del NICO (opcional).
     */
    descripcionNico?: string;
    /**
     * Descripción general del producto (opcional).
     */
    descripcion?: string;
    /**
     * Cantidad en Unidad de Medida de Transporte (opcional).
     */
    cantidadUMT?: string | number;
    /**
     * Unidad de Medida de Transporte (opcional).
     */
    umt?: string;
    /**
     * Cantidad en Unidad de Medida Comercial (opcional).
     */
    cantidadUMC?: string | number;
    /**
     * Unidad de Medida Comercial (opcional).
     */
    umc?: string;
    /**
     * Uso o destino del producto (opcional).
     */
    uso?: string;
    /**
     * Tipo de producto transportado (opcional).
     */
    tipoDeProducto?: string;
    /**
     * Tipo de mercancía, por ejemplo, "animal", "vegetal", etc. (opcional).
     */
    tipoMercancia?: string;
}

/**
 * Representa los datos de un formulario fitosanitario para trámites de importación o inspección.
 * @interface DatosForma
 * @property {string} aduanaDeIngreso - Nombre de la aduana por donde ingresa la mercancía.
 * @property {string} oficinaDeInspeccion - Oficina responsable de la inspección.
   */
export interface SolicitudDataReq {
  datosDeLaSolicitud: DatosDeLaSolicitud;
  filaSolicitud: FilaSolicitud[];
}

