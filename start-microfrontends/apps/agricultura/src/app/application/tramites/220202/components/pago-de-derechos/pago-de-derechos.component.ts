import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  Notificacion,
  formatearFechaDdMmYyyy,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CatalogosService } from '../../services/220202/catalogos/catalogos.service';
import { ConsultaSolicitudService } from '../../services/220202/consulta-solicitud/consulta-solicitud.service';
import { ConsultarPagoDerechosResponse } from '../../models/220202/response/consultar-pago-derechos-response.model';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { HttpClient } from '@angular/common/http';
import { PagoDeDerecho } from '../../../../shared/models/tercerosrelacionados.model';
import { PagoDeDerechoComponent } from '../../../../shared/components/pago-de-derecho/pago-de-derecho.component';
import { PagoDeDerechos } from '../../models/220202/fitosanitario.model';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Componente para el formulario de pago de derechos.
 * Este componente maneja la lógica y la presentación del formulario de pago de derechos,
 * incluyendo la gestión de los campos del formulario y la obtención de las listas de opciones.
 * @class PagoDeDerechosComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-pago-de-derechos',
  templateUrl: './pago-de-derechos.component.html',
  styleUrls: ['./pago-de-derechos.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, PagoDeDerechoComponent],
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {
  /**
   * Datos del pago de derechos.
   * @type {PagoDeDerechos}
   */
  pagoData: PagoDeDerechos = {} as PagoDeDerechos;

    /**
     * Referencia al componente hijo de pago de derechos.
     * Permite acceder a los métodos y propiedades del componente PagoDeDerechoComponent.
     * 
     * @public
     * @type {PagoDeDerechoComponent}
     * @memberof PagoDeDerechosComponent
     */
    @ViewChild('pagoDerechosRef') pagoDerechos!: PagoDeDerechoComponent;
  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @remarks
   * Cuando esta propiedad es `true`, los campos del formulario no serán editables por el usuario.
   *
   * @compodoc
   * @description
   * Determina si el formulario se presenta únicamente para consulta, deshabilitando la edición de los campos.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Objeto que contiene la información relacionada con el pago de derechos.
   * Este objeto se utiliza para inicializar el formulario y manejar los datos del pago.
   */
  public pagoSelect: PagoDeDerecho = {
    bancoSelector: [],
    justificacionSelector: [],
  };

  /**
 * Representa una nueva notificación que será utilizada en el componente.
 * @type {Notificacion}
 */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {ConsultaioState[]} consultaState
   * @description Consulta solicitud.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * booleano para ocultar el formulario
   * @property {boolean} ocultarForm
   */
  @Input() ocultarForm: boolean = false;

  /**
* @description Referencia al componente PagoDeDerechoComponent.
* Esta referencia permite acceder a los métodos y propiedades del componente PagoDeDerechoComponent,
* @type {PagoDeDerechoComponent}
* @viewChild PagoDeDerechosComponent
*/
  @ViewChild(PagoDeDerechoComponent) pagoDeDerechoComponentRef!: PagoDeDerechoComponent;

  /**
   * Constructor del componente. Inyecta los servicios y realiza una carga inicial de catálogos.
   * @param consultaioQuery
   * @param cdr
   * @param catalogosService
   * @param httpServicios Cliente HTTP para peticiones.
   * @param agriculturaApiService Servicio para actualizar datos de pago.
   * @param fitosanitarioQuery Fuente de datos del estado actual de certificado.
   * @param consultaSolicitudService Servicio que consulta los dats de la solicitud
   */
  constructor(
    private readonly agriculturaApiService: AgriculturaApiService,
    private readonly fitosanitarioQuery: FitosanitarioQuery,
    private readonly consultaioQuery: ConsultaioQuery,
    private readonly cdr: ChangeDetectorRef,
    public catalogosService: CatalogosService,
    private readonly httpServicios: HttpClient,
    private consultaSolicitudService: ConsultaSolicitudService
  ) {
  }
  

  /**
   * Ciclo de vida de Angular que se ejecuta al iniciar el componente.
   * Suscribe al estado del formulario para rellenar datos y verificar validez.
   */
  ngOnInit(): void {
    this.fitosanitarioQuery.seleccionarPagoDerechos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosDeLaSolicitud) => {
        if (datosDeLaSolicitud) {
          this.pagoData = datosDeLaSolicitud;
        }
      });
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    const CARGACATALOGOS = async () => {
      await this.obtenerBancoSelectorList();
      await this.obtenerListaDeJustificaciones();
    }
    CARGACATALOGOS().then(() => {
      if (this.ocultarForm) {
        this.obtenerDataPagoDerechos();
      }
    })
  }

  /**
   * Obtiene los datos de una solicitud mediante un folio especifico y procesa la respuesta
   * para llenar un formulario y realiza diversas acciones basadas en los datos recibidos.
   * @method obtenerDataMovilizacion
   * @returns {void}
   */
  obtenerDataPagoDerechos(): void {
    const FOLIO = this.consultaState.folioTramite;
    this.consultaSolicitudService.getDetallePagoDerechos(Number(this.consultaState.procedureId), FOLIO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(async (response) => {
        if (response?.codigo === '00' && response?.datos) {
          await this.obtenerBancoSelectorList();
          await this.obtenerListaDeJustificaciones();
          this.llenarFormularioDesdeRespuesta(response.datos);
        }
      })
  }

  /**
 * Llena el formulario con los datos de la respuesta recibida.
 * @param datos Respuesta de la consulta.
 * @returns {void}
 */
  llenarFormularioDesdeRespuesta(datos: ConsultarPagoDerechosResponse): void {
    const GUARDAR_VALORES: PagoDeDerechos = {
      exentoPago: datos.exento_pago ? 'si' : 'no',
      justificacion: datos.ide_motivo_exento_pago,
      claveReferencia: datos.cve_referencia_bancaria,
      cadenaDependencia: datos.cadena_pago_dependencia,
      banco: datos.cve_banco,
      llavePago: datos.llave_pago,
      importePago: datos.imp_pago.toString(),
      fechaPago: formatearFechaDdMmYyyy(datos.fec_pago),
    };
    (
      this.agriculturaApiService.updatePago as (
        value: PagoDeDerechos
      ) => void
    )(GUARDAR_VALORES);
    this.pagoData = GUARDAR_VALORES;
  }

    /**
   * Realiza una petición para obtener el catálogo de bancos.
   */
  obtenerBancoSelectorList(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoBanco(220202)
        .pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe(
        (data): void => {
           this.pagoSelect.bancoSelector = data.datos ?? [];
           resolve();
        }
      );
    })
  }

  /**
   * Realiza una petición para obtener el catálogo de justificaciones.
   */
  obtenerListaDeJustificaciones(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogosService.obtieneCatalogoJustificacion(220202)
        .pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe(
        (data): void => {
           this.pagoSelect.justificacionSelector = data.datos ?? [];
           resolve();
        }
      );
    })
  }


  /**
   * Envía los valores actuales del formulario al store compartido.
   */
  onPagoChanged(event: PagoDeDerechos): void {
    this.agriculturaApiService.updatePagoDeDerechos(event as PagoDeDerechos);
  }

  /**
  * @description Valida todos los campos del formulario y marca los campos como touched
  * para mostrar los errores de validación en los componentes app-catalogo-select
  * @method validarFormulario
  * @returns { valido: boolean; mensaje?: string } true si el formulario es válido, false en caso contrario
  */
  public validarFormulario(): { valido: boolean; mensaje?: string } {
    // Marcar todos los campos como touched
    if (!this.pagoDeDerechoComponentRef.validarFormulario()) {
      return { valido: false };
    }
    return { valido: true };
  }

  /**
   * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
