import { Catalogo, CatalogoServices, SeccionLibQuery, SeccionLibState, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CertificadoValidacionService } from '../../services/certificado-validacion.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosCertificadoDeComponent } from "../../../../shared/components/datos-certificado-de/datos-certificado-de.component";
import { ToastrService } from 'ngx-toastr';
import { Tramite110202Query } from '../../estados/tramite110202.query';
import { Tramite110202Store } from '../../estados/tramite110202.store';

@Component({
  selector: 'app-datos-certificado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatosCertificadoDeComponent],
  templateUrl: './datos-certificado.component.html',
  styleUrl: './datos-certificado.component.scss'
})
export class DatosCertificadoComponent implements OnDestroy, OnInit {

  // Variable booleana que indica si es necesario o no (precisa) en el formulario
  precisa: boolean = true;

  // Variable booleana que indica si el idioma está habilitado o no
  idioma: boolean = true;

  // Variable booleana que indica si el idioma está habilitado o no
  presenta: boolean = true;
  /**
   * Formulario reactivo que contiene los datos del certificado.
   * Utilizado para la validación y gestión de los datos en el formulario.
   */
  formDatosCertificado!: FormGroup;

  /**
   * Valores actuales del formulario de datos del certificado.
   */
  formDatosCertificadoValues!: { [key: string]: unknown };

  /**
   * Subject utilizado para gestionar el ciclo de vida del componente y cancelar las suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

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

  /** Estado de la consulta asociado al trámite. */
  consultaioState: boolean = false;
  /**
   * Estado de la sección, gestionado mediante el store.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;
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
   * @param certificadoService Servicio encargado de obtener los datos del certificado.
   * @param catalogoService Servicio global para obtener catálogos.
   * @param toastr Servicio de notificaciones (Toastr).
   * @param seccionQuery Consulta para obtener el estado de la sección.
   * @param seccionStore Store para manejar el estado de la sección.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite110202Store,
    public tramiteQuery: Tramite110202Query,
    public certificadoService: CertificadoValidacionService,
    private catalogoService: CatalogoServices,
    private toastr: ToastrService,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    public consultaQuery: ConsultaioQuery
  ) {

    /**
     * Suscripción al estado del formulario para actualizar los valores del formulario al obtener datos.
     */
    this.tramiteQuery.formDatosCertificado$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(estado => {
      this.formDatosCertificadoValues = estado || {};
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
    this.idiomaDatos$ = this.tramiteQuery.selectIdioma$ as Observable<Catalogo[]>;
    this.entidadFederativas$ = this.tramiteQuery.selectEntidadFederativa$ as Observable<Catalogo[]>;
    this.representacionFederal$ = this.tramiteQuery.selectrepresentacionFederal$ as Observable<Catalogo[]>;
  }

  /**
   * Getter para acceder al control del formulario, utilizado para la validación.
   * @returns FormControl del formulario.
   */
  get formularioControl(): FormControl {
    return this.formDatosCertificado.get('') as FormControl;
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
          this.consultaioState = seccionState.update;
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
  setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosCertificado({ [CAMPO]: VALOR });
  }
  /**
   * Método que selecciona un idioma y actualiza el estado en el store.
   * @param estado El estado del idioma seleccionado.
   */
  idiomaSeleccion(estado: Catalogo): void {
    this.store.setIdiomaSeleccion(estado);
  }

  /**
   * Método para obtener los datos del formulario y enviarlos al store.
   * @param e Los datos del formulario.
   */
  obtenerDatosFormulario(e: unknown): void {
    this.store.setFormDatosCertificado(e as { [key: string]: unknown });
  }

  /**
   * Método que selecciona una representación federal y actualiza el estado en el store.
   * @param estado El estado de la representación federal seleccionada.
   */
  representacionFederalSeleccion(estado: Catalogo): void {
    this.store.setRepresentacionFederalDatosSeleccion(estado);
  }

  /**
   * Establece el estado de validez del formulario en el store.
   * @param valida Indica si el formulario es válido o no.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ datos: valida });
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
