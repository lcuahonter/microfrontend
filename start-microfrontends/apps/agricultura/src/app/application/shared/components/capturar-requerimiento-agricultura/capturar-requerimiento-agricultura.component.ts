import { Catalogo, ConsultaioQuery, ConsultaioState, RequerimientosStates, SolicitudRequerimientoQuery, SolicitudRequerimientosState } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectClaveComponent } from "@libs/shared/data-access-user/src/tramites/components/catalogo-select-clave/catalogo-select.component";
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import {
  IniciarRequerimientoResponse,
} from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';
import { TipoRequerimiento } from '../../../core/enum/agricultura-core-enum';



@Component({
  selector: 'app-capturar-requerimiento-agricultura',
  standalone: true,
  imports: [CommonModule, CatalogoSelectClaveComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './capturar-requerimiento-agricultura.component.html',
  styleUrl: './capturar-requerimiento-agricultura.component.scss',
})
export class CapturarRequerimientoAgriculturaComponent implements OnInit, OnDestroy {
    /**
     * Declaración de variable para el formulario
     */
    formRequerimiento!: FormGroup;
    /**
      * Catálogo de tipo de requerimiento
      */
    catTipoRequerimiento!: Catalogo[];

        /**
      * Catálogo de tipo de requerimiento
      */
    catAreasSolicitantes!: Catalogo[];
    /**
     * Notificador para destruir las suscripciones.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
      * Estado de la solicitud.
      */
    public solicitudRequerimientosState!: SolicitudRequerimientosState;
    /**
     * Límite máximo de caracteres para el campo de justificación
     */
    readonly MAX_CHARS = 10000;
  
    /** Indica si se debe mostrar el tipo de requerimiento */
    @Input() isTipoRequerimiento: boolean = true;
  
    /** Indica si se debe mostrar el área solicitante */
    @Input() isAreaSolicitante: boolean = true;
  
    /** Indica si se debe mostrar la justificación del requerimiento */
    @Input() isJustificacionRequerimiento: boolean = true;
  
    /** Datos de respuesta de la inicialización del requerimiento */
    @Input() iniciarResponse!: IniciarRequerimientoResponse;

     /** Datos de respuesta de la inicialización del requerimiento */
    @Input() estadoTramite!: ConsultaioState;

  /** form solo lectura */
  @Input() esSoloLectura: boolean = false;

  /** Indica si las validaciones del formulario inician activas */
  @Input() validacionesActivas: boolean = false;


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Output() formChanged = new EventEmitter<any>();
  
    /**
     * Flag para mostrar mensaje de límite de caracteres alcanzado
     */
    public showCharLimitMessage = false;

    constructor(
      private fb: FormBuilder,
      private requerimientosStates: RequerimientosStates,
      private solicitudRequerimientoQuery: SolicitudRequerimientoQuery,
      private consultaioQuery: ConsultaioQuery,
      private catalogosService: CatalogosService
    ) {
      this.solicitudRequerimientoQuery.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudRequerimientosState = seccionState;
          })
        )
        .subscribe();
  


    }
    /**
    * Método que se ejecuta al inicializar el componente.
    */
  ngOnInit(): void {

      this.crearFormRequerimiento(); // primero: crear form vacío
      // luego cargar catálogos
      this.cargarCatalogoAreasSolicitantes();
      this.cargarTiposRequerimiento();

    this.formRequerimiento.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(() => {
        this.formChanged.emit(this.formRequerimiento);
      });
      if (this.esSoloLectura) {
        this.formRequerimiento.disable();
      } else {
        this.formRequerimiento.enable();
        if (this.validacionesActivas) {
          this.formRequerimiento.markAllAsTouched();
        }
      }
    }
  
    /**
     * Se ejecuta al destruir el componente.
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
    /**
     * Método para crear el formulario de la captura de requerimiento
     */
  crearFormRequerimiento(): void {
    this.formRequerimiento = this.fb.group({
      tipoRequerimiento: [
        this.solicitudRequerimientosState?.idTipoRequerimiento ||
        this.iniciarResponse.alcance_requerimiento || '', this.isTipoRequerimiento ? [Validators.required] : []
      ],

      // MULTISELECT SIEMPRE EN ARRAY, se asignan los valores seleccionados previamente cuando termina de cargar el catalogo
      areasSolicitantes: this.fb.control<string[]>([], Validators.required),

      justificacionRequerimiento: [
        this.solicitudRequerimientosState?.justificacionRequerimiento || this.iniciarResponse.justificacion || '',
        this.isJustificacionRequerimiento ? [Validators.required, Validators.maxLength(this.MAX_CHARS)] : []
      ]
    });
  }
  
    /**
     * Método para establecer el tipo de requerimiento seleccionado 
      * De acuerdo al tipo de requerimiento el observable activa o desactiva el Tab para el requrimiento de documentación
      *@param {FormGroup} form - El formulario del cual se obtiene el valor.
      * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
      * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
     */
    tipoRequerimientoSeleccionado(form: FormGroup, campo: string, metodoNombre: keyof RequerimientosStates): void {
      this.setValoresStore(form, campo, metodoNombre);
    }

  /**
* Método para establecer el tipo de requerimiento seleccionado 
 * De acuerdo al tipo de requerimiento el observable activa o desactiva el Tab para el requrimiento de documentación
 *@param {FormGroup} form - El formulario del cual se obtiene el valor.
 * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
 * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
*/
  areasSolicitantesSeleccionada(form: FormGroup, campo: string, metodoNombre: keyof RequerimientosStates, event: Event): void {
    const SELECT = event.target as HTMLSelectElement;

    const SELECTED_VALUES = Array
      .from(SELECT.options)
      .filter(o => o.selected)
      .map(o => o.value);

    const CLAVESCORRECTAS = CapturarRequerimientoAgriculturaComponent.limpiarArregloAreas(SELECTED_VALUES);
    (this.requerimientosStates[metodoNombre] as (value: string[]) => void)(CLAVESCORRECTAS);
  }
    /**
      * Establece los valores en el store de tramite5701.
      *
      * @param {FormGroup} form - El formulario del cual se obtiene el valor.
      * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
      * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
      * @returns {void}
      */
    setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof RequerimientosStates): void {
      const VALOR = form.get(campo)?.value;
      if (VALOR === '1' || VALOR === '2') {
        this.requerimientosStates.setPestaniaSolicitudDocumento(true);
      }
      else {
        this.requerimientosStates.setPestaniaSolicitudDocumento(false); // agrega esto si no lo tenías
      }
      (this.requerimientosStates[metodoNombre] as (value: string) => void)(VALOR);
    }
  
    /**
     * Método para manejar el evento keydown en el textarea de justificación
     * Previene que el usuario pueda escribir más caracteres cuando se alcanza el límite
     * @param {KeyboardEvent} event - El evento del teclado
     */
    onKeydown(event: KeyboardEvent): void {
      const CURRENT_VALUE = this.formRequerimiento.get('justificacionRequerimiento')?.value || '';
      const IS_AT_LIMIT = CURRENT_VALUE.length >= this.MAX_CHARS;
  
      // Permitir teclas de navegación y edición (backspace, delete, arrow keys, etc.)
      const ALLOWED_KEYS = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Escape'
      ];
  
      // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
      const IS_CTRL_KEY = event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase());
  
      // Si se alcanzó el límite y la tecla no está permitida, prevenir la entrada
      if (IS_AT_LIMIT && !ALLOWED_KEYS.includes(event.key) && !IS_CTRL_KEY) {
        event.preventDefault();
        // Mostrar mensaje de límite de caracteres
        this.showCharLimitMessage = true;
        // Marcar el campo como tocado para mostrar el error si no está ya marcado
        const CONTROL = this.formRequerimiento.get('justificacionRequerimiento');
        if (CONTROL && !CONTROL.touched) {
          CONTROL.markAsTouched();
        }
      } else if (ALLOWED_KEYS.includes(event.key) && CURRENT_VALUE.length < this.MAX_CHARS) {
        // Ocultar mensaje cuando el usuario puede editar y está por debajo del límite
        this.showCharLimitMessage = false;
      }
    }
  
    /**
     * Método para manejar el evento de pegado en el textarea
     * Trunca el contenido pegado si excede el límite de caracteres
     * @param {ClipboardEvent} event - El evento del portapapeles
     */
    onPaste(event: ClipboardEvent): void {
      const CLIPBOARD_DATA = event.clipboardData?.getData('text') || '';
      const CURRENT_VALUE = this.formRequerimiento.get('justificacionRequerimiento')?.value || '';
      const REMAINING_CHARS = this.MAX_CHARS - CURRENT_VALUE.length;
  
      if (CLIPBOARD_DATA.length > REMAINING_CHARS) {
        event.preventDefault();
        const TRUNCATED_TEXT = CLIPBOARD_DATA.substring(0, REMAINING_CHARS);
        const NEW_VALUE = CURRENT_VALUE + TRUNCATED_TEXT;
  
        this.formRequerimiento.get('justificacionRequerimiento')?.setValue(NEW_VALUE);
        this.setValoresStore(this.formRequerimiento, 'justificacionRequerimiento', 'setjustificacionRequerimientoValue');
  
        // Mostrar mensaje si se truncó el contenido
        if (REMAINING_CHARS <= 0 || CLIPBOARD_DATA.length > REMAINING_CHARS) {
          this.showCharLimitMessage = true;
        }
  
        // Marcar como tocado para mostrar validaciones
        this.formRequerimiento.get('justificacionRequerimiento')?.markAsTouched();
      }
    }

    /**
     * Carga los tipos de requerimiento del catalogo
     */
