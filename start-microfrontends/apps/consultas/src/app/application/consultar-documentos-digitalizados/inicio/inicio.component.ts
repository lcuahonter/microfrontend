import {
  AlertComponent,
  CategoriaMensaje,
  ERROR_FORMA_ALERT_CAMPOS,
  InputFecha,
  InputFechaComponent,
  LoginQuery,
  Notificacion,
  NotificacionesComponent,
  REGEX_RFC,
  TablePaginationComponent,
  TipoNotificacionEnum,
  TituloComponent
} from '@libs/shared/data-access-user/src'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentoDigitalizadoRequest } from '../service/model/request/documentos-digitalizacion-request.model';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentosDigitalizadosService } from '../service/documentos-digitalizados.service';
import moment from 'moment';

import { Subject, map, takeUntil } from 'rxjs';
import { Documento } from '../service/model/response/documento-digitalizado-response.model';
import { GenerarExcelRequest } from '../service/model/request/generar-excel-request.model';

import { CodigoRespuesta } from '../service/constants/constantes-inicio';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    ReactiveFormsModule,
    InputFechaComponent,
    NotificacionesComponent,
    TablePaginationComponent,
    TituloComponent,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class ConsultarDocumentosDigitalizadosComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal del componente */
  form: FormGroup;
  /**
   * Lista de documentos obtenidos en la consulta.
   * Se utiliza como fuente de datos para la tabla.
   */
  datos: Documento[] = [];

  /** Total de documentos obtenidos en la consulta */
  totalItems = 0;

  /** Número de elementos a mostrar por página */
  itemsPerPage = 10;

  /** Página actual en la paginación */
  currentPage = 1;
  
  /**
   * Configuración de notificación utilizada por el componente.
   * Se muestra cuando ocurre un error o una alerta.
 */
  notificacionInput!: Notificacion;

  /** Indica si se debe mostrar el botón de generar Excel y mostrar acuse */
  mostrarBtn: boolean = false;

  /*Valor del RFC obtenido del estado de login.*/
  public rfcValor: string = '';

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion;

  mostrarErrorTipoConsulta = false;
  
   /**
   * Indica si el formulario actual es válido o no.
   *
   * @property esFormaValido
   * @type {boolean}
   * @default false
   */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT_CAMPOS;

  /**
   * **Subject para manejar la destrucción del componente**
   * 
   * Este `Subject` se utiliza para cancelar suscripciones y evitar 
   * fugas de memoria cuando el componente es destruido.
   * Se usa comúnmente en el operador `takeUntil` dentro de los observables.
  */
  private destroy$ = new Subject<void>();

  /**
   * Configuración del input de fecha de inicio.
   */
  fechaInicioConfig: InputFecha = {
    labelNombre: 'Fecha de inicio',
    required: false,
    habilitado: true
  };

  /**
   * Configuración del input de fecha de fin.
   */
  fechaFinConfig: InputFecha = {
    labelNombre: 'Fecha de fin',
    required: false,
    habilitado: true
  };


  /**
 * Constructor del componente.
 *
 * Inicializa:
 * - El formulario reactivo
 * - Obtiene el RFC del usuario autenticado desde el estado de login
 *
 * @param fb Servicio para construcción de formularios reactivos
 * @param documentosService Servicio para consultas de documentos digitalizados
 * @param loginQuery Servicio para obtener información del usuario autenticado
 */
  constructor(
    private fb: FormBuilder,
    private documentosService: DocumentosDigitalizadosService,
    private loginQuery: LoginQuery
  ) {
    this.form = this.fb.group({
      tipoConsulta: [null, Validators.required],
      numeroEdocument: [null],
      rfcConsulta: [null],
      fechaInicio: [null],
      fechaFin: [null]
    });
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /**
   * **Ciclo de vida: OnInit**
   *
   * Se ejecuta al inicializar el componente.
   * Configura el comportamiento dinámico del formulario
   * según el tipo de consulta seleccionado.
   */
  ngOnInit(): void {
    this.handleTipoConsultaChange();
  }

  /**
   * Maneja los cambios del campo `tipoConsulta`.
   *
   * - Limpia los campos del formulario
   * - Aplica validadores dinámicos según el tipo de consulta:
   *   - eDocument → número de e-document obligatorio
   *   - Fecha → fechas obligatorias
   */
  handleTipoConsultaChange(): void {
  this.form.get('tipoConsulta')?.valueChanges.subscribe(tipo => {

    this.clearSearchFields();

    this.datos = [];
    this.mostrarBtn = false;
    this.mostrarErrorTipoConsulta = false;
    this.esFormaValido = false;

    this.fechaInicioConfig.required = false;
    this.fechaFinConfig.required = false;
    
    this.form.get('fechaInicio')?.clearValidators();
    this.form.get('fechaFin')?.clearValidators();

    this.form.get('numeroEdocument')?.setValidators([
      ...(tipo === 'edocument' ? [Validators.required] : []),
      Validators.pattern(/^[A-Za-z0-9]{13}$/)
    ]);

    if (tipo === 'fecha') {
      this.form.get('fechaInicio')?.setValidators([Validators.required]);
      this.form.get('fechaFin')?.setValidators([Validators.required]);

      this.fechaInicioConfig.required = true;
      this.fechaFinConfig.required = true;
    }

    this.form.get('rfcConsulta')?.setValidators([
      Validators.pattern(REGEX_RFC)
    ]);

    this.form.get('numeroEdocument')?.updateValueAndValidity();
    this.form.get('fechaInicio')?.updateValueAndValidity();
    this.form.get('fechaFin')?.updateValueAndValidity();
    this.form.get('rfcConsulta')?.updateValueAndValidity();
  });
}

  /**
   * Maneja la entrada en el campo RFC de consulta.
   *
   * Convierte el valor a mayúsculas
   * para mantener consistencia en el formato.
   */
  onRfcInput(): void {
    const CONTROL = this.form.get('rfcConsulta');
    const VALOR = CONTROL?.value;

    if (VALOR && typeof VALOR === 'string') {
      CONTROL?.setValue(VALOR.toUpperCase(), { emitEvent: false });
    }
  }

  /**
   * Maneja la entrada en el campo número de e-document.
   * 
   * Utiliza para forzar la actualización del estado de validación y visual del FormControl asociado al campo
   * "numeroEdocument".
   * @returns 
   */
  onNumeroEdocumentInput(): void {
    const CONTROL = this.form.get('numeroEdocument');

    if (!CONTROL) {
      return;
    }

    CONTROL.markAsTouched();
    CONTROL.markAsDirty();

    CONTROL.updateValueAndValidity({ onlySelf: true });
  }


  /**
   * Limpia los campos de búsqueda del formulario.
   *
   * No emite eventos de cambio para evitar
   * disparar validaciones innecesarias.
   */
  clearSearchFields(): void {
    this.form.patchValue({
      numeroEdocument: null,
      rfcConsulta: null,
      fechaInicio: null,
      fechaFin: null
    }, { emitEvent: false });
  }

  /**
   * Maneja el cambio del input de fecha de inicio.
   *
   * Convierte la fecha de formato `DD/MM/YYYY`
   * a `YYYY-MM-DD` antes de asignarla al formulario.
   *
   * @param fecha Fecha seleccionada en formato visual
   */
  onFechaInicioChange(fecha: string): void {
    const FORMAT = moment(fecha, 'DD/MM/YYYY', true).format('YYYY-MM-DD');
    this.form.get('fechaInicio')?.setValue(FORMAT);
  }

  /**
   * Maneja el cambio del input de fecha de fin.
   *
   * Convierte la fecha de formato `DD/MM/YYYY`
   * a `YYYY-MM-DD` antes de asignarla al formulario.
   *
   * @param fecha Fecha seleccionada en formato visual
   */
  onFechaFinChange(fecha: string): void {
    const FORMAT = moment(fecha, 'DD/MM/YYYY', true).format('YYYY-MM-DD');
    this.form.get('fechaFin')?.setValue(FORMAT);
  }


  /**
   * Ejecuta la consulta de documentos según el tipo seleccionado.
   *
   * - Valida campos obligatorios
   * - Reinicia la paginación
   * - Llama al método de carga de datos
   */
  onConsultar(): void {
    this.form.markAllAsTouched();

     if (this.form.get('tipoConsulta')?.invalid) {
      this.mostrarErrorTipoConsulta = true; 
      return; 
    }

    this.mostrarErrorTipoConsulta = false;

    if (this.form.get('tipoConsulta')?.invalid) {
      this.esFormaValido = true;
      return;
    }
    const TIPO = this.form.get('tipoConsulta')?.value;
    if (TIPO === 'edocument') {
      const VAL = this.form.get('numeroEdocument')?.value;
      if (!VAL || VAL.trim() === '') {
        this.mostrarAlerta('Debe introducir un número de e-document.');
        return;
      }
    } else if (TIPO === 'fecha') {
      const EDOC = this.form.get('numeroEdocument')?.value;
      if (EDOC) {
        this.esFormaValido = true;
        return;
      }
      if (!this.validarFechas()) {
        return;
      }
    }

    if (this.form.invalid) {
      this.esFormaValido = true;
      return;
    }
    this.currentPage = 1;
    this.esFormaValido = false;
    this.cargarDatos();
  }

  /**
   * Valida las fechas ingresadas en el formulario.
   *
   * Reglas:
   * - Ambas fechas son obligatorias
   * - La fecha de inicio no puede ser mayor a la fecha fin
   * - El rango no debe ser mayor a 15 días
   * - No se permite RFC de consulta en este tipo de búsqueda
   *
   * @returns `true` si las fechas son válidas, `false` en caso contrario
   */
  validarFechas(): boolean {
    const FECHA_INICIO = this.form.get('fechaInicio')?.value;
    const FECHA_FIN = this.form.get('fechaFin')?.value;

    if (!FECHA_INICIO && !FECHA_FIN) {
      this.mostrarAlerta('Debe introducir fecha inicio y fecha fin para realizar la consulta.');
      return false;
    }
    if (!FECHA_INICIO) {
      this.mostrarAlerta('Debe introducir una fecha inicio para realizar la consulta');
      return false;
    }
    if (!FECHA_FIN) {
      this.mostrarAlerta('Debe introducir una fecha fin para realizar la consulta');
      return false;
    }

    const START = moment(FECHA_INICIO, 'YYYY-MM-DD', true);
    const END = moment(FECHA_FIN, 'YYYY-MM-DD', true);

    if (START.isAfter(END)) {
      this.mostrarAlerta('La fecha de inicio no puede ser mayor a la fecha fin.');
      return false;
    }

    const DIFF_DAYS = END.diff(START, 'days');
    if (DIFF_DAYS > 15) {
      this.mostrarAlerta('No se podrá elegir fechas mayores de [15] días.');
      return false;
    }

    const RFC = this.form.get('rfcConsulta')?.value;
    if(RFC){
      this.mostrarAlerta('No puede ingresar el mismo RFC del usuario firmado, es necesaria la consulta por fechas.');
      return false;
    }
    return true;
  }

  /**
   * Muestra una alerta al usuario utilizando
   * el componente de notificaciones.
   *
   * @param mensaje Texto que se mostrará en la alerta
   */
  mostrarAlerta(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: 'Alerta',
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }


 /**
   * Realiza la llamada al servicio para obtener
   * los documentos digitalizados.
   *
   * - Construye el payload de la petición
   * - Maneja respuestas exitosas y errores
   * - Actualiza la tabla y botones de acción
   */
  cargarDatos(): void {
    const PAYLOAD: DocumentoDigitalizadoRequest = {
      opcion_de_consulta: this.form.get('tipoConsulta')?.value === 'edocument' ? "1" : "2",
      e_document: this.form.get('numeroEdocument')?.value,
      rfc_consulta: this.form.get('rfcConsulta')?.value,
      fecha_inicio: this.form.get('fechaInicio')?.value,
      fecha_fin: this.form.get('fechaFin')?.value,
      datos_autorizacion: {
        rfc_propietario: "LEQI8101314S7",
      }
    }
    this.documentosService.postDocumentoDigitalizacion(PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.datos = resp.datos?.documentos ?? [];
            this.mostrarBtn = true;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                'Error.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            this.mostrarBtn = false;
          }

        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * Maneja el cambio de página en la tabla.
   *
   * @param page Número de página seleccionada
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarDatos();
  }

 /**
   * Muestra el acuse del documento seleccionado.
   *
   * - Solo permite un registro seleccionado
   * - Envía el ID del documento al servicio
   */
  onMostrarAcuse(): void {
    const SELECCIONADOS = this.datos.filter(f => f.selected);

    if (SELECCIONADOS.length !== 1) {
      this.mostrarAlerta('Seleccione solo un registro');
      return;
    }

    const ID = SELECCIONADOS[0].id_documento;

    this.documentosService.postMostrarAcuse(ID.toString())
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {

            const CONTENIDO = resp.datos?.contenido;
            const NOMBRE = resp.datos?.nombre_archivo ?? '';

            if (CONTENIDO && CONTENIDO.trim().length > 0) {
              ConsultarDocumentosDigitalizadosComponent.manejarPdf(
                CONTENIDO,
                NOMBRE,
                'descargar'
              );
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.mostrarAlerta('No fue posible generar el acuse del documento.');
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                'Error.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }

        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * Genera el archivo Excel con los documentos consultados.
   *
   * Envía los parámetros necesarios al servicio
   * y maneja la respuesta del backend.
   */
  onGenerarExcel(): void {
    const PAYLOAD: GenerarExcelRequest = {
      opcion_de_consulta: this.form.get('tipoConsulta')?.value === 'edocument' ? "1" : "2",
      e_document: this.form.get('numeroEdocument')?.value,
      rfc: this.form.get('rfcConsulta')?.value,
      fecha_inicio: this.form.get('fechaInicio')?.value,
      fecha_fin: this.form.get('fechaFin')?.value,
      datos_autorizacion: {
        rfc_propietario: "LEQI8101314S7",
      }
    }
     this.documentosService.postGenerarExcel(PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            const BASE64_DATA = resp.datos ?? '';
            const BYTE_ARRAY = Uint8Array.from(
              window.atob(BASE64_DATA),
              c => c.charCodeAt(0)
            );
            const BLOB = new Blob([BYTE_ARRAY], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const LINK = document.createElement('a');
            LINK.href = window.URL.createObjectURL(BLOB);
            LINK.download = 'listadoEdocuments.xlsx';
            LINK.click();
            window.URL.revokeObjectURL(LINK.href);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                'Error.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            
          }

        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
  * Alterna la selección de todas las filas de la tabla simultáneamente.
  * Marca o desmarca todos los checkboxes basado en el estado del checkbox "seleccionar todo".
  * 
  * @param event - Evento del DOM proveniente del checkbox "seleccionar todo"
  * @returns void
  * 
*/
  alternarSeleccionTodos(event: Event): void {
    const CHECKED = (event.target as HTMLInputElement).checked;
    this.datos.forEach(f => (f.selected = CHECKED));
  }

  /**
  * Verifica si todas las filas de la tabla están actualmente seleccionadas.
  * 
  * @returns `true` si hay al menos una fila en la tabla y todas están seleccionadas,
  *          `false` en caso contrario
  * 
*/
  estanTodosSeleccionados(): boolean {
    return (
      this.datos.length > 0 &&
      this.datos.every(f => f.selected)
    );
  }

  /**
   * Alterna el estado de selección de una fila específica en la tabla.
   * Actualiza la lista de filas seleccionadas después del cambio.
   * @param fila - Objeto de datos de la mercancía que se va a seleccionar/deseleccionar
   * @param event - Evento del DOM proveniente del checkbox de selección
   */
  alternarFilaSeleccionada(fila: Documento, event: Event): void {
    const CHECKED = (event.target as HTMLInputElement).checked;
    if (CHECKED) {
      this.datos.forEach(f => {
        f.selected = false;
      });
      fila.selected = true;
    } else {
      fila.selected = false;
    }
  }

 /**
 * Método genérico para manejar un PDF en base64.
 *
 * @param base64 Contenido del PDF en base64.
 * @param nombreArchivo Nombre del archivo a descargar (si aplica).
 * @param accion 'abrir' para abrir en pestaña o 'descargar' para forzar descarga.
 */
  static manejarPdf(base64: string, nombreArchivo: string, accion: 'abrir' | 'descargar'): void {
    // Decodificar el base64
    const BYTE_ARRAY = Uint8Array.from(
      window.atob(base64),
      c => c.charCodeAt(0)
    );

    // Crear el Blob y la URL
    const BLOB = new Blob([BYTE_ARRAY], { type: 'application/pdf' });
    const URLCODIFICADA = URL.createObjectURL(BLOB);

    if (accion === 'abrir') {
      window.open(URLCODIFICADA, '_blank');
    } else {
      const LINK = document.createElement('a');
      LINK.href = URLCODIFICADA;
      LINK.download = nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`;
      LINK.click();
      URL.revokeObjectURL(URLCODIFICADA);
    }
  }

  /**
   * **Ciclo de vida: OnDestroy**
   * 
   * Este método se ejecuta cuando el componente se destruye. 
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   * 
   * - Envía un valor a `destroy$` para notificar a los observables que deben completarse.
   * - Completa `destroy$` para liberar los recursos asociados.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}