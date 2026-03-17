import {
  CONFIGURACION_EMPRESAS_SUBMANUFACTURERAS,
  CONFIGURACION_FEDERATARIOS,
  CONFIGURACION_FEDERATARIOS_DOMICILIO,
  CONFIGURACION_PLANTAS_MANUFACTURERAS
} from '../../constants/complementaria.enum';
import { Complimentaria, Empresas, Plantas } from '../../../../shared/models/complementaria.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Federatario,
  FederatarioRealizaranLasOperaciones,
  JSONRespuesta,
  ServiciosImmex,
} from '../../models/complementaria.model';

import { Subject, filter, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplementariaComponent } from '../../../../shared/components/complementaria/complementaria.component';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';

import { Operacions } from '../../../80302/estados/models/plantas-consulta.model';

import { CONFIGURACION_OPERACIONES } from '../../../80302/constantes/modificacion.enum';

import { Tramite80303State, Tramite80303Store } from '../../estados/tramite80303Store.store';

@Component({
  selector: 'app-complementario',
  standalone: true,
  imports: [CommonModule, ComplementariaComponent],
  templateUrl: './complementaria.component.html',
  styleUrl: './complementaria.component.scss',
})
export class ComplementarioComponent implements OnInit, OnDestroy {
  /**
   * Configuración de columnas para la tabla de accionistas.
   */
  public accionistasTablaDatos: Complimentaria[] = [];
  /** Configuración de columnas para la tabla de federatarios. */
  public configuracionFederatariosTabla: ConfiguracionColumna<Federatario>[] = CONFIGURACION_FEDERATARIOS;
  /** Configuración de columnas para la tabla de plantas IMMEX que realizarán las operaciones. */
  public federatariosTablaDatos: Federatario[] = [];
  /** Configuración de columnas para la tabla de plantas IMMEX que realizarán las operaciones. */
  public configuracionPlantasIMMEX: ConfiguracionColumna<FederatarioRealizaranLasOperaciones>[] = CONFIGURACION_FEDERATARIOS_DOMICILIO;
  /** Configuración de columnas para la tabla de plantas IMMEX que realizarán las operaciones. */
  public plantasIMMEXDatos: FederatarioRealizaranLasOperaciones[] = [];
  /** Configuración de columnas para la tabla de empresas submanufactureras. */
  public configuracionEmpresasSubmanufacturerasTabla: ConfiguracionColumna<Empresas>[] = CONFIGURACION_EMPRESAS_SUBMANUFACTURERAS;
  public empresasSubmanufacturerasTablaDatos: Empresas[] = [];
  /** Configuración de columnas para la tabla de plantas manufactureras. */
  public configuracionPlantasManufacturerasTabla: ConfiguracionColumna<Plantas>[] = CONFIGURACION_PLANTAS_MANUFACTURERAS;
  /** Configuración de columnas para la tabla de servicios IMMEX. */
  public plantasManufacturerasTablaDatos: Plantas[] = [];
  /** Configuración de columnas para la tabla de servicios IMMEX. */
  public serviciosImmexTablaDatos: ServiciosImmex[] = [];
  /** Configuración de columnas para la tabla de operaciones. */
  configuracionOperacion: ConfiguracionColumna<Operacions>[] = CONFIGURACION_OPERACIONES;
  /** Datos de la tabla de operaciones. */
  datosOperacions: Operacions[] = [];
  /** Certificación SAT */
  certificacionSAT: string = '';
  
  /**
   * Estado de la solicitud actual.
   */
  solicitudState!: Tramite80303State;

  /**
   * Buscar ID de la solicitud
   * @type {string[]}
   */
  buscarIdSolicitud!: string[];

  /** Configuración de columnas para la tabla de empresas submanufactureras. */
  private destroyNotifier$: Subject<void> = new Subject<void>();

