import { Catalogo, HistoricoColumnas, MercanciaTabla } from '../../models/validar-inicialmente-certificado.model';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Tramite110214State, Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HistoricoProductoresComponent } from '../../../../shared/components/historico-productores/historico-productores.component';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
@Component({
  selector: 'app-hist-productores',
  standalone: true,
  imports: [
    CommonModule,
    HistoricoProductoresComponent
  ],
  templateUrl: './hist-productores.component.html',
  styleUrl: './hist-productores.component.scss',
})
export class HistProductoresComponent implements OnInit, OnDestroy {

  /** Referencia al componente 'HistoricoProductoresComponent' en la plantilla.
   * Permite gestionar sus métodos y propiedades.
   */
  @ViewChild('HistoricoProductoresComponent', { static: false }) historicoProductoresComponent!: HistoricoProductoresComponent;

    /**
   * @input mercanciaDatos
   *
   * Arreglo de objetos de tipo `MercanciaTabla` que contiene los datos de mercancías
   * para ser utilizados en el componente. Este input permite pasar información desde
   * un componente padre.
   *
   * @type {Mercancia[]}
   * @default []
   */
  @Input() mercanciaDatos: Mercancia[] = [];


  /**
   * @property {Mercancia[]} mercanciaDatosSeleccionada
   *
   * @description
   * Arreglo que almacena los datos seleccionados de mercancías.
   *
   * @command
   * Utilizar este arreglo para gestionar la selección de mercancías en la tabla.
   */
  mercanciaDatosSeleccionada: Mercancia[] = [];
  
  /**
   * Estado actual del trámite.
   */
  public tramiteState!: { [key: string]: unknown };

  /**
   * Solicitud actual del trámite.
   */
  public solicitudState!: Tramite110214State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

   /**
   * @public
   * @property
   * @type { [key: string]: unknown}
   * @comando
   * Este objeto debe ser inicializado antes de su uso para evitar errores.
   */
  public agregarDatosProductor!: { [key: string]: unknown };

  /**
   * Lista de productores disponibles para el exportador.
   */
  public productoresExportador: HistoricoColumnas[] = [];

  // /**
  //  * @property {MercanciaTabla[]} mercancia - Arreglo que contiene información de las mercancías.
  //  * @command Este arreglo se utiliza para almacenar y gestionar los datos relacionados con las mercancías en el componente.
  //  */
  // public mercancia: MercanciaTabla[] = [];

  /**
   * @property {boolean} ocultarFax
   * Indica si el campo de fax debe estar oculto o visible en la interfaz de usuario.
    * @default true
  */
  public ocultarFax: boolean = false;

  /**
   * @property esTipoDeSeleccionado
   * @type {boolean}
   * @description Indica si el tipo seleccionado es válido o está activo.
   */
  public esTipoDeSeleccionado: boolean = true;

   /**
   * @property {Catalogo[]} optionsTipoFactura
   * @description Arreglo que contiene las opciones disponibles para el tipo de factura.
   * @command Este arreglo se utiliza para poblar un componente de selección en la interfaz de usuario.
   */
  public optionsTipoFactura: Catalogo[] = [];

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /** Observable que expone la lista de productores exportador agregados al store. */
  public agregarProductoresExportador$!: Observable<HistoricoColumnas[]>;

  /** Observable que expone la lista de mercancia al store. */
  public mercanciaProductores!: Mercancia[]; 

  /** Observable que expone la lista de mercanciaTabla al store. */
  public mercanciaDatos$!: Observable<Mercancia[]>;

