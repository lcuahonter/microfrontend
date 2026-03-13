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
      "tipoDeSolicitud": "guardar",
      "idSolicitud": state.idSolicitud || 0,
      "cveUnidadAdministrativa": null,
      "costoTotal": null,
      "certificadoSerialNumber": null,
      "numeroFolioTramiteOriginal": null,
      "tipoSolicitud": 1,
      "folioPrograma": null,
      "fechaFinVigencia": null,
      "idProgramaAutorizado": null,
      "discriminatorValue": "90101",
      "solicitante": {
          "rfc": "AAL0409235E6",
          "domicilio": {
              "cvePais": "MEX",
              "cveEntidad": "SIN",
              "cveDelegMun": "25001",
              "cveColonia": "00181210001",
              "cveLocalidad": "00181210008",
              "nombrePais": "ESTADOS UNIDOS MEXICANOS",
              "codigoPostal": "81210",
              "nombreEntidad": "SINALOA",
              "nombreDelegMun": "AHOME",
              "nombreLocalidad": "LOS MOCHIS",
              "nombreColonia": "MIGUEL HIDALGO",
              "calle": "CAMINO VIEJO",
              "numExterior": "1353",
              "numInterior": null
          },
          "cveUsuario": "AAL0409235E6",
          "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
          "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
          "correoElectronico": "vucem2021@gmail.com",
          "telefono": "55-98764532"
      },
      "anioPrograma": null,
      "idSolicitudSeleccionada": null,
      "inicio": 1,
      "repFedSol": null,
      "cveRolCapturista": "PersonaMoral",
      "cveUsuarioCapturista": "AAL0409235E6",
      "puedeCapturarRepresentanteLegalCG": false,
      "modalidad": "Productor indirecto",
      "entidadFederativaDomicilios": "SIN",
      "representacionesFederales": state.RepresentacionFederal,
      "actividadProductivaProsec": state.ActividadProductiva,
      "mensajeActivado": null,
      "sectoresProsecConf": "XIXa",
      "seleccionar": "50",
      "fraccion": null,
      "plantas": state.prosecDatos,
      "sectores": state.selectedSectorDatos,
      "fraccionSeleccionada": state.producirDatos,
      "productorIndirecto": state.productorDatos
    }
  }
}
