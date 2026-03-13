import { Component, Input, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SeccionLibQuery, SeccionLibState } from '@ng-mf/data-access-user';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Catalogo } from '../../models/validar-inicialmente-certificado.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosCertificadoDeComponent } from '../../../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
/**
 * Componente para gestionar los datos del certificado.
 *
 * Este componente permite al usuario ingresar y gestionar información relacionada con el certificado,
 * como observaciones, idioma, entidad federativa y representación federal.
 */
@Component({
  selector: 'app-datos-certificado',
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CommonModule,
    DatosCertificadoDeComponent,
  ],
  templateUrl: './datos-certificado.component.html',
  styleUrl: './datos-certificado.component.scss',
  standalone: true,
})
export class DatosCertificadoComponent implements OnInit, OnDestroy {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  
  /**
   * Idioma: Indica si el idioma está habilitado o no.
   */
  idioma: boolean = true;

  /**
   * Observable que contiene la lista de idiomas disponibles.
   */
  idiomaDatos$!: Observable<Catalogo[]>;

  /**
   * Observable que contiene la lista de entidades federativas disponibles.
   */
  entidadFederativas$!: Observable<Catalogo[]>;

  /**
   * Observable que contiene la lista de representaciones federales disponibles.
   */
  representacionFederal$!: Observable<Catalogo[]>;

  /**
   * Valores actuales del formulario de datos del certificado.
   */
  formDatosCertificadoValues!: { [key: string]: unknown };

  /**
   * Formulario reactivo para los datos del certificado.
   */
  formDatosCertificado!: FormGroup;

  /**
   * Lista de idiomas disponibles.
   */
  idiomas: Catalogo[] = [];

  /**
   * Lista de entidades federativas disponibles.
   */
  entidadFederativas: Catalogo[] = [];

  /**
   * Lista de representaciones federales disponibles.
   */
  representacionFederal: Catalogo[] = [];

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;
  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
    * Estado de la sección, gestionado mediante el store.
    * @type {SeccionLibState}
    */
  private seccion!: SeccionLibState;

  /**
   * Referencia al componente hijo DatosCertificadoDeComponent
   * Permite acceder al formulario y métodos del componente hijo
   */
  @ViewChild(DatosCertificadoDeComponent)
  datosCertificadoDeRef!: DatosCertificadoDeComponent;

  /**
   * Constructor del componente.
   *
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {ValidarInicialmenteCertificadoService} ValidarInicialmenteCertificadoService - Servicio para obtener datos relacionados con el certificado.
   * @param {Tramite110214Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110214Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private validarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService,
    public store: Tramite110214Store,
    public tramiteQuery: Tramite110214Query,
    private seccionQuery: SeccionLibQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.tramiteQuery.formDatosCertificado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDatosCertificadoValues = estado;
      });

    /**
     * Suscripción al estado de la sección para obtener y actualizar el estado.
     */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    /**
     * Asignación de los observables que contienen los catálogos de datos a los que se puede suscribir el componente.
     */
    this.idiomaDatos$ = this.tramiteQuery.selectIdioma$;
    this.entidadFederativas$ = this.tramiteQuery.selectEntidadFederativa$;
    this.representacionFederal$ =
      this.tramiteQuery.selectrepresentacionFederal$;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Carga los datos iniciales, configura el formulario y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Getter para acceder al control del formulario, utilizado para la validación.
   * @returns FormControl del formulario.
   */
  get formularioControl(): FormControl {
    return this.formDatosCertificado.get('') as FormControl;
  }

  /**
   * Getter para acceder al formulario del componente hijo DatosCertificadoDeComponent
   * @returns FormGroup del componente hijo o null si no está disponible
   */
  get childForm(): FormGroup | null {
    return this.datosCertificadoDeRef?.formDatosCertificado || null;
  }

  /**
   * Método para validar el formulario del componente hijo
   * @returns boolean indicando si el formulario es válido
   */
  isChildFormValid(): boolean {
    return this.datosCertificadoDeRef?.validarFormularios() || false;
  }

  /**
   * Método para obtener un control específico del formulario hijo
   * @param controlName Nombre del control a obtener
   * @returns FormControl o null si no se encuentra
   */
  getChildFormControl(controlName: string): FormControl | null {
    return (this.childForm?.get(controlName) as FormControl) || null;
  }

  /**
   * Método para establecer valores en el formulario hijo
   * @param values Objeto con los valores a establecer
   */
  setChildFormValues(values: { [key: string]: unknown }): void {
    if (this.childForm) {
      this.childForm.patchValue(values);
    }
  }

  /**
   * Establece el estado de validez del formulario en el store.
   * @param valida Indica si el formulario es válido o no.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ datos: valida });
    this.store.setFormValidity('datosCertificado', valida);
  }

  /**
   * Método público para validar todos los formularios del componente datos-certificado.
   * Valida el formulario del componente hijo DatosCertificadoDeComponent y actualiza el estado.
   * @returns boolean indicando si todos los formularios son válidos
   */
  public validateAll(): boolean {
    let valid = true;

    if (this.datosCertificadoDeRef) {
      const ES_FORMULARIO_HIJO_VALIDO =
        this.datosCertificadoDeRef.validarFormularios();
      if (!ES_FORMULARIO_HIJO_VALIDO) {
        valid = false;
      }

      this.setFormValida(ES_FORMULARIO_HIJO_VALIDO);
    }

    return valid;
  }

  /**
   * Método que selecciona un idioma y actualiza el estado en el store.
   * @param estado El estado del idioma seleccionado.
   */
  idiomaSeleccion(estado: Catalogo): void {
    this.store.setIdiomaSeleccion(estado);
  }

  /**
   * Método que selecciona una representación federal y actualiza el estado en el store.
   * @param estado El estado de la representación federal seleccionada.
   */
  representacionFederalSeleccion(estado: Catalogo): void {
    this.store.setRepresentacionFederalDatosSeleccion(estado);
  }

  /**
   * Valida el formulario de datos del certificado.
   *
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario.
   */
  public validarFormulario(): boolean {
    let isValid = true;

    if (!this.formDatosCertificado) {
      return false;
    }

    if (this.formDatosCertificado.invalid) {
      this.formDatosCertificado.markAllAsTouched();
      isValid = false;
    }

    return isValid;
  }

  /**
   * Establece valores en el estado de la tienda para un formulario genérico de certificado.
   *
   * @param event - Objeto que contiene los datos necesarios para actualizar el estado.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en esta implementación).
   * @param event.campo - Nombre del campo que se actualizará en el estado.
   * @param event.valor - Valor que se asignará al campo especificado.
   * @param event.storeStateName - Nombre del estado de la tienda (no utilizado en esta implementación).
   *
   * @returns void
   *
   * @command Este método actualiza el estado de la tienda con los valores proporcionados.
   */
  setValoresStore(event: {
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosCertificado({ [CAMPO]: VALOR });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}