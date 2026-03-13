import {
  AlertComponent,
  ConsultaioQuery,
  NotificacionesComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { ProveedorExtranjero } from '../../models/avisomodify.model';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { exportExcelFile } from '@libs/shared/data-access-user/src';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adicion-procesos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    NotificacionesComponent,
  ],
  templateUrl: './adicion-procesos.component.html',
  styleUrls: ['./adicion-procesos.component.scss'],
  providers: [ToastrService],

})
export class AdicionProcesosComponent implements OnInit, OnDestroy {
  /** Sujeto para destruir observables y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Título de la sección de proveedores existentes */
  seccionProveedoresExistentes: string = 'Registros cargodos:';

  /** Título del grupo de proveedores */
  ProveedoresTitulo!: string;

  /** Modelo que contiene los datos del proveedor extranjero */
  proveedorExtranjero!: ProveedorExtranjero;

  /** Formulario reactivo para el proveedor extranjero */
  proveedorXtranjForm!: FormGroup;

  /**
   * Declaración de la variable nuevaNotificacion de tipo Notificacion.
   * Se utiliza para almacenar y gestionar notificaciones dentro del sistema.
   */
  public nuevaNotificacion!: Notificacion;
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;
  /**
* Elemento de entrada de archivo HTML.
*
* @type {HTMLInputElement}
*/
  entradaArchivo!: HTMLInputElement;
  /**
  * Etiqueta del archivo seleccionado.
  */
  etiquetaDeArchivo: string = 'Sin archivo seleccionados';

