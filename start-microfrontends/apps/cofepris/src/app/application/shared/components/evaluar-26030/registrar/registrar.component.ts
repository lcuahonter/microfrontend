/* eslint-disable complexity */
import {
  base64ToHex,
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  ConsultaCatalogoService,
  ConsultaioState,
  EncabezadoRequerimientoComponent,
  encodeToISO88591Hex,
  FirmaElectronicaComponent,
  InputRadioComponent,
  Notificacion,
  TablaDinamicaComponent,
} from "@libs/shared/data-access-user/src";

import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { catchError, of, Subject, takeUntil, tap } from "rxjs";

import { AlertComponent } from "ngx-bootstrap/alert";
import { CodigoRespuesta } from "../../../../core/enum/cofepris-core-enum";
import { CommonModule } from "@angular/common";
import { EvaluarSolicitudService } from "../../../../core/services/evaluar-tramite/evaluar-solicitud.service";
import { FirmarDictamenService } from "../../../../core/services/evaluar-tramite/firmarDictamen.service";
import { FirmarRequerimientoRequest } from "../../../../core/models/evaluar/request/firmar-requerimiento-request.model";
import { FirmarRequermientoService } from "../../../../core/services/evaluar-tramite/firmarRequermiento.service";
import { Router } from "@angular/router";

import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";

import { EvaluarComponent } from "../../../../evaluar/evaluar.component";
import { FirmarDictamenRequest } from "../../../../core/models/evaluar/request/firmar-dictamen-request.model";
import { GuardarDictamenService } from "../../../../core/services/evaluar-tramite/guardar-dictamen.service";
import { MostrarFirmarResponse } from "../../../../core/models/evaluar/response/mostrar-firmar-response.model";

import { CriteriosResponse } from "@libs/shared/data-access-user/src/core/models/shared/criterios-response.model";
@Component({
  selector: "app-registrar",
  standalone: true,
  imports: [
    CommonModule,
    EncabezadoRequerimientoComponent,
    FormsModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    AlertComponent,
    InputRadioComponent,
    FirmaElectronicaComponent
  ],
  templateUrl: "./registrar.component.html",
  styleUrl: "./registrar.component.css",
})
export class RegistrarComponent implements OnInit {
  @Output() refreshTabs = new EventEmitter<void>();
  private firmarDictamenService = inject(FirmarDictamenService);
  /**
* Cadena original generada a partir de los datos del trámite.
* Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
*/
  cadenaOriginal?: string;


