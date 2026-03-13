import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';

import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { TituloComponent } from '@ng-mf/data-access-user';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Agregar220401Store, Solicitud220401State } from '../../../../estados/tramites/agregar220401.store';
import { AgregarQuery } from '../../../../estados/queries/agregar.query';

/**
 * @component
 * @description
 * Componente que gestiona el formulario de pago de derechos de importación o exportación.
 * Permite capturar información sobre la mercancía y el pago de derechos, validando los campos y habilitando/deshabilitando
 * ciertos campos según las selecciones del usuario. Integra catálogos para justificación y banco, y soporta modo solo lectura.
 */
@Component({
  selector: 'app-pago-de-derecho',
  templateUrl: './pago-de-derecho.component.html',
  styleUrls: ['./pago-de-derecho.component.scss'],
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule, CatalogoSelectComponent],
  standalone: true,
})
export class PagoDeDerechoComponent implements OnInit, OnDestroy {
  /**
   * Grupo de controles de formulario utilizado para gestionar y validar los datos ingresados en la solicitud.
   * Este objeto se utiliza para agrupar y controlar los campos del formulario relacionados con el pago de derecho en el trámite.
   */
  FormSolicitud!: FormGroup;

  /**
   * Notificador privado para cancelar las suscripciones y evitar fugas de memoria.
   * Se utiliza en los operadores takeUntil de RxJS.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud del trámite 220401.
   * Almacena los datos de la solicitud para ser utilizados y actualizados en el formulario de pago de derecho.
   */
  public solicitudState!: Solicitud220401State;

  /**
   * Respuesta seleccionada por el usuario.
   * Almacena la respuesta seleccionada en el formulario.
   */
  answer: string = '';

  /**
   * Opciones disponibles para justificar el pago.
   * Arreglo de catálogos que contiene las opciones de justificación para el pago de derechos.
   * Se utiliza para poblar el campo de justificación en el formulario.
   */
  public Justificacion!: Catalogo[];