  /**
 * Archivo de medicamentos seleccionado.
 */
  archivoMedicamentos: File | null = null;
  @Output() onContinue = new EventEmitter<void>();
  /**
   * Constructor que inyecta dependencias necesarias como FormBuilder, Store y Query.
   */
  constructor(
    private fb: FormBuilder,
    private store: Tramite32301Store,
    private Tramite32301Query: Tramite32301Query,
    private consultaioQuery: ConsultaioQuery,
    private AvisoModifyService: AvisoModifyService,
    private toastrService: ToastrService,


  ) {
    /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroy$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
          map((seccionState)=>{
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Ciclo de vida OnInit. Inicializa título, proveedor extranjero, y suscripciones al estado.
   */
  ngOnInit(): void {
    this.ProveedoresTitulo = 'Proceso(s) productivo(s)*';
    this.inicializarEstadoFormulario();

  }

  /**
 * Evalúa si se debe inicializar o cargar datos en el formulario.  
 * Además, obtiene la información del catálogo de mercancía.
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
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.proveedorXtranjForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.proveedorXtranjForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }
  /**
* Inicializa el formulario reactivo para capturar el valor de 'registro'.
* Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
* y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
* con el valor inicial obtenido del store.
*/

  inicializarFormulario(): void {
    this.inicializaProveedorExtranjer();
    this.Tramite32301Query.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.proveedorExtranjero = state as unknown as ProveedorExtranjero;
        this.crearFormProveedorExtranjer();
      });
  }

  /**
   * Inicializa los valores del proveedor extranjero en el store.
   */
  inicializaProveedorExtranjer(): void {
    this.store.setRegistrosProveedoresExtranjeros({
      archivoExtranjero: [],
      registrosProveedoresExtranjeros: '0',
    });
  }

  /**
   * Crea el formulario para capturar datos del proveedor extranjero.
   */
  crearFormProveedorExtranjer(): void {
    this.proveedorXtranjForm = this.fb.group({
      archivoExtranjero: [
        this.proveedorExtranjero?.archivoExtranjero,
        Validators.required,
      ],
      registrosProveedoresExtranjeros: [
        {
          value: this.proveedorExtranjero?.registrosProveedoresExtranjeros,
          disabled: true,
        },
      ],
    });
  }

  /**
   * Maneja la selección de archivos por parte del usuario.
   * @param event Evento generado al seleccionar un archivo
   */
  onFileSelected(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const FILE = INPUT?.files?.[0];

    if (FILE) {
      this.proveedorXtranjForm.patchValue({ archivoExtranjero: FILE });
      this.proveedorXtranjForm
        .get('archivoExtranjero')
        ?.updateValueAndValidity();
    } else {
      this.openCargaExtranjeroModel();
    }
  }

  cargarArchivoProceso(): void {
    if (this.archivoMedicamentos) {
      this.AvisoModifyService.cargarArchivoProceso(this.archivoMedicamentos).subscribe(
        (response) => {

          if (response.codigo === '00') {
            this.proveedorXtranjForm.patchValue({
              registrosProveedoresExtranjeros: response.datos?.numero_de_filas
            });
            this.toastrService.success('Archivo cargado exitosamente.'); 
          }
        },
        (error: any) => {
          console.error('Error al cargar el archivo:', error);
          this.toastrService.error(error.mensaje);
        }
      );
    }
  }

  /**
   * Abre el modal de advertencia para carga de archivo extranjero.
   */
  /**
   * Método para abrir el modelo de carga de archivos extranjeros.
   */
  openCargaExtranjeroModel(): void {
    /**
     * Configuración de una nueva notificación para alertar al usuario.
     */
    this.nuevaNotificacion = {
      /**
       * Tipo de notificación: alerta.
       */
      tipoNotificacion: 'alert',

      /**
       * Categoría de la notificación: peligro (danger).
       */
      categoria: 'danger',

      /**
       * Modo de la notificación: acción requerida.
       */
      modo: 'action',

      /**
       * Título de la notificación (actualmente vacío).
       */
      titulo: '',

      /**
       * Mensaje de la notificación, indicando que el archivo debe contener al menos un registro.
       */
      mensaje: '1 - El archivo debe contener al menos un registro.',

      /**
       * Indica si la notificación debe cerrarse automáticamente (false = no se cerrará).
       */
      cerrar: false,

      /**
       * Tiempo de espera antes de cerrar la notificación (2000 milisegundos).
       */
      tiempoDeEspera: 2000,

      /**
       * Texto del botón de aceptación en la notificación.
       */
      txtBtnAceptar: 'Aceptar',

      /**
       * Texto del botón de cancelación en la notificación (actualmente vacío).
       */
      txtBtnCancelar: '',
    };
  }

  descargarPlantilla(event: Event): void {
    event.preventDefault();
    // Lógica para obtener la plantilla de proveedores extranjeros
    this.AvisoModifyService.getPlantilla('PROCESO').subscribe(
      (response) => {
        // Manejar la respuesta exitosa

        if (response.codigo === '00') {
          exportExcelFile(response.datos.contenido);
        }
      },
      (error: any) => {
        // Manejar el error
        console.error('Error al obtener la plantilla de proveedores extranjeros:', error);
        this.toastrService.error(error.mensaje);

      }
    );

  }


  /**
   * Ciclo de vida OnDestroy. Finaliza suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
* Maneja el cambio de archivo en el input de archivo.
*
* @param event Evento de cambio de archivo.
*
* @returns {void}
*/
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    const FILE_INPUT = document.getElementById(
      'archivoExtranjero'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];
    if (FILE) {
      if (FILE.type !== 'text/xlsx' && !FILE.name.endsWith('.xlsx')) {
        this.abrirModal();
        return;
      }
      if (TARGET.files && TARGET.files.length > 0) {
        this.archivoMedicamentos = TARGET.files[0];
        this.etiquetaDeArchivo
          = this.archivoMedicamentos.name;
      } else {
        this.etiquetaDeArchivo = 'Sin archivo seleccionados';
      }
    }
  }
  /**
  * Abre un modal de notificación para alertar al usuario que debe seleccionar un archivo CSV.
  * 
  * Este método inicializa la notificación con un mensaje de alerta y configura el elemento a eliminar.
  */
  abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por favor seleccione un archivo CSV.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'OK',
      txtBtnCancelar: '',
    };

  }
  /**
* Activa la selección del archivo de medicamentos.
* @returns {void}
*/
  activarSeleccionArchivo(): void {
    this.entradaArchivo = document.getElementById(
      'archivoExtranjero'
    ) as HTMLInputElement;
    if (this.entradaArchivo) {
      this.entradaArchivo.click();
    }
  }
  
  continuar(): void {
    this.onContinue.emit();
  }
}
