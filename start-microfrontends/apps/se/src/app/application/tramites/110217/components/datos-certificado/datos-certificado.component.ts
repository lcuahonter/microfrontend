import { CommonModule } from '@angular/common';

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosCertificadoDeComponent } from '../../../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';

@Component({
  selector: 'app-datos-certificado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatosCertificadoDeComponent],
  templateUrl: './datos-certificado.component.html',
  styleUrl: './datos-certificado.component.scss'
})
export class DatosCertificadoComponent implements OnDestroy, OnInit {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false; 
  
  /**
   * Controla la visibilidad del campo "Precisa" en el formulario de datos del certificado.
   * Para el trámite 110217, este campo está oculto (false).
   * @type {boolean}
   */
  precisa: boolean = false;
  
  /**
   * Controla la visibilidad del campo "Idioma" en el formulario de datos del certificado.
   * Para el trámite 110217, este campo está visible (true).
   * @type {boolean}
   */
  idioma: boolean = true;
  
  /**
   * Controla la visibilidad del campo "Presenta" en el formulario de datos del certificado.
   * Para el trámite 110217, este campo está oculto (false).
   * @type {boolean}
   */
  presenta: boolean = false;

  /**
   * Formulario reactivo que contiene los datos del certificado.
   * Utilizado para la validación y gestión de los datos en el formulario.
   */
  formDatosCertificado!: FormGroup;

  /**
   * Valores actuales del formulario de datos del certificado.
   */
  formDatosCertificadoValues!: { [key: string]: unknown};

  /**
   * Subject utilizado para gestionar el ciclo de vida del componente y cancelar las suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Referencia al componente hijo DatosCertificadoDeComponent
   * Permite acceder al formulario y métodos del componente hijo
   */
  @ViewChild(DatosCertificadoDeComponent) datosCertificadoDeRef!: DatosCertificadoDeComponent;

  /**
   * Constructor del componente. Inicializa el formulario y las dependencias necesarias.
   * @param fb Instancia del FormBuilder para la creación del formulario.
   * @param store Instancia del store para el manejo de datos.
   * @param tramiteQuery Instancia del query para obtener datos de estado.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite110217Store,
    public tramiteQuery: Tramite110217Query,
    public consultaQuery: ConsultaioQuery
  ) {

    this.tramiteQuery.formDatosCertificado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDatosCertificadoValues = estado;
      });
  }

  /**
   * Método de ciclo de vida de Angular, se ejecuta al inicializar el componente.
   * Se utiliza para cargar los datos y suscribirse a los cambios del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {          
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
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
   setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }) :void{
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosCertificado({ [CAMPO]: VALOR });
  }

  /**
   * Método que selecciona un idioma y actualiza el estado en el store.
   * @param estado El estado del idioma seleccionado.
   */
  idiomaSeleccion(estado: Catalogo): void {
    this.store.setIdioma(estado.clave || '');
  }

  /**
   * Método para obtener los datos del formulario y enviarlos al store.
   * @param e Los datos del formulario.
   */
  obtenerDatosFormulario(e: unknown): void {
    this.store.setFormDatosCertificado(e as { [key: string]: unknown});
  }

  /**
   * Método que selecciona una representación federal y actualiza el estado en el store.
   * @param estado El estado de la representación federal seleccionada.
   */
  representacionFederalSeleccion(estado: Catalogo): void {
    this.store.setRepresentacionFederal(estado.clave || '');
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
    return this.childForm?.get(controlName) as FormControl || null;
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
   * Método público para validar todos los formularios del componente datos-certificado.
   * Valida el formulario del componente hijo DatosCertificadoDeComponent y actualiza el estado.
   * @returns boolean indicando si todos los formularios son válidos
   */
  public validateAll(): boolean {
    let valid = true;
    
    // Validar el componente hijo datos-certificado-de
    if (this.datosCertificadoDeRef) {
      // Usar el método validarFormularios del componente hijo que marca los campos como touched
      const IS_CHILD_FORM_VALID = this.datosCertificadoDeRef.validarFormularios();
      if (!IS_CHILD_FORM_VALID) {
        valid = false;
      }
      // Actualizar el estado de validez en el store
      this.setFormValida(IS_CHILD_FORM_VALID);
    }
    
    return valid;
  }

  /**
   * Método de ciclo de vida de Angular, se ejecuta al destruir el componente.
   * Cancela todas las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}