  /**
   * Opciones disponibles para seleccionar el banco.
   * Arreglo de catálogos que contiene las opciones de banco para el pago de derechos.
   * Se utiliza para poblar el campo de banco en el formulario.
   */
  public Banco!: Catalogo[];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Determina si los campos del formulario deben estar deshabilitados para evitar modificaciones.
   * Se utiliza para controlar la habilitación o deshabilitación de los campos del formulario según el estado de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente PagoDeDerecho.
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param agregar220401Store Store para manejar el estado relacionado con el trámite 220401.
   * @param agregarQuery Servicio para consultar el estado de la agregación.
   * @param consultaioQuery Servicio para consultar el estado de la sección IO.
   *
   * Al inicializar, se suscribe al estado de consultaioQuery para:
   * - Actualizar la propiedad `esFormularioSoloLectura` según el estado de solo lectura.
   * - Inicializar el formulario de derecho llamando a `inicializarDerechoFormulario()`.
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
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
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Validador estático que verifica si la fecha ingresada es futura.
   * @returns ValidatorFn
   */
  static validadorDeFechaFutura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      const SELECTED_DATE = new Date(control.value);
      const TODAY = new Date();
      SELECTED_DATE.setHours(0, 0, 0, 0);
      TODAY.setHours(0, 0, 0, 0);
      return SELECTED_DATE > TODAY ? { futureDate: true } : null;
    };
  }

  /**
   * Validador estático que verifica si el valor numérico no excede un valor máximo.
   * @param maxValue El valor máximo permitido.
   * @returns ValidatorFn
   */
  static maxTextValueValidator(maxValue: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }
    const numericValue = Number(control.value);
    if (isNaN(numericValue)) {
      return { notANumber: true };
    }
    return numericValue > maxValue ? { max: { maxValue, actual: numericValue } } : null;
  };
}

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa las opciones de justificación y banco, y define el grupo de formulario con sus controles y validadores.
   * Configura la lógica que habilita o deshabilita campos dependiendo de la selección del valor `exentoDePago`.
   */
  ngOnInit(): void {
    this.inicializarDerechoFormulario();
  }

  /**
   * Inicializa el formulario de derecho según el modo de la vista.
   * Si el formulario está en modo solo lectura, guarda los datos actuales del formulario llamando a `guardarDatosFormulario()`.
   * De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   */
  inicializarDerechoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario de solicitud de pago de derecho.
   * - Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud y lo asigna a `solicitudState`.
   * - Llama a los métodos `getJustificacion` y `getBanco` para obtener las opciones necesarias para los campos del formulario.
   * - Crea el formulario reactivo `FormSolicitud` con los campos requeridos y sus validaciones correspondientes, utilizando los valores del estado si están disponibles.
   * - Inicializa la lógica para actualizar los campos del formulario según el valor inicial de `exentoDePago`.
   * - Suscribe a los cambios del campo `exentoDePago` para actualizar dinámicamente los campos del formulario cuando este valor cambie.
   */
  inicializarFormulario(): void {
    this.agregarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.getJustificacion();
    this.getBanco();
    this.FormSolicitud = this.fb.group({
      exentoDePago: [this.solicitudState?.exentoDePago || 'No', Validators.required],
      Justificacion: [this.solicitudState?.Justificacion || '', [Validators.required]],
      nombreImportExport: ['', Validators.required],
      rfcImportExport: ['', Validators.required],
      cadenaDependencia: ['', Validators.required],
      Banco: [this.solicitudState?.Banco],
      llaveDePago: [this.solicitudState?.llaveDePago],
      fechaPago: [
        this.solicitudState?.fechaPago,
        [Validators.required, PagoDeDerechoComponent.validadorDeFechaFutura()]
      ],
      importePago: ['', [Validators.required,PagoDeDerechoComponent.maxTextValueValidator(10000000000000000)]],
    });

    // Se activa la lógica para actualizar campos según el valor inicial de 'exentoDePago'
    this.updateFormFieldsBasedOnExentoDePago('No');

    // Escucha los cambios en el valor de 'exentoDePago' y actualiza los campos del formulario
    this.FormSolicitud.get('exentoDePago')?.valueChanges.subscribe((value) => {
      this.updateFormFieldsBasedOnExentoDePago(value);
    });
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de habilitación del mismo según el modo de solo lectura.
   * Inicializa el formulario antes de aplicar los cambios. Si el formulario está en modo solo lectura,
   * lo deshabilita para evitar modificaciones. Si no está en modo solo lectura, lo habilita para permitir ediciones.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.FormSolicitud.disable();
    } else {
      this.FormSolicitud.enable();
    }
  }

  /**
   * Actualiza los campos del formulario en función del valor de 'exentoDePago'.
   * Si el valor es 'No', se habilitan los campos necesarios y se asignan valores predeterminados.
   * Si el valor es 'Sí', los campos se deshabilitan y se resetean.
   * @param value El valor de 'exentoDePago' para determinar cómo actualizar los campos del formulario.
   */
  updateFormFieldsBasedOnExentoDePago(value: string): void {
    if (value === 'No') {
      this.FormSolicitud.get('rfcImportExport')?.setValue('454000554');
      this.FormSolicitud.get('cadenaDependencia')?.setValue('0001012A0000EX');
      this.FormSolicitud.get('importePago')?.setValue('594.0');
      this.FormSolicitud.get('fechaPago')?.enable();
      this.FormSolicitud.get('llaveDePago')?.enable();

      this.FormSolicitud.get('rfcImportExport')?.enable();
      this.FormSolicitud.get('cadenaDependencia')?.enable();
      this.FormSolicitud.get('importePago')?.enable();
    } else {
      this.FormSolicitud.get('rfcImportExport')?.reset();
      this.FormSolicitud.get('cadenaDependencia')?.reset();
      this.FormSolicitud.get('importePago')?.reset();

      this.FormSolicitud.get('fechaPago')?.disable();
      this.FormSolicitud.get('llaveDePago')?.disable();
      this.FormSolicitud.get('rfcImportExport')?.disable();
      this.FormSolicitud.get('cadenaDependencia')?.disable();
      this.FormSolicitud.get('importePago')?.disable();
    }
  }

  /**
   * Asigna al store el valor de un campo de formulario usando el método especificado.
   * @param form Grupo de formulario que contiene el campo.
   * @param campo Nombre del control dentro del formulario.
   * @param metodoNombre Nombre del método del store (`Agregar220401Store`) que recibirá el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Agregar220401Store): void {
    const VALOR = form.get(campo)?.value;
    (this.agregar220401Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Obtiene las opciones de justificación para el pago de derechos.
   * En este caso, las opciones son 'Sí' o 'No'.
   */
  public getJustificacion(): void {
    this.Justificacion = [
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ];
  }

  /**
   * Obtiene las opciones de banco disponibles.
   * En este caso, las opciones son 'Sí' o 'No'.
   */
  public getBanco(): void {
    this.Banco = [
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ];
  }

  /**
   * Valida el formulario de pago de derecho.
   * Verifica si el formulario es inválido y permite implementar lógica adicional en caso de que no cumpla con las validaciones.
   * Se puede utilizar para mostrar mensajes de error o evitar el envío del formulario si hay campos inválidos.
   */
  validarFormulario(): void {
    if (this.FormSolicitud.invalid) {
      // Aquí se puede agregar lógica para manejar el formulario inválido
    }
  }

  /**
   * Limpia el campo 'fechaPago' del formulario.
   */
  borrarFechaPago(): void {
    this.FormSolicitud.get('fechaPago')?.setValue('');
    this.FormSolicitud.get('fechaPago')?.markAsPristine();
    this.FormSolicitud.get('fechaPago')?.markAsUntouched();
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Emite una señal para cancelar todas las suscripciones activas y evitar fugas de memoria.
   * Cancela las suscripciones y libera recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