  constructor(
    public modificacionProgramaImmexBajaSubmanufactureraService: ModificacionProgramaImmexBajaSubmanufactureraService,
    public tramite80303Querry: Tramite80303Query,
    public tramite80303Store: Tramite80303Store,
  ) {
    // Subscribe to get the solicitudState
    this.tramite80303Querry.selectTramiteState$.pipe(takeUntil(this.destroyNotifier$)).subscribe(state => {
      this.solicitudState = state;
      this.accionistasTablaDatos = state.accionistasTablaDatos ?? [];
      this.federatariosTablaDatos = state.federatariosTablaDatos;
      this.plantasIMMEXDatos = state.plantasIMMEXDatos;
      this.empresasSubmanufacturerasTablaDatos = state.empresasSubmanufacturerasTablaDatos;
      this.plantasManufacturerasTablaDatos = state.plantasManufacturerasTablaDatos;
      this.serviciosImmexTablaDatos = state.serviciosImmexTablaDatos;
    });

    // Subscribe to get buscarIdSolicitud from store (same pattern as anexo component)
    this.tramite80303Querry.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
        take(1)
      )
      .subscribe((solicitud) => {
        if (solicitud?.buscarIdSolicitud) {
          this.buscarIdSolicitud = solicitud.buscarIdSolicitud;
          this.fetchAccionistasTablaDatos();
          this.fetchFederatariosTablaDatos();
          this.fetchPlantasIMMEXDatos();
          this.fetchDatosCertificacionSAT();
          this.fetchEmpresasSubmanufacturerasTablaDatos();
          this.fetchPlantasManufacturerasTablaDatos();
          this.fetchServiciosImmexTablaDatos();
        }
      });
  }

  /**
   * Inicialización del componente.
   */
  ngOnInit(): void {
    // Initialization logic if needed
  }

  /**  * Fetch accionistas tabla datos. */
  fetchAccionistasTablaDatos(): void {
    const BODY = {
      idSolicitud: this.buscarIdSolicitud?.map(id => Number(id)) || [202734900, 202734904],
    };


    this.modificacionProgramaImmexBajaSubmanufactureraService
      .buscarSocioAccionista(BODY)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.accionistasTablaDatos = response.datos;
          this.tramite80303Store.updateAccionistasTablaDatos(response.datos);
        }
      });
  }
  
  /**  * Fetch federatarios tabla datos. */
  fetchFederatariosTablaDatos(): void {
    const BODY = {
      idSolicitud: this.buscarIdSolicitud?.map(id => Number(id)) || [202734900, 202734904],
    };


    this.modificacionProgramaImmexBajaSubmanufactureraService
      .buscarNotariosConsulta(BODY)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.federatariosTablaDatos = response.datos;
          this.tramite80303Store.updateFederatariosTablaDatos(response.datos);
        }
      });
  }

  /**  * Fetch plantas IMMEX datos. */
  fetchPlantasIMMEXDatos(): void {
    const BODY = {
      idSolicitud: this.buscarIdSolicitud?.map(id => Number(id)) || [202734892, 202734901],
    };


    this.modificacionProgramaImmexBajaSubmanufactureraService
      .consultarPlantas(BODY)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.datosOperacions = response.datos;
          this.tramite80303Store.updatePlantasIMMEXDatos(response.datos);
        }
      });
  }

  /**  * Fetch datos certificación SAT. */
  fetchDatosCertificacionSAT(): void {
    const rfc = this.solicitudState?.rfc || 'AAL0409235E6';


    this.modificacionProgramaImmexBajaSubmanufactureraService
      .buscarDatosCertificacionSAT(rfc)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.certificacionSAT = respuesta.datos?.certificacionSAT || '';
        this.tramite80303Store.setCertificacionSAT(this.certificacionSAT);
      });
  }

  /**  * Fetch empresas submanufactureras tabla datos. */
  fetchEmpresasSubmanufacturerasTablaDatos(): void {
    const idSolicitud = this.buscarIdSolicitud?.[0] || '202734892';


    this.modificacionProgramaImmexBajaSubmanufactureraService
      .buscarEmpresaSubmanufacturera(idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.empresasSubmanufacturerasTablaDatos = response.datos;
          this.tramite80303Store.updateEmpresasSubmanufacturerasTablaDatos(response.datos);
        }
      });
  }

  /**  * Fetch plantas manufactureras tabla datos. */
  fetchPlantasManufacturerasTablaDatos(): void {
    const idSolicitud = this.buscarIdSolicitud?.join(',') || '202734892,202734901';


    this.modificacionProgramaImmexBajaSubmanufactureraService
      .consultarPlantasSubmanufactureras(idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.plantasManufacturerasTablaDatos = response.datos;
          this.tramite80303Store.updatePlantasManufacturerasTablaDatos(response.datos);
        }
      });
  }

  /**  * Fetch servicios IMMEX tabla datos. */
  fetchServiciosImmexTablaDatos(): void {
    const BODY = {
      idSolicitud: this.buscarIdSolicitud || ["3198492", "3198493"],
    };

    this.modificacionProgramaImmexBajaSubmanufactureraService
      .consultarServiciosImmex(BODY)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response: JSONRespuesta<ServiciosImmex[]>) => {
        if (response && response.codigo === '00' && response.datos) {
          this.serviciosImmexTablaDatos = response.datos;
          this.tramite80303Store.updateServiciosImmexTablaDatos(response.datos);
        }
      });
  }
/**  * Destrucción del componente. */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}