  /** RFC del usuario actualmente autenticado utilizado para consultas y servicios. */
  private loginRFC = 'AAL0409235E6';

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite110214Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110214Query} tramiteQuery - Query para obtener el estado del trámite.
  */
  constructor(
    public store: Tramite110214Store,
    public tramiteQuery: Tramite110214Query,
    private certificadoDeService: ValidarInicialmenteCertificadoService,
    private consultaQuery: ConsultaioQuery
  ) {
    //
  }
  /**
  * Actualiza la lista de mercancías en el store con los datos recibidos del evento.
  * @param event Arreglo de objetos de tipo Mercancia a asignar.
  */
  setMercanciaDatosTabla(event: Mercancia[]): void {
      this.store.setmercanciaTabla(event);
  }
  /**
   * Hook de ciclo de vida de Angular que se ejecuta después de la construcción del componente.
   *
   * - Se suscribe a los observables relevantes para inicializar y mantener el estado del componente sincronizado con el store y las queries.
   * - Carga los datos iniciales de productores, mercancías y el estado de solo lectura.
   * - Configura las opciones para los tipos de factura y dispara la carga de datos si es necesario.
   * - Garantiza que todo el estado y los datos requeridos estén disponibles para el funcionamiento del componente.
   */
  ngOnInit(): void {
    this.agregarProductoresExportador$ = this.tramiteQuery.selectAgregarProductoresExportador$;
    this.mercanciaDatos$ = this.tramiteQuery.selectMercanciaTabla$;
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.productoresExportador = seccionState.productoresExportador || [];
          this.mercanciaProductores = seccionState.mercanciaProductores?.length ? seccionState.mercanciaProductores : seccionState.mercanciaTabla;
        })
      )
      .subscribe();
    
    this.tramiteQuery.formulario$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();

    this.tramiteQuery.datosProductorFormulario$.pipe(
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

    if (this.solicitudState.optionsTipoFactura.length === 0) {
      this.facturaOpcion();
    } else {
      this.optionsTipoFactura = this.solicitudState.optionsTipoFactura;
    }

    if (this.productoresExportador.length === 0) {
      this.cargarProductorPorExportador();
    }
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
   * 
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
  setValoresStoreAgregarForm(event: { formGroupName: string, campo: string, valor: string | number | boolean | null, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setAgregarFormDatosProductor({ [CAMPO]: VALOR });
  }

  /**
   * Carga la lista de productores disponibles para el exportador desde el servicio.
   */
  cargarProductorPorExportador(): void {
    this.certificadoDeService.obtenerProductorPorExportador(this.loginRFC)
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
              nuevo?: boolean;
            };
            return {
              id: index + 1,
              nombreProductor: PRODUCTOR.nombreCompleto ?? '',
              numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
              direccion: PRODUCTOR.direccionCompleta ?? '',
              correoElectronico: PRODUCTOR.correoElectronico ?? '',
              telefono: PRODUCTOR.telefono ?? '',
              fax: PRODUCTOR.fax ?? '',
              nuevo: true
            };
          });

          this.store.setProductoresExportador(RESULT);
        },
        error: () => {
          //
        },
    });
  }

  /**
 * Actualiza la lista de productores exportador en el store si el evento contiene datos.
 * @param event Arreglo de objetos HistoricoColumnas con los datos de los productores.
 */
  emitProductoresExportador(event: HistoricoColumnas[]) {
    if (event.length > 0) {
      this.store.setProductoresExportador([]);
      this.store.setProductoresExportador(event);
    }
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
    this.certificadoDeService.getTipoFactura()
      .pipe(
        takeUntil(this.destroyNotifier$),
      )
      .subscribe((data) => {
        this.optionsTipoFactura = data.datos as Catalogo[];
        this.store.setTipoFacturaOpciones(this.optionsTipoFactura);
      });
  }

  /** Actualiza el estado de validez del formulario según el valor recibido. */
  public formaValida(event: boolean): void {
    this.store.setFormValidity('histProductores', event);
  }

  /**
   * Valida el formulario del componente.
   * 
   * @returns {boolean} `true` si el formulario es válido, de lo contrario `false`.
   */
  public validarFormulario(): void {
    this.historicoProductoresComponent.validarFormulario();
  }

/**
 * Agrega un productor exportador al estado del store a partir del evento recibido.
 * Si el evento contiene los datos completos del productor, los utiliza; de lo contrario, asigna valores por defecto.
 * Si ya existen productores agregados, carga la mercancía relacionada.
 * @param event Objeto con los datos del productor exportador o con el número de registro fiscal.
 */
  public emitAgregarExportador(event: { [key: string]: unknown } | HistoricoColumnas): void {
    let DATOS: HistoricoColumnas | null = null;
    if (event && typeof event === 'object' && 'nombreProductor' in event) {
      DATOS = {
          id: (event as HistoricoColumnas).id ?? 0,
          nombreProductor: (event as HistoricoColumnas).nombreProductor ?? '',
          numeroRegistroFiscal: String((event as HistoricoColumnas).numeroRegistroFiscal ?? ''),
          direccion: String((event as HistoricoColumnas).direccion ?? ''),
          correoElectronico: String((event as HistoricoColumnas).correoElectronico ?? ''),
          telefono: String((event as HistoricoColumnas).telefono ?? ''),
          fax: String((event as HistoricoColumnas).fax ?? '')
      };
      this.store.setAgregarProductoresExportador([])
      this.store.setAgregarProductoresExportador([DATOS]);
    } else if (event && typeof event === 'object' && 'numeroRegistroFiscal' in event) {
      const PAYLOAD = {
          rfc_solicitante: String(event['numeroRegistroFiscal'] ?? ''),
      };
      this.certificadoDeService
      .agregarProductores(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: unknown) => {
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
          this.store.setAgregarProductoresExportador(RESULT);
        },
        error: () => {
          //
        }
      })
    }
  }

  /**
 * Actualiza la lista de mercancías en el store con los datos recibidos del evento.
 * @param event Arreglo de objetos de tipo Mercancia a asignar.
 */
  setMercanciaDatos(event: Mercancia[]): void {
    this.store.setMercanciaProductores(event);
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
