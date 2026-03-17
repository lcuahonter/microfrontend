
/**
 * @fileoverview Archivo de configuración para las tablas dinámicas del trámite 80207
 * @description
 * Este archivo contiene las configuraciones completas para el renderizado de tablas
 * dinámicas que muestran información de subfabricantes y plantas manufactureras.
 * Define la estructura, orden y formato de columnas para cada tipo de tabla.
 * 
 * @module TablaConfiguracion
 * @tramite 80207
 * @version 1.0.0
 * @author Sistema VUCEM
 */

import {PlantasDireccionModelo, SubfabricanteDireccionModelo } from "../modelos/subfabricante.model";

/**
 * @constant {Array<ConfiguracionColumna<SubfabricanteDireccionModelo>>} SUBFABRICANTE_TABLA_CONFIGURACION
 * @description
 * Configuración completa de la tabla para mostrar información detallada de empresas
 * subfabricantes disponibles en el sistema. Define la estructura visual y funcional
 * de cada columna, incluyendo encabezados, orden de presentación y extractores de datos.
 * 
 * @table_purpose
 * Esta tabla se utiliza para:
 * - **Búsqueda de subfabricantes**: Mostrar resultados de consultas por RFC y estado
 * - **Selección de empresas**: Permitir selección múltiple de subfabricantes
 * - **Validación de datos**: Verificar información de dirección y datos fiscales
 * - **Proceso de agregación**: Facilitar adición de plantas al trámite
 * 
 * @column_structure
 * Cada columna contiene:
 * - **encabezado**: Texto descriptivo para el header de la columna
 * - **clave**: Función extractora que obtiene el valor del modelo de datos
 * - **orden**: Posición secuencial de la columna en la tabla
 * 
 * @data_model
 * Utiliza el modelo `SubfabricanteDireccionModelo` que incluye:
 * - Información de dirección física completa
 * - Datos fiscales y de identificación
 * - Información de contacto y ubicación geográfica
 * 
 * @address_information
 * La tabla muestra datos de dirección estructurados según normativas mexicanas:
 * - **Calle**: Vía principal de ubicación
 * - **Números**: Exterior e interior para identificación específica
 * - **Código postal**: Zona postal oficial mexicana
 * - **Colonia**: Subdivisión urbana local
 * - **Delegación/Municipio**: División política administrativa
 * - **Entidad federativa**: Estado de la República Mexicana
 * - **País**: Ubicación nacional (México)
 * 
 * @fiscal_information
 * Incluye datos fiscales oficiales:
 * - **RFC**: Registro Federal de Contribuyentes
 * - **Domicilio fiscal**: Dirección registrada ante SAT
 * - **Razón social**: Denominación legal de la empresa
 * 
 * @ui_integration
 * Se integra con componentes de tabla dinámica para:
 * - Renderizado automático de columnas
 * - Ordenamiento de datos
 * - Filtrado y búsqueda
 * - Selección múltiple con checkboxes
 * 
 * @business_rules
 * - Orden de columnas optimizado para flujo de lectura
 * - Datos críticos (RFC, razón social) al final para fácil identificación
 * - Información de dirección agrupada lógicamente
 * - Formato consistente con estándares gubernamentales
 * 
 * @export
 * @property {string} encabezado - Título descriptivo de la columna para mostrar en header
 * @property {Function} clave - Función extractora que obtiene valor del modelo de datos
 * @property {number} orden - Posición secuencial de la columna en la tabla
 */
