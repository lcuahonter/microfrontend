import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosTramiteComponent } from '../../components/datosTramite.component';
import { ExencionImpuestosService } from '../../services/exencion-impuestos.service';
import { Tramite10302Store } from '../../estados/tramite10302.store';

/**
 * Componente que representa el paso uno del trámite.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: true,
  imports: [SolicitanteComponent, DatosTramiteComponent, CommonModule, FormsModule, ReactiveFormsModule],
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Referencia al componente de solicitante.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona.
   */
  tipoPersona!: number;

  /**
   * Datos del formulario dinámico de la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Datos del formulario dinámico del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña seleccionada.
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

  constructor(private cdr: ChangeDetectorRef,
     private consultaioQuery: ConsultaioQuery, public tramite10302Store: Tramite10302Store,
    private exencionImpuestosService: ExencionImpuestosService) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario, obtiene datos iniciales y suscribe al estado global.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();
    if (this.consultaDatos.update) {
      this.fetchGetDatosConsulta();
    }
  }

  /**
   * Método que se ejecuta después de que la vista ha sido inicializada.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    this.cdr.detectChanges();
  }

  /**
 * @method fetchGetDatosConsulta
 * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `tramite10302Store`.
 * 
 * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
 * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
 * 
 * @returns {void}
 */
  public fetchGetDatosConsulta(): void {
    this.exencionImpuestosService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
        if (respuesta.success) {
          this.tramite10302Store.setOrganismoPublico(respuesta.datos.organismoPublico);
          this.tramite10302Store.setAduana(respuesta.datos.aduana);
          this.tramite10302Store.setUsoEspecifico(respuesta.datos.usoEspecifico);
          this.tramite10302Store.setPais(respuesta.datos.pais);
          this.tramite10302Store.setRfc(respuesta.datos.rfc);
          this.tramite10302Store.setNumeroProgramaImmex(respuesta.datos.numeroProgramaImmex);
          this.tramite10302Store.setRazonSocial(respuesta.datos.razonSocial);
          this.tramite10302Store.setCorreoElectronicoOpcional(respuesta.datos.correoElectronicoOpcional);
          this.tramite10302Store.setTelefonoOpcional(respuesta.datos.telefonoOpcional);
          this.tramite10302Store.setCalle(respuesta.datos.calle);
          this.tramite10302Store.setNumeroExterior(respuesta.datos.numeroExterior);
          this.tramite10302Store.setNumeroInterior(respuesta.datos.numeroInterior);
          this.tramite10302Store.setTelefono(respuesta.datos.telefono);
          this.tramite10302Store.setCorreoElectronico(respuesta.datos.correoElectronico);
          this.tramite10302Store.setCodigoPostal(respuesta.datos.codigoPostal);
          this.tramite10302Store.setEstado(respuesta.datos.estado);
          this.tramite10302Store.setColonia(respuesta.datos.colonia);
        }
      });
  }

  /**
   * Selecciona la pestaña indicada por el índice.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
