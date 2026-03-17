/**
 * Este componente maneja el formulario de transporte.
 */

import { Catalogo, CatalogoServices, ConsultaioQuery } from "@ng-mf/data-access-user";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110209State, Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component'; 
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { TransporteService } from '../../services/transporte/transporte.service';

/**
 * Este componente maneja el formulario de transporte.
 */


@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent],
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.scss',
})
export class TransporteComponent implements OnInit, OnDestroy {

  /**
   * Formulario para el registro de transporte.
   * @type {FormGroup}
   */
  transporteForm!: FormGroup;

  /**
   * Opciones de medio de transporte.
   * @type {Catalogo[]}
   */
  medioDeTransporteOptions: Catalogo[] = [];

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
   * Indica si el formulario ha sido cargado correctamente con los datos del servicio.
   * Se utiliza para mostrar u ocultar elementos en la interfaz según el estado de carga.
   * @type {boolean}
   */
  formularioCargado: boolean = false;


  /**
   * Identificador único del trámite asociado a este componente.
   * @default '110209'
   */
  tramites: string = '110209';

  /**  
  * Contiene el estado actual de la solicitud del trámite 110209.  
  * Permite acceder y manipular los datos relacionados con el flujo del trámite.  
  */
  public solicitudState!: Tramite110209State;

  /**
   * Constructor del componente.
   * Servicio para la creación de formularios reactivos y para obtener datos de transporte.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {TransporteService} service - Servicio para obtener datos de transporte.
   * @param {Tramite110209Store} tramite110209Store - Servicio para manejar el estado del trámite.
   * @param {Tramite110209Query} tramite110209Query - Servicio para consultar el estado del trámite.
   */
  constructor(private fb: FormBuilder, private service: TransporteService, private tramite110209Store: Tramite110209Store,
     private tramite110209Query: Tramite110209Query,
      private consultaQuery: ConsultaioQuery,private catalogoService: CatalogoServices) {
    this.transporteForm = this.fb.group({
      medioDeTransporte: ['',Validators.required],
      rutaCompleta: ['',Validators.pattern(/^(?!\s)(.*\S)?$/)],
      puertoDeEmbarque: ['',Validators.pattern(/^(?!\s)(.*\S)?$/)],
      puertoDeDesembarque: ['',Validators.pattern(/^(?!\s)(.*\S)?$/)]
    });

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
          this.actualizarEstadoCampos();
        })
      )
      .subscribe();
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene las opciones de medio de transporte y los valores del store.
   */
  ngOnInit(): void {
    this.obtenerMedioTransporte();
    this.getValoresStore();
  }

  /**
   * Habilita o deshabilita dinámicamente los campos del formulario
   * según el estado de solo lectura del formulario.
   *
   * @returns void
   * @description Si el formulario está en modo solo lectura, deshabilita ambos campos; de lo contrario, los habilita.
   */
  actualizarEstadoCampos(): void {
    const CAMPOS = [
      'medioDeTransporte',
      'rutaCompleta',
      'puertoDeEmbarque',
      'puertoDeDesembarque'
    ];
    CAMPOS.forEach(campo => {
      const CONTROL = this.transporteForm.get(campo);
      if (CONTROL) {
        if (this.esFormularioSoloLectura) {
          CONTROL.disable();
        } else {
          CONTROL.enable();
        }
      }
    });
  }



  /**
   * Establece los valores en el store.
   * @param {FormGroup} form - El formulario del cual se obtienen los valores.
   * @param {string} campo - El nombre del campo del formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    // Obtiene el valor del campo especificado en el formulario
    const VALOR = form.get(campo)?.value;
    // Actualiza el store con el nuevo valor para el campo correspondiente
    this.tramite110209Store.setTramite110209({ [campo]: VALOR });
  }

  /**
   * Obtiene los valores del store y los asigna al formulario.
   */
  getValoresStore(): void {
    this.tramite110209Query.selectTramite110209$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite110209State;
        })
      )
      .subscribe();

    // Inicializa el formulario con el valor 'medio' del estado de la solicitud
    this.transporteForm = this.fb.group({
      medioDeTransporte: [this.solicitudState.medioDeTransporte],
      rutaCompleta: [this.solicitudState.rutaCompleta],
      puertoDeEmbarque: [this.solicitudState.puertoDeEmbarque],
      puertoDeDesembarque: [this.solicitudState.puertoDeDesembarque]
    });
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
    if (this.transporteForm.valid) {
      return true;
    }
    this.transporteForm.markAllAsTouched();
    return false;
  }


  /**
   * Obtiene el catálogo de medios de transporte utilizando el servicio `catalogoService`
   * y actualiza la propiedad `medio` con los datos recibidos.
   * 
   * Realiza la petición pasando los trámites actuales (`this.tramites`) y gestiona la suscripción
   * para que se cancele automáticamente cuando el componente se destruya, usando `destroyNotifier$`.
   * 
   * @remarks
   * Los datos recibidos se asignan a la propiedad `medio`. Si la respuesta no contiene datos,
   * se asigna un arreglo vacío.
   */
  obtenerMedioTransporte(): void {
    this.catalogoService.medioTransporteCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.medioDeTransporteOptions = response?.datos ?? [];
        this.formularioCargado = true;
        }
      });
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