import { AbstractControl,FormBuilder,FormGroup,ReactiveFormsModule,ValidationErrors,Validators} from '@angular/forms';
import { Agregar220401Store, Solicitud220401State } from '../../../../estados/tramites/agregar220401.store';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, REGEX_DESCRIPCION_ESPECIALES,REGEX_LEADING_SPACES} from '@ng-mf/data-access-user';
import { Subject,map,takeUntil } from 'rxjs';
import { AgregarQuery } from '../../../../estados/queries/agregar.query';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';
import aduanasJson from '@libs/shared/theme/assets/json/220401/umc.json';
import sexoJson from '@libs/shared/theme/assets/json/220401/sexo.json';

/**
 * @component
 * @description
 * Componente que maneja la selección de aduanas y otros datos generales de animales para el trámite 220401.
 * Permite la captura y validación de información relacionada con la mercancía animal, incluyendo fracción arancelaria,
 * tratamiento, presentación, marca de embarque, fecha de caducidad, aduana, CITES, nombre de identificación, raza, edad,
 * sexo y color. Soporta modo solo lectura y emite eventos para cancelar la acción.
 */
@Component({
  selector: 'app-datos-generales-animales',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
  ],
  templateUrl: './datos-generales-animales.component.html',
  styleUrl: './datos-generales-animales.component.scss',
})
export class DatosGeneralesAnimalesComponent implements OnInit, OnDestroy {
  /**
   * Evento emitido al cancelar la acción desde el formulario.
   */
  @Output() cancelar = new EventEmitter<void>();

  /**
   * Grupo de controles de formulario para los datos generales de animales.
   */
  frmMercanciaAnimal!: FormGroup;

  /**
   * Sujeto para limpiar las suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud del trámite 220401.
   */
  public solicitudState!: Solicitud220401State;

  /**
   * Catálogo de aduanas para el primer select.
   */
  aduanas: Catalogo[] = aduanasJson;

  /**
   * Catálogo de sexo para el segundo select.
   */
  sexo: Catalogo[] = sexoJson;

  /**
   * Aduana seleccionada en el primer select.
   */
  selectedAduana: Catalogo = { id: 0, descripcion: '' };

