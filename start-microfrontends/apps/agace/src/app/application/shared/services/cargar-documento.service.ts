import { API_POST_CARGAR_DOCUMENTOS, API_POST_DOCUMENTO_REFERENCIA_SOLICITUD } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { DocumentoProcesadoResponse, UploadDocumentResponse, Usuario } from '@libs/shared/data-access-user/src/core/models/shared/cargar-documentos.model';
import { DocumentosParaCargar } from '@libs/shared/data-access-user/src/core/models/shared/anexar-documentos.model';
import { Solicitud32501State, Solicitud32501Store } from '../../../application/tramites/32501/estados/solicitud32501.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { Solicitud32501Query } from '../../../application/tramites/32501/estados/solicitud32501.query';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

export interface FileTipoDocumento {
  nombreDocumento: string;
  idTipoDocumento: number | string;
  tamanioMaximo: number;
  file: FileDetail;
}
interface FileDetail {
  fileName: string;
  contentType: string;
  archivo: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})

/**
   * Constructor del servicio.
   * @param http Cliente HTTP inyectado para realizar peticiones.
   */

export class CargarDocumentoService {

   /**
     * @description Host de la API.
     * @type {string}
     */
    private readonly host: string;

    constructor(private http: HttpClient, 
      private solicitud32501Query: Solicitud32501Query
    ) {
      this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

  /**
 * Subject para controlar la destrucción de subscripciones (takeUntil).
 */
  private destroyed$ = new Subject<void>();

/**
 * Carga múltiples documentos al servidor utilizando una petición HTTP POST.
 *
 * @param archivosCargando - Arreglo de objetos que contienen la información y los archivos a cargar.
 * Cada objeto debe incluir el archivo, su identificador, y el tamaño máximo permitido.
 * 
 * @returns Un observable con la respuesta de la petición HTTP.
 *
 * @remarks
 * Esta función construye un objeto FormData que incluye los archivos y la información adicional requerida
 * para la carga de documentos. El cuerpo de la petición incluye datos del usuario, información de la firma electrónica
 * y los metadatos de los documentos a cargar.
 */
public cargarDocumentos(archivosCargando: DocumentosParaCargar[], datosUsuario: Usuario): Observable<UploadDocumentResponse> {

    const ENDPOINT = `${this.host}${API_POST_CARGAR_DOCUMENTOS}`;
    const FORMDATA = new FormData();
    const FILEINFO: FileTipoDocumento[] = [];
    var idSolicitud: number = 0;

   
    this.solicitud32501Query.seleccionarSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((respuestaState: Solicitud32501State) => {
            idSolicitud = respuestaState.idSolicitud;           
          })
        )
        .subscribe();

       
    const BODY = {
            "documentos": FILEINFO,
            "persona": {
            "claveUsuario": 'AAL0409235E6',
            "rfc": 'AAL0409235E6',
            "nombre": 'JUAN',
            "apellidoPaterno": 'PEREZ',
            "apellidoMaterno": 'SOOOS'
            },
            "firmaElectronica": {
            "cadenaOriginal": 'dummy',
            "certificado": 'dummy',
            "firma": 'dummy'
            },
            "rolActual": 'PersonaMoral',
            "rfcSolicitante": 'AAL0409235E6',
            "idSolicitud": idSolicitud,
            "referenciaSolicitud": ''
          };

  
    for (const ARCHIVO of archivosCargando) {
      FILEINFO.push({
        nombreDocumento: ARCHIVO?.archivo?.name || '',
        idTipoDocumento: ARCHIVO.id,
        tamanioMaximo: ARCHIVO.tamanioMaximo || 0,
        file: {
          fileName: ARCHIVO?.archivo?.name || '',
          contentType: ARCHIVO?.archivo?.type || '',
          archivo: '',
          size: ARCHIVO?.archivo?.size || 0
        }
      });
      if (ARCHIVO?.archivo) {
        FORMDATA.append("files", ARCHIVO.archivo, ARCHIVO.archivo.name);
      }
    }

    FORMDATA.append("body", new Blob([JSON.stringify(BODY)], { type: "application/json" }));

    const respuestaCargaDoc: Observable<UploadDocumentResponse> = this.http.post<UploadDocumentResponse>(ENDPOINT, FORMDATA);

    return respuestaCargaDoc;
  }

 public documentosreferenciaSolicitud(referenciaSolicitud: string | undefined): Observable<DocumentoProcesadoResponse> {
   const REFERENCIA = referenciaSolicitud ?? '';
   const ENDPOINT = `${this.host}${API_POST_DOCUMENTO_REFERENCIA_SOLICITUD(REFERENCIA)}`;
   return this.http.post<DocumentoProcesadoResponse>(ENDPOINT, REFERENCIA);
 }
}