cargarTiposRequerimiento(): void {
      const ALCANCES_REQUERIMIENTO = this.iniciarResponse?.alcances_requerimiento;
      const CAT_ALCANCES = ALCANCES_REQUERIMIENTO?.map(item => {
        return {
          descripcion: item.descripcion,
          clave: item.clave
        }
      }) as Catalogo[];
      this.catTipoRequerimiento = ALCANCES_REQUERIMIENTO !== undefined ? CAT_ALCANCES : [];
      if (this.solicitudRequerimientosState?.idTipoRequerimiento?.trim()) {
        this.formRequerimiento.patchValue({
          tipoRequerimiento: this.solicitudRequerimientosState.idTipoRequerimiento
        });
      } else if (this.iniciarResponse.alcance_requerimiento?.trim()) {
        this.formRequerimiento.patchValue({
          tipoRequerimiento: this.iniciarResponse.alcance_requerimiento
        });
      }
      else {
        this.formRequerimiento.patchValue({
          tipoRequerimiento: TipoRequerimiento.DATOS
        });
      }
}

/**
 * Carga los areas solicitantes del catalogo
 */
cargarCatalogoAreasSolicitantes(): void {
  this.catalogosService
    .obtieneCatalogoAreasSolicitantes(
      Number(this.estadoTramite.procedureId),
      this.estadoTramite.folioTramite
    )
    .pipe(
      takeUntil(this.destroyNotifier$)
    )
    .subscribe({
      next: (resp) => {
        this.catAreasSolicitantes = resp.datos ?? [];

        // Ejecutar DESPUÉS de cargar el catálogo
        if (this.solicitudRequerimientosState?.areasSolicitantes?.length) {
          this.formRequerimiento.patchValue({
            areasSolicitantes: this.solicitudRequerimientosState.areasSolicitantes
          });
        } else if (this.iniciarResponse.areas_dependencias?.length) {
          this.formRequerimiento.patchValue({
            areasSolicitantes: this.iniciarResponse.areas_dependencias.map(
              area => area.clave
            )
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar catálogo de áreas solicitantes', err);
      }
    });
}

  /**
    * funcion para limpiar el arreglo de areas solicitantes
    * @param arr 
    * @returns 
    */
  static limpiarArregloAreas(arr: string[]): string[] {
    return arr.map(item => {
      const MATCH = item.match(/'([^']+)'/);
      return MATCH ? MATCH[1] : item;
    });
}

  /**
   * @description Valida todos los campos del formulario y marca los campos como touched
   * para mostrar los errores de validación en los componentes app-catalogo-select
   * @method validarFormulario
   * @returns { valido: boolean; mensaje: string } true si el formulario es válido, false en caso contrario
   */
  public validarFormulario(): boolean {
    // Marcar los select customizados
    this.formRequerimiento.updateValueAndValidity();
    this.formRequerimiento.markAllAsTouched();

    // Retornar si el formulario es válido
    if (!this.formRequerimiento.valid) {
      return false;
    }

    return true;
  }


    /**
     * Método para manejar el evento input del textarea
     * Controla el mensaje de límite de caracteres
     */
    onInput(): void {
      const CURRENT_VALUE = this.formRequerimiento.get('justificacionRequerimiento')?.value || '';
      this.showCharLimitMessage = CURRENT_VALUE.length >= this.MAX_CHARS;
      this.setValoresStore(this.formRequerimiento, 'justificacionRequerimiento', 'setjustificacionRequerimientoValue');
    }
  }
