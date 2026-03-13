import { CONFIGURATION_TABLA_REQUISITOS, CONFIGURATION_TABLA_TRANSPORTE, Requisito, Transporte } from '../../models/embalaje-de-madera.models';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, ConsultaioQuery, InputFechaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite250103State, Tramite250103Store } from '../../estados/tramite250103.store';
import { INPUT_FECHA } from '../../constantes/embalaje-de-madera.enum';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250103Query } from '../../estados/tramite250103.query';
import catalogoDatos from '@libs/shared/theme/assets/json/250103/banco.json';

/**
 * Componente encargado de gestionar los requisitos y el transporte del trámite 250103.
 * Permite agregar elementos a las tablas dinámicas y almacenar los valores en el estado del store.
 */
@Component({
  selector: 'app-requisitos',
  standalone: true,
  imports: [
    ModalComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    FormsModule,
    ReactiveFormsModule, InputFechaComponent,
  ],
  templateUrl: './requisitos.component.html',
  styleUrl: './requisitos.component.scss',
})
export class RequisitosComponent implements OnInit, OnDestroy {

  /**
   * Catálogo de medios de transporte.
   */
  medio: Catalogo[] = catalogoDatos.medio

  /**
   * Catálogo de requisitos.
   */
  requisitoCatalogo: Catalogo[] = catalogoDatos.requisito;

  /**
   * Tipo de selección para las tablas.
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de la tabla de transporte.
   */
  configuracionTransporteTabla: ConfiguracionColumna<Transporte>[] = CONFIGURATION_TABLA_TRANSPORTE;

  /**
   * Datos de la tabla de transporte.
   */
  TransporteTabla: Transporte[] = [];

  /**
   * Configuración de la tabla de requisitos.
   */
  configuracionRequisitosTabla: ConfiguracionColumna<Requisito>[] = CONFIGURATION_TABLA_REQUISITOS;

  /**
   * Datos de la tabla de requisitos.
   */
  RequisitosTabla: Requisito[] = [];

  /**
   * Estado de visibilidad del modal de transporte.
   */
  showtransporteModal = false;

  /**
   * Estado de visibilidad del modal de requisitos.
   */
  showrequisitosModal = false;

  /**
   * Formulario de transporte y requisitos.
   */
  transporteForm!: FormGroup;

  /**
   * Estado actual del store del trámite 250103.
   */
  public solicitudState!: Tramite250103State;

