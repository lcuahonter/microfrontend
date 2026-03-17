import { AL_DAR, AlertComponent, InputRadioComponent, Notificacion, NotificacionesComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DomicilloDelComponent } from '../domicillo-del/domicillo-del.component';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
/**
 * Componente que representa la sección de datos de la solicitud en el formulario.
 * 
 * Este componente es responsable de mostrar y gestionar los datos relacionados con la solicitud.
 * Incluye un formulario reactivo con campos deshabilitados por defecto y funcionalidades para
 * alternar el estado colapsable de la sección y habilitar los controles del formulario.`
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    TituloComponent,
    DomicilloDelComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    InputRadioComponent,
    NotificacionesComponent,
    TooltipModule
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
   * Grupo de formularios principal.
   * @type {FormGroup}
   */
  public forma!: FormGroup;
  /**
* Opciones de radio.
*/
  public radioOpcions = [
    { label: 'Prórroga', value: 'Prórroga' },
    { label: 'Modificación', value: 'Modificación' },
    { label: 'Modificación y prórroga', value: 'Modificación y prórroga' }
  ];

  /**
   * Valor seleccionado del radio.
   */
  public valorSeleccionado!: string;

  /**
   * Indica si la sección es colapsable.
   * @type {boolean}
   * @default true
   */
  public colapsable: boolean = true;

  /**
   * Constantes importadas desde el archivo de enumeración que contienen textos importantes y advertencias.
   * @type {typeof AL_DAR}
   */
  public TEXTOS = AL_DAR;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Representa el estado de la Solicitud 260701.
   * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
   * Se espera que se inicialice con una instancia de `Solicitud260701State`.
   */
  public solicitudState!: Solicitud260701State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se ha hecho clic en la opción de tener selección.
   */
  public tieneSeleccionClicked: boolean = false;

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor del componente DatosDeLaSolicitudComponent.
   * 
   * @param fb - Instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param tramite260701Store - Servicio de store para gestionar el estado del Trámite 260701.
   * @param tramite260701Query - Servicio de consulta para obtener datos relacionados con el Trámite 260701.
   */
  constructor(
    public readonly fb: FormBuilder,
    private tramite260701Store: Tramite260701Store,
    private tramite260701Query: Tramite260701Query,
    private consultaioQuery: ConsultaioQuery,
    private certificadosLicenciasSvc: CertificadosLicenciasService
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
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Obtiene datos del estado de la solicitud y configura el formulario.
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite260701Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.solicitudState = seccionState;
    })).subscribe();

    this.inicializarFormulario();
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @returns {void}
   */
  public mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Inicializa el formulario reactivo (`forma`) con los valores actuales del estado `solicitudState`.
   * Cada control del formulario se establece con su valor correspondiente y está deshabilitado, haciendo el formulario de solo lectura.
   */
  public inicializarFormulario(): void {
    const READONLY = this.esFormularioSoloLectura;
    this.forma = this.fb.group({
      tipoOperacion: [{ value: this.solicitudState?.tipoOperacion, disabled: READONLY }],
      justificacion: [this.solicitudState?.justificacion],
      denominacionORazonSocial: [{ value: this.solicitudState?.denominacionORazonSocial, disabled: true }],
      correoElectronico: [{ value: this.solicitudState?.correoElectronico, disabled: true }]
    });
  }

  /**
   * Habilita todos los controles del formulario si están deshabilitados.
   * @returns {void}
   */
  public toggleFormControls(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.tieneSeleccionClicked = !this.tieneSeleccionClicked;
  }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260701Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260701Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Cambia el valor seleccionado del radio.
   * @param value Valor seleccionado.
   */
  public cambiarRadio(value: string | number):void {
    this.valorSeleccionado = value as string;
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
 * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
 * Luego reinicializa el formulario con los valores actualizados desde el store.
 */
  public guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.forma.get('tipoOperacion')?.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.forma.get('tipoOperacion')?.enable();
    }
  }

  /**
   * Maneja la eliminación de un pedimento basado en la confirmación del usuario.
   * Si `borrar` es verdadero, emite un evento para notificar la eliminación y habilita los controles del formulario.
   * @param borrar Indica si se debe proceder con la eliminación del pedimento.
   */
  public eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      Object.keys(this.forma.controls).forEach((controlName) => {
        const CONTROL = this.forma.get(controlName);
        if (CONTROL?.disabled) {
          CONTROL.enable();
        }
      });
      this.certificadosLicenciasSvc.emitEvent(this.tieneSeleccionClicked);
    }
  }

  /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
