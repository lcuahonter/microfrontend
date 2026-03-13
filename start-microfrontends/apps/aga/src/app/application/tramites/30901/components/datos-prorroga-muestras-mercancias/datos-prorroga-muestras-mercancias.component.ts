import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InputFecha, InputFechaComponent } from "@libs/shared/data-access-user/src";
import { Solicitud30901State, Solicitud30901Store } from "../../estados/tramites30901.store";
import { Subject, Subscription, map, takeUntil } from "rxjs";
import { BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ImportanteCatalogoSeleccion } from "../../models/registro-muestras-mercancias.model";
import { RenovacionesMuestrasMercanciasService } from "../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service";
import { Solicitud30901Query } from "../../estados/tramites30901.query";
import { ToastrService } from "ngx-toastr";

/**
 * Componente para gestionar los datos de prórroga de muestras de mercancías.
 *
 * Este componente permite capturar y validar la información relacionada con la solicitud
 * de prórroga para muestras de mercancías en el trámite 30901.
 *
 * @component
 * @templateUrl ./datos-prorroga-muestras-mercancias.component.html
 * @styleUrl ./datos-prorroga-muestras-mercancias.component.scss
 */
@Component({
  selector: 'app-datos-prorroga-muestras-mercancias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFechaComponent],
  providers: [
    RenovacionesMuestrasMercanciasService,
    ToastrService,
    BsModalService,
  ],
  templateUrl: './datos-prorroga-muestras-mercancias.component.html',
  styleUrl: './datos-prorroga-muestras-mercancias.component.scss',
})
export class DatosProrrogaMuestrasMercanciasComponent
  implements OnInit, OnDestroy
{
  /**
   * Formulario reactivo para los datos de prórroga de muestras de mercancías.
   *
   * Este formulario se utiliza para capturar y validar la información relacionada
   * con la solicitud de prórroga para muestras de mercancías en el trámite 30901.
   *
   * @type {FormGroup}
   */
  formDatosProrroga!: FormGroup;

  /**
   * Etiqueta que representa la vigencia actual.
   * @type {string}
   */
  vigenciaActualLabel: string = 'Vigencia actual';
  /**
   * Etiqueta que contiene el texto informativo sobre la fecha actual de inicio y fin de vigencia de la autorización.
   * @type {string}
   */
  vigenciaActualTextoLabel: string =
    'La fecha actual de inicio y fin de vigencia de su authorización es la siguiente :';
  /**
   * Etiqueta para la fecha de inicio de vigencia.
   * @type {string}
   */
  fechaInicioVigenciaLabel: string = 'Fecha de inicio de vigencia';
  /**
   * Etiqueta para la fecha de fin de vigencia.
   * @type {string}
   */
  fechaFinVigenciaLabel: string = 'Fecha de fin de vigencia';

  /**
   * Configuración para la fecha de fin de vigencia.
   *
   * @property {string} labelNombre - Etiqueta para el nombre de la fecha.
   * @property {boolean} required - Indica si el campo es obligatorio.
   * @property {boolean} habilitado - Indica si el campo está habilitado.
   */
  configuracionFechaFinVigencia: InputFecha = {
    labelNombre: 'Fecha de inicio de vigencia',
    required: false,
    habilitado: true,
  };

  /**
   * Configuración para la fecha de inicio de vigencia.
   *
   * @property {string} labelNombre - Etiqueta del nombre para la fecha de fin de vigencia.
   * @property {boolean} required - Indica si el campo es obligatorio.
   * @property {boolean} habilitado - Indica si el campo está habilitado.
   */
  configuracionFechaInicioVigencia: InputFecha = {
    labelNombre: 'Fecha de fin de vigencia',
    required: false,
    habilitado: true,
  };

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Administra el ciclo de vida de la suscripción `darseDeBaja`.
   *
   * - La variable `darseDeBaja` almacena la suscripción activa,
   *   la cual puede ser `null` si no hay suscripción.
   * - El método `ngOnDestroy` se asegura de que la suscripción
   *   se cancele correctamente cuando el componente se destruya,
   *   evitando fugas de memoria.
   */
  darseDeBaja: Subscription | null = null;

  /**
   * Estado actual de la solicitud 30901.
   * Se inicializa como un objeto vacío con la estructura de `Solicitud30901State`.
   */
  solicitud30901State: Solicitud30901State = {} as Solicitud30901State;

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 
  /**
   * Constructor del componente `DatosProrrogaMuestrasMercanciasComponent`.
   *
   * Se encarga de inyectar las dependencias necesarias para la creación del formulario,
   * la gestión del estado del trámite, la consulta de información, y el servicio de renovaciones.
   *
   * @param {FormBuilder} fb - Utilizado para crear formularios reactivos.
   * @param {RenovacionesMuestrasMercanciasService} renovacionesMuestrasMercanciasService - Servicio encargado de gestionar las renovaciones de muestras de mercancías.
   * @param {Solicitud30901Store} solicitud30901Store - Store del estado de la solicitud 30901.
   * @param {Solicitud30901Query} solicitud30901Query - Query para observar los cambios en el estado de la solicitud 30901.
   * @param {ConsultaioQuery} consultaioQuery - Query para observar el estado de consulta general (readonly, etc.).
   */
  constructor(
    public fb: FormBuilder,
    public renovacionesMuestrasMercanciasService: RenovacionesMuestrasMercanciasService,
    public solicitud30901Store: Solicitud30901Store,
    public solicitud30901Query: Solicitud30901Query,
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
          takeUntil(this.destroyed$),
          map((seccionState)=>{
            this.esFormularioSoloLectura = seccionState.readonly;
            this.inicializarEstadoFormulario();
          })
        )
        .subscribe()
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario `formDatosProrroga` con los campos `fechaInicioVigencia` y `fechaFinVigencia`,
   * estableciendo valores predeterminados y deshabilitándolos.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }
    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formDatosProrroga.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formDatosProrroga.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
}


  /**
   * Obtiene los datos de validez de la autorización desde el servicio y actualiza el estado.
   * Realiza una suscripción al servicio para obtener las opciones desplegables y
   * actualiza la validez de la autorización en el store.
   */
  getvalidezDeLaAutorizacionDatos(): void {
    this.darseDeBaja = this.renovacionesMuestrasMercanciasService
      .obtenerOpcionesDesplegables()
      .subscribe({
        next: (res: ImportanteCatalogoSeleccion) => {
          this.solicitud30901Store.setFechaInicioVigencia(
            res.validezDeLaAutorizacion.fechaInicioVigencia
          );
          this.solicitud30901Store.setFechaFinVigencia(
            res.validezDeLaAutorizacion.fechaFinVigencia
          );
        },
      });
  }

   /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.formDatosProrroga = this.fb.group({
      fechaInicioVigencia: [
        { value: this.solicitud30901State.fechaInicioVigencia },
      ],
      fechaFinVigencia: [
        { value: this.solicitud30901State.fechaFinVigencia },
      ],
    });

    /**
     * Observable que obtiene las fechas de inicio y fin de vigencia.
     */
    this.solicitud30901Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((datos: Solicitud30901State) => {
          this.solicitud30901State = datos;
          this.formDatosProrroga.patchValue({
            fechaInicioVigencia: datos.fechaInicioVigencia,
            fechaFinVigencia: datos.fechaFinVigencia,
          });
        })
      )
      .subscribe();

    this.getvalidezDeLaAutorizacionDatos();

  }

  /**
   * Maneja el evento de cambio de fecha de fin de vigencia.
   *
   * @param date - La nueva fecha de fin de vigencia en formato de cadena.
   *
   * Este método actualiza el valor del campo `fechaInicioVigencia` en el formulario `formDatosProrroga`
   * con la nueva fecha proporcionada.
   */
  onFechaFinVigenciaChange(date: string): void {
    this.formDatosProrroga.patchValue({
      fechaInicioVigencia: date,
    });
  }

  /**
   * Maneja el evento de cambio de fecha de inicio.
   *
   * @param date - La nueva fecha de inicio en formato de cadena.
   *
   * Actualiza el campo `fechaFinVigencia` del formulario `formDatosProrroga` con la nueva fecha proporcionada.
   */
  onFechaInicioChange(date: string): void {
    this.formDatosProrroga.patchValue({
      fechaFinVigencia: date,
    });
    
  }

  

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   * */
  ngOnDestroy(): void {
    if (this.darseDeBaja) {
      this.darseDeBaja.unsubscribe();
      this.darseDeBaja = null;
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
