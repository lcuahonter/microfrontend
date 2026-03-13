/* eslint-disable complexity */
/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */
import type { PlantaPayload, SectorPayload, SolicitantePayload} from '../models/prosec.module';
import { Injectable } from '@angular/core';
import { ProsecState } from '../estados/autorizacion-prosec.store';


@Injectable({
    providedIn: 'root'
})
export class GuardarMappingAdapter {
    /**
     * Convierte del estado de Akita al formato de payload de API usando las mismas claves
**/  
    static toFormPayload(state: ProsecState): unknown {
        return {
            "id_solicitud": state.idSolicitud,
            "tipo_solicitud": state.tipoSolicitud,
            "folio_programa": state.folioPrograma,
            "fecha_fin_vigencia": state.fechaFinVigencia,
            "id_programa_autorizado": state.idProgramaAutorizado || "409",
            "discriminator_value": state.discriminatorValue,
            "rfc_solicitante": state.rfcSolicitante,
            "anio_programa": state.anioPrograma,
            "id_solicitud_seleccionada": state.idSolicitudSeleccionada,
            "inicio": state.inicio,
            "rep_fed_sol": state.repFedSol,
            "discriminador": state.discriminador,
            "puede_capturar_representante_legal_cg": state.puedeCapturarRepresentanteLegalCg,
            "cve_rol_capturista": state.cveRolCapturista,
            "cve_usuario_capturista": state.cveUsuarioCapturista,
            "cve_usuario_solicitante": state.cveUsuarioSolicitante,
            "representaciones_federales": state.RepresentacionFederal,
            "actividad_productiva": state.ActividadProductiva,
            "solicitante": {
                "rfc": state.solicitante?.rfc || "AAL0409235E6",
                "razon_social": state.solicitante?.razonSocial || "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
                "descripcion_giro": state.solicitante?.descripcionGiro || "Siembra, cultivo y cosecha de otros cultivos",
                "correo_electronico": state.solicitante?.correoElectronico || "vucem3033@gmail.com",
                "telefono": state.solicitante?.telefono || "55-98764532",
                "domicilio": {
                    "pais_clave": state.solicitante?.domicilio?.pais_clave || "MEX",
                    "pais_nombre": state.solicitante?.domicilio?.pais_nombre || "ESTADOS UNIDOS MEXICANOS",
                    "entidad_federativa_clave": state.solicitante?.domicilio?.entidad_federativa_clave || "SIN",
                    "entidad_federativa_nombre": state.solicitante?.domicilio?.entidad_federativa_nombre || "SINOLA",
                    "delegacion_municipio_clave": state.solicitante?.domicilio?.delegacion_municipio_clave || "25001",
                    "delegacion_municipio_nombre": state.solicitante?.domicilio?.delegacion_municipio_nombre || "AHOME",
                    "colonia_clave": state.solicitante?.domicilio?.colonia_clave || "001812190001",
                    "colonia_nombre": state.solicitante?.domicilio?.colonia_nombre || "MIGUEL HIDALGO",
                    "localidad_clave": state.solicitante?.domicilio?.localidad_clave || "00181210008",
                    "localidad_nombre": state.solicitante?.domicilio?.localidad_nombre || "LOS MOCHIS",
                    "calle": state.solicitante?.domicilio?.calle || "CAMINO VIEJO",
                    "numero_exterior": state.solicitante?.domicilio?.numero_exterior || "1353",
                    "numero_interior": state.solicitante?.domicilio?.numero_interior || "",
                    "codigo_postal": state.solicitante?.domicilio?.codigo_postal || "81210"
                }
            },
            plantas: state.prosecDatos,
            sectores: (state.selectedSectorDatos && state.selectedSectorDatos.length > 0)
                ? state.selectedSectorDatos
                : state.sectorDatos,
            fraccionSeleccionada: state.producirDatos,
        }
    }
          }




   



  

