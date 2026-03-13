/**
 * Componente para la gestión de enlaces operativos en el trámite 32604.
 *
 * Este archivo contiene el componente que permite agregar y gestionar enlaces operativos
 * mediante formularios reactivos. Incluye validaciones, búsqueda de terceros nacionales,
 * actualización de estado y emisión de eventos al componente padre.
 */

import { CommonModule } from '@angular/common';

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent, Pedimento, REGEX_RFC, REG_X, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';

import { Subject, map, takeUntil } from 'rxjs';

import { EnlaceOperativo, RepresentanteLegal } from '../../models/empresas-comercializadoras.model';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';

import { Solicitud32604State, Solicitud32604Store } from '../../estados/solicitud32604.store';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';

/**
 * Componente para agregar y gestionar enlaces operativos en el trámite 32604.
 * 
 * Proporciona funcionalidades para capturar información de enlaces operativos
 * mediante formularios reactivos con validaciones, búsqueda de representantes legales,
 * y emisión de eventos para comunicación con componentes padre.
 * 
 * @component
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-agregar-enlace-operativo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent,NotificacionesComponent],
  templateUrl: './agregar-enlace-operativo.component.html',
  styleUrl: './agregar-enlace-operativo.component.scss',
})
/**
 * Componente para agregar un enlace operativo.
 * Utiliza un formulario reactivo para capturar y emitir la información del enlace operativo.
 */
export class AgregarEnlaceOperativoComponent implements OnInit, OnDestroy {
  /** Estado de carga para el botón Buscar */
  public cargandoBuscar: boolean = false;
  /**
   * Carga los datos de un enlace operativo en el formulario para modificar.
   * @param enlace El objeto EnlaceOperativo a modificar
   */
  public cargarEnlaceParaModificar(enlace: EnlaceOperativo): void {
    this.modoModificar = true;
    
    // Asegúrese de que el formulario esté inicializado
    if (!this.agregarEnlaceOperativoForm) {
      this.inicializarFormulario();
    }
    
    // Habilitar el formulario y campos específicos ANTES de hacer patchValue
    if (!this.esFormularioSoloLectura) {
      this.agregarEnlaceOperativoForm.enable();
    }
    
    // Asegurar que campos específicos estén habilitados para modificación
    this.agregarEnlaceOperativoForm.get('agregarEnlaceCiudadEstado')?.enable();
    this.agregarEnlaceOperativoForm.get('agregarEnlaceCargo')?.enable();
    
    // Ahora hacer patchValue con los campos ya habilitados
    this.agregarEnlaceOperativoForm.patchValue({
      agregarEnlaceRfcTercero: enlace.rfc ?? '',
      agregarEnlaceRfc: enlace.rfc ?? '',
      agregarEnlaceNombre: enlace.nombre ?? '',
      agregarEnlaceApellidoPaterno: enlace.apellidoPaterno ?? '',
      agregarEnlaceApellidoMaterno: enlace.apellidoMaterno ?? '',
      agregarEnlaceCiudadEstado: enlace.ciudadestado ?? enlace.ciudad ?? '',
      agregarEnlaceCargo: enlace.agregarEnlaceCargo ?? enlace.cargo ?? '',
      agregarEnlaceTelefono: enlace.telefono ?? '',
      agregarEnlaceCorreoElectronico: enlace.correo ?? '',
      agregarEnlaceSuplente: enlace.suplente === '1' || enlace.suplente === 'true' || (typeof enlace.suplente === 'boolean' && enlace.suplente)
    });
  }
  /**
   * Indica si el formulario está en modo modificación
   */
  modoModificar: boolean = false;
  /**
   * Formulario reactivo para capturar los datos del enlace operativo.
   * 
   * Contiene campos para RFC, nombres, teléfono, correo electrónico,
   * cargo y configuración de suplente con validaciones específicas.
   * 
   * @property {FormGroup} agregarEnlaceOperativoForm
   */
  agregarEnlaceOperativoForm!: FormGroup;

