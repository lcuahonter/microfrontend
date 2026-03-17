/**
 * @fileoverview Archivo principal del componente DatosDelSolicitanteComponent
 * @description Componente Angular que maneja la captura y validación de datos del solicitante
 * para el trámite 300105 de autorización de rayos X
 * @author VUCEM Development Team
 * @version 1.0.0
 * @since 2024
 */

// Importaciones de Angular Core para funcionalidad básica del componente
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';

// Importaciones de servicios y utilidades compartidas del módulo de acceso a datos
import { ConsultaioQuery, REG_X } from '@ng-mf/data-access-user';

// Importaciones de Angular Forms para manejo de formularios reactivos
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Importaciones de RxJS para programación reactiva y manejo de observables
import { Subject, map, takeUntil } from 'rxjs';

// Importaciones del estado y store específicos del trámite 300105
import {
  Tramite300105State,
  Tramite300105Store,
} from '../../estados/tramite300105.store';

// Importación del servicio específico para autorización de rayos X
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';

// Importaciones de modelos de datos para catálogos
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosSelect } from '@libs/shared/data-access-user/src/core/models/shared/components.model';

// Importación de enumeraciones para opciones de botones de radio
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enum/botons.enum';

// Importación de la query específica del trámite 300105
import { Tramite300105Query } from '../../estados/tramite300105.query';

/**
 * @class DatosDelSolicitanteComponent
 * @description Componente Angular responsable de gestionar la captura y validación de datos del solicitante
 * para el trámite 300105 de autorización de equipos de rayos X. Este componente maneja formularios reactivos,
 * validaciones, catálogos desplegables y comunicación con el store de estado.
 * 
 * @implements {OnInit} - Interfaz para inicialización del componente
 * @implements {OnDestroy} - Interfaz para limpieza de recursos al destruir el componente
 * 
 * @example
 * ```html
 * <app-datos-del-solicitante 
 *   (pasarTipoOperacion)="manejarTipoOperacion($event)">
 * </app-datos-del-solicitante>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
@Component({
  /**
   * @property {string} selector - Selector CSS para usar el componente en plantillas HTML
   * @description Define cómo se invoca este componente en las plantillas padre
   */
  selector: 'app-datos-del-solicitante',
  
  /**
   * @property {string} templateUrl - Ruta relativa al archivo de plantilla HTML del componente
   * @description Especifica la ubicación del archivo HTML que define la vista del componente
   */
  templateUrl: './datos-del-solicitante.component.html',
})
export class DatosDelSolicitanteComponent implements OnInit, OnDestroy {
  /** 
   * Evento que emite el tipo de operación seleccionado al componente padre. 
   */ 
  @Output() pasarTipoOperacion: EventEmitter<string> = new EventEmitter<string>();
  /**
   * Formulario de la solicitud.
   */
  formSolicitud!: FormGroup;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Estado de la solicitud de la sección 300105.
   */
  public solicitudState!: Tramite300105State;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /** 
  * Almacena el valor seleccionado del tipo de operación. 
  */
  VALOR_SELECCIONADO: string = '';

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private tramite300105Store: Tramite300105Store,
    private tramite300105Query: Tramite300105Query,
    @Inject(AutorizacionDeRayosXService)
    private autorizacionDeRayosXService: AutorizacionDeRayosXService,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
  }

  /**
   * Catálogo de tipo de operación.
   */
  public tipoOperacionCatalogo: CatalogosSelect = {
    labelNombre: 'Tipo de Operación',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Catálogo de finalidad.
   */
  public finalidadCatalogo: CatalogosSelect = {
    labelNombre: 'Finalidad',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Inicializa el componente y obtiene formulario.
   */
  ngOnInit(): void {
    this.initializarFormulario();
    this.fetchTipoOperacionData();
    this.fetchFinalidadData();
  }

  /**
   * Método para inicializar el formulario de datos del solicitante.
   */
  initializarFormulario(): void {
    this.tramite300105Query.selectTramite300105$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.formSolicitud = this.fb.group({
      datosSolicitante: this.fb.group({
        numeroExpediente: [
          this.solicitudState?.numeroExpediente,
          [
            Validators.required,
            Validators.maxLength(6),
            Validators.pattern(REG_X.SOLO_NUMEROS)
          ],
        ],
        tipoOperacion: [this.solicitudState?.tipoOperacion],
        finalidad: [this.solicitudState?.finalidad],
        isExento: [this.solicitudState?.isExento],
        isAutorizacion: [this.solicitudState?.isAutorizacion],
        numAutorizacion1: [
          this.solicitudState?.numAutorizacion1,
          [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]
        ],
        numAutorizacion2: [
          this.solicitudState?.numAutorizacion2,
          [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]
        ],
        numAutorizacion3: [
          this.solicitudState?.numAutorizacion3,
          [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]
        ],
      }),
    });
    if (this.solicitudState?.tipoOperacion) {
      this.obtenerTipoOperacionSeleccionado();
    }

    if(this.esFormularioSoloLectura){
      this.formSolicitud.disable();
    } else {
      this.formSolicitud.enable();
    }
  }

  /**
   * Método para actualizar el valor del campo en el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite300105Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Maneja el evento de clic en un botón de radio.
   */
  onRadioClick(nombreControl: string): void {
    const CURRENT_VALUE = this.datosSolicitante.get(nombreControl)?.value;
    this.datosSolicitante.get(nombreControl)?.setValue(!CURRENT_VALUE);
    this.tramite300105Store.establecerDatos({[nombreControl]: !CURRENT_VALUE});
  }

  /**
   * Metodo para obtener el catálogo de tipo de operación.
   */
  fetchTipoOperacionData(): void {
    this.autorizacionDeRayosXService
      .getTipoOperacion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.tipoOperacionCatalogo.catalogos = data as Catalogo[];
      });
  }

  /**
   * Método para obtener el catálogo de finalidad.
   */
  fetchFinalidadData(): void {
    this.autorizacionDeRayosXService
      .getFinalidad()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.finalidadCatalogo.catalogos = data as Catalogo[];
      });
  }

  /**
   * Método para obtener el formulario de datos del solicitante.
   */
  get datosSolicitante(): FormGroup {
    return this.formSolicitud.get('datosSolicitante') as FormGroup;
  }

  /** 
   * Obtiene el valor del tipo de operación desde el formulario y lo emite al componente padre. 
   */
  obtenerTipoOperacionSeleccionado(): void {
    const VALOR_SELECCIONADO = this.formSolicitud.get('datosSolicitante.tipoOperacion')?.value;
    this.pasarTipoOperacion.emit(VALOR_SELECCIONADO);
  }
  /**
   * Metodo y para destruir el componente y liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
