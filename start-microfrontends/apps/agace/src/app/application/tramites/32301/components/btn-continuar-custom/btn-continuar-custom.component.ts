import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  DatosPasos,
  Notificacion,NotificacionesComponent, SeccionLibQuery, SeccionLibState, VistaEmergente, WizardService } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';

/**
 * @interface AccionBoton
 * @description Define la estructura de un objeto que representa una acción de botón en el asistente.
 *
 * @property {string} accion - Acción a realizar ('cont' para continuar, 'ant' para retroceder).
 * @property {number} valor - Índice del paso al que se debe mover.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * @component
 * @name BtnContinuarComponent
 * @description Componente que gestiona los botones de navegación (Continuar, Anterior, Guardar) en un asistente.
 * Permite avanzar o retroceder entre los pasos del asistente y emite eventos para manejar estas acciones.
 *
 * @selector btn-continuar
 * @template ./btn-continuar.component.html
 * @style ./btn-continuar.component.scss
 */
@Component({
  selector: 'btn-continuar-custom',
  standalone: true,
  imports: [NotificacionesComponent],
  templateUrl: './btn-continuar-custom.component.html',
  styleUrl: './btn-continuar-custom.component.scss',
  host: {},
})
export class BtnContinuarCustomComponent implements OnInit {
  /**
   * @property datos
   * @description Datos relacionados con los pasos del asistente, incluyendo el índice actual y el número total de pasos.
   * @type {DatosPasos}
   */
  @Input({ required: true }) datos!: DatosPasos;

  /**
   * @property btnGuardar
   * @description Indica si el botón de guardar debe estar habilitado.
   * @type {boolean}
   * @default false
   */
  @Input() btnGuardar: boolean = false;
  /**
   * @Input dePadre
   * @description
   * Indica si el componente `BtnContinuarComponent` está siendo controlado por un componente padre.
   * @type {boolean}
   * @default false
   */
  @Input() public dePadre: boolean = false;
  /**
   * @property currentPasoUnoTab
   * @description Índice actual de la pestaña seleccionada en el componente PasoUno.
   * Se utiliza para decidir qué lógica de botón aplicar según la pestaña activa.
   * @type {number}
   */
  @Input() currentPasoUnoTab: number = 0;
  /**
   * @property vistaEmergente
   * @description Configuración para manejar vistas emergentes en el asistente.
   * @type {VistaEmergente}
   */
  @Input() vistaEmergente: VistaEmergente = {
    abierto: false,
    indice: 1,
  };

  /**
   * @property notificacion
   * @description Configuración de la notificación que se mostrará en el componente.
   * @type {Notificacion}
   */
  @Input() notificacion!: Notificacion;

  /**
   * @property continuarEvento
   * @description Evento emitido al hacer clic en el botón Continuar.
   * @type {EventEmitter<AccionBoton>}
   */
  @Output() continuarEvento = new EventEmitter<AccionBoton>();

  /**
   * @property btnGuardarClicked
   * @description Evento emitido al hacer clic en el botón Guardar.
   * @type {EventEmitter<void>}
   */
  @Output() btnGuardarClicked = new EventEmitter<void>();

  /**
   * @property wizardService
   * @description Servicio utilizado para manejar la lógica del asistente.
   * @type {WizardService}
   */
  wizardService = inject(WizardService);

  /**
   * @property seccion
   * @description Estado actual de la sección del asistente.
   * @type {SeccionLibState}
   */
  public seccion!: SeccionLibState;

  /**
   * @property destroyNotifier$
   * @description Notificador utilizado para cancelar suscripciones activas al destruir el componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property habilitarBoton
   * @description Indica si el botón Continuar debe estar habilitado.
   * @type {boolean}
   * @default false
   */
  public habilitarBoton: boolean = false;