  /**
   * Subject para manejar la destrucción de suscripciones.
   * 
   * Utilizado con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones activas cuando el componente se destruye.
   * 
   * @private
   * @property {Subject<void>} destroy$
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Estado actual de la solicitud 32604.
   * 
   * Contiene toda la información del estado actual del formulario
   * y datos relacionados con el enlace operativo.
   * 
   * @property {Solicitud32604State} solicitud32604State
   */
  solicitud32604State: Solicitud32604State = {} as Solicitud32604State;

  /**
   * Evento para emitir el objeto EnlaceOperativo al componente padre.
   * 
   * Se dispara cuando se completa exitosamente la creación
   * del enlace operativo y se desea notificar al componente padre.
   * 
   * @output
   * @property {EventEmitter<EnlaceOperativo>} agregarEnlaceOperativo
   */
  @Output() agregarEnlaceOperativo = new EventEmitter<EnlaceOperativo>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * 
   * Cuando es `true`, los campos del formulario no se pueden editar
   * y se muestran únicamente para consulta.
   * 
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Propiedad que almacena la notificación actual que se mostrará al usuario.
   * 
   * Contiene la configuración y contenido de las notificaciones
   * que se despliegan en la interfaz de usuario.
   * 
   * @public
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice del elemento que se desea eliminar de la lista de pedimentos.
   * 
   * Almacena la referencia del elemento seleccionado
   * para operaciones de eliminación en la lista de pedimentos.
   * 
   * @property {number} elementoParaEliminar
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos asociados al componente.
   * 
   * Array que contiene todos los pedimentos registrados
   * relacionados con el enlace operativo.
   * 
   * @property {Array<Pedimento>} pedimentos
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Constructor de la clase que inicializa las dependencias necesarias.
   *
   * Configura las dependencias del componente e inicializa la suscripción
   * al estado de consulta para manejar el modo de solo lectura del formulario.
   *
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular
   * @param {EmpresasComercializadorasService} empresasComercializadorasService - Servicio para gestión de datos de empresas comercializadoras
   * @param {Solicitud32604Store} solicitud32604Store - Store para manejo del estado de la solicitud 32604
   * @param {Solicitud32604Query} solicitud32604Query - Query para consultas del estado de la solicitud 32604
   * @param {ConsultaioQuery} consultaioQuery - Query para el estado de consulta de la aplicación
   */
  constructor(
    public fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery
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
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Configura el estado inicial del formulario y establece las
   * suscripciones necesarias para el manejo del estado del componente.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

 /**
 * Método que elimina un pedimento de la lista de pedimentos.
 *
 * Verifica si debe proceder con la eliminación y remueve el elemento
 * de la lista utilizando el índice almacenado en elementoParaEliminar.
 *
 * @param {boolean} borrar - Indica si se debe proceder con la eliminación del pedimento.
 *                          Si es `true`, se elimina el pedimento en el índice especificado
 * @memberof AgregarEnlaceOperativoComponent
 */
eliminarPedimento(borrar: boolean): void {
  if (borrar) {
    this.pedimentos.splice(this.elementoParaEliminar, 1);
  }
}
 
 /**
 * Método que abre un modal para mostrar una notificación al usuario.
 *
 * Configura y muestra un modal de notificación de alerta indicando
 * que se deben capturar todos los datos marcados como obligatorios.
 * También almacena el índice del elemento para operaciones posteriores.
 *
 * @param {number} [i=0] - Índice del elemento que se desea eliminar. Por defecto, es 0.
 *                        Este índice se asigna a la propiedad `elementoParaEliminar`
 * @memberof AgregarEnlaceOperativoComponent
 */
abrirModal(i: number = 0): void {
  this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Debe capturar todos los datos marcados como obligatorios',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: 'Cancelar',
  };

  this.elementoParaEliminar = i;
}

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * 
   * Determina el modo de operación del formulario basado en el estado
   * de solo lectura y ejecuta la acción correspondiente.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos del estado y configura el formulario según el modo de operación.
   * 
   * Inicializa el formulario y luego aplica el estado de solo lectura
   * habilitando o deshabilitando los controles según corresponda.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.agregarEnlaceOperativoForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.agregarEnlaceOperativoForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `agregarEnlaceOperativoForm` con los valores del estado actual.
   *
   * Configura un formulario reactivo con validaciones específicas para cada campo:
   * - RFC del tercero (requerido)
   * - Campos deshabilitados para datos del representante legal
   * - Teléfono con patrón de validación
   * - Correo electrónico con validación de email
   * 
   * También establece suscripción al estado para mantener sincronización automática.
   *
   * @memberof AgregarEnlaceOperativoComponent
   */
  inicializarFormulario(): void {
    this.agregarEnlaceOperativoForm = this.fb.group({
      agregarEnlaceRfcTercero: [
        this.solicitud32604State.rfcTercero,
        [Validators.required, Validators.pattern(REGEX_RFC), Validators.maxLength(15)],
      ],
      agregarEnlaceRfc: [
        { value: this.solicitud32604State.rfc, disabled: true },
        [Validators.required, Validators.pattern(REGEX_RFC)],
      ],
      agregarEnlaceNombre: [
        { value: this.solicitud32604State.nombre, disabled: true },
        [Validators.required],
      ],
      agregarEnlaceApellidoPaterno: [
        { value: this.solicitud32604State.apellidoPaterno, disabled: true },
        [Validators.required],
      ],
      agregarEnlaceApellidoMaterno: [
        { value: this.solicitud32604State.apellidoMaterno, disabled: true },
      ],
      agregarEnlaceCiudadEstado: [
        {
          value: this.solicitud32604State.agregarEnlaceCiudadEstado,
          disabled: false,
        },
      ],
      agregarEnlaceCargo: [
        {
          value: this.solicitud32604State.agregarEnlaceCargo,
          disabled: false
        },
        [Validators.maxLength(250)]
      ],
      agregarEnlaceTelefono: [
        this.solicitud32604State.telefono,
        [Validators.pattern(REG_X.SOLO_NUMEROS), Validators.maxLength(30)],
      ],
      agregarEnlaceCorreoElectronico: [
        this.solicitud32604State.correoElectronico,
        [Validators.email, Validators.maxLength(320)],
      ],
      agregarEnlaceSuplente: [this.solicitud32604State.agregarEnlaceSuplente],
    });

    /** Escucha los cambios en el estado de la solicitud y actualiza el formulario */
    this.solicitud32604Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32604State) => {
          this.solicitud32604State = respuesta;
          
          const ACTUAL_RFC = this.agregarEnlaceOperativoForm.get('agregarEnlaceRfc')?.value;
          const DEBE_PATCH_FORM = this.agregarEnlaceOperativoForm.pristine || !ACTUAL_RFC;
          
          if (DEBE_PATCH_FORM) {
            this.agregarEnlaceOperativoForm.patchValue({
              agregarEnlaceRfcTercero: this.solicitud32604State.rfcTercero,
              agregarEnlaceRfc: this.solicitud32604State.rfc,
              agregarEnlaceNombre: this.solicitud32604State.nombre,
              agregarEnlaceApellidoPaterno:
                this.solicitud32604State.apellidoPaterno,
              agregarEnlaceApellidoMaterno:
                this.solicitud32604State.apellidoMaterno,
              agregarEnlaceCiudadEstado:
                this.solicitud32604State.agregarEnlaceCiudadEstado,
              agregarEnlaceCargo: this.solicitud32604State.agregarEnlaceCargo,
              agregarEnlaceTelefono: this.solicitud32604State.telefono,
              agregarEnlaceCorreoElectronico:
                this.solicitud32604State.correoElectronico,
              agregarEnlaceSuplente:
                this.solicitud32604State.agregarEnlaceSuplente,
            }, { emitEvent: false });
          } else {
            // Actualice la casilla de verificación "suplente" solo cuando el formulario haya sido modificado para evitar que se restablezcan otros campos.
            this.agregarEnlaceOperativoForm.patchValue({
              agregarEnlaceSuplente: this.solicitud32604State.agregarEnlaceSuplente,
            }, { emitEvent: false });
          }
        })
      )
      .subscribe();
  }

  /**
   * Getter para acceder al control de teléfono del formulario.
   * @returns {AbstractControl} Control del formulario para teléfono
   */
  get agregarEnlaceTelefono(): AbstractControl | null {
    return this.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono');
  }

  /**
   * Getter para acceder al control de correo electrónico del formulario.
   * @returns {AbstractControl} Control del formulario para correo electrónico
   */
  get agregarEnlaceCorreoElectronico(): AbstractControl | null {
    return this.agregarEnlaceOperativoForm.get('agregarEnlaceCorreoElectronico');
  }

  /**
   * Busca y obtiene los datos del representante legal desde el servicio.
   * 
   * Realiza una consulta al servicio para obtener información del representante legal
   * y actualiza el estado con los datos recibidos. Muestra un modal al finalizar
   * la operación independientemente del resultado.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   */
  buscarTerceroNacionalIDC(): void {
  this.cargandoBuscar = true;
  const RFC_INPUT = this.agregarEnlaceOperativoForm.get('agregarEnlaceRfcTercero')?.value;
    // Validar que el campo RFC esté completo
    if (!RFC_INPUT?.trim()) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        titulo: '',
        modo: ''
      };
      this.cargandoBuscar = false;
      return;
    }
    // Validar que el RFC sea válido
    const CONTROL_RFC_TERCERO = this.agregarEnlaceOperativoForm.get('agregarEnlaceRfcTercero');
    if (CONTROL_RFC_TERCERO?.invalid) {
      let mensaje = 'El RFC tiene un formato inválido.';
      if (CONTROL_RFC_TERCERO.errors?.['pattern']) {
        mensaje = 'El RFC no es de persona física.';
      }
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        mensaje,
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        titulo: '',
        modo: ''
      };
      this.cargandoBuscar = false;
      return;
    }
    this.empresasComercializadorasService.conseguirRepresentanteLegalDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (respuesta: RepresentanteLegal[] | RepresentanteLegal) => {
        let registro: RepresentanteLegal | null = null;
        const RFC_ENTRADA = RFC_INPUT.trim().toUpperCase();
        if (Array.isArray(respuesta)) {
        const REGISTRO_ENCONTRADO = respuesta.find((item) => item.rfc?.trim().toUpperCase() === RFC_ENTRADA);
        registro = REGISTRO_ENCONTRADO ? REGISTRO_ENCONTRADO : null;
        } else if (respuesta && respuesta.rfc) {
        registro = respuesta.rfc?.trim().toUpperCase() === RFC_ENTRADA ? respuesta : null;
        }
        if (registro) {
        this.solicitud32604Store.actualizarEnlaceRfc(registro.rfc);
        this.solicitud32604Store.actualizarEnlaceNombre(registro.nombre);
        this.solicitud32604Store.actualizarEnlaceApellidoPaterno(registro.apellidoPaterno);
        this.solicitud32604Store.actualizarEnlaceApellidoMaterno(registro.apellidoMaterno);
        this.solicitud32604Store.actualizarEnlaceTelefono(registro.telefono);
        this.solicitud32604Store.actualizarEnlaceCorreoElectronico(registro.correoElectronico);
            // Actualizar store para ciudad/estado y cargo
        const CIUDAD_ESTADO_VALUE = registro.agregarEnlaceCiudadEstado ?? registro.ciudadestado ?? '';
        this.solicitud32604Store.actualizarEnlaceCiudadEstado(CIUDAD_ESTADO_VALUE);
        if (registro.agregarEnlaceCargo) {
          this.solicitud32604Store.actualizarEnlaceCargo(registro.agregarEnlaceCargo);
        }
            // Siempre habilitar los campos antes de parchear
        this.agregarEnlaceOperativoForm.get('agregarEnlaceCiudadEstado')?.enable();
        this.agregarEnlaceOperativoForm.get('agregarEnlaceCargo')?.enable();
        this.agregarEnlaceOperativoForm.patchValue({
          agregarEnlaceRfc: registro.rfc,
          agregarEnlaceNombre: registro.nombre,
          agregarEnlaceApellidoPaterno: registro.apellidoPaterno,
          agregarEnlaceApellidoMaterno: registro.apellidoMaterno,
          agregarEnlaceTelefono: registro.telefono,
          agregarEnlaceCorreoElectronico: registro.correoElectronico,
          agregarEnlaceCiudadEstado: registro.agregarEnlaceCiudadEstado ?? registro.ciudadestado ?? '',
          agregarEnlaceCargo: registro.agregarEnlaceCargo ?? ''
        });
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'action',
          titulo: '',
          mensaje: 'Datos obtenidos correctamente.',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        } else {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          mensaje: 'Ha proporcionado información con un formato incorrecto.',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
          titulo: '',
          modo: ''
        };
        }
        this.cargandoBuscar = false;
      },
      error: (_error) => {
        this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        mensaje: 'No se encontró información para el RFC especificado o ocurrió un error en la consulta.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        titulo: '',
        modo: ''
        };
        this.cargandoBuscar = false;
      },
      complete: () => {
        this.cargandoBuscar = false;
      }
      });
  }

  /**
   * Actualiza el RFC del tercero en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo RFC del tercero.
   * 
   * @param {Event} evento - Evento de cambio del input con el RFC del tercero
   * @memberof AgregarEnlaceOperativoComponent
   */
  actualizarRfcTercero(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarRfcTercero(VALOR);
  }

  /**
   * Actualiza el teléfono en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo de teléfono.
   * 
   * @param {Event} evento - Evento de cambio del input con el teléfono
   * @memberof AgregarEnlaceOperativoComponent
   */
  actualizarTelefono(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTelefono(VALOR);
  }

  /**
   * Actualiza el correo electrónico en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo de correo electrónico.
   * 
   * @param {Event} evento - Evento de cambio del input con el correo electrónico
   * @memberof AgregarEnlaceOperativoComponent
   */
  actualizarCorreoElectronico(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarCorreoElectronico(VALOR);
  }

  /**
   * Actualiza la ciudad y estado del enlace operativo en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo de ciudad y estado del enlace.
   * 
   * @param {Event} evento - Evento de cambio del input con la ciudad y estado
   * @memberof AgregarEnlaceOperativoComponent
   */
  actualizarCiudadEstado(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarEnlaceCiudadEstado(VALOR);
  }

  /**
   * Actualiza el cargo del enlace operativo en el store.
   * 
   * Extrae el valor del input desde el evento y lo almacena
   * en el estado global para el campo de cargo del enlace.
   * 
   * @param {Event} evento - Evento de cambio del input con el cargo
   * @memberof AgregarEnlaceOperativoComponent
   */
  actualizarCargo(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarEnlaceCargo(VALOR);
  }

  /**
   * Actualiza el valor del campo suplente en el store.
   * 
   * Extrae el estado checked del checkbox desde el evento
   * y lo almacena en el estado global para el campo suplente.
   * 
   * @param {Event} evento - Evento de cambio del checkbox suplente
   * @memberof AgregarEnlaceOperativoComponent
   */
  actualizarEnlaceSuplente(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).checked;
    this.agregarEnlaceOperativoForm.get('agregarEnlaceSuplente')?.setValue(VALOR, { emitEvent: false });
    this.solicitud32604Store.actualizarEnlaceSuplente(VALOR);
  }

  /**
   * Construye el objeto EnlaceOperativo con los valores del formulario y lo emite al componente padre.
   * 
   * Recopila todos los datos del formulario, construye un objeto EnlaceOperativo
   * completo con información adicional predeterminada y lo emite al componente
   * padre mediante el EventEmitter.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   */
  aceptarEnlaceSuplente(): void {
    this.validarYProcesarEnlaceOperativo();
  }

  /**
   * Valida el formulario y procesa los datos del enlace operativo si es válido.
   * Si no es válido, muestra los errores y previene el cierre del modal.
   */
  private validarYProcesarEnlaceOperativo(): void {
    if (this.agregarEnlaceOperativoForm.valid) {
      this.procesarDatosEnlaceOperativo();
    } else {
      this.marcarCamposComoTocados();
      // Mostrar notificación de error cuando el formulario no es válido
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios.',
        cerrar: false,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Procesa los datos del enlace operativo cuando el formulario es válido.
   * Emite los datos al componente padre y cierra el modal.
   */
  private procesarDatosEnlaceOperativo(): void {
    const OBJETO_JSON: EnlaceOperativo = {
      rfc: this.agregarEnlaceOperativoForm.get('agregarEnlaceRfc')?.value,
      nombre: this.agregarEnlaceOperativoForm.get('agregarEnlaceNombre')?.value,
      apellidoPaterno: this.agregarEnlaceOperativoForm.get(
        'agregarEnlaceApellidoPaterno'
      )?.value,
      apellidoMaterno: this.agregarEnlaceOperativoForm.get(
        'agregarEnlaceApellidoMaterno'
      )?.value,
      claveCiudad: '',
      ciudad: this.agregarEnlaceOperativoForm.get('agregarEnlaceCiudadEstado')
        ?.value,
      ciudadestado: this.agregarEnlaceOperativoForm.get('agregarEnlaceCiudadEstado')
        ?.value,
      agregarEnlaceCargo: this.agregarEnlaceOperativoForm.get('agregarEnlaceCargo')?.value,
      cargo: this.agregarEnlaceOperativoForm.get('agregarEnlaceCargo')?.value,
      telefono: this.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')
        ?.value,
      correo: this.agregarEnlaceOperativoForm.get(
        'agregarEnlaceCorreoElectronico'
      )?.value,
      suplente:
        this.agregarEnlaceOperativoForm.get('agregarEnlaceSuplente')?.value ===
        true
          ? '1'
          : '0',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      colonia: '',
      codigoPostal: '',
      localidad: '',
      delegacionMunicipio: '',
    };
    
    // Emitir los datos al componente padre
    this.agregarEnlaceOperativo.emit(OBJETO_JSON);

    // Resetear el formulario y el modo modificar después de envío exitoso
    this.agregarEnlaceOperativoForm.reset();
    this.modoModificar = false;
    
    // Reiniciar el formulario al estado predeterminado
    this.inicializarFormulario();

    // Cerrar el modal y eliminar backdrop
    setTimeout(() => {
      AgregarEnlaceOperativoComponent.cerrarModal();
    }, 100);
  }
  /**
   * Actualiza el cargo del enlace operativo en el store.
   * Extrae el valor del input desde el evento y lo almacena
   */
  agregarEnlaceCargo(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarEnlaceCargo(VALUE);
  }
  /**
   * Cierra el modal programáticamente y limpia los estilos del body.
   */
  private static cerrarModal(): void {
    // Cerrar usando el modal de Bootstrap
    const ELEMENTO_MODAL = document.getElementById('agregarEnlaceOperativo');
    if (ELEMENTO_MODAL) {
      const BOOTSTRAP_GLOBAL = (window as unknown as { bootstrap?: { Modal: { getInstance: (element: Element) => { hide: () => void } | null } } }).bootstrap;
      const MODAL_BOOTSTRAP = BOOTSTRAP_GLOBAL?.Modal?.getInstance(ELEMENTO_MODAL);
      if (MODAL_BOOTSTRAP) {
        MODAL_BOOTSTRAP.hide();
      }
    }
    
    // Limpiar estilos del body
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 100);
  }

  /**
   * Marca todos los campos del formulario como touched para mostrar errores de validación.
   */
  private marcarCamposComoTocados(): void {
    this.agregarEnlaceOperativoForm.markAllAsTouched();
  }

  /**
   * Cancela la acción actual, cierra el modal y elimina el backdrop
   */
  cancelarAccion(): void {
    this.agregarEnlaceOperativoForm.reset();
    this.modoModificar = false;
    // Reinicializar el formulario con valores por defecto del estado
    this.inicializarFormulario();
    AgregarEnlaceOperativoComponent.cerrarModalCompletamente();
  }

  /**
   * Cierra el modal completamente y elimina todos los elementos asociados
   */
  private static cerrarModalCompletamente(): void {
    const ELEMENTO_MODAL = document.getElementById('agregarEnlaceOperativo');
    if (ELEMENTO_MODAL) {
      try {
        interface BootstrapModal {
          hide: () => void;
          dispose: () => void;
        }
        interface BootstrapWindow extends Window {
          bootstrap?: {
            Modal?: {
              getInstance: (element: Element) => BootstrapModal | null;
            };
          };
        }
        const BOOTSTRAP_MODAL = (window as BootstrapWindow).bootstrap?.Modal?.getInstance(ELEMENTO_MODAL) || Modal.getInstance(ELEMENTO_MODAL);
        if (BOOTSTRAP_MODAL) {
          BOOTSTRAP_MODAL.hide();
          setTimeout(() => {
            try {
              if (typeof BOOTSTRAP_MODAL.dispose === 'function') {
                BOOTSTRAP_MODAL.dispose();
              }
            } catch (e) {
              // Error al eliminar la instancia del modal.
            }
          }, 100);
        }
      } catch (e) {
        // Error al acceder a la instancia del modal.
      }
      
      // Forzar limpieza inmediata del DOM
      setTimeout(() => {
        ELEMENTO_MODAL.classList.remove('show', 'fade', 'd-block');
        ELEMENTO_MODAL.removeAttribute('aria-modal');
        ELEMENTO_MODAL.setAttribute('aria-hidden', 'true');
        ELEMENTO_MODAL.style.display = 'none';
        ELEMENTO_MODAL.style.paddingRight = '';
        
        // Limpiar el conjunto de datos de Bootstrap
        Object.keys(ELEMENTO_MODAL.dataset).forEach((key) => {
          if (key.startsWith('bs')) {
            delete ELEMENTO_MODAL.dataset[key];
          }
        });
        
        // Elimina todos los fondos.
        document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        });
        
        // Restablecer el estado del cuerpo
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 0);
    }
  }

  /**
   * Prepara el formulario para agregar un nuevo enlace operativo.
   * Resetea el formulario y asegura que esté en modo agregar.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   */
  prepararParaAgregar(): void {
    this.modoModificar = false;
    this.agregarEnlaceOperativoForm.reset();
    // Patchear con valores del estado actual si existen
    this.agregarEnlaceOperativoForm.patchValue({
      agregarEnlaceRfcTercero: this.solicitud32604State.rfcTercero || '',
      agregarEnlaceRfc: '',
      agregarEnlaceNombre: '',
      agregarEnlaceApellidoPaterno: '',
      agregarEnlaceApellidoMaterno: '',
      agregarEnlaceCiudadEstado: '',
      agregarEnlaceCargo: '',
      agregarEnlaceTelefono: '',
      agregarEnlaceCorreoElectronico: '',
      agregarEnlaceSuplente: false
    });
  }

  /**
   * Verifica si un campo del formulario no es válido.
   * 
   * Evalúa el estado de validación de un campo específico del formulario,
   * verificando si es inválido y ha sido tocado por el usuario.
   * 
   * @param {string} id - Identificador del campo en el formulario
   * @returns {boolean | undefined} true si el campo es inválido y ha sido tocado, undefined en caso contrario
   * @memberof AgregarEnlaceOperativoComponent
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.agregarEnlaceOperativoForm.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Finaliza todas las suscripciones para evitar fugas de memoria.
   * 
   * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
   * Emite un valor en el Subject destroy$ y lo completa para cancelar
   * automáticamente todas las suscripciones activas.
   * 
   * @memberof AgregarEnlaceOperativoComponent
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
