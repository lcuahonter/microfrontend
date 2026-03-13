/* eslint-disable @nx/enforce-module-boundaries */
/**
 * @module InformacionDeLaComponent
 * @description Este módulo define el componente `InformacionDeLaComponent` que maneja la información de la mercancía.
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud301State,
  Tramite301Store,
} from '../../../../core/estados/tramites/tramite301.store';
import { map, takeUntil } from 'rxjs/operators';
import { BtnContinuarComponent } from 'libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from 'libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';
import estadofisico from 'libs/shared/theme/assets/json/130102/entidad_federativa.json';
import franccionArancelaria from 'libs/shared/theme/assets/json/301/fraccion-arancelaria-options.json';
import nico from 'libs/shared/theme/assets/json/301/nico-options.json';

/**
 * Componente que gestiona la información de la mercancía para el trámite 301.
 *
 * Este componente permite capturar, mostrar y validar los datos relacionados con la fracción arancelaria,
 * NICO, estado físico y otros campos requeridos para la solicitud. Integra formularios reactivos,
 * catálogos y controles de visualización para campos dependientes.
 *
 * @component
 * @example
 * <app-informacion-de-la></app-informacion-de-la>
 */
@Component({
  selector: 'app-informacion-de-la',
  templateUrl: './informacion-de-la.component.html',
  styleUrl: './informacion-de-la.component.scss',
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CommonModule,
    BtnContinuarComponent,
    CatalogoSelectComponent,
  ],
  standalone: true,
})

export class InformacionDeLaComponent implements OnInit, OnDestroy {

  /**
   * @property {FormGroup} informacionDeLaform - Formulario principal del componente.
   */
  informacionDeLaform!: FormGroup;

  /**
   * @property {CatalogosSelect} fraccionArancelariaOptions - Opciones del catálogo de fracción arancelaria.
   */
  fraccionArancelariaOptions: Catalogo[] = franccionArancelaria;

  /**
   * @property {CatalogosSelect} nicoOptions - Opciones del catálogo de Nico.
   */
  nicoOptions: Catalogo[] = nico;

  /**
   * @property {CatalogosSelect} estadoFisicoOptions - Opciones del catálogo de estado físico.
   */
  estadoFisicoOptions: Catalogo[] = estadofisico;

  /**
   * @property {number} indice - Índice del paso actual.
   */
  indice: number = 1;

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
   * @constructor
   * @param {FormBuilder} formbuilt - Instancia de FormBuilder para crear formularios.
   */
  constructor(
    private formbuilt: FormBuilder,
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
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al iniciar el componente.  
   * Llama a la función que determina cómo inicializar el formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
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

    this.informacionDeLaform = this.formbuilt.group({
      fraccionArancelaria: [
        this.solicitudState?.fraccionArancelaria,
        Validators.required,
      ],
      descripcionFraccion: [{value: this.solicitudState?.descripcionFraccion, disabled: true}],
      nico: [this.solicitudState?.nico, Validators.required],
      descripcionNico: [{value: this.solicitudState?.descripcionNico, disabled: true}],
      nombreQuimico: [this.solicitudState?.nombreQuimico, [Validators.required, Validators.maxLength(256)]],
      nombreComercial: [
        this.solicitudState?.nombreComercial,
        [Validators.required, Validators.maxLength(256)]
      ],
      numeroCAS: [this.solicitudState?.numeroCAS, [Validators.required, Validators.maxLength(120)]],
      estadoFisico: [this.solicitudState?.estadoFisico, Validators.required],
      acondicionamiento: [
        this.solicitudState?.acondicionamiento,
        Validators.required,
      ],
    });
    this.valorSeleccionadoFraccion(); // enable descripcionFraccion if fraccionArancelaria has value
    this.valorSeleccionadoNico(); // enable descripcionNico if nico has value
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.informacionDeLaform.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.informacionDeLaform.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
}

  /**
   * @method valorSeleccionadoFraccion
   * @description Maneja el evento de selección de una fracción arancelaria.
   * @param {any} valor - Valor seleccionado.
   * @memberof InformacionDeLaComponent
   */
  valorSeleccionadoFraccion(): void {
    if (this.informacionDeLaform.get('fraccionArancelaria')?.value) {
      const VALOR = InformacionDeLaComponent.obtenerDescripcion(this.fraccionArancelariaOptions, this.informacionDeLaform.get('fraccionArancelaria')?.value);
      this.informacionDeLaform.get('descripcionFraccion')?.setValue(VALOR);
    } else {
      this.informacionDeLaform.get('descripcionFraccion')?.setValue('');
    }
  }

  /**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], id: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => Number(ele.id) === Number(id))?.descripcion;
    return DESCRIPCION ?? '';
  }

  /**
   * @method valorSeleccionadoNico
   * @description Maneja el evento de selección de un Nico.
   * @param {any} valor - Valor seleccionado.
   * @memberof InformacionDeLaComponent
   */
  valorSeleccionadoNico(): void {
    if (this.informacionDeLaform.get('nico')?.value) {
      const VALOR = InformacionDeLaComponent.obtenerDescripcion(this.nicoOptions, this.informacionDeLaform.get('nico')?.value);
      this.informacionDeLaform.get('descripcionNico')?.setValue(VALOR);
    } else {
      this.informacionDeLaform.get('descripcionNico')?.setValue('');
    }
  }

  /**
   * Maneja el evento de continuar al siguiente paso.
   * @method continuar
   * @memberof InformacionDeLaComponent
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
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  esInvalido(campo: string): boolean | null {
    const CAMPO = this.informacionDeLaform.get(campo);
    return CAMPO ? CAMPO.invalid && CAMPO.touched : null;
  }

  /**
   * Valida el formulario actual.
   *
   * - Si el formulario no está inicializado retorna false.
   * - Marca todos los controles como "touched" para forzar la visualización
   *   de mensajes de validación en la UI.
   * - Devuelve true si el formulario es válido, false en caso contrario.
   *
   * @returns {boolean} Estado de validez del formulario.
   */
  validarFormulario(): boolean {
    if (!this.informacionDeLaform) {
      return false;
    }
    this.informacionDeLaform.markAllAsTouched();
    return this.informacionDeLaform.valid;
  }

  /**
   * Maneja el evento de continuar al siguiente paso.
   * @method continuar
   * @memberof InformacionDeLaComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}