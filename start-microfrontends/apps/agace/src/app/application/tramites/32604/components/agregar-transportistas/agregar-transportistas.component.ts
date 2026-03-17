import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent, REGEX_RFC, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Solicitud32604State, Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { TransportistasTable } from '../../models/empresas-comercializadoras.model';

/**
 * Decorador que define el componente 'AgregarTransportistasComponent'.
 * Incluye configuración de selector, template, estilos y módulos importados.
 */
@Component({
  selector: 'app-agregar-transportistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, NotificacionesComponent],
  templateUrl: './agregar-transportistas.component.html',
  styleUrl: './agregar-transportistas.component.scss',
})
/**
 * Decorador que define el componente 'AgregarTransportistasComponent'.
 * Incluye configuración de selector, template, estilos y módulos importados.
 */
export class AgregarTransportistasComponent implements OnInit, OnDestroy {
  /**
   * Permite al componente padre actualizar los valores del formulario con un objeto TransportistasTable.
   * @param {TransportistasTable} transportista - Datos del transportista a cargar en el formulario
   */
  private originalRFC: string | null = null;
  public patchForm(transportista: TransportistasTable): void {
    if (this.transportistaCertificacionForm) {
      this.originalRFC = transportista.transportistaRFCModifTrans;
      this.transportistaCertificacionForm.patchValue({
        transportistaRFC: transportista.transportistaRFCModifTrans,
        transportistaRFCModifTrans: transportista.transportistaRFCModifTrans,
        transportistaRazonSocial: transportista.transportistaRazonSocial,
        transportistaDomicilio: transportista.transportistaDomicilio,
        transportistaCaat: transportista.transportistaCaat
      });
    }
  }
  /** Formulario reactivo para capturar datos del transportista */
  transportistaCertificacionForm!: FormGroup;

  /** Sujeto utilizado para cancelar suscripciones y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Estado actual de la solicitud obtenido desde el store */
  solicitud32604State: Solicitud32604State = {} as Solicitud32604State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Evento que emite los datos del transportista seleccionado al componente padre */
  @Output() seccionTransportistasLista = new EventEmitter<TransportistasTable>();

  /** Evento para cancelar y cerrar el modal */
  @Output() cancelarModal = new EventEmitter<void>();

  /** Datos del transportista a modificar (opcional) */
  @Input() transportistaAModificar: TransportistasTable | null = null;

  /** Lista de transportistas existentes para validación de duplicados */
  @Input() transportistasExistentes: TransportistasTable[] = [];

  /**
   * Representa una confirmar instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
  public confirmarNotificacion!: Notificacion;

  /**
   * Nueva notificación para mostrar mensajes modales.
   * 
   * @public
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Getter que devuelve el título dinámico del modal basado en si se está agregando o modificando.
   * 
   * @returns {string} "Modificar transportistas" si hay un transportista a modificar, "Agregar transportistas" en caso contrario
   */
  get tituloModal(): string {
    return this.transportistaAModificar ? 'Modificar transportistas' : 'Agregar transportistas';
  }

  /**
   * Constructor de la clase AgregarTransportistasComponent.
   *
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param empresasComercializadorasService Servicio para la gestión de empresas comercializadoras.
   * @param solicitud32604Store Store para el manejo del estado de la solicitud 32604.
   * @param solicitud32604Query Query para consultar el estado de la solicitud 32604.
   * @param consultaioQuery Query para consultar el estado de la sección Consultaio.
   *
   * Suscribe al estado de `Consultaio` para:
   * - Actualizar la propiedad `esFormularioSoloLectura` según el estado de solo lectura.
   * - Inicializar la configuración del formulario llamando a `inicializarEstadoFormulario()`.
   * - Cancelar la suscripción automáticamente al emitir `destroy$` para evitar fugas de memoria.
   */
  constructor(
    private fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
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
   * Ciclo de vida ngOnInit: inicializa el formulario y se suscribe al estado de la solicitud.
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
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
  }

