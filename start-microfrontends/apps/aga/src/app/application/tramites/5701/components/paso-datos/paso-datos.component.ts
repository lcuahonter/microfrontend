import {

  CategoriaMensaje,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  formatearFechaConMoment,
  Notificacion,
  NotificacionesComponent,
  SoloNumerosDirective,

  TercerosQuery,

  TercerosState,

  TipoPedimentoService,
} from '@ng-mf/data-access-user';
import {

  NgxDatatableModule,
  SelectionType,
} from '@swimlane/ngx-datatable';
import {
  Component,
  OnDestroy,
  OnInit,
  forwardRef,
  output,
} from '@angular/core';

import {  Observable, Subject,  catchError,  map, of, takeUntil } from 'rxjs';
import {  ReactiveFormsModule } from '@angular/forms';

import {
  Solicitud5701State,
  Tramite5701Store,
} from '../../../../core/estados/tramites/tramite5701.store';;
import { CommonModule } from '@angular/common';
import { EstadoPedimentoService } from '../../../../core/services/5701/pedimento/estado-pedimento.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { ServiciosExtraordinariosModule } from '../../servicios-extraordinarios.module';
import { FechaSevex, Pago, Pedimento, PersonaNoti, PersonaResponsable, SolicitudActualizarRequestModel, TipoServicio, TransporteDespacho, UnidadArribo } from '../../models/request/solicitud-actualizar-request.model';
import { ListFechasSevex } from '../../../../core/models/5701/solicitud-result.model';
import { GuardaSolicitudService } from '../../../../core/services/5701/guardar/guarda-solicitud.service';

/**
 * Componente responsable de gestionar la captura, validación y presentación
 * de datos relacionados con pedimentos aduanales en un formulario interactivo.
 * Permite seleccionar, editar y emitir eventos de cambios hacia componentes padres.
 */
@Component({
  selector: 'paso-datos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    forwardRef(() => SoloNumerosDirective),
    NotificacionesComponent,
    NgxDatatableModule,
    ServiciosExtraordinariosModule
  ],
  templateUrl: './paso-datos.component.html',
  styleUrl: './paso-datos.component.scss',
  providers: [ToastrService],
})

/**
 * Componente encargado de gestionar la lógica de captura, validación y emisión de datos
 * relacionados con los pedimentos aduanales dentro del trámite 5701.
 */
export class PasoDatosComponent implements OnInit, OnDestroy {

  /**
  * Estado de la solicitud utilizado en el componente.
  */
  public solicitudState!: Solicitud5701State;
  /**
   * Subject para manejar la destrucción del componente y limpiar las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /*
  * Propiedad pública que almacena la nueva notificación a mostrar en el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Estado de los terceros utilizado en el componente.
   */
  public tercerosState!: TercerosState;

  /**
   * @description Estado de los datos guardados de la solicitud.
   */
  guardarDatos!: ConsultaioState;
    
  /*
  * Propiedad pública que almacena los datos del estado de la solicitud 5701.
  */
  public actualizarSolicitud(): void {
    this.actualizaSolicitudRequest();
  }


  /**
   * Constructor del componente Pedimento.
   * Se inyectan las dependencias necesarias para el componente, incluyendo servicios y store.
   * tramite5701Query
   * tramite5701Store
   * estadoPedimentoService
   * tipoPedimentoService
   */
  constructor(
    private tramite5701Query: Tramite5701Query,
    private tramite5701Store: Tramite5701Store,
    private estadoPedimentoService: EstadoPedimentoService,
    private tipoPedimentoService: TipoPedimentoService,
    private guardarSolicitudService: GuardaSolicitudService,
    private tercerosQuery: TercerosQuery,
    private consultaioQuery: ConsultaioQuery,
    private consultaioStore: ConsultaioStore,
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se utiliza para obtener los tipos de pedimento y suscribirse al estado de la solicitud 5701.
   */
  ngOnInit(): void {

      this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
              this.guardarDatos = seccionState;
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
      this.consultaioStore.setSolicitudEditable(true);
  }

  onFormularioPadreValido(isValid: boolean): void {

    
  }

  /**
   * Convierte fecha de DD/MM/YYYY a YYYY-MM-DD HH:mm:ss
   */
  private convertirFechaParaServidor(fecha: string): string {
    if (!fecha) return '';
    
    // Si ya está en formato correcto, devolverla
    if (fecha.includes('-') && fecha.includes(':')) {
      return fecha;
    }
    
    // Convertir de DD/MM/YYYY a YYYY-MM-DD HH:mm:ss
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const año = partes[2];
      const horaActual = new Date().toTimeString().split(' ')[0];
      return `${año}-${mes}-${dia} ${horaActual}`;
    }
    
    return fecha;
  }