  /**
   * Aduana seleccionada en el segundo select.
   */
  selectedAduanaOne: Catalogo = { id: 0, descripcion: '' };

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * Cuando es verdadero, los campos del formulario no serán editables.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Suscribe al estado de solo lectura y llama a la inicialización del formulario.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param agregar220401Store Store para manejar el estado del trámite.
   * @param agregarQuery Servicio para consultar el estado de la solicitud.
   * @param consultaioQuery Servicio para consultar el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder, 
    private agregar220401Store: Agregar220401Store,
    private agregarQuery: AgregarQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState)=>{
          this.esFormularioSoloLectura = seccionState.readonly; 
          this.inicializarGeneralesFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Validador personalizado para validar una descripción especial.
   * Verifica si el valor ingresado cumple con las reglas de caracteres permitidos y no tiene espacios al principio.
   * @param control - El control de formulario que contiene el valor a validar.
   * @returns Un objeto de error de validación si el valor no cumple con las reglas, o `null` si es válido.
   */
  static descripcionEspecialesValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALUE = control.value;
    if (
      REGEX_LEADING_SPACES.test(VALUE) ||
      !REGEX_DESCRIPCION_ESPECIALES.test(VALUE)
    ) {
      return { descripcionEspeciales: 'Ingresa datos válidos.' };
    }
    return null;
  }

  /**
   * Validador personalizado para regla de descripción especial.
   * @param control - El control de formulario a validar.
   * @returns Un objeto de error de validación o nulo.
   */
  static descripcionValidator(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (VALUE && VALUE.length > 0) {
      return null;
    }
    return { descripcion: true };
  }

  /**
   * Validador personalizado para verificar si el valor está dentro del rango especificado.
   * @param min - El valor mínimo.
   * @param max - El valor máximo.
   * @returns Una función de validación.
   */
  static valueRangeValidator(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const VALUE = parseFloat(control.value);
      if (isNaN(VALUE) || VALUE < min || VALUE > max) {
        return { valueRange: true };
      }
      return null;
    };
  }

  /**
   * Inicializa el componente y configura el grupo de formularios con reglas de validación.
   */
  ngOnInit(): void {
    this.inicializarGeneralesFormulario();
  }

  /**
   * Inicializa el formulario reactivo para la sección de datos generales de animales.
   * Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud y actualizar la propiedad `solicitudState`.
   * Crea el formulario `frmMercanciaAnimal` con los controles y validadores necesarios para cada campo.
   */
  inicializarFormulario():void{
    this.agregarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.frmMercanciaAnimal = this.fb.group({
      fraccionArancelaria: [
        this.solicitudState?.fraccionArancelaria || '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      tratamiento: [
        '',
        [
          Validators.maxLength(1000),
          DatosGeneralesAnimalesComponent.descripcionEspecialesValidator,
        ],
      ],
      presentacion: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*.?[0-9]+$'),
          DatosGeneralesAnimalesComponent.valueRangeValidator(0.01, 999999999999.99),
        ],
      ],
      marcaEmbarque: [
        '',
        [
          Validators.maxLength(30),
          DatosGeneralesAnimalesComponent.descripcionValidator,
        ],
      ],
      fechaCaducidad: [
        this.solicitudState?.fechaCaducidad || '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*.?[0-9]+$'),
          DatosGeneralesAnimalesComponent.valueRangeValidator(0.01, 999999999999.99),
        ],
      ],
      aduana: [this.solicitudState?.aduana || '',[ Validators.required]],
      cites: ['', Validators.maxLength(15)],
      nombreIdentificacion: [
        this.solicitudState?.nombreIdentificacion || '',
        [
          Validators.required,
          Validators.maxLength(200),
          DatosGeneralesAnimalesComponent.descripcionEspecialesValidator,
        ],
      ],
      numeroAutorizacionCITES: [ this.solicitudState?.raza || '',[Validators.maxLength(15)]],
      raza: [
        this.solicitudState?.raza || '',
        [
          Validators.maxLength(50),
          DatosGeneralesAnimalesComponent.descripcionEspecialesValidator,
        ],
      ],
      edadAnimal: [
        this.solicitudState?.edadAnimal || '',
        [
          Validators.required,
          Validators.maxLength(50),
          DatosGeneralesAnimalesComponent.descripcionEspecialesValidator,
        ],
      ],
      sexo:[ this.solicitudState?.sexo || '' ],
      color: [
        this.solicitudState?.color || '',
        [
          Validators.maxLength(30),
          DatosGeneralesAnimalesComponent.descripcionEspecialesValidator,
        ],
      ],
    });
  }

  /**
   * Inicializa el formulario de datos generales de animales.
   * Si el formulario está en modo solo lectura, guarda los datos actuales del formulario.
   * De lo contrario, inicializa el formulario para su edición.
   */
  inicializarGeneralesFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
  }

  /**
   * Guarda los datos del formulario de mercancía animal.
   * Inicializa el formulario y ajusta su estado según el modo de solo lectura.
   * Si el formulario está en modo solo lectura, lo deshabilita.
   * Si no está en modo solo lectura, lo habilita.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.frmMercanciaAnimal.disable();
    } else{
      this.frmMercanciaAnimal.enable();
    } 
  }

  /**
   * Maneja la selección de una aduana en el segundo select.
   * @param e - La aduana seleccionada.
   */
  aduanaSeleccionOne(e: Catalogo): void {
    this.selectedAduanaOne = e;
  }

  /**
   * Obtiene la descripción de la fracción arancelaria y la asigna al formulario.
   */
  obtenerDescripcionFraccion(): void {
    this.frmMercanciaAnimal
      .get('descFraccionArancelaria')
      ?.setValue('Descripción de la fracción');
  }

  /**
   * Limpia los datos capturados en el formulario de mercancía.
   */
  limpiarDatosCapturaMercancia(): void {
    this.frmMercanciaAnimal.reset();
  }

  /**
   * Establece los valores en el store de textiles.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo.
   * @param metodoNombre - El método del store a invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Agregar220401Store): void {
    const VALOR = form.get(campo)?.value;
    (this.agregar220401Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Método que se ejecuta al cancelar la acción.
   * Emite un evento de cancelación.
   */
  onCancelar(): void {
    this.cancelar.emit();
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Emite una señal para cancelar todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
