/* eslint-disable @nx/enforce-module-boundaries */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud301State, Tramite301Store } from '../../../../core/estados/tramites/tramite301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from 'libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';

/**
 * Componente `DeLaMuestraComponent`
 *
 * Este componente gestiona una solicitud que incluye un formulario relacionado
 * con la toma de muestras de un producto. Ofrece funcionalidades como la
 * habilitación/deshabilitación de campos según la selección de un valor en
 * un catálogo, validación de formularios y la inicialización de datos relevantes.
 *
 * @component
 * @example
 * <app-de-la-muestra></app-de-la-muestra>
 */
@Component({
  selector: 'app-de-la-muestra',
  templateUrl: './de-la-muestra.component.html',
  styleUrls: ['./de-la-muestra.component.scss'],
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent],
  standalone: true,
})
export class DeLaMuestraComponent implements OnInit, OnDestroy {

  /**
   * Referencia al elemento del modal de confirmación en la plantilla.
   * Se utiliza para controlar la visualización del modal mediante código.
   *
   * @type {ElementRef}
   * @memberof DeLaMuestraComponent
   * @example
   * this.modalConfirmacionRef.nativeElement.show();
   */
  @ViewChild('modalConfirmacionRef') modalConfirmacionRef!: ElementRef;


  /**
   * Datos del catálogo relacionados con la mercancía.
   *
   * @type {Catalogo[]}
   */
  public mercancia!: Catalogo[];

  /**
   * Formulario reactivo que contiene los datos de la solicitud.
   * Incluye el campo obligatorio `folio` dentro de `datosImportadorExportador`.
   *
   * @type {FormGroup}
   */
  Informaciondela!: FormGroup;

  /**
   * Estado de la solicitud de la sección 301.
   */
  public solicitudState!: Solicitud301State;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor del componente `DeLaMuestraComponent`.
   *
   * Inicializa el formulario utilizando el `FormBuilder` de Angular.
   *
   * @param {FormBuilder} fb - Inyecta el servicio `FormBuilder` para la creación del formulario.
   */
  constructor(
    private fb: FormBuilder,
    private tramite301Store: Tramite301Store,
    private tramite301Query: Tramite301Query,
    private consultaioQuery: ConsultaioQuery,
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
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Método del ciclo de vida que se ejecuta al iniciar el componente.  
   * Llama a la función para inicializar el estado del formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
    this.getMercancia();
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.tramite301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.Informaciondela = this.fb.group({
      datosImportadorExportador: this.fb.group({
        folio: [{value: this.solicitudState?.folio, disabled: true}, [Validators.required, Validators.maxLength(25)]],
        mercancia: [this.solicitudState?.mercancia, Validators.required],
      }),
    });
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.Informaciondela.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.Informaciondela.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }

  /**
   * Método que inicializa el objeto `mercancia` con datos predeterminados.
   * Estos datos se utilizan para llenar el catálogo de opciones disponibles para el usuario,
   * que incluyen "Sí" y "No" como posibles respuestas a una pregunta sobre el registro de muestras.
   *
   * @returns {void} No retorna nada, ya que solo inicializa el objeto `mercancia`.
   *
   * @example
   * component.getMercancia();
   */
  public getMercancia(): void {
    this.mercancia = [
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ];
  }

  /**
   * Habilita o deshabilita el campo `folio` dependiendo del valor seleccionado en `mercancia`.
   * Si se selecciona "No", se deshabilita el campo `folio`, de lo contrario se habilita.
   *
   * @returns {void} No retorna nada.
   */
  mercanciaSeleccion(): void {
    if (
      this.Informaciondela.get('datosImportadorExportador.mercancia')?.value ===
      '2'
    ) {
      this.Informaciondela.get('datosImportadorExportador.folio')?.disable();
    } else {
      this.Informaciondela.get('datosImportadorExportador.folio')?.enable();
    }
  }

  /**
   * Método del ciclo de vida `ngOnDestroy()` de Angular.
   *
   * Este método se ejecuta cuando el componente es destruido y realiza las siguientes acciones:
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite301Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method sobreElCambioFolio
   * @description
   * Valida la longitud del campo `folio` dentro del formulario.
   * Si el valor del folio supera los 25 caracteres, muestra un modal de confirmación
   * utilizando la referencia al elemento del modal en la plantilla.
   *
   * Funcionalidad:
   * - Obtiene el valor del campo `folio` del formulario reactivo.
   * - Si la longitud del folio es mayor a 25 caracteres, muestra el modal de confirmación.
   *
   * @example
   * this.sobreElCambioFolio();
   * // Si el folio es demasiado largo, se muestra el modal de advertencia.
   */
  sobreElCambioFolio(): void {
    const FOLIO = this.Informaciondela.get('datosImportadorExportador.folio');
    if (FOLIO && FOLIO.value?.length > 25) {
      const MODAL = new bootstrap.Modal(this.modalConfirmacionRef.nativeElement);
      MODAL.show();
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  esInvalido(): boolean | null {
    const CAMPO = this.Informaciondela.get('datosImportadorExportador.folio');
    return CAMPO ? CAMPO.invalid && CAMPO.touched : null;
  }

  /**
   * Valida el formulario y fuerza la visualización de errores en todos los controles.
   * @returns {boolean} `true` si el formulario está inicializado y es válido; `false` en caso contrario.
   */
  validarFormulario(): boolean {
    // Si el formulario no está inicializado, considerarlo inválido.
    if (!this.Informaciondela) {
      return false;
    }

    // Marcar todos los controles como tocados para mostrar mensajes de validación.
    this.Informaciondela.markAllAsTouched();

    // Devolver el estado de validez del formulario.
    return this.Informaciondela.valid;
  }
  /**
   * Método del ciclo de vida `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente es destruido y realiza las siguientes acciones:
   *
   * @memberof PagoDeDerechosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}