   /**
   * Inicializa el formulario `agregarEnlaceOperativoForm` con los valores actuales
   * del estado `solicitud32604State` o con los datos del transportista a modificar.
   *
   * Algunos campos están deshabilitados porque no deben ser editables por el usuario.
   * Aplica validaciones como `required`, `email`, y un patrón para el teléfono.
   *
   * Además, se suscribe a los cambios del estado de la solicitud (`selectSolicitud$`)
   * y actualiza los valores del formulario mediante `patchValue`.
   *
   * @returns {void}
   */
  inicializarFormulario(): void {
    // Si hay transportista a modificar, usar esos valores; de lo contrario, usar valores del state
    const VALORES_FORMULARIO = this.transportistaAModificar ? {
      transportistaRFC: '', // Este valor no está en TransportistasTable, usar vacío para modificación
      transportistaRFCModifTrans: this.transportistaAModificar.transportistaRFCModifTrans,
      transportistaRazonSocial: this.transportistaAModificar.transportistaRazonSocial,
      transportistaDomicilio: this.transportistaAModificar.transportistaDomicilio,
      transportistaCaat: this.transportistaAModificar.transportistaCaat,
      transportistaIdDomicilio: '', // Valores por defecto para campos que no están en TransportistasTable
      transportistaIdRFC: '',
      transportistaIdRazonSocial: '',
      transportistaIdCaat: ''
    } : {
      transportistaRFC: this.solicitud32604State.transportistaRFC,
      transportistaRFCModifTrans: this.solicitud32604State.transportistaRFCModifTrans,
      transportistaRazonSocial: this.solicitud32604State.transportistaRazonSocial,
      transportistaDomicilio: this.solicitud32604State.transportistaDomicilio,
      transportistaCaat: this.solicitud32604State.transportistaCaat,
      transportistaIdDomicilio: this.solicitud32604State.transportistaIdDomicilio,
      transportistaIdRFC: this.solicitud32604State.transportistaIdRFC,
      transportistaIdRazonSocial: this.solicitud32604State.transportistaIdRazonSocial,
      transportistaIdCaat: this.solicitud32604State.transportistaIdCaat
    };

    this.transportistaCertificacionForm = this.fb.group({
      transportistaRFC: [
        VALORES_FORMULARIO.transportistaRFC,
        [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC)]
      ],
      transportistaRFCModifTrans: [
        VALORES_FORMULARIO.transportistaRFCModifTrans,
        [Validators.maxLength(13), Validators.pattern(REGEX_RFC)]
      ],
      transportistaRazonSocial: [
        VALORES_FORMULARIO.transportistaRazonSocial,
        [Validators.maxLength(254)]
      ],
      transportistaDomicilio: [
        VALORES_FORMULARIO.transportistaDomicilio,
        [Validators.maxLength(300)],
      ],
      transportistaCaat: [
        VALORES_FORMULARIO.transportistaCaat,
        [Validators.maxLength(254)],
      ],
      transportistaIdDomicilio: [
        VALORES_FORMULARIO.transportistaIdDomicilio,
      ],
      transportistaIdRFC: [VALORES_FORMULARIO.transportistaIdRFC],
      transportistaIdRazonSocial: [
        VALORES_FORMULARIO.transportistaIdRazonSocial,
      ],
      transportistaIdCaat: [VALORES_FORMULARIO.transportistaIdCaat],
    });

    // Deshabilitar campos específicos
    this.transportistaCertificacionForm.get('transportistaRFCModifTrans')?.disable();
    this.transportistaCertificacionForm.get('transportistaRazonSocial')?.disable();
    this.transportistaCertificacionForm.get('transportistaDomicilio')?.disable();
    this.transportistaCertificacionForm.get('transportistaCaat')?.disable();

    // Aplicar estado general deshabilitar/habilitar si es necesario
    if (this.esFormularioSoloLectura) {
      this.transportistaCertificacionForm.disable();
    }

