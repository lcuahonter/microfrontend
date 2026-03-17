import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertComponent, ConsultaioQuery, NotificacionesComponent, TituloComponent} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit ,EventEmitter,Output} from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { PROVEEDORES } from '../../enums/proveedor-extranjero.enum';
import { ProveedorExtranjero } from '../../models/avisomodify.model';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { exportExcelFile } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente para manejar la carga y gestión de proveedores extranjeros.
 * Este componente incluye un formulario reactivo para la carga de archivos y registros de proveedores.
 */
@Component({
  selector: 'app-proveedor-extranjero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    NotificacionesComponent,
  ],
  styleUrls: ['./proveedor-extranjero.component.scss'],
  templateUrl: './proveedor-extranjero.component.html',
  providers: [ToastrService],

})
export class ProveedorExtranjeroComponent implements OnInit, OnDestroy {
  /** Título de la sección de proveedores existentes */
  seccionProveedoresExistentes: string = 'Sección de Proveedores Existentes';

  /** Título dinámico basado en el tipo de proveedor */
  ProveedoresTitulo!: string;

  /**
   * Declaración de la variable proveedores con el tipo de PROVEEDORES.
   * Se utiliza para almacenar y gestionar la lista de proveedores dentro del sistema.
   */
  proveedores!: typeof PROVEEDORES;

  /** Formulario reactivo para la carga de proveedores extranjeros */
  proveedorXtranjForm!: FormGroup;

  /** Datos del proveedor extranjero obtenidos desde el store */
  proveedorExtranjero!: ProveedorExtranjero;

  /** Tipo de proveedor, se recibe como input */
  @Input() proveedortype!: string;


  @Output() onContinue = new EventEmitter<void>();

  /** Objeto que maneja el ciclo de vida de los componentes, se usa para la destrucción de observables */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Declaración de la variable cargaExtranjeroNotificacion de tipo Notificacion.
   * Se utiliza para gestionar notificaciones relacionadas con la carga de datos de extranjeros.
   */
  public cargaExtranjeroNotificacion!: Notificacion;

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  mensajeCamposObligatorios: string = '* Campos obligatorios';

  
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


  /**
   * Constructor del componente, inyecta las dependencias necesarias
   * @param fb - FormBuilder para la creación de formularios reactivos
   * @param store - Store para manejar el estado de los proveedores
   * @param Tramite32301Query - Query para obtener los datos del estado
   */
  constructor(
    private fb: FormBuilder,
    private store: Tramite32301Store,
    private Tramite32301Query: Tramite32301Query,
    private consultaioQuery: ConsultaioQuery,
    private avisoModifyService: AvisoModifyService,
    private toastrService: ToastrService,
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
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Inicializa el componente, configura el título y el formulario reactivo,
   * y suscribe a los cambios en el estado del store.
   */
  ngOnInit(): void {
    this.ProveedoresTitulo =
      this.proveedortype === 'extranjero'
        ? 'Aviso de modificaciones de clientes y proveedores extranjeros'
        : 'Aviso de modificaciones de clientes y proveedores nacionales';
      this.inicializarFormulario();
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
    this.crearFormProveedorExtranjer();


  }


  /**
   * Inicializa el estado del proveedor extranjero en el store.
   */
  inicializaProveedorExtranjer(): void {
    this.store.setRegistrosProveedoresExtranjeros({
      archivoExtranjero: [],
      registrosProveedoresExtranjeros: '0',
    });
  }

  /**
   * Crea el formulario reactivo para el proveedor extranjero con los datos del store.
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
   * Validador estático para asegurar que el archivo seleccionado es de tipo .xlsx.
   * @param control - Control del formulario
   * @returns Un objeto de error si el archivo no es válido, o null si es válido.
   */
  static fileValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const FILE = control.value;
    if (FILE && FILE.name.endsWith('.xlsx')) {
      return null; // El archivo es válido
    }
    return { invalidFileType: true }; // El archivo es inválido
  }

  /**
   * Maneja la selección de un archivo. Si se selecciona un archivo, lo agrega al formulario.
   * Si no se selecciona un archivo, abre el modal de carga.
   * @param event - Evento de selección de archivo
   */
  onFileSelected(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const FILET = INPUT?.files?.[0];

    if (FILET) {
      this.proveedorXtranjForm.patchValue({ archivoExtranjero: FILET });
      this.proveedorXtranjForm
        .get('archivoExtranjero')
        ?.updateValueAndValidity();
    } else {
      this.openCargaExtranjeroModel();
    }
  }

  /**
   * Carga el archivo a través de Ajax si el formulario es válido. Si no es válido, muestra el modal.
   */
  cargarArchivoAjax(): void {
    if (this.proveedorXtranjForm.valid) {

      this.avisoModifyService.cargarArchivoProveedoresExtranjeros( this.archivoMedicamentos as File,this.proveedortype).subscribe(
        (response) => {
          // Manejar la respuesta exitosa
          if(response.codigo === '00'){
            const registros = response.datos.numero_de_filas;
            this.proveedorXtranjForm.patchValue({ registrosProveedoresExtranjeros: registros });
            if(this.proveedortype === 'extranjero'){
              this.store.setProveedoresExtranjeros(response.datos.proveedores);
            }
            if(this.proveedortype === 'nacionales'){
              this.store.setProveedoresNacionalesRes(response.datos.proveedores);
            }
        
          }else{
            this.toastrService.error(response.mensaje);

          }
        }
      );


      this.store.setRegistrosProveedoresExtranjeros(
        this.proveedorXtranjForm.value
      );
    } else {
      this.openCargaExtranjeroModel();
    }
  }

  /**
   * Se llama cuando el componente es destruido para limpiar los recursos.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Abre el modal de carga de proveedores extranjeros.
   */
  openCargaExtranjeroModel(): void {
    this.cargaExtranjeroNotificacion = {
      /**
       * Tipo de notificación: alerta.
       */
      tipoNotificacion: 'alert',

      /**
       * Categoría de la notificación: peligro (danger).
       */
      categoria: 'success',

      /**
       * Modo de la notificación: acción requerida.
       */
      modo: 'action',

      /**
       * Título de la notificación (actualmente vacío).
       */
      titulo: '',

      /**
       * Mensaje de la notificación, indicando que El archivo debe contener almenos un registro.
       */
      mensaje: 'Existen registros con información incompleta',

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
  * Abre un modal de notificación para alertar al usuario que debe seleccionar un archivo xlsx.
  * 
  * Este método inicializa la notificación con un mensaje de alerta y configura el elemento a eliminar.
  */
  abrirModal(): void {
    this.cargaExtranjeroNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por favor seleccione un archivo xlsx.',
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

  getPlantillaProveedoresExtranjeros(event: Event): void {
    event.preventDefault();
    // Lógica para obtener la plantilla de proveedores extranjeros
    this.avisoModifyService.getPlantillaProveedoresExtranjeros(this.proveedortype).subscribe(
      (response) => {
        // Manejar la respuesta exitosa
        
        if(response.codigo === '00'){
          exportExcelFile(response.datos.contenido);
        }
      },
      (error) => {
        // Manejar el error
        console.error('Error al obtener la plantilla de proveedores extranjeros:', error);
        this.toastrService.error(error.mensaje);
        
      }
    );
  }
}