  /**
   * @property moduloEmergente
   * @description Indica si el módulo emergente está activo.
   * @type {boolean}
   * @default false
   */
  public moduloEmergente: boolean = false;
  /**
     * @property btngardarClicked
     * @description Controla si el botón de guardar debe mostrarse como activado para tipoDevAviso.
     * Se activa solo si el usuario aceptó el valor en el índice permitido (e.g., 2).
     * @type {boolean}
     */
  btngardarClicked: boolean = false;
  /**
   * @property btngardarClickedModificacionSocios
   * @description Controla si el botón guardar se activa en el contexto de modificación de socios.
   * @type {boolean}
   */
  btngardarClickedModificacionSocios: boolean = false;
  /**
   * @constructor
   * @description Inicializa el componente e inyecta las dependencias necesarias.
   * @param {SeccionLibQuery} seccionQuery Servicio para consultar el estado de la sección.
   */
  constructor(private seccionQuery: SeccionLibQuery, private store: Tramite32101Store, public Tramite32301Query: Tramite32301Query) { }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la sección y actualiza la propiedad `habilitarBoton`.
   * @returns {void}
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
          this.habilitarBoton =
            JSON.stringify(this.seccion.formaValida) ===
            JSON.stringify(this.seccion.seccion);
        })
      )
      .subscribe();
    this.Tramite32301Query.selectState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        const INDICES_MODIFICACION_SOCIOS = [2,3, 4, 5, 6, 7,8];

        if (INDICES_MODIFICACION_SOCIOS.includes(this.currentPasoUnoTab)) {
          this.btngardarClicked = false;

          this.btngardarClickedModificacionSocios = state.modificacionSocios?.isActive ?? true;
        } else {
          this.btngardarClicked = false;
          this.btngardarClickedModificacionSocios = false;
        }

      })

  }
  /**
   * @method btnAntVisible
   * @description Determina la visibilidad del botón "Anterior".
   * @returns {string} 'hidden' si el índice es 1, de lo contrario 'visible'.
   */
  get btnAntVisible(): string {
    return this.datos.indice === 1 ? 'hidden' : 'visible';
  }

  /**
   * @method btnContVisible
   * @description Determina si el botón "Continuar" debe ser visible.
   * @returns {boolean} `true` si el índice actual no es igual al número de pasos, de lo contrario `false`.
   */
  get btnContVisible(): boolean {
    return this.datos.indice === this.datos.nroPasos ? false : true;
  }

  /**
   * @method continuar
   * @description Avanza al siguiente paso del asistente si la condición se cumple.
   * @returns {void}
   */
  continuar(): void {
    const PUEDE_CONTINUAR =
      this.datos.indice > 0 && this.datos.indice < this.datos.nroPasos;
    let valor = this.datos.indice;
    if (!PUEDE_CONTINUAR) {
      return;
    }
    if (
      this.vistaEmergente.abierto &&
      this.datos.indice === this.vistaEmergente.indice
    ) {
      this.moduloEmergente = true;
    }
    if (!this.dePadre) {
      this.wizardService.cambio_indice(valor);
      valor += 1;
      this.datos.indice = valor;
    }
    const DATOS_CONTINUAR: AccionBoton = {
      accion: 'cont',
      valor,
    };
    this.continuarEvento.emit(DATOS_CONTINUAR);
  }

  /**
   * @method anterior
   * @description Retrocede al paso anterior si el índice actual está dentro del rango permitido.
   * @returns {void}
   */
  anterior(): void {
    const PUEDE_RETROCEDER =
      this.datos.indice > 1 && this.datos.indice <= this.datos.nroPasos;
    let valor = this.datos.indice;
    if (!PUEDE_RETROCEDER) {
      return;
    }
    if (!this.dePadre) {
      valor -= 1;
      this.datos.indice = valor;
    }
    const DATOS_ANTERIOR: AccionBoton = {
      accion: 'ant',
      valor,
    };
    this.continuarEvento.emit(DATOS_ANTERIOR);
  }

  /**
   * @method eliminarPedimento
   * @description Elimina un pedimento y avanza al siguiente paso si la condición se cumple.
   * @param {boolean} borrar Indica si se debe eliminar el pedimento.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    this.moduloEmergente = false;
    if (borrar) {
      const CONDICION =
        this.datos.indice > 0 && this.datos.indice < this.datos.nroPasos;
      if (CONDICION) {
        this.wizardService.cambio_indice(this.datos.indice);
        const DATOS_CONTINUAR: AccionBoton = {
          accion: 'cont',
          valor: (this.datos.indice += 1),
        };
        this.continuarEvento.emit(DATOS_CONTINUAR);
      }
      this.moduloEmergente = false;
    }
  }

  /**
   * @method guardar
   * @description Emite un evento al hacer clic en el botón guardar.
   * @returns {void}
   */
  guardar(): void {
    this.btnGuardarClicked.emit();
  }
}
