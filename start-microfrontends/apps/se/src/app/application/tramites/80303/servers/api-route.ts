/**
 * Conjunto de rutas de la API para el procedimiento 80101.
 */

import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
/**
 * url base de la API
 */
const BASE_URL = ENVIRONMENT.API_HOST;
/**
 * API nombre
 */
const API = ENVIRONMENT.API;

/**
 * Solicitud de la API
 */
const SOLICITUD = ENVIRONMENT.SOLICITUD_URL;

/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t80303';

export const PROC_80303 = {
  CONSULTAR_BITACORA_IMMEX: (idPrograma: string): string =>
    `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultar-bitacora-immex?idPrograma=${idPrograma}`,
  CONSULTA_MERCANCIAS_IMPORTACION: (idSolicitud: string): string =>
    `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-mercancias-importacion?idSolicitud=${idSolicitud}`,
  CONSULTA_PRODUCTOS_EXPORTACION: (idSolicitud: string): string =>
    `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-productos-exportacion?idSolicitud=${idSolicitud}`,
  CONSULTA_FRACCIONES_SENSIBLES: (idSolicitud: string): string =>
    `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-fracciones-sensibles?idSolicitud=${idSolicitud}`,
  CONSULTAR_PLANTAS_SUBMANUFACTURERAS: (idSolicitud: string): string =>
    `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/plantas-submanufactureras?idSolicitud=${idSolicitud}`,
  BUSCAR_EMPRESA_SUBMANUFACTURERA: (idSolicitud: string): string =>
    `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-empresa-sumanufacturera-por-id-solicitud?idSolicitud=${idSolicitud}`,
  CONSULTAR_SERVICIOS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar/consulta-servicios`,
  BUSCAR_SOCIO_ACCIONISTA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-socio-accionista`,
  BUSCAR_NOTARIOS_CONSULTA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-notarios-consulta`,
  CONSULTA_PLANTAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta-plantas`,
  BUSCAR_EMPRESAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-empresas`, 
  GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
  BUSCAR_DATOS_CERTIFICACION_SAT: `${BASE_URL}${API}/sat-t80303/solicitud/buscarDatosCertificacionSAT`,
  LISTA_PROGRAMAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-ProgramasAModificar?rfc=`,
  DATOS_MODIFICACION: `${BASE_URL}${API}/idc/contribuyente/LEQI8101314S7/informacion`,
  FRACCIONES_EXPORTACION: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar/fraccionesExportacion`,
  MOSTRAR: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostrar?idSolicitud=${id}`,
  BUSCAR_ID_SOLICITUD: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultas-busca-id-solicitud`,

};
 
 