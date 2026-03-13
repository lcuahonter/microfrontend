import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
// eslint-disable-next-line sort-imports
import {
  CAMPO_VACIO,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  PASOS,
  SECCIONES_TRAMITE_5701,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TEXTO_CERRAR,
  TITULO_MODAL_AVISO,
  TercerosQuery,
  TercerosState,
  TransporteDespacho,
  Usuario,
  convertirFechaDdMmYyyyAMoment,
  formatearFechaConMoment,
  CargaDocumentoComponent,
} from '@ng-mf/data-access-user';
import {
  FechasSevexItem,
  ListFechasSevex,
  ListPersonaNoti,
  Pedimento,
  PersonaResponsableDespacho,
  SolicitudPayload,
} from '../../../../core/models/5701/solicitud-payload.model';
import {
  MSG_REGISTRO_EXITOSO,
  TIPO_TRAMITE,
} from '../../../../core/enums/5701/tramite5701.enum';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import {
  Solicitud5701State,
  Tramite5701Store,
} from '../../../../core/estados/tramites/tramite5701.store';
import { GuardaSolicitudService } from '../../../../core/services/5701/guardar/guarda-solicitud.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';



/**
 * Interface que representa una acción de botón con su nombre y valor asociado.
 *
 */
interface AccionBoton {
  /**
   * Nombre o identificador de la acción del botón.
   */
  accion: string;
  /**
   * Valor numérico relacionado con la acción del botón.
   */
  valor: number;
}

/**
 * Componente Angular que representa la página de solicitud del trámite 5701.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})

/**
 * Clase que representa la página de solicitud del trámite 5701.
 */
export class SolicitudPageComponent implements OnInit {
  /**
   * Contiene la lista de pasos del wizard.
   * Se inicializa con la constante PASOS importada desde el archivo correspondiente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Contiene el índice del paso actual, para las navs-tabs del paso uno.
   * Se inicializa en 1
   */
  indice: number = 1;

  /**
   * Contiene el estado de la sección actual.
   * Se inicializa como un objeto vacío.
   */
  public seccion!: SeccionLibState;

  /**
   * Notificador para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * Se completa al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud utilizado en el componente.
   */
  public solicitudState!: Solicitud5701State;

  /**
   * Estado de los terceros utilizado en el componente.
   */
  public tercerosState!: TercerosState;

  /**
   * Referencia al componente WizardComponent, que se utiliza para navegar entre los pasos del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Emite un evento cuando el boton de carga de archivos es presionado.
   * Este evento es escuchado por el componente <anexar-documentos> para iniciar la carga de archivos.
   */
  @Output() cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Emite un evento cuando el boton de Anterior es presionado
   * Este evento es escuchado por el componente <anexar-documentos> para regresar a la sección de carga de documentos.
   */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
   * Inicializa la variable de alertaNotificación con un objeto de tipo Notificacion.
   * @type {Notificacion}
   */
  public alertaNotificacion!: Notificacion;

  formularioPadreEsValido: boolean = false;

  @ViewChild(PasoUnoComponent) SolicitudPasoComponent!: PasoUnoComponent;

  @ViewChild('pasoUnoElement') pasoUnoElement!: ElementRef;

    /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true; 


  /**
   * Representa los datos de configuración para los pasos de un proceso.
   * @property nroPasos - Número total de pasos.
   * @property indice - Índice actual del paso.
   * @property txtBtnAnt - Texto del botón "Anterior".
   * @property txtBtnSig - Texto del botón "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   *Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Estado del tramite Folio
   */
  public folioTemporal: number = 0;

  /**
   * Indica si hay archivos seleccionados.
   */
  public hayArchivosSeleccionados: boolean = false;

  /**
   * valida si se valido el formulario principal.
   */
  VALIDA_FORM: boolean = false;

  /**
   * Indica si se está procesando la navegación al paso 2
   */
  procesandoNavegacion: boolean = false;

