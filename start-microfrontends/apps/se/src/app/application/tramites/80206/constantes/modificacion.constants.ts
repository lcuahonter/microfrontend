/**
 * Este archivo contiene constantes y configuraciones utilizadas en el módulo de ampliación de servicios.
 * Proporciona configuraciones para tablas, textos, pasos del proceso y alertas que se utilizan en la interfaz de usuario.
 * 
 * Este archivo define configuraciones para sectores, fracciones arancelarias, fracciones de importación, textos de instrucciones,
 * alertas y pasos del proceso de ampliación de servicios.
 */

import {
  Arancelaria,
  ArancelariaImportacion,
  Sector,
} from '../models/datos-info.model';

/**
 * Pasos del proceso de ampliación de servicios.
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Configuración de la tabla para sectores.
 */
export const CONFIGURACION_SECTOR = [
  
  {
    encabezado: 'Descripción',
    clave: (ele: Sector): string | undefined => ele.descripcion,
    orden: 1,
  },
];

/**
 * Configuración de la tabla para fracciones arancelarias.
 */
export const CONFIGURACION_ARANCELARIAS = [
  {
    encabezado: '#Fracción',
    clave: (ele: Arancelaria): string | undefined => ele.fraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: Arancelaria): string | undefined => ele.fraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: Arancelaria): string | undefined => ele.descripcionComercial,
    orden: 3,
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: Arancelaria): string | undefined => ele.anexoII,
    orden: 4,
  },
  {
    encabezado: 'Tipo',
    clave: (ele: Arancelaria): string | undefined => ele.tipo,
    orden: 5,
  },
  {
    encabezado: 'UMT',
    clave: (ele: Arancelaria): string | undefined => ele.umt,
    orden: 6,
  },
  {
    encabezado: 'Categoría',
    clave: (ele: Arancelaria): string | undefined => ele.categoria,
    orden: 7,
  },
  {
    encabezado: 'Valor en moneda mensual',
    clave: (ele: Arancelaria): string | undefined => ele.valorMensual,
    orden: 8,
  },
  {
    encabezado: 'Valor en moneda anual',
    clave: (ele: Arancelaria): string | undefined => ele.valorAnual,
    orden: 9,
  },
  {
    encabezado: 'Volumen mensual',
    clave: (ele: Arancelaria): string | undefined => ele.volumenrMensual,
    orden: 10,
  },
  {
    encabezado: 'Volumen anual',
    clave: (ele: Arancelaria): string | undefined => ele.volumenAnual,
    orden: 11,
  },
];

/**
 * Configuración de la tabla para fracciones de importación.
 */
export const CONFIGURACION_ARANCELARIASIMPORTACION = [
  {
    encabezado: '#Fracción',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.fraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.fraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.descripcionFraccionPadre,
    orden: 3,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.fraccionArancelariaImportacion,
    orden: 4,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.descripcionComercialImportacion,
    orden: 5,
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.anexoII,
    orden: 6,
  },
  {
    encabezado: 'Tipo',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.tipo,
    orden: 7,
  },
  {
    encabezado: 'UMT',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.umt,
    orden: 8,
  },
  {
    encabezado: 'Categoría',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.categoria,
    orden: 9,
  },
  {
    encabezado: 'Valor en moneda mensual',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.valorMensual,
    orden: 10,
  },
  {
    encabezado: 'Valor en moneda anual',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.valorAnual,
    orden: 11,
  },
  {
    encabezado: 'Volumen mensual',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.volumenrMensual,
    orden: 12,
  },
  {
    encabezado: 'Volumen anual',
    clave: (ele: ArancelariaImportacion): string | undefined => ele.volumenAnual,
    orden: 13,
  },
];

/**
 * Textos constantes para el módulo 80206.
 */
export const TEXTOS_80206 = {
  ALERTA_TEXTOS:
    'Materias primas, partes, componentes, materiales auxiliares, envases, material de empaque, etiquetas, folletos, combustibles y lubricantes que se utilicen en el proceso de producción o de servicios de las mercancías de exportación.',
};

/**
 * Mensajes de alerta utilizados en la aplicación.
 */
export const ALERT = {
  ERRORMESSAGE: `<p>Corrija los siguientes errores: </p>
      <p style="color:#d0021b; display: flex; justify-content: center; position: relative;"><span style="position: absolute; left: 2px;">1</span>(Toda fracción de exportación debe tener al menos una fracción de importación) es un campo requerido </p>
      <p style="color:#d0021b; display: flex; justify-content: center; position: relative;"><span style="position: absolute; left: 2px;">2</span>(Regla Tres Rs) es un campo requerido </p>`,
};


/**
 * Mensaje de alerta que se muestra cuando hay errores de validación en los formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">(Debe agregar al menos un servicio) es un campo requerido</span>
    </div>

   
  </div>
</div>
`;

/**
 * Mensaje de alerta que se muestra cuando faltan campos por capturar.
 */
export const ERROR_CAMPOS_FALTANTES = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary">Faltan campos por capturar.</div>
  </div>
</div>
`;