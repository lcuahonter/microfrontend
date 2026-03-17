import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, map, takeUntil } from 'rxjs';

import {
  ConsultaioQuery,
  ConsultaioState,
  SeccionLibStore,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Anexo1Component } from '../../components/anexo-1/anexo-1.component';
import { ImmexRegistroform } from '../../modelos/immex-registro-de-solicitud-modality.model';
import { PermisoImmexDatosService } from '../../servicios/immex/permiso-immex-datos.service';
import { SECCIONES_TRAMITE_80203 } from '../../constantes/immex-registro-de-solicitud-modality.enums';

/**
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoUnoComponent
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrls ./paso-uno.component.scss
 * @standalone
 * @imports CommonModule, SolicitanteComponent, Anexo1Component
 * @description
 * Clase que implementa la lógica del primer paso del formulario multipaso.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, Anexo1Component],
})

/**
 * @class PasoUnoComponent
 * @description
 * Clase que implementa la lógica del primer paso del formulario multipaso.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta para el trámite.
   */
  public consultaState!: ConsultaioState;

  /**
   * Índice de la pestaña actualmente seleccionada.
   * @default 1
   */
  indice: number = 1;

  /**
   * @property {SolicitanteComponent} solicitante
   * @description Referencia al componente hijo `SolicitanteComponent` obtenida mediante ViewChild.
   * Esta referencia permite al componente padre acceder directamente a los métodos y propiedades 
   * del formulario de solicitante, especialmente para realizar validaciones y obtener datos del formulario.
   * 
   * El template reference `'solicitante'` debe estar definido en el template HTML del componente
   * para que Angular pueda resolver esta referencia correctamente. Esta propiedad es esencial
   * para la validación del primer paso del asistente IMMEX.
   * 
   * @type {SolicitanteComponent}
   * @decorator @ViewChild('solicitante')
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * @see {@link SolicitanteComponent} - Componente que maneja los datos del solicitante
   * @see {@link validarFormularios} - Método que utiliza esta referencia para validación
   * 
   * @example
   * ```typescript
   * // Validar el formulario del solicitante
   * if (this.solicitante?.form) {
   *   if (this.solicitante.form.invalid) {
   *     this.solicitante.form.markAllAsTouched();
   *   }
   * }
   * ```
   * 
   * @throws No lanza excepciones directas, pero puede ser undefined antes de la inicialización
   */
  @ViewChild('solicitante') solicitante!: SolicitanteComponent;

  /**
   * @property {Anexo1Component} anexoComponent
   * @description Referencia al componente hijo `Anexo1Component` obtenida mediante ViewChild.
   * Esta referencia permite al componente padre interactuar con el formulario del Anexo I,
   * que contiene información específica requerida para el trámite IMMEX de registro de solicitud.
   * 
   * El template reference `'anexo'` debe estar definido en el template HTML del componente.
   * Esta propiedad es fundamental para validar que toda la información del Anexo I
   * esté correctamente completada antes de permitir el avance al siguiente paso.
   * 
   * @type {Anexo1Component}
   * @decorator @ViewChild('anexo')
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * @see {@link Anexo1Component} - Componente que maneja los datos del Anexo I
   * @see {@link validarFormularios} - Método que utiliza esta referencia para validación
   * 
   * @example
   * ```typescript
   * // Validar el formulario del anexo
   * if (this.anexoComponent) {
   *   if (!this.anexoComponent.validarFormulario()) {
   *     // Manejar error de validación
   *   }
   * }
   * ```
   * 
   * @throws No lanza excepciones directas, pero puede ser undefined antes de la inicialización
   */
  @ViewChild('anexo') anexoComponent!: Anexo1Component;

  /**
   * Constructor que inicializa el store de la sección.
   * @param seccionStore Servicio para manejar el estado de las secciones.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param permisoImmexDatosService Servicio para obtener y actualizar datos IMMEX.
   */
  constructor(
    private seccionStore: SeccionLibStore,
    private readonly consultaQuery: ConsultaioQuery,
    private permisoImmexDatosService: PermisoImmexDatosService
  ) {}

  /**
   * Método de inicialización del componente. Asigna las secciones del formulario.
   * @inheritdoc
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.permisoImmexDatosService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoImmexDatosService.actualizarEstadoFormulario(
            resp?.immexRegistro || ({} as ImmexRegistroform)
          );
        }
      });
  }

  /**
   * Lista de pasos dentro del formulario con sus respectivos componentes.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Anexo I', component: 'anexo-1' },
  ];

  /**
   * Evento emitido al cambiar de pestaña.
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * Cambia el índice de la pestaña seleccionada y emite el evento `tabChanged`.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }

  /**
   * Método privado que asigna las secciones del formulario y establece su estado inicial.
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_80203;

    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (
        Object.prototype.hasOwnProperty.call(
          PREDETERMINADO.PASO_1,
          LLAVE_SECCION
        )
      ) {
        // @ts-expect-error - Ignorar error de tipo
        SECCIONES.push(PREDETERMINADO.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(false);
      }
    }

    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }

  /**
   * @method validarFormularios
   * @description Método público que valida todos los formularios del primer paso del asistente IMMEX.
   * Este método es fundamental para asegurar la integridad de los datos antes de permitir el avance
   * al siguiente paso del proceso de registro de solicitud.
   * 
   * El método implementa una validación exhaustiva en dos etapas:
   * 1. **Validación del Solicitante**: Verifica que el componente `SolicitanteComponent` esté disponible
   *    y que su formulario sea válido. Si es inválido, marca todos los campos como tocados para
   *    mostrar los errores de validación al usuario.
   * 
   * 2. **Validación del Anexo I**: Verifica que el componente `Anexo1Component` esté disponible
   *    y ejecuta su método de validación interno para asegurar que todos los campos requeridos
   *    estén correctamente completados.
   * 
   * El método utiliza una estrategia de validación defensiva donde retorna `false` si cualquiera
   * de los componentes hijo no está disponible o si alguna validación falla. Esto garantiza que
   * solo se permita avanzar cuando todos los datos estén correctos y completos.
   * 
   * @public
   * @returns {boolean} Resultado de la validación:
   *                   - `true`: Todos los formularios son válidos y están completos
   *                   - `false`: Al menos un formulario es inválido, está incompleto o no está disponible
   * 
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @see {@link SolicitanteComponent.form} - Formulario reactivo del solicitante
   * @see {@link Anexo1Component.validarFormulario} - Método de validación del Anexo I
   * @see {@link ImmexRegistroSolicitudModalityComponent.validarTodosFormulariosPasoUno} - Método del componente padre que utiliza esta validación
   * 
   * @example
   * ```typescript
   * // Validar antes de avanzar al siguiente paso
   * if (this.pasoUno.validarFormularios()) {
   *   // Avanzar al siguiente paso
   *   this.wizard.siguiente();
   * } else {
   *   // Mostrar errores y mantener en el paso actual
   *   this.mostrarErroresValidacion();
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Uso interno en el componente padre
   * const ISVALID = this.validarTodosFormulariosPasoUno() ?? false;
   * this.isValid = ISVALID;
   * if (!this.isValid) {
   *   // Manejar errores de validación
   *   return;
   * }
   * ```
   * 
   * @throws No lanza excepciones directas, pero puede fallar si los componentes hijos no están inicializados
   * @complexity O(n) - Donde n es el número de campos en los formularios
   * 
   * @workflow
   * 1. Inicializar isValid como true
   * 2. Validar componente solicitante y su formulario
   * 3. Si hay errores, marcar campos como tocados
   * 4. Validar componente anexo
   * 5. Retornar resultado final de validación
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.anexoComponent) {
      if (!this.anexoComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Limpia las suscripciones y recursos al destruir el componente.
   * @inheritdoc
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
