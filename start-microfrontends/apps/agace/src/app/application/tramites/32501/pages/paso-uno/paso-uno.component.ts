import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';

import { OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';

import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';

/**
 * Componente correspondiente al paso uno del proceso.
 */
@Component({
  selector: 'paso-uno',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, DatosSolicitudComponent],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
/**
 * Componente correspondiente al paso uno del proceso.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Referencia al componente de solicitante */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Tipo de persona seleccionada */
  tipoPersona!: number;

  /** Información del formulario de persona */
  persona: FormularioDinamico[] = [];

  /** Información del formulario de domicilio fiscal */
  domicilioFiscal: FormularioDinamico[] = [];

  /** Índice de la pestaña seleccionada */
  indice: number = 1;

  /**
   * Cambia el índice de la pestaña seleccionada.
   * @param i Índice de la nueva pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
  * Indica si los datos de respuesta del servidor están disponibles.
  */
  public datosRespuestaDisponibles: boolean = false;

  /**
   * Referencia al componente `solicitudComponent`.
   */
  @ViewChild('solicitudComponent', { static: false }) solicitudComponent: DatosSolicitudComponent| undefined;


  /**
/**
 * Subject para notificar la destrucción del componente y desuscribirse de observables.
 */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta.
   */
  public estadoConsulta!: ConsultaioState;

  /**
   * Índice de la pestaña actualmente seleccionada.
   * Inicializado a 1 por defecto.
   */

  /**
   * Constructor del componente.
   * @param servicio Servicio para obtener datos de la solicitud.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    private servicio: MercanciasDesmontadasOSinMontarService,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Hook del ciclo de vida que se llama al inicializar el componente.
   * Realiza la suscripción al estado de la consulta y obtiene los datos de la bandeja de solicitudes si es necesario.
   */
  ngOnInit(): void {

    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSeccion) => {
        this.estadoConsulta = estadoSeccion;
      });
    this.datosRespuestaDisponibles = true;
    
  }

 /*
  * Valida todos los formularios del componente.
  * @returns `true` si todos los formularios son válidos, `false` en caso contrario.
  */
  public validarTodosLosFormularios(): boolean {
    let allFormsValid = true;
  
     if (this.indice >= 1 && this.solicitudComponent) {
      this.solicitudComponent?.formAviso.markAllAsTouched();

        if (!this.solicitudComponent.formAviso.valid) {
        allFormsValid = false;
      }
  
    }
    return allFormsValid ;
  }
  /**
   * Hook del ciclo de vida que se llama cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}
