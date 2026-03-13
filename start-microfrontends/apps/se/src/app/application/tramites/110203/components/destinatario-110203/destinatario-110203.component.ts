import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud110203State, Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Subject, map, takeUntil } from 'rxjs';
import { DESTINATARIO_DATOS } from '../../constant/destinatario.enum';
import {Placeholders } from '@libs/shared/data-access-user/src/core/models/110203/tecnicos.model';
import { REGEX_ALFANUMERICO_CON_ESPACIOS } from '@libs/shared/data-access-user/src';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import mediocatalogo from '@libs/shared/theme/assets/json/110203/mediocatalogo.json';
/**
 * Componente que gestiona la visualización y actualización de los datos relacionados con el destinatario para el trámite 110203.
 * Este componente permite la edición de los datos personales del destinatario, como nombre, dirección, correo y teléfono,
 * y guarda los valores seleccionados en el estado de la solicitud a través de un formulario reactivo.
 * 
 * @component
 * @example
 * <app-destinatario-110203></app-destinatario-110203>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * 
 */
@Component({
  selector: 'app-destinatario-110203',
  standalone: true,
  imports: [TituloComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './destinatario-110203.component.html',
  styleUrl: './destinatario-110203.component.scss'
})
/**
 * Componente que maneja la visualización y actualización de los datos relacionados con el destinatario
 * para el trámite 110203. Utiliza un formulario reactivo para capturar y persistir la información del destinatario
 * en el estado de la solicitud.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-destinatario-110203></app-destinatario-110203>
 * 
 * @constructor
 * El componente se inicializa con un formulario reactivo que contiene los campos necesarios para capturar la
 * información del destinatario. Esta información se obtiene del estado de la solicitud 110203.
 * 
 * @property {FormGroup} destinatarioForm - Formulario reactivo que gestiona los datos del destinatario.
 * @property {Solicitud110203State} solicitudState - Estado de la solicitud 110203 que contiene los valores actuales de la solicitud.
 * @property {Subject<void>} destroyNotifier$ - Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
 * 
 * @method ngOnInit() - Inicializa el formulario reactivo con los valores actuales del estado de la solicitud.
 * @method inicializarFormulario() - Inicializa el formulario reactivo con los valores del destinatario obtenidos desde el estado de la solicitud.
 * @method setValoresStore() - Actualiza el store del trámite con el valor de un campo específico del formulario.
 * @method ngOnDestroy() - Se ejecuta cuando el componente es destruido. Limpia los recursos y previene memory leaks.
 */
export class Destinatario110203Component implements OnInit, OnDestroy {
  
  /**
   * Formulario reactivo que gestiona los datos del destinatario, incluyendo nombre, dirección, correo, etc.
   * 
   * Campos:
   * - nombre
   * - primer
   * - segundo
   * - fiscal
   * - razon
   * - calle
   * - letra
   * - ciudad
   * - correo
   * - fax
   * - telefono
   */
  destinatarioForm!: FormGroup;
/** Indica si los campos de nombre y apellidos están en solo lectura. 
 * Se activa si el campo "razón social" tiene datos. */
  camposNombreSoloLectura= false;
  /**
 * Establece los valores de los placeholders utilizados en el formulario.
 * El valor se obtiene desde el catálogo de medios.
 */
  placeholder :Placeholders=mediocatalogo.placeholder;
  /**
   * Estado de la solicitud 110203, que contiene los valores actuales de los campos relacionados con el destinatario.
   */
  public solicitudState!: Solicitud110203State;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente. Inicializa el formulario reactivo y configura las dependencias necesarias.
   * 
   * @param fb - FormBuilder utilizado para crear el formulario reactivo.
   * @param tramite110203Store - Store que gestiona los valores persistentes del trámite 110203.
   * @param tramite110203Query - Query que se utiliza para obtener el estado actual de la solicitud 110203.
   */
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tramite110203Store: Tramite110203Store,
    private tramite110203Query: Tramite110203Query,
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
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }


 /**
     * Evalúa si se debe inicializar o cargar datos en el formulario.  
     * Además, obtiene la información del catálogo de mercancía.
     */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.destinatarioForm?.get('razon')?.setValue(this.solicitudState.razon);
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }


   /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.destinatarioForm?.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.destinatarioForm.enable();
    }
  }


  /**
   * Se ejecuta cuando el componente se inicializa. Llama al método `inicializarFormulario` para cargar los valores
   * predeterminados en el formulario con los datos del destinatario provenientes del estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Método que inicializa el formulario reactivo con los valores del destinatario desde el estado de la solicitud.
   * El formulario contiene los campos: 'nombre', 'primer', 'segundo', 'fiscal', 'razon', 'calle', 'letra', 'ciudad',
   * 'correo', 'fax' y 'telefono', que son los datos personales del destinatario.
   */
  private inicializarFormulario(): void {
    this.tramite110203Query.selectSolicitud$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((seccionState) => {
      this.solicitudState = seccionState as Solicitud110203State;

    // Inicializa el formulario con los valores del destinatario desde el estado de la solicitud
    this.destinatarioForm = this.fb.group({
      nombre: [this.solicitudState.nombre,[Validators.maxLength(30)]],
      primer: [this.solicitudState.primer,[Validators.maxLength(20)]],
      segundo: [this.solicitudState.segundo,[Validators.maxLength(20)]],
      fiscal: [this.solicitudState.fiscal,[Validators.maxLength(30),Validators.required]],
      razon: [this.solicitudState.razon,[Validators.maxLength(70)]],
      calle: [this.solicitudState.calle, [Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),Validators.required, Validators.maxLength(100)]],
      letra: [this.solicitudState.letra, [Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),Validators.required, Validators.maxLength(30)]],
      ciudad: [this.solicitudState.ciudad, [Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),Validators.required, Validators.maxLength(50)]],
      correo: [this.solicitudState.correo, [Validators.required, Validators.maxLength(70),Validators.email]],
      fax: [this.solicitudState.fax, [Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),Validators.maxLength(20)]],
      telefono: [this.solicitudState.telefono,[Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),Validators.maxLength(30)]],
    });
  if(this.destinatarioForm.get('nombre')?.value){
    this.destinatarioForm.get('razon')?.disable();
  } else if(this.destinatarioForm.get('razon')?.value){
    this.destinatarioForm.get('nombre')?.setValue('');
    this.destinatarioForm.get('primer')?.setValue('');
    this.destinatarioForm.get('segundo')?.setValue('');
    this.destinatarioForm.get('nombre')?.disable();
    this.destinatarioForm.get('primer')?.disable();
    this.destinatarioForm.get('segundo')?.disable();
  }
    });
  }
  /**
   * Método para actualizar el store del trámite con el valor de un campo específico del formulario.
   * 
   * @param form - Formulario que contiene los valores.
   * @param campo - Nombre del campo del formulario.
   * @param metodoNombre - Nombre del método del store que se utilizará para guardar el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite110203Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite110203Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

/**
 * Valida los campos del formulario de destinatario.
 * Verifica que los campos 'calle' y 'letra' no estén vacíos ni sean nulos.
 * Si ambos son válidos, devuelve true; de lo contrario, marca todos los campos como tocados y devuelve false.
 */
  validarFormularios(): boolean {
    if (
      this.destinatarioForm.get('calle')?.value !== '' &&
      this.destinatarioForm.get('calle')?.value !== null &&
      this.destinatarioForm.get('letra')?.value !== '' &&
      this.destinatarioForm.get('letra')?.value !== null && 
      this.destinatarioForm.get('correo')?.valid 
    ) {
      return true;
    }
    this.destinatarioForm.markAllAsTouched();
    return false;
  }

  /**
   * Se ejecuta cuando el componente es destruido. Se limpia el `destroyNotifier$` para evitar memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}