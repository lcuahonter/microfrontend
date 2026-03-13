import { Component, Input, OnDestroy, OnInit } from '@angular/core'; // Importa las clases base para componentes de Angular.
import { CommonModule } from '@angular/common'; // Importa funcionalidades comunes de Angular.

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa clases para formularios reactivos.
import { Subject, map, takeUntil } from 'rxjs'; // Importa clases para manejar observables y suscripciones.

import { EXPOSICION_RADIO_OPCIONS, MODALIDAD_RADIO_OPCIONS } from '../../constantes/permiso-de-exportacion.enum'; // Importa constantes para opciones de radio.

import { Catalogo, CatalogoSelectComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src'; // Importa componentes y modelos compartidos.
import { Solicitud280101State, Tramite280101Store } from '../../../../estados/tramite/tramite280101.store'; // Importa el estado y el store del trámite.
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service'; // Importa el servicio de permisos de exportación.
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query'; // Importa la consulta para el estado del trámite.



/**
 * Componente que representa la solicitud del trámite 280101.
 * 
 * Este componente utiliza un formulario reactivo para gestionar los datos de la solicitud,
 * incluyendo opciones de modalidad, exposición, aduanas, y otros campos relacionados.
 * También interactúa con un store para manejar el estado del trámite y un servicio para
 * obtener datos necesarios como el catálogo de aduanas.
 * 
 * @remarks
 * - El componente es independiente (`standalone`) y utiliza varios módulos y componentes reutilizables.
 * - Implementa las interfaces `OnInit` y `OnDestroy` para manejar la inicialización y limpieza de recursos.
 * 
 * @example
 * ```html
 * <app-solicitud></app-solicitud>
 * ```
 */
@Component({
  selector: 'app-solicitud', // Define el selector del componente.
  templateUrl: './solicitud.component.html', // Ruta al archivo de plantilla HTML del componente.
  styleUrl: './solicitud.component.scss', // Ruta al archivo de estilos SCSS del componente.
  standalone: true, // Indica que el componente es independiente y no necesita declararse en un módulo.
  imports: [
    CatalogoSelectComponent, // Componente reutilizable para desplegar catálogos en listas desplegables.
    CommonModule, // Módulo común de Angular para funcionalidades básicas.
    InputRadioComponent, // Componente reutilizable para opciones de radio.
    ReactiveFormsModule, // Módulo para trabajar con formularios reactivos.
    TituloComponent // Componente reutilizable para mostrar títulos.
  ]
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Opciones de radio para la modalidad.
   */
  public radioOpcions = MODALIDAD_RADIO_OPCIONS;

  /**
   * Catálogo de aduanas.
   */
  aduana: Catalogo[] = [];

  /**
   * Opciones de radio para la exposición.
   */
  exposicionRadioOpcions = EXPOSICION_RADIO_OPCIONS;

  /**
   * Valor seleccionado en las opciones de radio.
   */
  public valorSeleccionado!: string;

  /**
   * Estado de la solicitud 280101.
   */
  private solicitudState!: Solicitud280101State;

  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los campos del formulario no serán editables.
   * 
   * @default false
   */
  @Input() soloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param service Servicio de permisos de exportación.
   * @param store Store para manejar el estado del trámite.
   * @param query Query para obtener el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private service: PermisoDeExportacionService,
    private store: Tramite280101Store,
    private query: Tramite280101Query
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.getAduana(); // Obtiene el catálogo de aduanas.

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$), // Finaliza la suscripción al destruir el componente.
        map((seccionState) => {
          this.solicitudState = seccionState; // Asigna el estado de la solicitud.
        })
      )
      .subscribe();

    this.establecerValoresFormulario(); // Establece los valores iniciales del formulario.
  }

  /**
   * Establece los valores iniciales del formulario `SolicitudForm` utilizando el estado de la solicitud.
   */
  establecerValoresFormulario(): void {
    this.solicitudForm = this.fb.group({
      modalidadOpcion: [this.solicitudState?.modalidadOpcion, [Validators.required]], // Campo obligatorio para la modalidad.
      exposicionOpcion: [this.solicitudState?.exposicionOpcion, [Validators.required]], // Campo obligatorio para la exposición.
      nombre: [this.solicitudState?.nombre, [Validators.required]], // Campo obligatorio para el nombre.
      aduana: [this.solicitudState?.aduana, [Validators.required]], // Campo obligatorio para la aduana.
      aduanaEntrada: [this.solicitudState?.aduanaEntrada], // Campo opcional para la aduana de entrada.
      descripcionClobGenerica: [this.solicitudState?.descripcionClobGenerica, [Validators.required]], // Campo obligatorio para la descripción genérica.
      cantMonumentos: [this.solicitudState?.cantMonumentos, [Validators.required]], // Campo obligatorio para la cantidad de monumentos.
    });

    if (this.solicitudForm.get('exposicionOpcion')?.value === "false") {
      this.solicitudForm.get('nombre')?.disable(); // Deshabilita el campo de nombre si la opción de exposición es "false".
    }
    if(this.soloLectura) {
      this.solicitudForm.disable(); // Deshabilita todo el formulario si está en modo solo lectura.
    }
  }

  /**
   * Actualiza el estado del store con los valores del formulario.
   * @param form Formulario reactivo que contiene los valores.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Método del store que se utilizará para guardar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite280101Store
  ): void {
    const VALOR = form.get(campo)?.value; // Obtiene el valor del campo.
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR); // Actualiza el store con el valor.
    if (campo === "exposicionOpcion" && VALOR === "true") {
      this.solicitudForm.get('nombre')?.enable(); // Habilita el campo de nombre si la opción de exposición es "true".
    }
    else if (campo === "exposicionOpcion" && VALOR === "false") {
    this.solicitudForm.get('nombre')?.disable();
}
  }

  /**
   * Obtiene el catálogo de aduanas desde el servicio.
   */
  getAduana(): void {
    this.service
      .getAduana()
      .pipe(takeUntil(this.destroyNotifier$)) // Finaliza la suscripción al destruir el componente.
      .subscribe((data: Catalogo) => {
        this.aduana = Array.isArray(data) ? data : [data]; // Asigna los datos al catálogo de aduanas.
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica la destrucción del componente.
    this.destroyNotifier$.complete(); // Completa el Subject.
  }
}