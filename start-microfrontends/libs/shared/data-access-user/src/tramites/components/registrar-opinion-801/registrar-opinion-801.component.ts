import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ModalFuncionesComponent } from '../modal-funciones/modal-funciones.component';
import { Router } from '@angular/router';
import { OpinionService } from '../../../core/services/shared/opinion/opinion.service';
import { CategoriaMensaje, ConsultaioState, Notificacion } from '../../..';
import { SentidosDisponiblesResponse } from '../../../core/models/shared/sentidos-disponibles.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

/**
 * Componente para el registro de opiniones.
 * 
 * Permite al usuario cargar archivos, visualizar instrucciones para los documentos requeridos,
 * y navegar al proceso de firma electrónica. Controla la visibilidad de botones y modales
 * relacionados con la carga de documentos.
 */
@Component({
  selector: 'app-registrar-opinion-801',
  standalone: true,
  imports: [CommonModule, ModalFuncionesComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './registrar-opinion-801.component.html',
  styleUrl: './registrar-opinion-801.component.scss',
})
export class RegistrarOpinionComponent801 implements OnInit{
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

  /**
   * Evento para enviar datos al componente padre.
   * 
   * @property {EventEmitter<string>} cadena
   * @description
   * Emite un string al componente padre cuando se requiere comunicar información desde este componente.
   */
  @Output() cadena = new EventEmitter<string>();

  @Output() firmar = new EventEmitter<boolean>();

  /**
   * Controla la visibilidad del modal para cargar documentos.
   */
  abrirModal = false;

  /**   * Identificador de la opinión.
   */
  public opinionId: string = '';

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
  <ul>
    <li>Debe ser formato PDF sin formularios ni código embebido.</li>
    <li>Máximo 10 MB.</li>
    <li>No debe contener páginas en blanco.</li>
    <li>Imágenes en escala de grises a 300 dpi.</li>
  </ul>
`;

  /**
   * Constructor del componente.
   * @param router Inyección del servicio Router para navegación.
   */
  constructor(private router: Router,private fb: FormBuilder) {}

  /**
   * Agrega un archivo al arreglo de archivos seleccionados y muestra los botones de acción.
   * @param archivo Archivo seleccionado por el usuario.
   */
  agregarArchivo(archivo: File) :void{
    
    //this.mostrarBotones = true;
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
      opinion: ['',Validators.required]
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
              this.areaSolicitante= OPINION.cve_area_solicitante;
              this.fechaSolicitud= OPINION.fecha_creacion;
              this.opinionId = OPINION.id_opinion;
              // this.opinionForm.patchValue({
              //   areaSolicitante: OPINION.cve_area_solicitante,
              //   fechaSolicitud: OPINION.fecha_creacion,
              //   justificacion: OPINION.justificacion,
              //   sentidoOpinion: OPINION.ide_sent_opinion === 'SEOP.AC' ? 0 : 1,
              //   opinion: OPINION.respuesta || ''
              // });
              // // Set the cadenaOriginalRequerimiento if available
              //         this.cadenaOriginalRequerimiento = response.datos?.cadena_original || '';

              // Disable the justificacion field
              // this.opinionForm.get('areaSolicitante')?.disable();
              // this.opinionForm.get('fechaSolicitud')?.disable();
              // this.opinionForm.get('justificacion')?.disable();
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


  getRadioTramite():void{
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

  guardarYFirmar(): void {
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
        }
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
              // this.firmarMostrarDictamen(this.opinionForm.getRawValue() as DictamenForm);
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

  enviar(): void {
    if (this.opinionForm.invalid) {
      this.opinionForm.markAllAsTouched();
    } else {
      const DATA = {
        "cve_usuario": this.guardarDatos.current_user,
        "descripcion_opinion": this.opinionForm.get('opinion')?.value,
        "fecha_atencion": this.fechaSolicitud,
        "ide_sentido_opinion": this.opinionForm.get('sentidoDelOpinion')?.value,
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
              this.guardarYFirmar()
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
  mostrarModalDocumentos() :void{
    this.abrirModal = true;
  }

  /**
   * Navega a la ruta de firma electrónica para continuar el proceso.
   */
  guardarFormar() :void{
    this.router.navigate(['funcionario/firma-electronica']);
  }
}