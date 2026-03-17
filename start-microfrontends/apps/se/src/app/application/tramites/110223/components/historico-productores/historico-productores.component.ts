import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, map, takeUntil } from 'rxjs';
import { Tramite110223Store, TramiteState } from '../../estados/Tramite110223.store';
import { AsyncPipe } from '@angular/common';
import { CertificadosOrigenService } from '../../../110223/services/certificado-origen.service';
import { FormBuilder } from '@angular/forms';
import { HistoricoColumnas} from '../../../110223/models/certificado-origen.model';
import { HistoricoProductoresComponent } from '../../../../shared/components/historico-productores/historico-productores.component';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { MercanciaTabla } from '../../../../shared/models/certificado-origen.model';
import { Subject } from 'rxjs';
import { Tramite110223Query } from '../../query/tramite110223.query';

/**
 * Componente para gestionar el histórico de productores.
 * Este componente permite al usuario visualizar, seleccionar y gestionar productores relacionados
 * con el trámite. También incluye la funcionalidad para agregar nuevos productores y gestionar
 * datos confidenciales.
 */
@Component({
  selector: 'app-historico-productoress',
  standalone: true,
  imports: [HistoricoProductoresComponent, AsyncPipe],
  templateUrl: './historico-productores.component.html',
  styleUrls: ['./historico-productores.component.scss'],
})
export class HistoricoProductoressComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} ocultarFax
   * Indica si el campo de fax debe estar oculto o visible en la interfaz de usuario.
    * @default true
   */
  ocultarFax: boolean = true;

  /**
   * @property esTipoDeSeleccionado
   * @type {boolean}
   * @description Indica si el tipo seleccionado es válido o está activo.
   */
  esTipoDeSeleccionado: boolean = true;

  /**
   * @property {Catalogo[]} optionsTipoFactura
   * @description Arreglo que contiene las opciones disponibles para el tipo de factura.
   * @command Este arreglo se utiliza para poblar un componente de selección en la interfaz de usuario.
   */
  optionsTipoFactura: Catalogo[] = [];
  /**
   * Lista de productores disponibles para el exportador.
   */
  productoresExportador: HistoricoColumnas[] = [];
  /**
   * @property {MercanciaTabla[]} MercanciaTabla - Arreglo que contiene información de las mercancías.
   * @command Este arreglo se utiliza para almacenar y gestionar los datos relacionados con las mercancías en el componente.
   */
  mercancia: MercanciaTabla[] = [];
  
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente hijo de historico-productores para acceder a sus métodos públicos.
   */
  @ViewChild(HistoricoProductoresComponent) historicoProductoresComponent!: HistoricoProductoresComponent;

  /**
   * Estado actual del trámite.
   */
  public tramiteState!: { [key: string]: unknown };
  /**
   * @public
   * @property
   * @type { [key: string]: unknown}
   * @comando
   * Este objeto debe ser inicializado antes de su uso para evitar errores.
   */
  public agregarDatosProductor!: { [key: string]: unknown };
  /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;

  /**
   * Solicitud actual del trámite.
   */
  public solicitudState!: TramiteState;

  /** Indica si el formulario es válido. */
  public isFormValid: boolean = false;

    /** Observable que expone la lista de productores exportador agregados al store. */
  public agregarProductoresExportador$!: Observable<HistoricoColumnas[]>;

  /** Observable que expone los datos de mercancías desde el store. */
  public mercanciaDatos$!: Observable<Mercancia[]>;

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {ValidarInicialmenteCertificadoService} ValidarInicialmenteCertificadoService - Servicio para obtener datos relacionados con los productores.
   * @param {Tramite110221Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110221Query} tramiteQuery - Query para obtener el estado del trámite.
  */
  constructor(
    public fb: FormBuilder,
    private certificadoDeService: CertificadosOrigenService,
    public store: Tramite110223Store,
    public tramiteQuery: Tramite110223Query,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Carga los datos iniciales, configura los formularios y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.agregarProductoresExportador$ = this.tramiteQuery.selectAgregarProductoresExportador$;
    this.mercanciaDatos$ = this.tramiteQuery.selectmercanciaTabla$;
    this.tramiteQuery.selectPexim$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.cargarProductorPorExportador();
    this.cargarMercancia();
    if (this.solicitudState.optionsTipoFactura.length === 0) {
      this.facturaOpcion();
    } else {
      this.optionsTipoFactura = this.solicitudState.optionsTipoFactura;
    }
    this.tramiteQuery.formulario$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.tramiteQuery.agregarDatosProductorFormulario$.pipe(
      takeUntil(this.destroyNotifier$), map((seccionState) => {
        this.agregarDatosProductor = seccionState;
      })
    ).subscribe();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Carga la lista de productores disponibles para el exportador desde el servicio.
   */
  cargarProductorPorExportador(): void {
    this.certificadoDeService
      .obtenerProductorPorExportador('AAL0409235E6')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          const DATOS = (response as { datos: unknown[] }).datos;
          const RESULT: HistoricoColumnas[] = DATOS.map((item, index) => {
            const PRODUCTOR = item as {
              nombreCompleto?: string;
              rfc?: string;
              direccionCompleta?: string;
              correoElectronico?: string;
              telefono?: string;
              fax?: string;
            };
            return {
              id: index + 1,
              nombreProductor: PRODUCTOR.nombreCompleto ?? '',
              numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
              direccion: PRODUCTOR.direccionCompleta ?? '',
              correoElectronico: PRODUCTOR.correoElectronico ?? '',
              telefono: PRODUCTOR.telefono ?? '',
              fax: PRODUCTOR.fax ?? '',
            };
          });
          this.productoresExportador = RESULT;
          this.store.setProductoresExportador(RESULT);
        }
      });
  }
  
  /**
   * Actualiza la lista de productores exportador después de eliminar elementos seleccionados.
   * @param event Arreglo actualizado de productores exportador después de la eliminación.
   */
  eliminarEventoExportador(event: HistoricoColumnas[]): void {
    this.store.updateAgregarProductoresExportador(event);
  }

  /**
   * @descripcion
   * Obtiene la lista de países disponibles.
   */
  facturaOpcion(): void {
    this.certificadoDeService
      .getTipoFactura()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.optionsTipoFactura = data.datos as Catalogo[];
        this.store.setTipoFacturaOpciones(this.optionsTipoFactura);
      });
  }

  /**
  * Actualiza la lista de mercancías en el store con los datos recibidos del evento.
  * @param event Arreglo de objetos de tipo Mercancia a asignar.
  */
  setMercanciaDatos(event: Mercancia[]): void {
      this.store.setmercanciaTabla(event);
  }

  /**
   * Carga la lista de productores disponibles para el exportador desde el servicio.
   */
  cargarMercancia(): void {
 this.certificadoDeService.obtenerMercancias().pipe(takeUntil(this.destroyNotifier$)).subscribe(respuesta => {
      this.mercancia = respuesta.datos;
    });
  }

  /**
   * Establece valores en el estado del store para un formulario histórico.
   * 
   * @param event - Objeto que contiene los datos necesarios para actualizar el store.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en este método).
   * @param event.campo - Nombre del campo que se actualizará en el store.
   * @param event.valor - Valor que se asignará al campo en el store.
   * @param event.storeStateName - Nombre del estado del store (no utilizado en este método).
   * 
   * @returns void
   */
  setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormHistorico({ [CAMPO]: VALOR });
  }

  /**
   * Establece valores en el store para agregar datos del formulario del productor.
   * @param event - Objeto que contiene los datos necesarios para actualizar el store.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en este método).
   * @param event.campo - Nombre del campo que se actualizará en el store.
   * @param event.valor - Valor que se asignará al campo en el store.
   * @param event.storeStateName - Nombre del estado del store (no utilizado en este método).
   *
   * @returns void
   *
   * @command Actualiza el estado del store con los valores proporcionados.
   */
  setValoresStoreAgregarForm(event: {
    formGroupName: string;
    campo: string;
    valor: string | number | boolean | null;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setAgregarFormDatosProductor({ [CAMPO]: VALOR });
  }

  /**
   * Emite un evento para agregar un nuevo productor exportador.
   * 
   * @param event - Objeto que contiene los datos del productor a agregar.
   *                Puede ser un objeto con las propiedades del productor o un objeto con el número de registro fiscal.
   */
  public emitAgregarExportador(
    event: { [key: string]: unknown } | HistoricoColumnas
  ): void {
    let DATOS: HistoricoColumnas | null = null;
    if (event && typeof event === 'object' && 'nombreProductor' in event) {
      DATOS = {
        id: (event as HistoricoColumnas).id ?? 0,
        nombreProductor: (event as HistoricoColumnas).nombreProductor ?? '',
        numeroRegistroFiscal: String(
          (event as HistoricoColumnas).numeroRegistroFiscal ?? ''
        ),
        direccion: String((event as HistoricoColumnas).direccion ?? ''),
        correoElectronico: String(
          (event as HistoricoColumnas).correoElectronico ?? ''
        ),
        telefono: String((event as HistoricoColumnas).telefono ?? ''),
        fax: String((event as HistoricoColumnas).fax ?? ''),
      };
      this.store.setAgregarProductoresExportador([DATOS]);
    } else if (
      event &&
      typeof event === 'object' &&
      'numeroRegistroFiscal' in event
    ) {
      const PAYLOAD = {
        rfc_solicitante: String(event['numeroRegistroFiscal'] ?? ''),
      };
      this.certificadoDeService
        .obtenerProductorNuevo(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (response: unknown) => {
            
            if (!response || typeof response !== 'object') {
              return;
            }
            const RESPONSE_OBJ = response as { datos?: unknown[] };
            const DATOS = RESPONSE_OBJ.datos;
            
            if (!DATOS || !Array.isArray(DATOS)) {
              this.store.setAgregarProductoresExportador([]);
              return;
            }
            
            const RESULT: HistoricoColumnas[] = DATOS.map((item, index) => {
              const PRODUCTOR = item as {
                nombreCompleto?: string;
                rfc?: string;
                direccionCompleta?: string;
                correoElectronico?: string;
                telefono?: string;
                fax?: string;
              };
              return {
                id: index + 1,
                nombreProductor: PRODUCTOR.nombreCompleto ?? '',
                numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
                direccion: PRODUCTOR.direccionCompleta ?? '',
                correoElectronico: PRODUCTOR.correoElectronico ?? '',
                telefono: PRODUCTOR.telefono ?? '',
                fax: PRODUCTOR.fax ?? '',
              };
            });
            this.store.setAgregarProductoresExportador(RESULT);
          },
          error: () => {
            this.store.setAgregarProductoresExportador([]);
          },
        });
    }
  }

  /** Actualiza el estado de validez del formulario según el valor recibido. */
  public formaValida(event: boolean): void {
    this.isFormValid = event;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}