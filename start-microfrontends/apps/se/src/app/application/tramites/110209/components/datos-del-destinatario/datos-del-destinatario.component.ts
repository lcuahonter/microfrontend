/**
 * Componente encargado de gestionar los datos del destinatario.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,REGEX_SOLO_DIGITOS } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110209State, Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { CommonModule } from '@angular/common';
import { SgpCertificadoService } from '../../services/sgp-certificado/sgp-certificado.service';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';

/**
 * Componente encargado de gestionar los datos del destinatario.
 */
@Component({
  selector: 'app-datos-del-destinatario',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './datos-del-destinatario.component.html',
  styleUrl: './datos-del-destinatario.component.scss',
})
/**
 * Componente encargado de gestionar los datos del destinatario.
 */
export class DatosDelDestinatarioComponent implements OnInit, OnDestroy {
  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea de tipo 'FormGroup'.
   *
   * @property {FormGroup} datosDelDestinatarioForm - El formulario del componente.
   */
  datosDelDestinatarioForm!: FormGroup;

  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
  
   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado interno de la sección actual del trámite 110209.
   */
  private seccionState!: Tramite110209State;

  /**  
  * Indica si el formulario ha sido inicializado correctamente.  
  * Se utiliza para controlar la ejecución de procesos dependientes de la carga inicial.  
  */
  private formularioInicializado = false;

  /**
   * Constructor del componente DetallesDelDestinatarioComponent.
   * 
   * @param {FormBuilder} fb - El servicio FormBuilder proporcionado por Angular.
   * @param {Tramite110209Store} tramite110209Store - El store del trámite 110209.
   * @param {Tramite110209Query} tramite110209Query - La consulta del trámite 110209.
   * @example
   * const form = new FormGroup();
   * @public
   */
  constructor(private service: SgpCertificadoService, 
    private fb: FormBuilder, 
    private tramite110209Store: Tramite110209Store, 
    private tramite110209Query: Tramite110209Query, 
    private consultaQuery: ConsultaioQuery) {
     /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - La suscripción se cancela automáticamente cuando `destroyed$` emite un valor (para evitar fugas de memoria).
    * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
    */
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      
  }

     /**
 * Inicializa el estado de los formularios según el modo de solo lectura.
 *
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
 * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
 */
   inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); 
    } else {
       this.crearFormulario();
      }
  
    }
  
     /**
 * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
 *
 * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
 * o los habilita si está en modo edición.
 */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosDelDestinatarioForm.disable();
     
    } else {
      this.datosDelDestinatarioForm.enable();
     
    } 
}
   /**
   * Suscribe al observable `selectSolicitud$` del query `tramite120501Query` para obtener el estado actual de la solicitud y actualizar la propiedad `seccionState` con los datos recibidos. La suscripción se mantiene activa hasta que se emite un valor en `destroyed$`, evitando fugas de memoria.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite110209Query.selectTramite110209$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite110209State) => {
        this.seccionState = data;
      });
  }
  /**
   * Crea el formulario del componente.
   */
  crearFormulario(): void {
  if(this.formularioInicializado){ 
    return;
  }

    this.obtenerEstadoSolicitud();
    this.datosDelDestinatarioForm = this.fb.group({
      nombre: [this.seccionState?.nombre ?? '', [Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL),Validators.maxLength(25)]],
      primerApellido: [this.seccionState?.primerApellido ?? '', [Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL),Validators.maxLength(20)]],
      segundoApellido: [this.seccionState?.segundoApellido ?? '', [Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL),Validators.maxLength(20)]],
      numeroDeRegistroFiscal: [this.seccionState?.numeroDeRegistroFiscal ?? '', [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(30)]],
      razonSocial: [this.seccionState?.razonSocial ?? '', [Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL),Validators.maxLength(70)]],
    });

    this.formularioInicializado = true;
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Crea el formulario del componente.
   */
  ngOnInit(): void {
   this.tramite110209Query.selectTramite110209$.pipe(
    takeUntil(this.destroyed$),
  ).subscribe(() => {
    this.inicializarEstadoFormulario();
    if (this.datosDelDestinatarioForm.get('nombre')?.value) {
    this.datosDelDestinatarioForm.get('razonSocial')?.disable();
  }
  if(this.datosDelDestinatarioForm.get('razonSocial')?.value) {
    this.datosDelDestinatarioForm.get('nombre')?.setValue('');
    this.datosDelDestinatarioForm.get('primerApellido')?.setValue('');
    this.datosDelDestinatarioForm.get('segundoApellido')?.setValue('');
    this.datosDelDestinatarioForm.get('nombre')?.disable();
    this.datosDelDestinatarioForm.get('primerApellido')?.disable();
    this.datosDelDestinatarioForm.get('segundoApellido')?.disable();
  }
  });
  
  }


   /**
     * Establece el valor en Tramite110209Store para el campo especificado del formulario.
     * 
     * @param {FormGroup} form - El grupo de formularios que contiene el campo.
     * @param {string} campo - El nombre del campo a obtener y guardar en el store.
     * @returns {void}
     */
    setValoresStore(form: FormGroup, campo: string): void {
      const VALOR = form.get(campo)?.value;
      this.tramite110209Store.setTramite110209({ [campo]: VALOR });
    }
  /**
   * @method validarFormulario
   * @description
   * Valida el formulario de datos del destinatario.
   * Si el formulario es válido, retorna `true`.
   * Si el formulario es inválido, marca todos los controles como "tocados" para mostrar los errores de validación y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
    validarFormulario(): boolean {
    if (this.datosDelDestinatarioForm.valid) {
      return true;
    }
    this.datosDelDestinatarioForm.markAllAsTouched();
    return false;
  }
    /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
}