export const SUBFABRICANTE_TABLA_CONFIGURACION = [
  {
    /**
     * @property {string} encabezado
     * @description
     * Título de la primera columna que muestra el nombre de la calle donde
     * se encuentra ubicada la empresa subfabricante. Esta información es
     * fundamental para la identificación geográfica del establecimiento.
     * 
     * @value "Calle"
     * @display_context Información principal de dirección
     * @importance_level Alta - Dato crítico para ubicación
     */
    encabezado: 'Calle',

    /**
     * @property {Function} clave
     * @description
     * Función extractora que obtiene el valor de la propiedad 'calle' del modelo
     * SubfabricanteDireccionModelo. Permite acceso tipado y seguro a los datos
     * de dirección del subfabricante.
     * 
     * @param {SubfabricanteDireccionModelo} ele - Objeto que contiene datos del subfabricante
     * @returns {string} Nombre de la calle de ubicación del subfabricante
     * 
     * @type_safety Función tipada que garantiza tipo de retorno string
     * @data_access Acceso directo a propiedad del modelo sin transformación
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.calle,

    /**
     * @property {number} orden
     * @description
     * Posición secuencial de esta columna en la tabla. Como primera columna
     * de información de dirección, establece el punto de inicio para la
     * lectura de datos de ubicación del subfabricante.
     * 
     * @value 1
     * @sequence_position Primera columna de la tabla
     * @visual_priority Alta - Primera información visible al usuario
     */
    orden: 1,
  },
  {
    /**
     * @property {string} encabezado - Columna para número exterior del domicilio
     * @description Muestra el número exterior de la dirección del subfabricante
     */
    encabezado: 'Num.exterior',
    /**
     * @property {Function} clave - Extractor del número exterior
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {number} Número exterior del domicilio
     */
    clave: (ele: SubfabricanteDireccionModelo):number => ele.numExterior,
    /**
     * @property {number} orden - Posición 2 en la secuencia de columnas
     */
    orden: 2,
  },
  {
    /**
     * @property {string} encabezado - Columna para número interior del domicilio
     * @description Muestra el número interior de la dirección del subfabricante
     */
    encabezado: 'Num.interior',
    /**
     * @property {Function} clave - Extractor del número interior
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {number} Número interior del domicilio
     */
    clave: (ele: SubfabricanteDireccionModelo):number => ele.numInterior,
    /**
     * @property {number} orden - Posición 3 en la secuencia de columnas
     */
    orden: 3,
  },
  {
    /**
     * @property {string} encabezado - Columna para código postal
     * @description Muestra el código postal oficial mexicano del subfabricante
     */
    encabezado: 'Código postal',
    /**
     * @property {Function} clave - Extractor del código postal
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {number} Código postal de 5 dígitos
     */
    clave: (ele: SubfabricanteDireccionModelo):number=> ele.codigoPostal,
    /**
     * @property {number} orden - Posición 4 en la secuencia de columnas
     */
    orden: 4,
  },
  {
    /**
     * @property {string} encabezado - Columna para colonia o fraccionamiento
     * @description Muestra la colonia donde se ubica el subfabricante
     */
    encabezado: 'Colonia',
    /**
     * @property {Function} clave - Extractor de la colonia
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} Nombre de la colonia o fraccionamiento
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.colonia,
    /**
     * @property {number} orden - Posición 5 en la secuencia de columnas
     */
    orden: 5,
  },
  {
    /**
     * @property {string} encabezado - Columna para delegación o municipio
     * @description Muestra la división política administrativa local
     */
    encabezado: 'Delegación / Municipio',
    /**
     * @property {Function} clave - Extractor de delegación/municipio
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} Nombre de la delegación o municipio
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.delegacionMunicipio,
    /**
     * @property {number} orden - Posición 6 en la secuencia de columnas
     */
    orden: 6,
  },
  {
    /**
     * @property {string} encabezado - Columna para entidad federativa
     * @description Muestra el estado de la República Mexicana
     */
    encabezado: 'Entidad federativa',
    /**
     * @property {Function} clave - Extractor de entidad federativa
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} Nombre del estado mexicano
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.entidadFederativa,
    /**
     * @property {number} orden - Posición 7 en la secuencia de columnas
     */
    orden: 7,
  },
  {
    /**
     * @property {string} encabezado - Columna para país de ubicación
     * @description Muestra el país donde se encuentra el subfabricante
     */
    encabezado: 'País',
    /**
     * @property {Function} clave - Extractor del país
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} Nombre del país (típicamente México)
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.pais,
    /**
     * @property {number} orden - Posición 8 en la secuencia de columnas
     */
    orden: 8,
  },
  {
    /**
     * @property {string} encabezado - Columna para RFC del subfabricante
     * @description Muestra el Registro Federal de Contribuyentes oficial
     */
    encabezado: 'Registro federal de contribuyentes',
    /**
     * @property {Function} clave - Extractor del RFC
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} RFC de 12 o 13 caracteres según tipo de persona
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.rfc,
    /**
     * @property {number} orden - Posición 9 en la secuencia de columnas
     */
    orden: 9,
  },
  {
    /**
     * @property {string} encabezado - Columna para domicilio fiscal
     * @description Muestra el domicilio fiscal registrado ante el SAT
     */
    encabezado: 'Domicilio fiscal del solicitante',
    /**
     * @property {Function} clave - Extractor del domicilio fiscal
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} Dirección completa del domicilio fiscal
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.domicilioFiscalSolicitante,
    /**
     * @property {number} orden - Posición 10 en la secuencia de columnas
     */
    orden: 10,
  },
  {
    /**
     * @property {string} encabezado - Columna para razón social
     * @description Muestra la denominación legal oficial de la empresa
     */
    encabezado: 'Razón social',
    /**
     * @property {Function} clave - Extractor de la razón social
     * @param {SubfabricanteDireccionModelo} ele - Modelo de datos del subfabricante
     * @returns {string} Denominación legal completa de la empresa
     */
    clave: (ele: SubfabricanteDireccionModelo):string => ele.razonSocial,
    /**
     * @property {number} orden - Posición 11 (final) en la secuencia de columnas
     */
    orden: 11,
  }
];

