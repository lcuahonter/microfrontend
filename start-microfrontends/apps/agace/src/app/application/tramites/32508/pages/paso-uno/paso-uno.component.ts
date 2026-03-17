import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, formatDateToDDMMYYYY, FormularioDinamico, Notificacion } from '@ng-mf/data-access-user';
import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Solicitud32508State, Tramite32508Store } from '../../state/Tramite32508.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AdaceService } from '../../services/adace.service';
import { ConsultaDictamen } from '../../models/adace.model';
import { AvisoComponent } from '../../components/aviso.component';

/**
 * Componente que representa el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  @ViewChild(AvisoComponent) avisoComponent!: AvisoComponent;

  constructor(
    private consultaioQuery: ConsultaioQuery,
    private tramite32508Store: Tramite32508Store,
    private adaceService: AdaceService,
    private fb: FormBuilder) 
    {
    // El constructor se utiliza para la inyección de dependencias.
    }
 
  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud32508State;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaDatos = seccionState;
        this.esFormularioSoloLectura = this.consultaDatos.readonly;

        if (this.consultaDatos.update) {
          this.fetchGetDatosConsulta(this.consultaDatos.id_solicitud);
        }
      });
  }

  /**
 * @method fetchGetDatosConsulta
 * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `tramite32508Store`.
 *
 * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
 * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
 *
 * @returns {void}
 */
  public fetchGetDatosConsulta(idSolicitud: string): void {
    this.adaceService
      .getDatosConsulta(idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.codigo === '00' && respuesta.datos) {
          this.setDatosEstado(respuesta.datos);
        }
      });
  }

  public setDatosEstado(datos: ConsultaDictamen) {
    this.tramite32508Store.setClaveFiscalizador(datos.clave_recinto ?? '');
    this.tramite32508Store.setTipoDictamen(datos.tipo_dictamen ?? '');
    this.tramite32508Store.setRfcCpi(datos.rfc ?? '');
    this.tramite32508Store.setNombreCpi(datos.nombre ?? '');
    this.tramite32508Store.setNumeroInscripcion(datos.numero_inscripcion ?? '');
    this.tramite32508Store.setAnoSeleccionado(datos.anio_periodo ?? '');
    this.tramite32508Store.setMesSeleccionado(datos.mes_periodo ?? '');
    this.tramite32508Store.setRadioPartial(datos.pago_aprovechamiento ?? '');
    this.tramite32508Store.setRadioTotal(datos.aprovechamiento ?? '');
    this.tramite32508Store.setSaldoPendienteCompensarAnterior(datos.saldo_compensar_anterior ?? '');
    this.tramite32508Store.setSaldoPendienteDisminuirAnterior(datos.saldo_disminuir_anterior ?? '');
    this.tramite32508Store.setAprovechamiento(datos.aprovechamiento_total ?? '');
    this.tramite32508Store.setDisminucionAplicada(datos.disminucion_aplicada ?? '');
    this.tramite32508Store.setCompensacionAplicada(datos.compensacion_aplicada ?? '');
    this.tramite32508Store.setSaldoPendienteDisminuir(datos.saldo_disminuir ?? '');
    this.tramite32508Store.setCantidad(datos.cantidad_pagada ?? '');
    this.tramite32508Store.setLlaveDePago(datos.llave_de_pago ?? '');
    if (datos.fecha_pago) { this.tramite32508Store.setFechaPago(formatDateToDDMMYYYY(datos.fecha_pago)); }
    if (datos.fec_elaboracion) { this.tramite32508Store.setFechaElaboracion(formatDateToDDMMYYYY(datos.fec_elaboracion)); }
    this.tramite32508Store.setSaldoPendienteCompensar(datos.saldo_compensar ?? '');
    // no van a estar disponibles hasta que se habiliten los campos en BD
    this.tramite32508Store.setDictaminadaCantidad(datos.cantidad_dictaminada);
    this.tramite32508Store.setIngresos(datos.total_ingresos_prestracion);
  }

  /**
   * @method fetchAdacePorEstado
   * @description Método para obtener el ADACE según la entidad federativa del solicitante.
   *
   * Este método realiza una solicitud HTTP al servicio para obtener el ADACE correspondiente
   * al estado (entidad federativa) proporcionado. Similar al patrón del trámite 32507.
   * Si la respuesta es exitosa, actualiza el valor de ADACE en el store.
   *
   * @param estado Nombre de la entidad federativa para consultar el ADACE
   * @returns {void}
   */
  public fetchAdacePorEstado(estado: string): void {
    this.adaceService
      .getAdace(estado)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta) => {
          if (respuesta.codigo === '00' && respuesta.datos) {
            const ADACE_VALOR = respuesta.datos.descripcion;
            this.tramite32508Store.setAdace(ADACE_VALOR);
            this.tramite32508Store.setCveUnidadAdministrativa(respuesta.datos.cve_parametro);
          } else {
            const MENSAJE = respuesta?.error || 'Error inesperado al consultar adace.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error inesperado al consultar adace.';
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
   * @method onDatosGeneralesLoaded
   * @description Método que se ejecuta cuando los datos generales del solicitante han sido cargados.
   *
   * Este método captura el evento del componente SolicitanteComponent cuando termina de cargar los datos.
   * Extrae la entidad federativa de los datos de ubicación y la utiliza para consultar el ADACE correspondiente.
   * Similar al patrón implementado en el trámite 32507.
   *
   * @param datosGenerales Datos generales obtenidos del servicio del solicitante
   * @returns {void}
   */
  public onDatosGeneralesLoaded(datosGenerales: DatosGeneralesModel): void {
    const UBICACION = datosGenerales.datos.ubicacion;
    const IDENTIFICACION = datosGenerales.datos.identificacion;

    this.tramite32508Store.setRfc(datosGenerales.datos.rfc_original || '');

    const NOMBRE_COMPLETO = IDENTIFICACION.razon_social ||
      `${IDENTIFICACION.nombre || ''} ${IDENTIFICACION.ap_paterno || ''} ${IDENTIFICACION.ap_materno || ''}`.trim();

    this.tramite32508Store.setNombre(NOMBRE_COMPLETO);

    this.tramite32508Store.setCveEntidadFederativa(UBICACION.c_ent_fed || '');

    this.tramite32508Store.setTipoPersona(IDENTIFICACION.tipo_persona || '');

    // Consultar ADACE usando la entidad federativa
    if (UBICACION.d_ent_fed) {
      this.fetchAdacePorEstado(UBICACION.d_ent_fed);
    }
  }

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Valida el formulario del componente aviso.
   * @returns true si el formulario de aviso es válido, false en caso contrario
   */
  public validarAviso(): boolean {
    if (this.avisoComponent) {
      return this.avisoComponent.validarFormulario();
    }
    return false;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