  /**
   * Subject para destruir suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor que inyecta las dependencias necesarias.
   */
  /**
    * Constante para configurar el input de fecha.
    * Define las propiedades del campo de entrada de fecha.
    */
  INPUT_FECHA = INPUT_FECHA;
  /**
    * Maneja los cambios en el campo "Fecha".
    * Actualiza el estado del almacén con la fecha proporcionada.  
    */
  cambioFechasFinal(nuevo_valor: string): void {
    this.transporteForm.patchValue({
      fechas: nuevo_valor,
    });
    this.tramite250103Store.establecerDatos({ fechas: nuevo_valor });
  }
  /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;
  constructor(
    private fb: FormBuilder,
    private tramite250103Store: Tramite250103Store,
    private tramite250103Query: Tramite250103Query,
    private consultaioQuery: ConsultaioQuery
  ) {
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
   * Inicializa el componente, suscribiéndose al estado del store
   * y creando el formulario reactivo.
   */
  ngOnInit(): void {
    this.tramite250103Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250103State;
        })
      )
      .subscribe();

    this.crearFormulario();
  }

  /**
   * Alterna la visibilidad del modal de transporte.
   */
  transporte(): void {
    this.showtransporteModal = !this.showtransporteModal;
  }
  /**
  * Alterna la visibilidad del modal de transporte.
  */
  transporteEliminar(): void {
    this.showtransporteModal = !this.showtransporteModal;
  }
  /**
   * Alterna la visibilidad del modal de requisitos.
   */
  requisitosEliminar(): void {
    this.showrequisitosModal = !this.showrequisitosModal;
  }

  /**
   * Alterna la visibilidad del modal de requisitos.
   */
  requisitos(): void {
    this.showrequisitosModal = !this.showrequisitosModal;
  }


  /**
    * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
    * @param form - El formulario reactivo.
    * @param campo - El nombre del campo en el formulario.
    */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite250103Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Se ejecuta cuando el componente se destruye. Limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Agrega un nuevo registro a la tabla de requisitos con los datos del formulario.
   */
  requisitosDatos(): void {
    const REQUISITO_FORMDATA = {
      No: this.transporteForm.value.numero,
      Fecha: this.transporteForm.value.fechas,
      Tipo: this.requisitoCatalogo.find(item => item.id === Number(this.transporteForm.value.requisito))?.descripcion,
    };
    this.RequisitosTabla.push(REQUISITO_FORMDATA);
    this.showrequisitosModal = !this.showrequisitosModal;
  }

  /**
   * Agrega un nuevo registro a la tabla de transporte con los datos del formulario.
   */
  transporteDatos(): void {
    const TRANSPORTE_FORMDATA = {
      numeroIdentificacion: this.transporteForm.value.identificacion,
      numeroEconomico: this.transporteForm.value.economico,
      placa: this.transporteForm.value.placa,
    };
    this.TransporteTabla.push(TRANSPORTE_FORMDATA);
    this.showtransporteModal = !this.showtransporteModal;
  }
  /**
* Evalúa si se debe inicializar o cargar datos en el formulario.
* Además, obtiene la información del catálogo de mercancía.
*/
  inicializarEstadoFormulario(): void {
    this.guardarDatosFormulario();
  }
  /**
* @method
* @name guardarDatosFormulario
* @description
* Inicializa los formularios y obtiene los datos de la tabla.
* Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
* deshabilita o habilita todos los formularios del componente.
* Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
* Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
*
* @returns {void}
*/
  guardarDatosFormulario(): void {
    // Inicializa el formulario con los valores del estado
    this.tramite250103Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe()
  }
  /**
   * @method crearFormulario
   * @description
   * Este método inicializa el formulario reactivo `transporteForm` con los valores actuales del estado `solicitudState`.
   * Define las validaciones necesarias para cada campo del formulario, como requisitos obligatorios y límites de longitud.
   * Además, evalúa si el formulario debe estar en modo de solo lectura (`esFormularioSoloLectura`) y ajusta su estado
   * habilitando o deshabilitando los campos según corresponda.
   *
   * @returns {void}
   * 
   * @example
   * // Ejemplo de uso:
   * this.crearFormulario();
   * 
   * // Resultado:
   * // Se crea un formulario reactivo con los valores del estado y las validaciones configuradas.
   */
  crearFormulario(): void {
    this.transporteForm = this.fb.group({
      medio: [this.solicitudState.medio, Validators.required], // Campo obligatorio
      identificacion: [this.solicitudState.identificacion, [Validators.required, Validators.maxLength(16)]], // Campo obligatorio con longitud máxima de 16 caracteres
      economico: [this.solicitudState.economico, [Validators.required, Validators.maxLength(50)]], // Campo obligatorio con longitud máxima de 50 caracteres
      placa: [this.solicitudState.placa, [Validators.required, Validators.maxLength(25)]], // Campo obligatorio con longitud máxima de 25 caracteres
      numero: [this.solicitudState.numero, [Validators.required, Validators.maxLength(50)]], // Campo obligatorio con longitud máxima de 50 caracteres
      fechas: [this.solicitudState.fechas, Validators.required], // Campo obligatorio
      requisito: [this.solicitudState.requisito, Validators.required], // Campo obligatorio
    });

    // Ajusta el estado del formulario según el modo de solo lectura
    if (this.esFormularioSoloLectura) {
      this.transporteForm.disable(); // Deshabilita el formulario si está en modo de solo lectura
    } else {
      this.transporteForm.enable(); // Habilita el formulario si no está en modo de solo lectura
    }
  }

}