  private actualizaSolicitudRequest(): void {
      const CONSTRUYE_SOLICITUD_PAYLOAD: SolicitudActualizarRequestModel =
        this.construyeSolicitudPayload();
     this.guardarSolicitudService
        .postActualizarSolicitud(this.guardarDatos.procedureId, this.guardarDatos.id_solicitud, CONSTRUYE_SOLICITUD_PAYLOAD).pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe({
          next: (response) => {
            if (response.codigo === '00') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.EXITO,
                modo: 'action',
                titulo: 'Actualización de solicitud.',      
                mensaje:
                response.mensaje,
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error al actualizar la solicitud.',
                mensaje:
                response.mensaje,
                cerrar: false,  
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },  
          error: () => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr', 
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al actualizar la solicitud.',
              mensaje:
              'Ocurrió un error al actualizar la solicitud. Por favor, inténtelo de nuevo más tarde.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          },
        });
    }

    /**
     * @ Obtiene la lista de responsables de despacho a partir del estado de la solicitud.
     * Una lista de objetos `PersonaResponsableDespacho` que representan a los responsables de despacho.
     */
    obtenerResponsablesDespacho(): PersonaResponsable[] {
      return this.solicitudState.personasResponsablesDespacho.map((persona) => {
        return {
          gafete: persona.gafeteRespoDespacho,
          nombre: persona.nombre,
          apellido_paterno: persona.primerApellido,
          apellido_materno: persona.segundoApellido,
        } as PersonaResponsable;
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
          id_solicitud: this.solicitudState.idSolicitud,
          patente: parseInt(pedimento.patente),
          pedimento: pedimento.pedimento.toString(),
          aduana: pedimento.aduana.toString(),
          tipo_pedimento: pedimento.tipoPedimento.toString(),
          numeros: pedimento.numero,
          cove: pedimento.comprobanteValor,
          estado_pedimento: parseInt(pedimento.estadoPedimento, 10),
          sub_estado_pedimento: parseInt(pedimento.subEstadoPedimento, 10),
          numero_pedimento: pedimento.pedimento,
          bln_valido_pedimento:
            pedimento.pedimentoValidado === 'SI' ? true : false,
          fecha_edo_ws_pedimento: '',
          bln_activo: true,
        } as Pedimento;
      });
    }
  
    /**
     * @ Obtiene una lista de transporte de arribo/salida a partir del estado de la solicitud.
     * Una lista de objetos `TransporteDespacho` que representan los transportes de despacho obtenidos del estado de la solicitud.
     */
    obtenerTransporteArriboSalida(): UnidadArribo[] {
      const TIPO_TRANSPORTE_ARRIBO_SALIDA = this.solicitudState.tipoTransporteArriboSalida;
      
      // Si hay datos de transporte, determinar el tipo basándose en los campos presentes
      if (this.solicitudState.transporteArriboDatos && this.solicitudState.transporteArriboDatos.length > 0) {
        const transporte = this.solicitudState.transporteArriboDatos[0];
        
        // Detectar tipo ferroviario
        if (transporte.numero_bl || transporte.tipo_equipo || transporte.iniciales_equipo || transporte.numero_equipo) {
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: '2',
                numero_bl: transporte.numero_bl || '',
                tipo_equipo: transporte.tipo_equipo || '',
                iniciales_equipo: transporte.iniciales_equipo || '',
                numero_equipo: transporte.numero_equipo || '',
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        }
        
        // Detectar tipo marítimo PRIMERO
        if (transporte.guia_bl_Maritimo || transporte.guia_house_maritimo || transporte.nombre_buque_maritimo || transporte.contenedor_maritimo) {
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: '4',
                guia_bl_Maritimo: transporte.guia_bl_Maritimo || '',
                guia_house_maritimo: transporte.guia_house_maritimo || '',
                nombre_buque_maritimo: transporte.nombre_buque_maritimo || '',
                contenedor_maritimo: transporte.contenedor_maritimo || '',
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        }
        
        // Detectar tipo aéreo DESPUÉS        
        if (transporte.guia_master_aereo || transporte.guia_house_aereo || 
            (transporte.arribo_pendiente_aereo !== undefined && 
             (transporte.guia_master_aereo || transporte.guia_house_aereo || transporte.fecha_arribo_aereo || transporte.hora_arribo_aereo))) {          
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: '3',
                arribo_pendiente_aereo: transporte.arribo_pendiente_aereo,
                guia_master_aereo: transporte.guia_master_aereo || '',
                guia_house_aereo: transporte.guia_house_aereo || '',
                fecha_arribo_aereo: transporte.fecha_arribo_aereo || '',
                hora_arribo_aereo: transporte.hora_arribo_aereo || '',
                guia_valida: transporte.guia_valida,
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        }
        
        // Detectar tipo otro        
        if (transporte.datos_transporte) {          
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: '6',
                emp_transportista: transporte.emp_transportista || '',
                tipo_transporte_des: transporte.tipo_transporte_des || '',
                datos_transporte: transporte.datos_transporte || '',
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        }
        
        // Si tiene campos de carretero, forzar tipo 1
        if (transporte.numero_porte || transporte.marca_transporte || transporte.modelo_transporte || transporte.placas_transporte) {
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: '1',
                emp_transportista: transporte.emp_transportista || '',
                numero_porte: transporte.numero_porte || '',
                fecha_porte: this.convertirFechaParaServidor(transporte.fecha_porte || ''),
                marca_transporte: transporte.marca_transporte || '',
                modelo_transporte: transporte.modelo_transporte || '',
                placas_transporte: transporte.placas_transporte || '',
                contenedor_transporte: transporte.contenedor_transporte || '',
                observaciones: transporte.observaciones || '',
                mismosDatosTransporte: true
              } as UnidadArribo;
            }
          );
        }
      }
      
      switch (TIPO_TRANSPORTE_ARRIBO_SALIDA) {
        case '1': // Carretero
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
                emp_transportista: transporte.emp_transportista || '',
                numero_porte: transporte.numero_porte || '',
                fecha_porte: this.convertirFechaParaServidor(transporte.fecha_porte || ''),
                marca_transporte: transporte.marca_transporte || '',
                modelo_transporte: transporte.modelo_transporte || '',
                placas_transporte: transporte.placas_transporte || '',
                contenedor_transporte: transporte.contenedor_transporte || '',
                observaciones: transporte.observaciones || '',
                mismosDatosTransporte: true
              } as UnidadArribo;
            }
          );
        case '2': // Ferroviario
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
                numero_bl: transporte.numero_bl || '',
                tipo_equipo: transporte.tipo_equipo || '',
                iniciales_equipo: transporte.iniciales_equipo || '',
                numero_equipo: transporte.numero_equipo || '',
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        case '3': // Aéreo
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
                arribo_pendiente_aereo: transporte.arribo_pendiente_aereo,
                guia_master_aereo: transporte.guia_master_aereo || '',
                guia_house_aereo: transporte.guia_house_aereo || '',
                fecha_arribo_aereo: transporte.fecha_arribo_aereo || '',
                hora_arribo_aereo: transporte.hora_arribo_aereo || '',
                guia_valida: transporte.guia_valida,
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        case '4': // Marítimo
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
                guia_bl_Maritimo: transporte.guia_bl_Maritimo || '',
                guia_house_maritimo: transporte.guia_house_maritimo || '',
                nombre_buque_maritimo: transporte.nombre_buque_maritimo || '',
                contenedor_maritimo: transporte.contenedor_maritimo || '',
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        case '6': // Otro
          return this.solicitudState.transporteArriboDatos.map(
            (transporte) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_ARRIBO_SALIDA,
                emp_transportista: transporte.emp_transportista || '',
                tipo_transporte_des: transporte.tipo_transporte_des || '',
                datos_transporte: transporte.datos_transporte || '',
                observaciones: transporte.observaciones || ''
              } as UnidadArribo;
            }
          );
        default:
          return [] as UnidadArribo[];
      }
    }
  
    /**
     * @ Obtiene una lista de transporte de despacho a partir del estado de la solicitud.
     * Una lista de objetos `TransporteDespacho` que representan los transportes de despacho obtenidos del estado de la solicitud.
     */
    obtenerTransporteDespacho(): TransporteDespacho[] {
      const TIPO_TRANSPORTE_DESPACHO = this.solicitudState.tipoTransporte;
      
      // Si hay datos de transporte, determinar el tipo basándose en los campos presentes
      if (this.solicitudState.transporte && this.solicitudState.transporte.length > 0) {
        const transporte = this.solicitudState.transporte[0];
        
        // Detectar tipo ferroviario
        if (transporte.numero_bl || transporte.tipo_equipo || transporte.iniciales_equipo || transporte.numero_equipo) {
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: '2',
                numero_bl: transporte.numero_bl || '',
                tipo_equipo: transporte.tipo_equipo || '',
                iniciales_equipo: transporte.iniciales_equipo || '',
                numero_equipo: transporte.numero_equipo || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        }
        
        // Detectar tipo peatonal
        if (transporte.rfc_empresa || transporte.nombre_transportista || transporte.num_gafete) {
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: '5',
                rfc_empresa: transporte.rfc_empresa || '',
                emp_transportista: transporte.emp_transportista || '',
                nombre_transportista: transporte.nombre_transportista || '',
                num_gafete: transporte.num_gafete || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        }
        
        // Detectar tipo otro
        if (transporte.tipo_transporte_des || transporte.datos_transporte) {
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: '6',
                emp_transportista: transporte.emp_transportista || '',
                tipo_transporte_des: transporte.tipo_transporte_des || '',
                datos_transporte: transporte.datos_transporte || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        }
        
        // Si tiene campos de carretero, forzar tipo 1
        if (transporte.numero_porte || transporte.marca_transporte || transporte.modelo_transporte || transporte.placas_transporte) {
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: '1',
                emp_transportista: transporte.emp_transportista || '',
                numero_porte: transporte.numero_porte || '',
                fecha_porte: this.convertirFechaParaServidor(transporte.fecha_porte || ''),
                marca_transporte: transporte.marca_transporte || '',
                modelo_transporte: transporte.modelo_transporte || '',
                placas_transporte: transporte.placas_transporte || '',
                contenedor_transporte: transporte.contenedor_transporte || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        }
      }
  
      switch (TIPO_TRANSPORTE_DESPACHO) {
        case '1': // Carretero
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
                emp_transportista: transporte.emp_transportista || '',
                numero_porte: transporte.numero_porte || '',
                fecha_porte: this.convertirFechaParaServidor(transporte.fecha_porte || ''),
                marca_transporte: transporte.marca_transporte || '',
                modelo_transporte: transporte.modelo_transporte || '',
                placas_transporte: transporte.placas_transporte || '',
                contenedor_transporte: transporte.contenedor_transporte || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        case '2': // Ferroviario
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
                numero_bl: transporte.numero_bl || '',
                tipo_equipo: transporte.tipo_equipo || '',
                iniciales_equipo: transporte.iniciales_equipo || '',
                numero_equipo: transporte.numero_equipo || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        case '5': // Peatonal
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
                rfc_empresa: transporte.rfc_empresa || '',
                emp_transportista: transporte.emp_transportista || '',
                nombre_transportista: transporte.nombre_transportista || '',
                num_gafete: transporte.num_gafete || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
            }
          );
        case '6': // Otro
          return this.solicitudState.transporte.map(
            (transporte: Partial<TransporteDespacho>) => {
              return {
                tipo_transporte: TIPO_TRANSPORTE_DESPACHO,
                emp_transportista: transporte.emp_transportista || '',
                tipo_transporte_des: transporte.tipo_transporte_des || '',
                datos_transporte: transporte.datos_transporte || '',
                observaciones: transporte.observaciones || ''
              } as TransporteDespacho;
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
    obtenerFechasSevex(): FechaSevex[] {
      return this.solicitudState.selectRangoDias.map((fecha) => {
        return {
          fecha: fecha,
          fecha_desc: fecha,
          hora_inicio_svex: this.solicitudState.horaInicio,
          hora_final_svex: this.solicitudState.horaFinal,
        } as FechaSevex;
      });
    }
  /**
   * @ Construye el payload para actualizacion de la solicitud para el trámite 5701
   * {SolicitudPayload} Un objeto que representa la solicitud con todos los datos necesarios.
   */
  construyeSolicitudPayload(): SolicitudActualizarRequestModel {
    
    // Si los valores son cadenas vacías, enviar cadena vacía
    const paisOrigenValue = this.solicitudState.paisOrigen || '';
    const paisProcedenciaValue = this.solicitudState.paisProcedencia || '';
      
    return {
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
          id_aduana_despacho: this.solicitudState.idAduanaDespacho,
          id_seccion_despacho: parseInt(
            this.solicitudState.idSeccionDespacho,
            10
          ),
          bln_lda: this.solicitudState.lda,
          rfc_despacho: '',
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
          patente: parseInt(this.solicitudState.patente.patente),
          id_patentes_aduanales: 1,
        } as TipoServicio,
        lista_pagos: [
          {
            linea_captura: this.solicitudState.lineaCaptura,
            monto: parseFloat(this.solicitudState.monto),
            bln_activo: true,
            id_modulo: 1,
            cve_modulo: 'cve1',
          }  as Pago,
        ],
        mercancias: {
          pais_origen: paisOrigenValue,
          descripcion_generica: this.solicitudState.descripcionGenerica,
          justificacion: this.solicitudState.justificacion,
          pais_procedencia: paisProcedenciaValue,
        },
        list_transporte_despacho: this.obtenerTransporteDespacho(),
        list_unidad_arribo: this.obtenerTransporteArriboSalida(),
        persona_responsable: this.obtenerResponsablesDespacho(),
        list_persona_noti: this.obtenerPersonasNotificacion(),
        list_fechas_sevex: this.obtenerFechasSevex(),
      
    } as SolicitudActualizarRequestModel;
  }

  /**
     * @ Obtiene la lista de personas notificadas a partir del estado de terceros.
     * Una lista de objetos `ListPersonaNoti` que representan las personas notificadas.
     */
    obtenerPersonasNotificacion(): PersonaNoti[] {
      return this.tercerosState.terceros.map((persona, i) => {
        return {
          gafete: '',
          nombre: persona.nombre,
          apellido_paterno: '',
          apellido_materno: '',
          correo_electronico: persona.correo,
        } as PersonaNoti;
      });
    }
  

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica y completa el observable `destroyNotifier$` para limpiar suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.consultaioStore.setSolicitudEditable(false);
  }


}
