
import { BUSCAR_OBTENER_DATOS, COMUN_URL, GUARDAR_SOLICITUD } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { Observable,combineLatest, map,} from 'rxjs';
import { Tramite120404State, Tramite120404Store } from '../estados/store/tramite120404.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite120404Query } from '../estados/queries/tramite120404.query';
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  /**
   * Host base para las solicitudes HTTP.
   */
  host!: string;
/**
   * @constructor
   * @description
   * Constructor que inyecta `HttpClient` para realizar solicitudes HTTP y `Tramite120404Store`
   * para gestionar el estado del trámite.
   *
   * @param {HttpClient} http - Servicio HTTP para la obtención de datos.
   * @param {Tramite120404Store} tramite120404Store - Tienda Akita para la gestión del estado.
   */
  constructor(private http:HttpClient,private tramite120404Store: Tramite120404Store ,
    private tramite120404Query: Tramite120404Query
  ) { 
    this.host = `${COMUN_URL.BASE_URL}`;
  }
 
  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param {Tramite120404State} DATOS - Datos del trámite que se van a establecer en el estado.
   */
  actualizarEstadoFormulario(DATOS:Tramite120404State): void {
    this.tramite120404Store.establecerDatos(DATOS);
  }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns {Observable<Tramite120404State>} - Un observable que emite el estado del trámite.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite120404State> {
    return this.http.get<Tramite120404State>('assets/json/120404/asignciondirecta.json');
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * @param payload - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @param idTipoTramite - Identificador del tipo de trámite para construir la URL de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(tramite: string,payload: Record<string, unknown>): Observable<JSONResponse> {
    const ENDPOINT = `${this.host}${GUARDAR_SOLICITUD(tramite)}`;
    return this.http.post<JSONResponse>(ENDPOINT, payload).pipe(
      map((response) => response)
    );
  }

  /**
   * Obtiene los datos de búsqueda para una solicitud específica según el trámite proporcionado.
   * @param tramite 
   * @param payload 
   * @returns 
   */
  obtenerBuscarDatos(tramite: string, payload: Record<string, unknown>): Observable<JSONResponse> {
    const ENDPOINT = `${this.host}${BUSCAR_OBTENER_DATOS(tramite)}`;
    return this.http.post<JSONResponse>(ENDPOINT,payload).pipe(
      map((response) => response)
    );
  }
  /**
   * @description
   * Utility function to merge multiple state objects.
   * Removes duplicate keys and retains only meaningful values.
   * @param {...Record<string, any>} states - List of state objects to merge.
   * @returns {Record<string, unknown>} Merged state object.
   */
  private static mergeStates(...states: Record<string, unknown>[]): Record<string, unknown> {
    const RESULT: Record<string, unknown> = {};

    for (const STATE of states) {
      for (const [KEY, VALUE] of Object.entries(STATE)) {
        const EXISTING = RESULT[KEY];

        const IS_MEANINGFUL = VALUE !== null && VALUE !== undefined &&
          !(typeof VALUE === 'string' && VALUE.trim() === '') &&
          !(Array.isArray(VALUE) && VALUE.length === 0);

        if (!EXISTING || IS_MEANINGFUL) {
          RESULT[KEY] = VALUE;
        }
      }
    }
    return RESULT;
  }

   /**
    * @description
    * Obtiene el estado completo combinando múltiples fuentes de estado.
    * @returns {Observable<Record<string, unknown>>} Observable que emite el estado combinado.
    */
     getAllState(): Observable<Record<string, unknown>> {
       return combineLatest([
         this.tramite120404Query.allStoreData$,
       ]).pipe(
         map(([tramite120404Query,]) =>
           SolicitudService.mergeStates(
              tramite120404Query as unknown as Record<string, unknown>,
           )
         )
       );
     }

     /**
      * Construye el payload para la búsqueda basada en los datos proporcionados.
      * @param data 
      * @returns 
      */
   buscarPayload(data: Record<string, unknown>): Record<string, unknown> 
  {
    return {
    "solicitud": {
    "solicitante": {
      "cveUsuario": "AAL0409235E6",
      "rfc": "AAL0409235E6",
      "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
      "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
      "correoElectronico": "vucem2021@gmail.com",
      "telefono": "55-98764532",
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
        "colonia": {
          "clave": "00181210001",
          "nombre": "MIGUEL HIDALGO"
        },
        "localidad": {
          "clave": "00181210008",
          "nombre": "LOS MOCHIS"
        },
        "codigoPostal": "81210",
        "calle": "CAMINO VIEJO",
        "numeroExterior": "1353",
        "numeroInterior": ""
      }
    },
    "cveRolCapturista": "PersonaMoral",
    "cveUsuarioCapturista": "AAL0409235E6",
    "asignacion": {
      "tipoAsignacionDirecta": "TIASD.AV"
    },
    "asignacionBusqueda": {
      "anoAutorizacion": "2023",
      "numFolioAsignacion": "8817"
    },
    "operacion": "ampliacion",
    "idSolicitud": "",
    "tramite": {
      "numFolioTramite": data['numTramite'] || "",
    }
  },
  "puedeCapturarRepresentanteLegalCG": false,
  "obtenerDatosAsignacion": "Buscar"
    };
}


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

  