    // Solo suscribirse al state si no estamos modificando un transportista existente
    if (!this.transportistaAModificar) {
      /** Se suscribe al estado de la solicitud para mantener sincronizado el formulario */
      this.solicitud32604Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroy$),
          map((respuesta: Solicitud32604State) => {
            this.solicitud32604State = respuesta;
            this.transportistaCertificacionForm.patchValue({
              transportistaRFC: respuesta.transportistaRFC,
              transportistaRFCModifTrans: respuesta.transportistaRFCModifTrans,
              transportistaRazonSocial: respuesta.transportistaRazonSocial,
              transportistaDomicilio: respuesta.transportistaDomicilio,
              transportistaCaat: respuesta.transportistaCaat,
            });
          })
        )
        .subscribe();
    }
  }

  /**
   * Actualiza el RFC del transportista en el store.
   */
  actualizarTransportistaRFC(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTransportistaRFC(VALOR);
  }

  /**
   * Actualiza el RFC modificado del transportista en el store.
   */
  actualizarTransportistaRFCModifTrans(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTransportistaRFCModifTrans(VALOR);
  }

  /**
   * Actualiza la razón social del transportista en el store.
   */
  actualizarTransportistaRazonSocial(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTransportistaRazonSocial(VALOR);
  }

  /**
   * Actualiza el domicilio del transportista en el store.
   */
  actualizarTransportistaDomicilio(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTransportistaDomicilio(VALOR);
  }

  /**
   * Actualiza el CAAT del transportista en el store.
   */
  actualizarTransportistaCaat(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarTransportistaCaat(VALOR);
  }

  /**
   * Verifica si un control del formulario es inválido y ha sido tocado.
   * @param id ID del control del formulario
   * @returns booleano que indica si el campo es inválido
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.transportistaCertificacionForm.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Ejecuta la búsqueda del transportista si el RFC ha sido ingresado.
   * Valida que el campo RFC sea válido antes de proceder con la búsqueda.
   */
  selectBuscarTransportista(): void {
    const RFC_CONTROL = this.transportistaCertificacionForm.get('transportistaRFC');
    
    // Marcar el campo como tocado para mostrar errores de validación
    RFC_CONTROL?.markAsTouched();
    
    if (RFC_CONTROL?.invalid) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: 'Existen datos incorrectos que no cumplen con el formato esperado.',
        cerrar: false,
        tiempoDeEspera: 4000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      
      this.cdr.detectChanges();
      return;
    }
    
    if (RFC_CONTROL?.value) {
      this.validarRFCContraJSON(RFC_CONTROL.value);
    }
  }

  /**
   * Valida el RFC contra los datos del JSON y procede con la búsqueda si es válido.
   * 
   * @param {string} rfc - RFC a validar contra el JSON
   * @memberof AgregarTransportistasComponent
   */
  private validarRFCContraJSON(rfc: string): void {
    // Primero verificar si el RFC ya existe en la lista de transportistas existentes
    const TRANSPORTISTA_DUPLICADO = this.transportistasExistentes.find(
      (transportista) => transportista.transportistaRFCModifTrans === rfc
    );

    if (TRANSPORTISTA_DUPLICADO && !this.transportistaAModificar) {
      // RFC ya existe en la lista y no estamos modificando, mostrar error de duplicado
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: 'Ya existe un registro con ese RFC',
        cerrar: false,
        tiempoDeEspera: 4000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      
      this.cdr.detectChanges();
      return;
    }

    // Si estamos modificando un transportista, verificar que no sea el mismo RFC
    if (TRANSPORTISTA_DUPLICADO && this.transportistaAModificar && 
        TRANSPORTISTA_DUPLICADO.transportistaRFCModifTrans !== this.transportistaAModificar.transportistaRFCModifTrans) {
      // RFC ya existe en otro registro diferente al que estamos modificando
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Mensaje',
        mensaje: 'Ya existe un registro con ese RFC',
        cerrar: false,
        tiempoDeEspera: 4000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      
      this.cdr.detectChanges();
      return;
    }

    this.empresasComercializadorasService
      .conseguirTransportistasLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: TransportistasTable[]) => {
          // Compruebe si el RFC existe en la respuesta JSON
          // El usuario ingresa el RFC en el primer campo, y lo buscamos en transportistaRFCModifTrans
          const TRANSPORTISTA_ENCONTRADO = respuesta.find(
            (transportista) => transportista.transportistaRFCModifTrans === rfc
          );
          
          if (TRANSPORTISTA_ENCONTRADO) {
            // RFC encontrado, llenar formulario con los datos del transportista
            this.actualizarFormularioConDatos(TRANSPORTISTA_ENCONTRADO);
          } else {
            // RFC no encontrado en JSON, muestra notificación de error
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: '',
              mensaje: 'Existen datos incorrectos que no cumplen con el formato esperado.',
              cerrar: false,
              tiempoDeEspera: 4000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: ''
            };
            
            this.cdr.detectChanges();
          }
        },
        error: () => {
          // Manejar error del servicio
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: 'Existen datos incorrectos que no cumplen con el formato esperado.',
            cerrar: false,
            tiempoDeEspera: 4000,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: ''
          };
          
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Actualiza el formulario con los datos del transportista encontrado.
   * 
   * @param {TransportistasTable} transportista - Datos del transportista
   * @memberof AgregarTransportistasComponent
   */
  private actualizarFormularioConDatos(transportista: TransportistasTable): void {
    this.transportistaCertificacionForm.patchValue({
      transportistaRFC: transportista.transportistaRFCModifTrans,
      transportistaRFCModifTrans: transportista.transportistaRFCModifTrans,
      transportistaRazonSocial: transportista.transportistaRazonSocial,
      transportistaDomicilio: transportista.transportistaDomicilio,
      transportistaCaat: transportista.transportistaCaat
    });

    this.solicitud32604Store.actualizarTransportistaRFCModifTrans(
      transportista.transportistaRFCModifTrans
    );
    this.solicitud32604Store.actualizarTransportistaRazonSocial(
      transportista.transportistaRazonSocial
    );
    this.solicitud32604Store.actualizarTransportistaDomicilio(
      transportista.transportistaDomicilio
    );
    this.solicitud32604Store.actualizarTransportistaCaat(
      transportista.transportistaCaat
    );

    // Mostrar modal de éxito
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
    this.cdr.detectChanges();
  }

  /**
   * Llama al servicio para obtener la lista de transportistas y actualiza el store.
   */
  conseguirTransportistasLista(): void {
    this.empresasComercializadorasService
      .conseguirTransportistasLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: TransportistasTable[]) => {
          this.solicitud32604Store.actualizarTransportistaRFCModifTrans(
            respuesta[0].transportistaRFCModifTrans
          );
          this.solicitud32604Store.actualizarTransportistaRazonSocial(
            respuesta[0].transportistaRazonSocial
          );
          this.solicitud32604Store.actualizarTransportistaDomicilio(
            respuesta[0].transportistaDomicilio
          );
          this.solicitud32604Store.actualizarTransportistaCaat(
            respuesta[0].transportistaCaat
          );
        },
      });
  }

  /**
   * Prepara un objeto con los datos del transportista y lo emite al componente padre.
   */
  aceptarTransportista(): void {
    this.validarYProcesarTransportista();
  }

  /**
   * Valida el formulario y procesa los datos del transportista si es válido.
   */
  private validarYProcesarTransportista(): void {
    if (this.transportistaCertificacionForm.valid) {
      this.procesarDatosTransportista();
    } else {
      this.marcarCamposComoTocados();
    }
  }

  /**
   * Procesa los datos del transportista cuando el formulario es válido.
   */
  private procesarDatosTransportista(): void {
    const OBJETO_JSON: TransportistasTable & { originalRFC?: string } = {
      transportistaRFCModifTrans: this.transportistaCertificacionForm.getRawValue().transportistaRFCModifTrans,
      transportistaRazonSocial: this.transportistaCertificacionForm.getRawValue().transportistaRazonSocial,
      transportistaDomicilio: this.transportistaCertificacionForm.getRawValue().transportistaDomicilio,
      transportistaCaat: this.transportistaCertificacionForm.getRawValue().transportistaCaat,
      ...(this.originalRFC ? { originalRFC: this.originalRFC } : {})
    };
    this.seccionTransportistasLista.emit(OBJETO_JSON);
    this.originalRFC = null;
    
    // Mostrar notificación de éxito después de guardar los datos
    this.nuevaNotificacion = {
      tipoNotificacion: 'INFORMACION',
      categoria: 'success',
      modo: 'action',
      titulo: 'Mensaje',
      mensaje: 'Datos guardados correctamente',
      cerrar: false,
      tiempoDeEspera: 4000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    };
    
    // Limpiar el formulario después de guardar exitosamente
    this.limpiar();
  }

  /**
   * Marca todos los campos del formulario como touched para mostrar errores de validación.
   */
  private marcarCamposComoTocados(): void {
    this.transportistaCertificacionForm.markAllAsTouched();
  }

  /**
   * Limpia los datos de la transportistaCertificacionForm.
   */
  public limpiar(): void {
    this.transportistaCertificacionForm.reset();
    // Al limpiar, también se debe resetear la referencia del transportista a modificar
    this.transportistaAModificar = null;
  }

  /**
   * Maneja la confirmación de la notificación de validación.
   * 
   * @param {boolean} _confirmar - True si el usuario confirma, false si cancela
   * @memberof AgregarTransportistasComponent
   */
  manejarConfirmacionNotificacion(_confirmar: boolean): void {
    this.nuevaNotificacion = {} as Notificacion;
  }

  /**
   * Método para cancelar y cerrar el modal, emitiendo evento al componente padre
   */
  cancelarTransportistaModal(): void {
    this.cancelarModal.emit();
  }

  /**
   * Ciclo de vida ngOnDestroy: finaliza el observable para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