  /**
   * Controla si se debe mostrar el botón anterior
   */
  mostrarBotonAnterior: boolean = false;

  /**
   * Controla si hay documentos opcionales agregados
   */
  hayDocumentosOpcionales: boolean = false;

  /**
   * Señal para limpiar documentos opcionales
   */
  limpiarDocumentosOpcionalesSignal: boolean = false;

  datosUsuario: Usuario = USUARIO_INFO;

  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private tramite5701Query: Tramite5701Query,
    private tercerosQuery: TercerosQuery,
    private tramite5701Store: Tramite5701Store,
    private guardarSolicitudService: GuardaSolicitudService
  ) {}

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * En este método, se suscribe al estado de la sección utilizando `selectSeccionState$`
   * y actualiza la propiedad `seccion` con el estado recibido. La suscripción se
   * completa cuando se emite `destroyNotifier$` para evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    this.tramite5701Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.tercerosQuery.selectTerceros$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((tercerosState) => {
          this.tercerosState = tercerosState;
        })
      )
      .subscribe();

    this.asignarSecciones();
  }

  /**
   * Selecciona una pestaña específica y actualiza el índice actual.
   *
   *  i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Actualiza el valor del índice basado en la acción del botón y navega en el componente wizard.
   *
   *  e - Objeto de tipo `AccionBoton` que contiene el valor y la acción del botón.
   *
   * Si el valor del botón está entre 1 y 4, actualiza el índice con el valor del botón.
   * Si la acción es 'cont', avanza al siguiente paso del wizard.
   * Si la acción no es 'cont', retrocede al paso anterior del wizard.
   */
  getValorIndice(e: AccionBoton): void {
    /** Validar el formulario solo cuando se intenta continuar desde el paso 1 */
    if (this.indice === 1 && e.accion === 'cont') {
      // Si no estamos en la pestaña "Datos de la solicitud", cambiar temporalmente para validar
      const pestañaOriginal = this.SolicitudPasoComponent.indice;
      if (pestañaOriginal !== 2) {
        this.SolicitudPasoComponent.seleccionaTab(2);
        // Esperar a que se repueble el formulario
        setTimeout(() => {
          this.validarYContinuar(e, pestañaOriginal);
        }, 100);
        return;
      } else {
        this.validarYContinuar(e, pestañaOriginal);
      }
    } else {
      this.continuarNavegacion(e);
    }
  }

  private validarYContinuar(e: AccionBoton, pestañaOriginal: number): void {
    let validacionExitosa = false;
    
    try {
      // Validar el formulario de la pestaña actual primero
      if (pestañaOriginal !== 2) {
        // Si estamos en otra pestaña, validar esa pestaña primero
        this.SolicitudPasoComponent.seleccionaTab(pestañaOriginal);
        setTimeout(() => {
          const VALIDACION_PESTANA_ACTUAL = this.SolicitudPasoComponent.validarFormularioPadre();
          if (!VALIDACION_PESTANA_ACTUAL) {
            this.mostrarErrorValidacion();
            return;
          }
          // Si la pestaña actual es válida, validar también "Datos de la solicitud"
          this.validarDatosSolicitudYContinuar(e, pestañaOriginal);
        }, 100);
        return;
      } else {
        // Si ya estamos en "Datos de la solicitud", validar directamente
        validacionExitosa = this.SolicitudPasoComponent.validarFormularioPadre();
      }
    } catch (error) {
      validacionExitosa = false;
    }

    if (!validacionExitosa) {
      this.mostrarErrorValidacion();
      return;
    }
    
    this.VALIDA_FORM = true;
    this.continuarNavegacion(e);
  }

  private validarDatosSolicitudYContinuar(e: AccionBoton, pestañaOriginal: number): void {
    // Cambiar a "Datos de la solicitud" para validar
    this.SolicitudPasoComponent.seleccionaTab(2);
    setTimeout(() => {
      try {
        const validacionDatosSolicitud = this.SolicitudPasoComponent.validarFormularioPadre();
        
        // Regresar a la pestaña original
        this.SolicitudPasoComponent.seleccionaTab(pestañaOriginal);
        
        if (!validacionDatosSolicitud) {
          this.mostrarErrorValidacion();
          return;
        }
        
        this.VALIDA_FORM = true;
        this.continuarNavegacion(e);
      } catch (error) {
        this.SolicitudPasoComponent.seleccionaTab(pestañaOriginal);
        this.mostrarErrorValidacion();
      }
    }, 100);
  }

  private mostrarErrorValidacion(): void {
    this.indice = 1;
    this.datosPasos.indice = 1;
    this.VALIDA_FORM = false;
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: 'Has proporcionado información con formato incorrecto o no proporcionaste información en campos obligatorios.',
      cerrar: false,
      txtBtnAceptar: TEXTO_CERRAR,
      txtBtnCancelar: CAMPO_VACIO,
    };
  }

  private continuarNavegacion(e: AccionBoton): void {
    /** Nos encontramos en el paso 1 y continuamos, se guarda parcialmente la información. **/
    if (this.indice === 1 && e.accion === 'cont' && this.VALIDA_FORM) {
      this.procesandoNavegacion = true;
      this.enviaSolicitudRequest()
        .pipe(
          takeUntil(this.destroyNotifier$),
          tap((respuesta) => {
            if (!respuesta) {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: 'error',
                modo: 'action',
                titulo: '',
                mensaje: 'Error al guardar la solicitud. Intente nuevamente.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              this.indice = 1;
              this.wizardComponent.indiceActual = 1;
              this.wizardComponent.atras();
              return;
            }

            if (e.valor > 0 && e.valor < 5) {
              this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
              } else {
                this.wizardComponent.atras();
                this.indice = e.valor;
                this.datosPasos.indice = e.valor;
              }
            }
          }),
          catchError(() => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: 'Error al guardar la solicitud. Intente nuevamente.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            return of(false);
          })
        )
        .subscribe({
          next: () => {
            /** Solo actualizar cuando el observable se complete exitosamente */
            if (e.accion === 'cont') {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
              this.procesandoNavegacion = false;
              this.mostrarBotonAnterior = true;
              // Al avanzar al paso 2, asegurar que se muestre la sección de carga de documentos
              if (e.valor === 2) {
                this.seccionCargarDocumentos = true;
              }
            }
          }
        });
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.datosPasos.indice = e.valor;
        
        // Gestionar el estado de seccionCargarDocumentos según el paso
        if (e.valor === 2) {
          this.seccionCargarDocumentos = true;
        } else {
          this.seccionCargarDocumentos = false;
        }
        
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
          // Preservar datos cuando se regresa al paso 1
          if (e.valor === 1) {
            // Llamar al método específico para repoblar el formulario
            setTimeout(() => {
              if (this.SolicitudPasoComponent) {
                this.SolicitudPasoComponent.repoblarFormularioAlRegresarAPaso1();
              }
            }, 50); // Reducir el timeout para una respuesta más rápida
          }
        }
      }
    }
  }

  /**
   * @ Obtiene la lista de personas notificadas a partir del estado de terceros.
   * Una lista de objetos `ListPersonaNoti` que representan las personas notificadas.
   */
  obtenerPersonasNotificacion(): ListPersonaNoti[] {
    return this.tercerosState.terceros.map((persona, i) => {
      return {
        id_persona_noti: i + 1,
        correo_electronico: persona.correo,
        nombreTercero: persona.nombre,
      };
    });
  }

  /**
   * @ Obtiene la lista de responsables de despacho a partir del estado de la solicitud.
   * Una lista de objetos `PersonaResponsableDespacho` que representan a los responsables de despacho.
   */
  obtenerResponsablesDespacho(): PersonaResponsableDespacho[] {
    return this.solicitudState.personasResponsablesDespacho.map((persona) => {
      return {
        gafete: persona.gafeteRespoDespacho,
        nombre: persona.nombre,
        apellido_paterno: persona.primerApellido,
        apellido_materno: persona.segundoApellido,
      };
    });
  }

  /**
   * @ Obtiene una lista de pedimentos a partir del estado de la solicitud.
   * Una lista de objetos `Pedimento` que representan los pedimentos obtenidos del estado de la solicitud.
   */
  obtenerPedimentosLista(): Pedimento[] {
    return this.solicitudState.pedimentos.map((pedimento, i) => {
      return {
        id_pedimento: i + 1,
        patente: pedimento.patente,
        pedimento: pedimento.pedimento.toString(),
        aduana: pedimento.aduana.toString(),
        tipo_pedimento: pedimento.tipoPedimento.toString(),
        numeros: pedimento.numero,
        cove: pedimento.comprobanteValor,
        estado_pedimento: parseInt(pedimento.estadoPedimento, 10),
        sub_estado_pedimento: parseInt(pedimento.subEstadoPedimento, 10),
        numero_pedimento: pedimento.pedimento,
        tipo_pedimento_por_evaluacion: '',
        bln_valido_pedimento:
          pedimento.pedimentoValidado === 'SI' ? true : false,
        fecha_edo_ws_pedimento: '',
        bln_activo: false,
      };
    });
  }

  /**
   * @ Obtiene una lista de transporte de arribo/salida a partir del estado de la solicitud.
   * Una lista de objetos `TransporteDespacho` que representan los transportes de despacho obtenidos del estado de la solicitud.
   */
  obtenerTransporteArriboSalida(): TransporteDespacho[] {
    const TIPO_TRANSPORTE_ARRIBO_SALIDA =
      this.solicitudState.tipoTransporteArriboSalida;
    switch (TIPO_TRANSPORTE_ARRIBO_SALIDA) {
      case '1':
        return this.solicitudState.transporteArriboDatos.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
              emp_transportista: (transporte.emp_transportista || '') as string,
              numero_porte: transporte.numero_porte || '',
              fecha_porte: (formatearFechaConMoment(new Date().toISOString()) || '') as string,
              marca_transporte: transporte.marca_transporte || '',
              modelo_transporte: transporte.modelo_transporte || '',
              placas_transporte: transporte.placas_transporte || '',
              contenedor_transporte: transporte.contenedor_transporte || '',
              observaciones: transporte.observaciones,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '2':
        return this.solicitudState.transporteArriboDatos.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
              numero_bl: transporte.numero_bl || '',
              tipo_equipo: transporte.tipo_equipo || '',
              iniciales_equipo: transporte.iniciales_equipo || '',
              numero_equipo: transporte.numero_equipo || '',
              observaciones: transporte.observaciones,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '4':
        //Marítimo
        return this.solicitudState.transporteArriboDatos.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
              guia_bl_Maritimo: transporte.guia_bl_Maritimo || '',
              guia_house_maritimo: transporte.guia_house_maritimo || '',
              nombre_buque_maritimo: transporte.nombre_buque_maritimo || '',
              contenedor_maritimo: transporte.contenedor_maritimo || '',
              observaciones: transporte.observaciones,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '3':
        //Aereo
        return this.solicitudState.transporteArriboDatos.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
              arribo_pendiente_aereo: transporte.arribo_pendiente_aereo,
              guia_master_aereo: transporte.guia_master_aereo || '',
              guia_house_aereo: transporte.guia_house_aereo || '',
              fecha_arribo_aereo: transporte.fecha_arribo_aereo || '',
              hora_arribo_aereo: transporte.hora_arribo_aereo || '',
              guia_valida: transporte.guia_valida,
              observaciones: transporte.observaciones,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '6':
        return this.solicitudState.transporteArriboDatos.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
              emp_transportista: transporte.emp_transportista || '',
              tipo_transporte_des: transporte.tipo_transporte_des || '',
              datos_transporte: transporte.datos_transporte || '',
              observaciones: transporte.observaciones,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      default:
        return [] as TransporteDespacho[];
    }
  }

  /**
   * @ Obtiene una lista de transporte de despacho a partir del estado de la solicitud.
   * Una lista de objetos `TransporteDespacho` que representan los transportes de despacho obtenidos del estado de la solicitud.
   */
  obtenerTransporteDespacho(): TransporteDespacho[] {
    const TIPO_TRANSPORTE_DESPACHO = this.solicitudState.tipoTransporte;

    switch (TIPO_TRANSPORTE_DESPACHO) {
      case '1':
        return this.solicitudState.transporte.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
              emp_transportista: (transporte.emp_transportista || '') as string,
              numero_porte: transporte.numero_porte || '',
              fecha_porte: (formatearFechaConMoment(new Date().toISOString()) || '') as string,
              marca_transporte: transporte.marca_transporte || '',
              modelo_transporte: transporte.modelo_transporte || '',
              placas_transporte: transporte.placas_transporte || '',
              contenedor_transporte: transporte.contenedor_transporte || '',
              observaciones: transporte.observaciones,
              mismos_datos_transporte: false,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '2':
        return this.solicitudState.transporte.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
              numero_bl: transporte.numero_bl || '',
              tipo_equipo: transporte.tipo_equipo || '',
              iniciales_equipo: transporte.iniciales_equipo || '',
              numero_equipo: transporte.numero_equipo || '',
              observaciones: transporte.observaciones,
              mismos_datos_transporte: false,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '5':
        return this.solicitudState.transporte.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
              rfc_empresa: transporte.rfc_empresa || '',
              emp_transportista: transporte.emp_transportista || '',
              nombre_transportista: transporte.nombre_transportista || '',
              num_gafete: transporte.num_gafete || '',
              observaciones: transporte.observaciones,
              mismos_datos_transporte: false,
            };
            return RESULTADO as TransporteDespacho;
          }
        );
      case '6':
        return this.solicitudState.transporte.map(
          (transporte: Partial<TransporteDespacho>) => {
            const RESULTADO: Partial<TransporteDespacho> = {
              tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
              emp_transportista: transporte.emp_transportista || '',
              tipo_transporte_des: transporte.tipo_transporte_des || '',
              datos_transporte: transporte.datos_transporte || '',
              observaciones: transporte.observaciones,
              mismos_datos_transporte: false,
            };
            return RESULTADO as TransporteDespacho;
          }
        );

      default:
        return [] as TransporteDespacho[];
    }
  }

  /**
   * @ Obtiene una lista de fechas del servicio a partir del estado de la solicitud.
   * {ListFechasSevex[]} Una lista de fechas del servicio obtenidas del estado de la solicitud.
   */
  obtenerFechasSevex(): FechasSevexItem[] {
    return this.solicitudState.fechasSeleccionadas.map((fecha) => {
      const fechaFormat = convertirFechaDdMmYyyyAMoment(fecha.split(',')[1].replace(/\s+/g, ''));
      return {
        id_solicitud: null,
        fecha: fechaFormat,
      };
    });
  }

  /**
   * @ Construye el payload de la solicitud para el trámite 5701
   * {SolicitudPayload} Un objeto que representa la solicitud con todos los datos necesarios.
   */
  construyeSolicitudPayload(): SolicitudPayload {
    return {
      id_solicitud:
        this.solicitudState.idSolicitud === 0
          ? null
          : this.solicitudState.idSolicitud,
      id_tipo_tramite: TIPO_TRAMITE,
      cve_unidad_administrativa: "CV1",
      costo_total: '',
      rfc: this.solicitudState.RFCImportadorExportador, //Este viene del store con los datos del inicio de sesión
      representante_legal: {
        rfc: '',
        telefono: '',
        nombre: '',
        ap_paterno: '',
        ap_materno: '',
      },
      datos_tramite: {
        importador_exportador: {
          rfc: this.solicitudState.RFCImportadorExportador,
          nombre: this.solicitudState.nombre,
          industria_automotriz: this.solicitudState.industriaAutomotriz,
          desc_industrial_automotriz:
            this.solicitudState.descripcionIndustrialAutomotriz,
          programa_fomento: this.solicitudState.programa,
          desc_programa_fomento: this.solicitudState.descripcionProgramaFomento,
          immex: this.solicitudState.checkIMMEX,
          desc_inmex: this.solicitudState.descripcionImmex,
          numero_registro:
            this.solicitudState.descripcionNumeroRegistro !== '' ? true : false,
          desc_numero_registro: this.solicitudState.descripcionNumeroRegistro,
          certificacion_a:
            this.solicitudState.tipoEmpresaCertificada === 'a' ? true : false,
          certificacion_aa:
            this.solicitudState.tipoEmpresaCertificada === 'aa' ? true : false,
          certificacion_aaa:
            this.solicitudState.tipoEmpresaCertificada === 'aaa' ? true : false,
          socio_comercial: this.solicitudState.socioComercial,
          id_socio_comercial: this.solicitudState.idSocioComercial,
          oea: this.solicitudState.certificacionOEA,
          revision_origen: this.solicitudState.revision,
        },
        despacho: {
          aduana_despacho: this.solicitudState.idAduanaDespacho,
          id_seccion_despacho: parseInt(
            this.solicitudState.idSeccionDespacho,
            10
          ),
          bln_lda: this.solicitudState.lda,
          rfc_despacho_lda: this.solicitudState.autorizacionLDA,
          bln_dd: this.solicitudState.dd,
          folio_ddex: this.solicitudState.autorizacionDDEX,
          tipo_despacho: this.solicitudState.descripcionTipoDespacho,
          nombre_recinto: this.solicitudState.nombreRecinto,
          domicilio: this.solicitudState.domicilioDespacho,
          especifique: this.solicitudState.especifique,
          fecha_inicio: this.solicitudState.fechaInicio,
          fecha_final: this.solicitudState.fechaFinal,
          hora_inicio: this.solicitudState.horaInicio,
          hora_fin: this.solicitudState.horaFinal,
          tipo_operacion: this.solicitudState.tipoOperacion,
          encargo_conferido: this.solicitudState.encargoConferido,
          relacion: this.solicitudState.relacionSociedad,
          bln_despacho: true,
        },
        pedimentos: this.obtenerPedimentosLista(),
        tipo_servicio: {
          bln_activo: false,
          cve_tipo_servicio: this.solicitudState.tipoSolicitud,
          desc_tipo_servicio: this.solicitudState.descripcionTipoSolicitud,
          numero_svex: '',
          rni: true,
          fecha_inicio_servicio: this.solicitudState.fechaInicio,
          fecha_fin_servicio: this.solicitudState.fechaFinal,
          hora_inicio_servicio: this.solicitudState.horaInicio,
          hora_fin_servicio: this.solicitudState.horaFinal,
          patente: this.solicitudState.patente.patente,
          id_patentes_aduanales: 1,
        },
        lista_pagos: [
          {
            linea_captura: this.solicitudState.lineaCaptura,
            monto: parseFloat(this.solicitudState.monto),
            bln_activo: true,
            id_modulo: 1,
            cve_modulo: 'cve1',
          },
        ],
        mercancias: {
          pais_origen: this.solicitudState.paisOrigen.toString(),
          descripcion_generica: this.solicitudState.descripcionGenerica,
          justificacion: this.solicitudState.justificacion,
          pais_procedencia: this.solicitudState.paisProcedencia.toString(),
        },
        list_transporte_despacho: this.obtenerTransporteDespacho(),
        list_unidad_arribo: this.obtenerTransporteArriboSalida(),
        persona_responsable: this.obtenerResponsablesDespacho(),
        list_persona_noti: this.obtenerPersonasNotificacion(),
        list_fechas_sevex: this.obtenerFechasSevex(),
      },
    };
  }

  /**
   * @ Este método construye un objeto `SolicitudPayload` con los datos necesarios para enviar una solicitud
   * del tramite 5701.
   * {void} No retorna ningún valor.   *
   */

  private enviaSolicitudRequest(): Observable<boolean> {
    const CONSTRUYE_SOLICITUD_PAYLOAD: SolicitudPayload =
      this.construyeSolicitudPayload();

    return this.guardarSolicitudService
      .postSolicitud(CONSTRUYE_SOLICITUD_PAYLOAD)
      .pipe(
        map((response) => {
          if (response.datos.id_solicitud) {
            this.solicitudState.idSolicitud = response.datos.id_solicitud;
            this.folioTemporal = response.datos.id_solicitud;
            this.tramite5701Store.setIdSolicitud(response.datos.id_solicitud);
            return true;
          }

          return false;
        }),
        catchError(() => of(false)),

        takeUntil(this.destroyNotifier$)
      );
  }

  /**
   * Método para asignar las secciones existentes al stored
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    for (const LLAVE_SECCION in SECCIONES_TRAMITE_5701.PASO_1) {
      if (
        Object.prototype.hasOwnProperty.call(
          SECCIONES_TRAMITE_5701.PASO_1,
          LLAVE_SECCION
        )
      ) {
        // @ts-expect-error - fix this
        SECCIONES.push(SECCIONES_TRAMITE_5701.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
      this.cargarArchivosEvento.emit();
    }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    
    // Resetear el estado de la sección de carga según el paso actual
    this.resetearEstadoSeccionCarga(this.indice);
    
    // Si regresamos al paso 1, recargar datos del formulario
    if (this.indice === 1) {
      this.recargarDatosFormularioPaso1();
    }
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   *  carga - Indica si la carga de documentos está activa o no.
   * {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para manejar el evento de regreso a la sección de carga de documentos.
   * Emite un evento para regresar a la sección de carga de documentos.
   * {void} No retorna ningún valor.
   */
  anteriorSeccionCargarDocumento(): void {
    this.regresarSeccionCargarDocumentoEvento.emit();
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
    // Asegurar que solo se actualice si estamos en el paso 2
    if (this.indice === 2) {
      this.seccionCargarDocumentos = cargaRealizada ? false : true;
    }
  }

  /**
   * Método para verificar si hay archivos seleccionados
   * Este método debería ser llamado desde el componente hijo cuando se seleccionen archivos
   */
  onArchivosSeleccionados(hayArchivos: boolean): void {
    this.hayArchivosSeleccionados = hayArchivos;
  }

  /**
   * Método para resetear el estado cuando se cambie de paso
   */
  resetearEstadoArchivos(): void {
    this.hayArchivosSeleccionados = false;
  }

  onFormularioPadreValido(isValid: boolean): void {
    this.formularioPadreEsValido = isValid;
  }

   /**
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  onDocumentosOpcionalesChange(hayDocumentosOpcionales: boolean): void {
    this.hayDocumentosOpcionales = hayDocumentosOpcionales;
  }

  irAPaso3(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.indiceActual = 2;
  }

  /**
   * Recarga los datos del formulario cuando se regresa al paso 1
   * Esto asegura que los datos previamente llenados se muestren correctamente
   */
  private recargarDatosFormularioPaso1(): void {
    setTimeout(() => {
      if (this.pasoUnoElement?.nativeElement) {        
        const recargarEvent = new CustomEvent('recargarFormulario', {
          detail: { solicitudState: this.solicitudState }
        });
        this.pasoUnoElement.nativeElement.dispatchEvent(recargarEvent);
      }
    }, 100);
  }

  /**
   * Resetea el estado de la sección de carga de documentos según el paso actual
   * @param paso - El paso actual del wizard
   */
  private resetearEstadoSeccionCarga(paso: number): void {
    if (paso === 1) {
      this.seccionCargarDocumentos = false;
    } else if (paso === 2) {
      this.seccionCargarDocumentos = true;
    }
  }


}
