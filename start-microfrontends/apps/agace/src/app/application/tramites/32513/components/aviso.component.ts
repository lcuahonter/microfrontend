import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Solicitud32513State, Solicitud32513Store } from '../estados/solicitud32513.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SOLICITUD_32513_ENUM } from '../constantes/anexo';
import { Solicitud32513Query } from '../estados/solicitud32513.query';

/**
 * Componente encargado de la gestión del aviso
 */
@Component({
  selector: 'app-aviso',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    TituloComponent
  ],
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
})
export class AvisoComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo utilizado para capturar los datos del aviso.
   * Se inicializa en el método ngOnInit.
   */
  avisoForm!: FormGroup;

  /**
   * Estado de la solicitud actual.
   */
  public solicitudState!: Solicitud32513State;

  /**
   * Subject utilizado para destruir los observables al destruir el componente.
   * Evita fugas de memoria al usar operadores como takeUntil.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice del elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Etiqueta del archivo seleccionado.
   */
  elgirDeArchivo: string = SOLICITUD_32513_ENUM.ELGIR_DE_ARCHIVO;

  /**
   * Referencia al elemento de entrada de archivo HTML.
   */
  elgirArchivo!: HTMLInputElement;

  /**
   * Archivo de medicamentos seleccionado.
   */
  archivoMedicamentos: File | null = null;

  /**
   * Bandera para mostrar el mensaje de archivo válido.
   */
  mostrarMensajeArchivoValido = false;

  /**
   * Mensaje que se muestra cuando el archivo es válido.
   */
  mensajeArchivoValido = SOLICITUD_32513_ENUM.MESAJE_ARCHIVO;

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
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente AvisoComponent.
   * Inyecta los servicios y stores necesarios para la gestión del formulario y los datos asociados al trámite 32513.
   * @param fb FormBuilder para la creación del formulario reactivo.
   * @param solicitud32513Store Store para el manejo del estado de la solicitud.
   * @param solicitud32513Query Query para consultar el estado de la solicitud.
   * @param consultaioQuery Query para consultar el estado de la consulta.
   * @param avisoService Servicio para operaciones relacionadas con el aviso.
   */
  constructor(
    private fb: FormBuilder,
    public solicitud32513Store: Solicitud32513Store,
    public solicitud32513Query: Solicitud32513Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa los datos de consulta y solicitud, y configura el formulario.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
    .subscribe();
    this.solicitud32513Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
    .subscribe();
    this.inicializarFormulario();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario reactivo con los valores del estado de la solicitud.
   */
  inicializarFormulario(): void {
    this.avisoForm = this.fb.group({
      descripcionMercancia: [this.solicitudState?.descripcionMercancia, Validators.required],
      porcentajeDesperdicio: [this.solicitudState?.porcentajeDesperdicio, Validators.required],
    });
  }

  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.avisoForm?.disable();
    } else {
      this.avisoForm?.enable();
    }
  }

  /**
   * Método para cargar un archivo de proveedores.
   * Valida que el archivo sea de formato Excel (.xlsx).
   * Si el archivo es válido, muestra el mensaje correspondiente.
   * Si no es válido, oculta el mensaje.
   */
  cargarProveedores(): void {
    const FILE_INPUT = document.getElementById('archivoMedicamentos') as HTMLInputElement;
    const FILE = FILE_INPUT?.files?.[0];
    if (FILE) {
      const EXT_FILE = FILE.name.toLowerCase().endsWith('.xlsx');
      if (EXT_FILE) {
        this.mostrarMensajeArchivoValido = true;
      } else {
        this.mostrarMensajeArchivoValido = false;
      }
    }
  }

  /**
   * Maneja el cambio de archivo en el input de archivo.
   * @param event Evento de cambio de archivo.
   */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoMedicamentos = TARGET.files[0];
      this.elgirDeArchivo = this.archivoMedicamentos.name;
    } else {
      this.elgirDeArchivo = this.elgirArchivo?.value;
    }
  }

  /**
   * Activa la selección del archivo de medicamentos.
   */
  activarSeleccionArchivo(): void {
    this.elgirArchivo = document.getElementById('archivoMedicamentos') as HTMLInputElement;
    if (this.elgirArchivo) {
      this.elgirArchivo.click();
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado o modificado.
   * @param id El nombre del control del formulario.
   * @returns `true` si el control es inválido y tocado o modificado, `false` en caso contrario.
   */
  isInvalid(id: string): boolean {
    const CONTROL = this.avisoForm.get(id);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Formulario del cual se obtiene el valor.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud32513Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud32513Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida `OnDestroy`.
   * Se ejecuta automáticamente cuando el componente se destruye.
   * Emite un valor al `destroyNotifier$` para cancelar todas las suscripciones activas y liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
