import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AmpliacionServiciosAdapter {


 /**
   * Construye el payload para la solicitud basada en los datos proporcionados y un valor discriminador.
   * @param data 
   * @param discriminatorValue 
   * @returns 
   */
  buildPayload(data: Record<string, unknown>): Record<string, unknown> {
   return {
       "id_solcitud": 0,
    "cve_regimen": "01",
    "tipoDeSolicitud": "guardar",
    "cve_clasificacion_regimen": "01",
    "certificado_serial_number": "8393",
    "cve_unidad_administrativa": "0203",
    "numero_folio_tramite_original":"3838",
    "solicitante": {
        "nombre": "Empresa Ejemplo S.A. de C.V.",
        "rfc": "AAL0409235E6",
        "personaMoral": true,
       "domicilio": {
        "pais": {
          "clave": "MEX",
          "nombre": "ESTADOS UNIDOS MEXICANOS"
        },
        "entidadFederativa": {
          "clave": "SIN",
          "nombre": "SINALOA"
        },
        "delegacionMunicipio": {
          "clave": "25001",
          "nombre": "AHOME"
        },
        "codigoPostal": "81210",
        "calle": "CAMINO VIEJO",
        "numeroExterior": "1353",
        "numeroInterior": ""
      },
        "telefono": "5512345678",
        "correoElectronico": "contacto@ejemplo.com"
    },
    "solicitud": {
        "solicitante": {
            "nombre": "Empresa Ejemplo S.A. de C.V.",
            "rfc": "EJE900101ABC",
            "personaMoral": true,
            "domicilio": {
                "calle": "Av. Reforma",
                "numeroExterior": "123",
                "colonia": "Juárez",
                "codigoPostal": "06600",
                "entidadFederativa": {
                    "cveEntidad": "AGS",
                    "nombre": "Ciudad de México"
                }
            },
            "telefono": "5512345678",
            "correoElectronico": "contacto@ejemplo.com"
        },
        "domicilio": {
            "calle": "Av. Reforma",
            "numeroExterior": "123",
            "colonia": "Juárez",
            "codigoPostal": "06600",
            "entidadFederativa": {
                "cveEntidad": "CMX",
                "nombre": "Ciudad de México"
            }
        },
             "asignacionBusqueda": {
      "añoAutorizacion": data['asignacionsolitud'] || "",
      "numFolioAsignacion": data['numTramite'] || "",
    },
    "mecanismoAsignacion": {
      "idMecanismoAsignacion": 10834,
      "ideTipoMecAsignacion": "TIMA.AD"
    },
    "unidadAdministrativaRepresentacionFederal": {
      "clave": "2540"
    },
    
        "recif": "RECIF-2025-001",
        "numeroOficioDeAsignacion": "OFI/2025/001",
        "operacion": "busqueda",
        "descripcionMercancia": "Maíz amarillo para consumo humano",
        "entidadFederativa": {
            "entidadSolicitud": 101,
            "cveEntidad": "AGS",
            "tipoEntidad": "FEDERAL",
            "cveDelegMun": "015",
            "nombreEntidad": "Ciudad de México"
        },
            "asignacion": {
            "idMecanismoAsignacion": 5001,
            "cantidadSolicitada": 50000,
            "cantidadAprobada": 45000,
            "asignacionActiva": true,
            "aprobada": true,
            "fechaInicioVigencia": data['especie'] || "2025-01-01",
            "fechaFinVigenciaSolicitada": data['funcionZootecnica'] || "2025-12-31",
            "fechaFinVigenciaAprobada": "2025-11-30",
            "ideTipoAsignacionDirecta": null,
            "numFolioAsignacion": 123,
            "fechaAutorizacion": "2025-02-20",
            "montoDisponible": data['disponible'] || 0,
            "montoExpedido": data['expendido'] || 0,
             "asignacionOrigen": {

        "sumaAprobada": 1,

        "montoExpedido": 0,

        "montoDisponible": 1,

        "idAsignacion": 72746,

        "mecanismoAsignacion": {

          "cupo": {

            "unidadMedidaOficialCupo": {

              "descripcion": "Pieza"

            }

          }

        }

        }

            }
    }
         };
  }
 
}