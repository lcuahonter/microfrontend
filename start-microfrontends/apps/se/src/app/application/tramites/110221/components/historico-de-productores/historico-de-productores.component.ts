import { Catalogo, HistoricoColumnas, MercanciaTabla } from '../../models/peru-certificado.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Tramite110221State, Tramite110221Store } from '../../estados/tramite110221.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { Tramite110221Query } from '../../estados/tramite110221.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { Mercancia } from '../../../../shared/models/modificacion.enum';

@Component({
  selector: 'app-historico-de-productores',
  templateUrl: './historico-de-productores.component.html',
  styleUrl: './historico-de-productores.component.scss',
})

export class HistoricoDeProductoresComponent implements OnInit, OnDestroy {

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
   * @property {MercanciaTabla[]} mercancia - Arreglo que contiene información de las mercancías.
   * @command Este arreglo se utiliza para almacenar y gestionar los datos relacionados con las mercancías en el componente.
   */
  mercancia: MercanciaTabla[] = [];

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

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
  public solicitudState!: Tramite110221State;

    
  /** Observable que expone la lista de mercancia al store. */
  public mercanciaProductores!: Mercancia[];
    /** Observable que expone la lista de productores agregados por el exportador en el estado del trámite. */
  public agregarProductoresExportador$!: Observable<HistoricoColumnas[]>;
 
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
    private certificadoDeService: ValidarInicialmenteCertificadoService,
    public store: Tramite110221Store,
    public tramiteQuery: Tramite110221Query,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Carga los datos iniciales, configura los formularios y suscribe al estado del trámite.
   */
  ngOnInit(): void {
      this.agregarProductoresExportador$ = this.tramiteQuery.selectAgregarProductoresExportador$;
      this.tramiteQuery.selectTramite$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
            this.productoresExportador = seccionState.productoresExportador || [];
            this.mercanciaProductores = seccionState.mercanciaTabla;
          })
        )
        .subscribe();
      this.tramiteQuery.selectTramite$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe();
  
      this.cargarProductorPorExportador();
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
  
      this.tramiteQuery.agregarDatosProductorFormulario$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.agregarDatosProductor = seccionState;
          })
        )
        .subscribe();
  
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
      .obtenerProductorPorExportador()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.productoresExportador = respuesta.datos;
      });
  }
  /**
   * @descripcion
   * Obtiene la lista de países disponibles.
   */
  facturaOpcion(): void {
    this.certificadoDeService.getTipoFacturaOpciones()
      .pipe(
        takeUntil(this.destroyNotifier$),
      )
      .subscribe((data) => {
        this.optionsTipoFactura = data.datos as Catalogo[];
        this.store.setTipoFacturaOpciones(this.optionsTipoFactura);
      });
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
   * Obtiene los datos disponibles de productores y los actualiza en el store.
   */
conseguirDisponiblesDatos(): void {

    const SELECTED_RFC = this.agregarDatosProductor['numeroRegistroFiscal'];
    const PAYLOAD = {
      rfc_solicitante: SELECTED_RFC,
    };
    this.certificadoDeService
      .obtenerProductoruNevo(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: any) => {
          const MAPPED_DATA: HistoricoColumnas[] = (response?.datos ?? []).map(
            (item: any) => ({
              id: item.id,
              nombreProductor: item.nombreCompleto,
              numeroRegistroFiscal: item.rfc,
              direccion: item.direccionCompleta,
              correoElectronico: item.correoElectronico,
              telefono: item.telefono,
              fax: item.fax,
            })
          );
         
          this.store.setProductores(MAPPED_DATA);
        },
        
      });

  }
  /**
   * Emite un evento para agregar un nuevo exportador y actualizar la lista de productores en el store.
   *
   * @param event - Objeto que contiene los datos del exportador a agregar.
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
       this.store.setAgregarProductoresExportador(DATOS);
     } else if (event && typeof event === 'object' && 'numeroRegistroFiscal' in event) {
       const PAYLOAD = {
         rfc_solicitante: String(event['numeroRegistroFiscal'] ?? ''),
       };
       this.certificadoDeService
         .obtenerProductoruNevo(PAYLOAD)
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
             RESULT.forEach(productor => {
               this.store.setAgregarProductoresExportador(productor);
             });
           },
           error: () => {
             //
           }
         })
     }
   }
 
   /** Actualiza el estado de validez del formulario según el valor recibido. */
   public formaValida(event: boolean): void {
     this.store.setFormValidity('histProductores', event);
   }
  /**
 * Actualiza la lista de mercancías en el store con los datos recibidos del evento.
 * @param event Arreglo de objetos de tipo Mercancia a asignar.
 */
  setMercanciaDatos(event: Mercancia[]): void {
     this.store.setmercanciaTabla(event);
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
   * Método que se ejecuta al destruir el componente.
   * 
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
