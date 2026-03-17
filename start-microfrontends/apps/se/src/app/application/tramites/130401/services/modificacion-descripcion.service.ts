import {
  HttpCoreService,
  JSONResponse,
  LoginQuery,
} from '@libs/shared/data-access-user/src';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import {
  Tramite130401State,
  Tramite130401Store,
} from '../../../estados/tramites/tramite130401.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130401 } from '../server/api-router';
import { RespuestaConsulta } from '../models/modificacion-descripcion.model';
import { Tramite130401Query } from '../../../estados/queries/tramite130401.query';

/**
 * Servicio para gestionar las operaciones relacionadas con la modificación de descripción.
 *
 * Este servicio proporciona métodos para obtener datos como partidas, arancelarias, solicitudes,
 * mercancías y tablas de mercancías, necesarios para el trámite 130401.
 */
@Injectable({
  providedIn: 'root',
})
export class ModificacionDescripcionService {

  /**
   * @property {Subject<void>} destroyed$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  // Valor de RFC de ejemplo
  private loginRfc: string = '';

  /**
   * Constructor del servicio.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los recursos.
   */
  constructor(
    private http: HttpClient,
    private httpService: HttpCoreService,
    private loginQuery: LoginQuery,
    private tramite130401Query: Tramite130401Query,
    private tramite130401Store: Tramite130401Store
  ) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /**
   * @property getAllState
   * @description
   * Obtiene todos los datos del estado almacenado en el store.
   *
   * @returns Observable<Solicitud130301State> Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130401State> {
    return this.tramite130401Query.selectSolicitud$;
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   *
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta-130401.json`.
   *
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(
      `assets/json/130401/consulta-130401.json`
    );
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param body - Objeto con los datos a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  guardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130401.GUARDAR, body);
  }

  // buscar(body: Record<string, unknown>): Observable<JSONResponse> {
  //   return this.httpService.post<JSONResponse>(PROC_130401.BUSCAR, { body: body });
  // }

  buscar(body: Record<string, unknown>): Observable<any> {
    const MOCK_RESPONSE = {
      datos: {
        numeroFolioResolucion: '1701C125000408',
        mercanciaResponseDto: {
          tipoSolicitudPexim: 'TISOL.M',
          regimen: 'Definitivos',
          clasificacionRegimen: 'De exportación',
          condicionMercancia: 'CONDMER.N',
          descripcion: 'Descripción de la mercancía',
          fraccionArancelaria:
            '71022101- En bruto o simplemente aserrados, exfoliados o desbastados.',
          unidadMedidaTarifaria: 'Gramo',
          unidadesAutorizadas: '1478552',
          importeFacturaAutorizadoUSD: '122587339',
        },
        partidasMercancia: [
          {
            idPartidaSol: 1,
            unidadesAutorizadas: '123456789012',
            descripcionAutorizada: 'Descripción de la mercancía',
            importeUnitarioUSDAutorizado: '82.91',
            importeTotalUSDAutorizado: '122,587,339',
          },
        ],
        modificationDescripcion: {
          cantidadLibreMercancia: '1478552',
          descripcion: 'Descripción de la mercancía',
          descripcionNuevaMercanciaPexim: '',
        },
        partidasModificationDescripcion: [
          {
            idPartidaSol: 1,
            unidadesAutorizadas: '1,478,552',
            descripcionAutorizada: 'Descripción de la mercancía',
            descripcionSolicitada: 'Descripción de la mercancía',
            importeUnitarioUSDAutorizado: '82.91',
            importeTotalUSDAutorizado: '122,587,339',
          },
        ],
        paises: 'DEU-ALEMANIA (REPUBLICA FEDERAL DE)',
        usoEspecifico:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
        justificacionImportacionExportacion:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
        observaciones:
          'accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
        representacionFederal: 'OFICINA CENTRAL',
      },
    };

    return of(MOCK_RESPONSE);
  }
}