/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { Injectable } from '@angular/core';
import { ProsecState } from '../estados/autorizacion-prosec.store';

@Injectable({
  providedIn: 'root',
})
export class GuardarMappingAdapter {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */

  static toFormPayload(state: ProsecState): unknown {
    
    return {   
  "id_solicitud": state.idSolicitud || 0,
  "tipo_solicitud": 4,
  "folio_programa": "9444",
  "fecha_fin_vigencia": "2025-09-26",
  "id_programa_autorizado": "409",
  "discriminator_value": "90201",
  "rfc_solicitante": "AAL0409235E6",
  "anio_programa": "2025-09-26",
  "id_solicitud_seleccionada": 1001,
  "inicio": 1,
  "rep_fed_sol": "DELEGACION FEDERAL CULIACAN",
  "discriminador": "90201",
  "puede_capturar_representante_legal_cg": false,
  "cve_rol_capturista": "PersonaMoral",
  "cve_usuario_capturista": "AAL0409235E6",
  "cve_usuario_solicitante": "AAL0409235E6",
  "representaciones_federales": state.RepresentacionFederal,
  "actividad_productiva": state.ActividadProductiva,
  "solicitante": {
    "rfc": "AAL0409235E6",
    "razon_social": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
    "descripcion_giro": "Siembra, cultivo y cosecha de otros cultivos",
    "correo_electronico": "vucem3033@gmail.com",
    "telefono": "55-98764532",
    "domicilio": {
      "pais_clave": "MEX",
      "pais_nombre": "ESTADOS UNIDOS MEXICANOS",
      "entidad_federativa_clave": "SIN",
      "entidad_federativa_nombre": "SINALOA",
      "delegacion_municipio_clave": "25001",
      "delegacion_municipio_nombre": "AHOME",
      "colonia_clave": "00181210001",
      "colonia_nombre": "MIGUEL HIDALGO",
      "localidad_clave": "00181210008",
      "localidad_nombre": "LOS MOCHIS",
      "calle": "CAMINO VIEJO",
      "numero_exterior": "1353",
      "numero_interior": "",
      "codigo_postal": "81210"
    }
  },
   "plantas": state.prosecDatos,
 
    "sectores": state.selectedSectorDatos,
    "fraccionSeleccionada": state.producirDatos, 
    "productorIndirecto": state.productorDatos

    }
  }
}