  /** Response del servicio de firmar mostrar */
  mostrarFirmarData!: MostrarFirmarResponse;
  private firmarRequermientoService = inject(FirmarRequermientoService);
  /**
   * @property {string} conformidadDictamen
   * @description Texto que representa la conformidad del dictamen, utilizado en el formulario de generación de dictamen.
   */
  conformidadDictamen: CriteriosResponse = {} as CriteriosResponse;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para cancelar las suscripciones y evitar fugas de memoria al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  opinionForm!: FormGroup;
  nuevaNotificacion!: Notificacion;
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };
    private readonly destroy$ = new Subject<void>();
  /**
   * @property {boolean} firmar
   * @description Indica si se debe mostrar la sección de firma electrónica.
   */
  firmar: boolean = false;
  areaCatalogo: Catalogo[] = [
  ];
  @Input({ required: true }) guardarDatos!: ConsultaioState;
  @Input({ required: true }) tramite!: number;
  private router = inject(Router);
  /** Cadena original del requerimiento a firmar */
  cadenaOriginalRequerimiento!: string;
  tipoPersonaOptions: {
    label: string;
    value: string | number;
    hint?: string;
  }[] = [
      {
        label: "Aceptada",
        value: "SEDI.AC",
      },
      {
        label: "Rechazada",
        value: "SEDI.RZ",
      },
    ];
  private fb = inject(FormBuilder);
  private evaluarSolicitudService = inject(EvaluarSolicitudService);
  constructor(private catalogoService:ConsultaCatalogoService) {
    this.opinionForm = this.fb.group({
      areaSolicitante: [],
      fechaSolicitud: [],
      justificacion: [],
      sentidoDictamen: ["SEDI.RZ", Validators.required],
      cumplimiento: [],
      opinion: ["", Validators.required],
      description:[""]
    });
  }

  ngOnInit(): void {
    this.intalieCatalogos();
    this.getEvaluacionTramite();
  }
  getEvaluacionTramite(): void {
    this.evaluarSolicitudService
      .getSolicitarTramite(this.tramite, this.guardarDatos.folioTramite)
      .subscribe({
        next: (response: any) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            const OPINION = response.datos?.opiniones?.[0];
            if (OPINION) {
              this.opinionForm.patchValue({
                areaSolicitante: OPINION.cve_area_solicitante,
                fechaSolicitud: OPINION.fecha_creacion,
                justificacion: OPINION.justificacion,
                sentidoOpinion: OPINION.ide_sent_opinion,
                opinion: OPINION.respuesta || '',
              });
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

  guardarYFirmar(): void {
    if (this.opinionForm.invalid) {
      this.opinionForm.markAllAsTouched();
    } else {
      const DATA = {
        "cve_usuario": this.guardarDatos.current_user,
        "descripcion_opinion": this.opinionForm.get('opinion')?.value,
        "fecha_atencion": this.opinionForm.get('fechaSolicitud')?.value,
        "ide_sentido_opinion": this.opinionForm.get('sentidoOpinion')?.value === 0 ? 'SEOP.AC' : 'SEOP.RC',
        "solicitante": {
          "apellido_materno": "1",
          "rfc": this.guardarDatos.current_user,
          "nombre": "nombre",
          "apellido_paterno": "paterno"
        }
      }
      this.evaluarSolicitudService.postopinionregistrarMostrarFirma(this.tramite, this.guardarDatos.folioTramite, DATA)
        .subscribe({
          next: (response: any) => {
            if (response.codigo === CodigoRespuesta.EXITO) {
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
              this.firmar = true;
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
  guardar(): void {
    if (this.opinionForm.invalid) {
      this.opinionForm.markAllAsTouched();
    } else {
      const DATA = {
        "cve_usuario": this.guardarDatos.current_user,
        "descripcion_opinion": this.opinionForm.get('opinion')?.value,
        "fecha_atencion": this.opinionForm.get('fechaSolicitud')?.value,
        "ide_sentido_opinion": this.opinionForm.get('sentidoOpinion')?.value === 0 ? 'SEOP.AC' : 'SEOP.RC',
      }
      this.evaluarSolicitudService.postopinionregistrarGurder(this.tramite, this.guardarDatos.folioTramite, DATA)
        .subscribe({
          next: (response: any) => {
            if (response.codigo === CodigoRespuesta.EXITO) {
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
              this.refreshTabs.emit();
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
  obtieneFirma(datos: any): void {
    this.datosFirmaReales = datos;
    this.firmaDictamen(datos.firma);
  }

  firmarOpinion(firma: string): void {
    if (!this.cadenaOriginalRequerimiento || !this.datosFirmaReales) {
      this.nuevaNotificacion = {
        tipoNotificacion: "toastr",
        categoria: CategoriaMensaje.ERROR,
        modo: "action",
        titulo: "Error inesperado",
        mensaje: "Ocurrió un error al procesar la firma.",
        cerrar: false,
        txtBtnAceptar: "",
        txtBtnCancelar: "",
      };
      return;
    }

    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginalRequerimiento);
    const FIRMAHEX = base64ToHex(firma);

    const PAYLOAD = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      firma: {
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: RegistrarComponent.formatFecha(new Date()),
        clave_rol: "Dictaminador",
        sello: FIRMAHEX,
      },
    };

    this.firmarDictamenService
      .postFirmarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp: any) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.router.navigate(["bandeja-de-tareas-pendientes"], {
              queryParams: { labelExitoso: true },
            });
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: "toastr",
              categoria: CategoriaMensaje.ERROR,
              modo: "action",
              titulo: "Error inesperado",
              mensaje: "Ocurrió un error al procesar la firma.",
              cerrar: false,
              txtBtnAceptar: "",
              txtBtnCancelar: "",
            };
          }
        },
        error: (err) => {
          this.nuevaNotificacion = {
            tipoNotificacion: "toastr",
            categoria: CategoriaMensaje.ERROR,
            modo: "action",
            titulo: "Error inesperado",
            mensaje:
              err?.error.error || "Ocurrió un error al procesar la firma.",
            cerrar: false,
            txtBtnAceptar: "",
            txtBtnCancelar: "",
          };
        },
      });
  }

  firmarRequerimiento(firma: string): void {
    if (!this.cadenaOriginalRequerimiento || !this.datosFirmaReales) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Faltan datos para completar la firma.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      return;
    }

    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginalRequerimiento);
    const FIRMAHEX = base64ToHex(firma);
    const NUMFOLIO = this.guardarDatos.folioTramite;

    const PAYLOAD: FirmarRequerimientoRequest = {
      id_accion: this.guardarDatos.action_id,
      firma: {
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: EvaluarComponent.formatFecha(new Date()),
        clave_rol: 'Dictaminador',
        sello: FIRMAHEX,
      },
      cve_usuario: this.guardarDatos.current_user,
      requiere_autorizador: false
    };

    this.firmarRequermientoService.postFirmarRequerimiento(this.tramite, NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((firmaResponse: BaseResponse<null>) => {
          if (firmaResponse.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje: firmaResponse.mensaje || firmaResponse.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          } else if (firmaResponse.codigo === CodigoRespuesta.EXITO) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Firma exitosa',
              mensaje: 'La firma del dictamen se ha realizado correctamente.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
            this.router.navigate(['bandeja-de-tareas-pendientes'],
              {
                queryParams: { labelExitoso: true },
              });
          }

        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: error?.error.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return of(null);
        })
      )
      .subscribe();
  }
  firmaDictamen(firma: string): void {
    if (!this.cadenaOriginalRequerimiento || !this.datosFirmaReales) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Faltan datos para completar la firma.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      return;
    }

    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginalRequerimiento);
    const FIRMAHEX = base64ToHex(firma);
    const NUMFOLIO = this.guardarDatos.folioTramite;

    const PAYLOAD: FirmarDictamenRequest = {
      id_accion: this.guardarDatos.action_id,
      firma: {
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: EvaluarComponent.formatFecha(new Date()),
        clave_rol: 'Dictaminador',
        sello: FIRMAHEX,
      }
    };

    this.firmarDictamenService.postregistrarFirmarDictamen(this.tramite, NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((firmaResponse: BaseResponse<null>) => {
          if (firmaResponse.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje: firmaResponse.mensaje || firmaResponse.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          } else if (firmaResponse.codigo === CodigoRespuesta.EXITO) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Firma exitosa',
              mensaje: 'La firma del dictamen se ha realizado correctamente.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
            this.router.navigate(['bandeja-de-tareas-pendientes']);
          }

        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: error?.error.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return of(null);
        })
      )
      .subscribe();
  }


  static formatFecha(fecha: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(
      fecha.getDate()
    )} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(
      fecha.getSeconds()
    )}`;
  }
  intalieCatalogos(): void {  
    this.catalogoService.getArea(this.tramite)
      .pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) { this.areaCatalogo = DATOS;
                const DATA = this.areaCatalogo.find((data:any)=>{
               return data.clave === this.opinionForm.get('areaSolicitante')?.value;
              });
              this.opinionForm.patchValue({
                description:DATA?.nombre||''
              });
                   this.opinionForm.get('description')?.disable();
         }
      })
  }

}