/**
 * @constant {Array<ConfiguracionColumna<PlantasDireccionModelo>>} PLANTAS_TABLA_CONFIGURACION
 * @description
 * Configuración completa de la tabla para mostrar información detallada de plantas
 * manufactureras que han sido agregadas al trámite. Define la estructura visual
 * y funcional para gestionar las plantas seleccionadas para operaciones IMMEX.
 * 
 * @table_purpose
 * Esta tabla se utiliza para:
 * - **Gestión de plantas agregadas**: Mostrar plantas seleccionadas en el trámite
 * - **Visualización de ubicaciones**: Verificar direcciones de plantas IMMEX
 * - **Operaciones de eliminación**: Permitir remoción de plantas del trámite
 * - **Validación de datos**: Confirmar información antes del envío final
 * 
 * @immex_context
 * Las plantas mostradas son ubicaciones autorizadas para:
 * - Operaciones de manufactura, maquila y servicios de exportación
 * - Procesos de transformación de materiales importados
 * - Actividades de submanufactura bajo régimen IMMEX
 * - Operaciones de comercio exterior reguladas
 * 
 * @data_model
 * Utiliza el modelo `PlantasDireccionModelo` que incluye:
 * - Información completa de dirección física de la planta
 * - Datos de identificación fiscal y legal
 * - Información de contacto y ubicación geográfica específica
 * - Datos de autorización para operaciones IMMEX
 * 
 * @column_differences
 * A diferencia de la tabla de subfabricantes, incluye:
 * - **Localidad**: Campo específico para plantas (en lugar de colonia)
 * - Misma estructura base de dirección mexicana
 * - Mismos datos fiscales y de identificación
 * - Orden idéntico para consistencia de UX
 * 
 * @business_validation
 * Las plantas deben cumplir:
 * - Ubicación en territorio nacional mexicano
 * - Registro válido ante autoridades fiscales
 * - Autorización para operaciones IMMEX
 * - Dirección verificable y completa
 * 
 * @ui_integration
 * Se integra con:
 * - Componente de tabla dinámica para renderizado
 * - Sistema de selección múltiple para eliminación
 * - Validadores de dirección y datos fiscales
 * - Procesos de confirmación de cambios
 * 
 * @export
 * @property {string} encabezado - Título descriptivo de la columna
 * @property {Function} clave - Función extractora de datos del modelo PlantasDireccionModelo
 * @property {number} orden - Posición secuencial en la tabla
 */
