import { CategoriaMensaje, ConfiguracionColumna, ConsultaioState, FirmaElectronicaComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, base64ToHex, encodeToISO88591Hex } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalFuncionesComponent } from '@libs/shared/data-access-user/src';
import { OpinionService } from '@libs/shared/data-access-user/src/core/services/shared/opinion/opinion.service';
import { Router } from '@angular/router';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';
import { Subject } from 'rxjs';

/**
 * Componente para el registro de opiniones.
 * 
 * Permite al usuario cargar archivos, visualizar instrucciones para los documentos requeridos,
 * y navegar al proceso de firma electrónica. Controla la visibilidad de botones y modales
 * relacionados con la carga de documentos.
 */

export interface Archivos {
  archivos: string;
  id_documento_opinion: number;
}
@Component({
  selector: 'app-registrar-opinion-130',
  standalone: true,
  imports: [CommonModule, ModalFuncionesComponent, FormsModule, ReactiveFormsModule, FirmaElectronicaComponent, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './registrar-opinion-130.component.html',
  styleUrl: './registrar-opinion-130.component.scss',
})
export class RegistrarOpinion130Component implements OnInit {
  /**
   * Controla la visibilidad de los botones de acción.
   */
  mostrarBotones = false;

  /**
   * Representa la fecha de la solicitud.
   */
  fechaSolicitud: string = '2023-10-01';

  /**   * Formulario reactivo para la opinión.
   */
  public opinionForm!: FormGroup

  /**   * Servicio de opinión
   */
  private opinionService = inject(OpinionService);

  /**   * Estado de consultaio para guardar datos.
   */
  @Input({ required: true }) guardarDatos!: ConsultaioState;
  /**   * Número de trámite.
   */
  @Input({ required: true }) tramite!: number;

  seleccionArchivosListo: Archivos[] = [];

  /**
  * Notificación para mostrar alertas al usuario.
  */
  alertaNotificacion!: Notificacion;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para cancelar las suscripciones y evitar fugas de memoria al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
* Objeto que contiene los datos reales de la firma electrónica generada después del proceso de firma.
* Incluye:
* - firma: Cadena de la firma generada (en base64).
* - certSerialNumber: Número de serie del certificado digital.
* - rfc: RFC extraído del certificado.
* - fechaFin: Fecha de vencimiento del certificado.
*/
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };

  /**
   * Evento para enviar datos al componente padre.
   * 
   * @property {EventEmitter<string>} cadena
   * @description
   * Emite un string al componente padre cuando se requiere comunicar información desde este componente.
   */
  @Output() cadena = new EventEmitter<string>();

  /**
   * Evento para indicar al componente padre que se debe iniciar el proceso de firma electrónica.
   */
  @Output() firmar = new EventEmitter<boolean>();

  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string;

  /**
   * Controla la visibilidad del modal para cargar documentos.
   */
  abrirModal = false;

  /**   * Identificador de la opinión.
   */
  public opinionId: string = '';

  configuracionTabla: ConfiguracionColumna<Archivos>[] = [
    {
      encabezado: 'Archivo',
      clave: (ele: Archivos) => ele.archivos,
      orden: 1,
    }
  ];

  archivosDatos: Archivos[] = [];

  tipoSeleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * @property {string} cadenaOriginalRequerimiento
   * @description
   * Contiene la cadena original del requerimiento asociada al trámite 801.
   * Esta cadena puede ser utilizada para validaciones, firmas digitales o auditoría
   * dentro del proceso de registro de opinión.
   *
   * @see [Documentación de Compodoc](https://compodoc.app/)
   */
  cadenaOriginalRequerimiento!: string;


  /**
   * Almacena los archivos seleccionados por el usuario.
   * Inicialmente es un arreglo vacío.
   */
  archivos: File[] = [];

  /**   * Área solicitante obtenida de la opinión.
   */
  public areaSolicitante: string = '';

  /**   * Nueva notificación para mostrar mensajes al usuario.
   */
  nuevaNotificacion!: Notificacion;

  /** 
 * @property {GuardarDictamenRequest} guardarDictamenRequest
 * @description Objeto que contiene los datos necesarios para guardar un dictamen.
 */
  opcionesSentidosDispobles: SentidosDisponiblesResponse[] = [];

  /**
   * Contiene las instrucciones o requisitos para los archivos que se pueden cargar.
   * Se muestra en el modal de carga de documentos.
   */
  descripcionModal: string = `
  <p>Para poder adjuntar tu documento, debera cumplir las siguientes caracteristicas:</p>
  <ul class="ml-5">
    <li>Debe ser formato PDF que no contenga formularios, objetos OLE incrustrados, codigo java script, etc.</li>
    <li>El tamano maximo permitido por archivo es 10 MB.</li>
    <li>No debe contener paginas en blanco.</li>
    <li>Las imagenes contenidas deben estar en escala de grises.</li>
    <li>La resolucion debe ser de 300 dpi.</li>
  </ul>
`;

  /**
   * Constructor del componente.
   * @param router Inyección del servicio Router para navegación.
   */
  constructor(private router: Router, private fb: FormBuilder) { }

  /**
   * Agrega un archivo al arreglo de archivos seleccionados y muestra los botones de acción.
   * @param archivo Archivo seleccionado por el usuario.
   */
  agregarArchivo(archivo: File): void {

    this.mostrarBotones = true;
    const FORM_DATA = new FormData();
    const REQUEST_PAYLOAD = {
      id_opinion: this.opinionId
    };
    FORM_DATA.append(
      'request',
      new Blob([JSON.stringify(REQUEST_PAYLOAD)], { type: 'application/json' })
    );
    const FILE: File = archivo;
    if (FILE) {
      FORM_DATA.append('file', FILE);
    }
    this.opinionService.postOpinionDocumento(FORM_DATA).subscribe({
      next: (response: any) => {
        if (response.codigo === '00') {
          this.archivos.push(archivo);
          this.archivosDatos = [
            ...this.archivosDatos,
            {
              archivos: archivo.name,
              id_documento_opinion: response.datos.id_documento_opinion
            }
          ];
          window.scrollTo({ top: 0, behavior: 'smooth' });

          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.EXITO,
            modo: 'action',
            titulo: 'Éxito',
            mensaje: response.mensaje,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.nuevaNotificacion = {
            tipoNotificacion: "toastr",
            categoria: CategoriaMensaje.ERROR,
            modo: "action",
            titulo: response.error || "Error en iniciar evaluar tramite.",
            mensaje:
              response.causa ||
              response.mensaje ||
              response.error ||
              "Error en opciones de iniciar evaluar tramite.",
            cerrar: false,
            txtBtnAceptar: "",
            txtBtnCancelar: "",
          };
        }
      },
      error: (error) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.nuevaNotificacion = {
          tipoNotificacion: "toastr",
          categoria: CategoriaMensaje.ERROR,
          modo: "action",
          titulo: "",
          mensaje:
            error?.error?.error ||
            "Error inesperado en iniciar evaluar tramite.",
          cerrar: false,
          txtBtnAceptar: "",
          txtBtnCancelar: "",
        };
      }
    })
  }

  /**   * Método de inicialización del componente.
   * Llama a la función para obtener la evaluación del trámite.
   */
  ngOnInit(): void {
    this.getEvaluacionTramite();
    this.getRadioTramite();
    this.opinionForm = this.fb.group({
      sentidoDelOpinion: [''],
      justificacion: [''],
      opinion: ['', Validators.required]
    });
  }
  /**   * Obtiene la evaluación del trámite y actualiza el formulario con los datos recibidos.
   */
  getEvaluacionTramite(): void {
    this.opinionService
      .getSolicitarTramite(this.tramite, this.guardarDatos.folioTramite)
      .subscribe({
        next: (response: any) => {
          if (response.codigo === '00') {
            const OPINION = response.datos?.opiniones?.[0];
            if (OPINION) {
              this.areaSolicitante = OPINION.cve_area_solicitante;
              this.fechaSolicitud = OPINION.fecha_creacion;
              this.opinionId = OPINION.id_opinion;
              this.opinionForm.patchValue({
                areaSolicitante: OPINION.cve_area_solicitante,
                fechaSolicitud: OPINION.fecha_creacion,
                justificacion: OPINION.justificacion,
                sentidoOpinion: OPINION.ide_sent_opinion === 'SEOP.AC' ? 0 : 1,
                opinion: OPINION.respuesta || ''
              });
              // Set the cadenaOriginalRequerimiento if available
              this.cadenaOriginalRequerimiento = response.datos?.cadena_original || '';

              // Disable the justificacion field
              this.opinionForm.get('areaSolicitante')?.disable();
              this.opinionForm.get('fechaSolicitud')?.disable();
              this.opinionForm.get('justificacion')?.disable();
            }
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: response.error || "Error en iniciar evaluar tramite.",
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                "Error en opciones de iniciar evaluar tramite.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          }
        },
        error: (error: any) => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.nuevaNotificacion = {
            tipoNotificacion: "toastr",
            categoria: CategoriaMensaje.ERROR,
            modo: "action",
            titulo: "",
            mensaje:
              error?.error?.error ||
              "Error inesperado en iniciar evaluar tramite.",
            cerrar: false,
            txtBtnAceptar: "",
            txtBtnCancelar: "",
          };
        },
      });
  }


  /**
   * Obtiene las opciones de sentidos disponibles para el trámite y las almacena en la propiedad correspondiente.
   * En caso de error, muestra una notificación al usuario.
   */
  getRadioTramite(): void {
    this.opinionService
      .getRadioTramite(this.tramite)
      .subscribe({
        next: (response: any) => {
          if (response.codigo === '00') {
            this.opcionesSentidosDispobles = response.datos ?? [];
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: response.error || "Error en iniciar evaluar tramite.",
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                "Error en opciones de iniciar evaluar tramite.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          }
        },
        error: (error: any) => {
          const MENSAJE = error?.error?.error || 'Error al obtener los sentidos';
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
   * Guarda la opinión y, si es necesario, inicia el proceso de firma electrónica.
   * @param value Indica si se debe iniciar el proceso de firma electrónica después de guardar.
   */
  guardarYFirmar(_value: boolean): void {
    if (this.opinionForm.invalid) {
      this.opinionForm.markAllAsTouched();
    } else {
      const DATA = {
        "cve_usuario": this.guardarDatos.current_user,
        "descripcion_opinion": this.opinionForm.get('opinion')?.value,
        "fecha_atencion": this.fechaSolicitud,
        "ide_sentido_opinion": this.opinionForm.get('sentidoDelOpinion')?.value,
        "solicitante": {
          "apellido_materno": "1",
          "rfc": this.guardarDatos.current_user,
          "nombre": "nombre",
          "apellido_paterno": "paterno"
        },
        ...(this.tramite === 130113 && { id_dependencia: '' })
      }
      this.opinionService.postopinionregistrarMostrarFirma(this.tramite, this.guardarDatos.folioTramite, DATA)
        .subscribe({
          next: (response: any) => {
            if (response.codigo === '00') {
              window.scrollTo({ top: 0, behavior: "smooth" });
              this.nuevaNotificacion = {
                tipoNotificacion: "toastr",
                categoria: CategoriaMensaje.EXITO,
                modo: "action",
                titulo: "Éxito",
                mensaje: response.mensaje,
                cerrar: false,
                txtBtnAceptar: "",
                txtBtnCancelar: "",
              };
              this.cadenaOriginalRequerimiento = response.datos?.cadena_original;
              this.cadena.emit(response.datos?.cadena_original);
              this.firmar.emit(true);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
              this.nuevaNotificacion = {
                tipoNotificacion: "toastr",
                categoria: CategoriaMensaje.ERROR,
                modo: "action",
                titulo: response.error || "Error en iniciar evaluar tramite.",
                mensaje:
                  response.causa ||
                  response.mensaje ||
                  response.error ||
                  "Error en opciones de iniciar evaluar tramite.",
                cerrar: false,
                txtBtnAceptar: "",
                txtBtnCancelar: "",
              };
            }
          },
          error: (error: any) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: "",
              mensaje:
                error?.error?.error ||
                "Error inesperado en iniciar evaluar tramite.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          },
        });
    }
  }

  /**
   * Envía la opinión si el formulario es válido.
   * Si el formulario es inválido, marca todos los campos como tocados para mostrar los errores de validación.
   */
  enviar(): void {
    if (this.opinionForm.invalid) {
      this.opinionForm.markAllAsTouched();
    } else {
      const DATA = {
        "cve_usuario": this.guardarDatos.current_user,
        "descripcion_opinion": this.opinionForm.get('opinion')?.value,
        "fecha_atencion": this.opinionForm.get('fechaSolicitud')?.value,
        "ide_sentido_opinion": this.opinionForm.get('sentidoOpinion')?.value,
      }
      this.opinionService.postopinionregistrarGuardar(this.tramite, this.guardarDatos.folioTramite, DATA)
        .subscribe({
          next: (response: any) => {
            if (response.codigo === '00') {
              window.scrollTo({ top: 0, behavior: "smooth" });
              this.nuevaNotificacion = {
                tipoNotificacion: "toastr",
                categoria: CategoriaMensaje.EXITO,
                modo: "action",
                titulo: "Éxito",
                mensaje: response.mensaje,
                cerrar: false,
                txtBtnAceptar: "",
                txtBtnCancelar: "",
              };
              this.guardarYFirmar(false)
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
              this.nuevaNotificacion = {
                tipoNotificacion: "toastr",
                categoria: CategoriaMensaje.ERROR,
                modo: "action",
                titulo: response.error || "Error en iniciar evaluar tramite.",
                mensaje:
                  response.causa ||
                  response.mensaje ||
                  response.error ||
                  "Error en opciones de iniciar evaluar tramite.",
                cerrar: false,
                txtBtnAceptar: "",
                txtBtnCancelar: "",
              };
            }
          },
          error: (error: any) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: "",
              mensaje:
                error?.error?.error ||
                "Error inesperado en iniciar evaluar tramite.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          },
        });
    }
  }

  /**
   * Cambia el estado de abrirModal a true para mostrar el modal de carga de documentos.
   */
  mostrarModalDocumentos(): void {
    this.abrirModal = true;
  }

  /**
   * Navega a la ruta de firma electrónica para continuar el proceso.
   */
  guardarFormar(value: boolean): void {
    if (this.opinionForm.invalid) {
      this.opinionForm.markAllAsTouched();
    } else {
      const DATA = {
        "cve_usuario": this.guardarDatos.current_user,
        "descripcion_opinion": this.opinionForm.get('opinion')?.value,
        "fecha_atencion": this.opinionForm.get('fechaSolicitud')?.value,
        "ide_sentido_opinion": this.opinionForm.get('sentidoOpinion')?.value,
      }
      this.opinionService.postopinionregistrarGuardar(this.tramite, this.guardarDatos.folioTramite, DATA)
        .subscribe({
          next: (response: any) => {
            if (response.codigo === '00') {
              window.scrollTo({ top: 0, behavior: "smooth" });
              this.nuevaNotificacion = {
                tipoNotificacion: "toastr",
                categoria: CategoriaMensaje.EXITO,
                modo: "action",
                titulo: "Éxito",
                mensaje: response.mensaje,
                cerrar: false,
                txtBtnAceptar: "",
                txtBtnCancelar: "",
              };
              if (value) {
                this.guardarYFirmar(value)
              }
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
              this.nuevaNotificacion = {
                tipoNotificacion: "toastr",
                categoria: CategoriaMensaje.ERROR,
                modo: "action",
                titulo: response.error || "Error en iniciar evaluar tramite.",
                mensaje:
                  response.causa ||
                  response.mensaje ||
                  response.error ||
                  "Error en opciones de iniciar evaluar tramite.",
                cerrar: false,
                txtBtnAceptar: "",
                txtBtnCancelar: "",
              };
            }
          },
          error: (error: any) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: "",
              mensaje:
                error?.error?.error ||
                "Error inesperado en iniciar evaluar tramite.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          },
        });
    }
  }

  mostrarEliminar(): void {
    if (this.seleccionArchivosListo.length === 0) {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione un documento a eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
    } else if (this.seleccionArchivosListo.length > 0) {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: '¿Esta seguro que desea eliminar el documento marcado?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      }
    }
  }

  confirmacionAlertaNotificacion(evento: boolean): void {
    if (evento && this.seleccionArchivosListo.length > 0) {
      const IDS_DOCUMENTOS = this.seleccionArchivosListo.map((archivo) => archivo.id_documento_opinion);
      this.opinionService.deleteRegistraOpinion(this.tramite, IDS_DOCUMENTOS[0]).subscribe({
        next: (response: any) => {
          if (response.codigo === '00') {
            this.archivosDatos = this.archivosDatos.filter((archivo) => !IDS_DOCUMENTOS.includes(archivo.id_documento_opinion));
            this.seleccionArchivosListo = [];
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.EXITO,
              modo: "action",
              titulo: "Éxito",
              mensaje: response.mensaje,
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: response.error || "Error en eliminar documento.",
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                "Error en eliminar documento.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          }
        },
        error: (error: any) => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.nuevaNotificacion = {
            tipoNotificacion: "toastr",
            categoria: CategoriaMensaje.ERROR,
            modo: "action",
            titulo: "",
            mensaje:
              error?.error?.error ||
              "Error inesperado en eliminar documento.",
            cerrar: false,
            txtBtnAceptar: "",
            txtBtnCancelar: "",
          };
        }
      });
    }
  }

  seleccionArchivos(evento: Archivos[]): void {
    this.seleccionArchivosListo = evento;
  }
}