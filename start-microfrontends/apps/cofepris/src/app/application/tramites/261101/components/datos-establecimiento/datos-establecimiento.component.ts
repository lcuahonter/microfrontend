import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261101.query';
import { DatosProcedureState } from '../../../../estados/tramites/tramites261101.store';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261101.store';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-datosestablecimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './datos-establecimiento.component.html',
  styleUrl: './datos-establecimiento.component.scss',
})
export class DatosestablecimientoComponent implements OnInit, OnDestroy {
  /**
 * Formulario reactivo para datos preoperativos.
 */
  datosdelestablecimiento!: FormGroup;

  /**
 * Variable que almacena el estado de la sección actual del procedimiento.
 * Se utiliza para gestionar y acceder a los datos relacionados con el estado
 * del procedimiento en curso.
 */
  public seccionState!: DatosProcedureState;
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
     * Modelo de datos para una nueva notificación que se va a crear.
     */
    public nuevaNotificacion!: Notificacion;
  
    /**
     * Identificador del elemento que se desea eliminar.
     */
    elementoParaEliminar!: number;
  

  /**
   * Constructor de la clase `DatosestablecimientoComponent`.
   * 
   * @param fb - Servicio `FormBuilder` utilizado para crear formularios reactivos.
   * @param store - Servicio `DatosProcedureStore` que gestiona el estado de los datos del procedimiento.
   * @param query - Servicio `DatosProcedureQuery` que permite realizar consultas sobre el estado del procedimiento.
   */
  constructor(private fb: FormBuilder,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaioQuery: ConsultaioQuery
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
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
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
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosdelestablecimiento.disable();
    } else {
      this.datosdelestablecimiento.enable();
    }
  }

  /**
 * Gancho de ciclo de vida `OnInit`.
 * 
 * Este método se ejecuta al inicializar el componente. Realiza las siguientes acciones:
 * - Se suscribe al observable `selectProrroga$` del servicio `DatosProcedureQuery` para obtener
 *   el estado actual del procedimiento y lo asigna a la variable `seccionState`.
 * - Llama al método `crearFormulario` para inicializar el formulario reactivo con los datos
 *   obtenidos del estado actual.
 */
  ngOnInit(): void {
    this.getValorStore();
    this.inicializarEstadoFormulario();
  }

  /**
 * Método para inicializar el formulario reactivo de datos del establecimiento.
 * Este formulario se utiliza para gestionar los datos relacionados con la denominación
 * del establecimiento, obteniendo su valor inicial desde el estado actual de la sección.
 * 
 * El formulario se crea utilizando el FormBuilder y contiene un único campo:
 * - `denominacion`: Representa la denominación del establecimiento, cuyo valor inicial
 *   se obtiene de la propiedad `denominacion` del estado de la sección (`seccionState`).
 */
  crearFormulario(): void {   
    this.datosdelestablecimiento = this.fb.group({
      denominacion: [this.seccionState?.['denominacion']]
    });
  }
  
  /**
    * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
    * @param form - El formulario reactivo.
    * @param campo - El nombre del campo en el formulario.
    */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.query.selectProrroga$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(
      (data) => {
        this.seccionState = data;
      });    
  }

  /**
   * Abre el modal de notificación para informar que no hay comunicación
   * con el sistema de COFEPRIS, solicitando al usuario capturar su establecimiento.
   * 
   * @param i Índice del elemento que se desea eliminar (por defecto es 0).
   */
  abrirModal(i: number = 0): void {
    console.log('Abrir modal de notificación por falta de comunicación con COFEPRIS.');
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };

    this.elementoParaEliminar = i;
  }

  /**
* Gancho de ciclo de vida OnDestroy
*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