export const PLANTAS_TABLA_CONFIGURACION = [
  {
    /**
     * @property {string} encabezado
     * @description
     * Título de la primera columna que muestra el nombre de la calle donde
     * se encuentra ubicada la planta manufacturera. Información esencial
     * para identificación geográfica de instalaciones IMMEX.
     * 
     * @value "Calle"
     * @context Ubicación física de planta manufacturera
     * @importance_level Crítica - Dato fundamental para operaciones IMMEX
     */
    encabezado: 'Calle',

    /**
     * @property {Function} clave
     * @description
     * Función extractora que obtiene el valor de la propiedad 'calle' del modelo
     * PlantasDireccionModelo. Acceso tipado a información de dirección de plantas.
     * 
     * @param {PlantasDireccionModelo} ele - Objeto con datos de la planta manufacturera
     * @returns {string} Nombre de la calle donde se ubica la planta
     * 
     * @data_context Dirección física de instalación manufacturera
     * @type_safety Función tipada que garantiza retorno string
     */
    clave: (ele: PlantasDireccionModelo):string => ele.calle,

    /**
     * @property {number} orden
     * @description
     * Posición inicial en la secuencia de columnas de la tabla de plantas.
     * Establece el punto de inicio para visualización de datos de ubicación.
     * 
     * @value 1
     * @sequence_position Primera columna de información
     * @consistency Mantiene consistencia con tabla de subfabricantes
     */
    orden: 1,
  },
  {
    /**
     * @property {string} encabezado - Número exterior de la planta
     * @description Identificación numérica exterior del domicilio de la planta
     */
    encabezado: 'Num.exterior',
    /**
     * @property {Function} clave - Extractor de número exterior
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {number} Número exterior del domicilio
     */
    clave: (ele: PlantasDireccionModelo):number => ele.numExterior,
    /**
     * @property {number} orden - Segunda posición en la tabla
     */
    orden: 2,
  },
  {
    /**
     * @property {string} encabezado - Número interior de la planta
     * @description Identificación numérica interior del domicilio de la planta
     */
    encabezado: 'Num.interior',
    /**
     * @property {Function} clave - Extractor de número interior
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {number} Número interior del domicilio
     */
    clave: (ele: PlantasDireccionModelo):number => ele.numInterior,
    /**
     * @property {number} orden - Tercera posición en la tabla
     */
    orden: 3,
  },
  {
    /**
     * @property {string} encabezado - Código postal de la planta
     * @description Código postal oficial mexicano de la ubicación de la planta
     */
    encabezado: 'Código postal',
    /**
     * @property {Function} clave - Extractor de código postal
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {number} Código postal de 5 dígitos
     */
    clave: (ele: PlantasDireccionModelo):number=> ele.codigoPostal,
    /**
     * @property {number} orden - Cuarta posición en la tabla
     */
    orden: 4,
  },
  {
    /**
     * @property {string} encabezado - Localidad de la planta
     * @description Localidad específica donde se encuentra la planta (diferente a colonia)
     */
    encabezado: 'Localidad ',
    /**
     * @property {Function} clave - Extractor de localidad
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} Nombre de la localidad
     */
    clave: (ele: PlantasDireccionModelo):string => ele.localidad,
    /**
     * @property {number} orden - Quinta posición en la tabla
     */
    orden: 5,
  },
  {
    /**
     * @property {string} encabezado - Delegación/municipio de la planta
     * @description División política administrativa donde se ubica la planta
     */
    encabezado: 'Delegación / Municipio',
    /**
     * @property {Function} clave - Extractor de delegación/municipio
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} Nombre de delegación o municipio
     */
    clave: (ele: PlantasDireccionModelo):string => ele.delegacionMunicipio,
    /**
     * @property {number} orden - Sexta posición en la tabla
     */
    orden: 6,
  },
  {
    /**
     * @property {string} encabezado - Estado donde se ubica la planta
     * @description Entidad federativa de la República Mexicana
     */
    encabezado: 'Entidad federativa',
    /**
     * @property {Function} clave - Extractor de entidad federativa
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} Nombre del estado mexicano
     */
    clave: (ele: PlantasDireccionModelo):string => ele.entidadFederativa,
    /**
     * @property {number} orden - Séptima posición en la tabla
     */
    orden: 7,
  },
  {
    /**
     * @property {string} encabezado - País de ubicación de la planta
     * @description País donde se encuentra la planta manufacturera
     */
    encabezado: 'País',
    /**
     * @property {Function} clave - Extractor del país
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} Nombre del país (México)
     */
    clave: (ele: PlantasDireccionModelo):string => ele.pais,
    /**
     * @property {number} orden - Octava posición en la tabla
     */
    orden: 8,
  },
  {
    /**
     * @property {string} encabezado - RFC de la planta
     * @description Registro Federal de Contribuyentes de la planta manufacturera
     */
    encabezado: 'Registro federal de contribuyentes',
    /**
     * @property {Function} clave - Extractor del RFC
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} RFC oficial de la planta
     */
    clave: (ele: PlantasDireccionModelo):string => ele.rfc,
    /**
     * @property {number} orden - Novena posición en la tabla
     */
    orden: 9,
  },
  {
    /**
     * @property {string} encabezado - Domicilio fiscal de la planta
     * @description Domicilio fiscal registrado ante el SAT para la planta
     */
    encabezado: 'Domicilio fiscal del solicitante',
    /**
     * @property {Function} clave - Extractor del domicilio fiscal
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} Dirección completa del domicilio fiscal
     */
    clave: (ele: PlantasDireccionModelo):string => ele.domicilioFiscalSolicitante,
    /**
     * @property {number} orden - Décima posición en la tabla
     */
    orden: 10,
  },
  {
    /**
     * @property {string} encabezado - Razón social de la planta
     * @description Denominación legal oficial de la empresa propietaria de la planta
     */
    encabezado: 'Razón social',
    /**
     * @property {Function} clave - Extractor de razón social
     * @param {PlantasDireccionModelo} ele - Modelo de datos de la planta
     * @returns {string} Denominación legal de la empresa
     */
    clave: (ele: PlantasDireccionModelo):string => ele.razonSocial,
    /**
     * @property {number} orden - Posición final (11) en la tabla
     */
    orden: 11,
  }
];
