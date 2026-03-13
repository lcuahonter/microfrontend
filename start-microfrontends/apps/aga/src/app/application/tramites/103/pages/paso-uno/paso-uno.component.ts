import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExencionImpuestosComponent } from '../../components/exencion-impuestos.component';
import { ExencionImpuestosService } from '../../services/exencion-impuestos.service';
import { Subject } from 'rxjs';
import { Tramite103Store } from '../../estados/tramite103.store';

/**
 * Componente que representa el paso uno del trámite de exención de impuestos.
 * Muestra los datos del solicitante y su domicilio fiscal, permitiendo seleccionar
 * entre diferentes pestañas según el tipo de información.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: true,
  imports: [SolicitanteComponent, ExencionImpuestosComponent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PasoUnoComponent implements AfterViewInit, OnDestroy, OnInit {
  /**
   * Referencia al componente de solicitante para interactuar con sus métodos.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona seleccionada para el trámite.
   * @type {number}
   */
  tipoPersona!: number;

  /**
   * Datos dinámicos del formulario correspondientes a la persona.
   * @type {FormularioDinamico[]}
   */
  persona: FormularioDinamico[] = [];

  /**
   * Datos dinámicos del formulario del domicilio fiscal.
   * @type {FormularioDinamico[]}
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice actual de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Datos de consulta del trámite.
   * @type {ConsultaioState}
   */
  consultaDatos!: ConsultaioState;

  /**
   * Subject para gestionar la destrucción de suscripciones.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param {ExencionImpuestosService} exencionImpuestosService - Servicio para operaciones de exención de impuestos.
   * @param {ChangeDetectorRef} cdr - Servicio para detectar cambios en la vista.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de consulta.
   * @param {Tramite103Store} tramite103Store - Store para gestionar el estado del trámite.
   */
  constructor(
    private exencionImpuestosService: ExencionImpuestosService,
    private cdr: ChangeDetectorRef,
    private consultaioQuery: ConsultaioQuery,
    private tramite103Store: Tramite103Store
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe a los cambios de estado y carga datos si es necesario.
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
   * Método que se ejecuta después de inicializar la vista.
   * Configura los formularios y obtiene el tipo de persona.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    this.cdr.detectChanges();
  }

  /**
   * Cambia la pestaña seleccionada mediante su índice.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene los datos de consulta del servicio y actualiza el store.
   */
  public fetchGetDatosConsulta(): void {
    this.exencionImpuestosService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.tramite103Store.setManifesto(respuesta?.datos?.exencionImpuestos?.manifesto);
          this.tramite103Store.setOrganismoPublico(respuesta?.datos?.exencionImpuestos?.organismoPublico);
          this.tramite103Store.setAduana(respuesta?.datos?.exencionImpuestos?.aduana);
          this.tramite103Store.setDestinoMercancia(respuesta?.datos?.exencionImpuestos?.destinoMercancia);

          this.tramite103Store.setNombre(respuesta?.datos?.importadorExportador?.nombre);
          this.tramite103Store.setCalle(respuesta?.datos?.importadorExportador?.calle);
          this.tramite103Store.setNumeroExterior(respuesta?.datos?.importadorExportador?.numeroExterior);
          this.tramite103Store.setNumeroInterior(respuesta?.datos?.importadorExportador?.numeroInterior);
          this.tramite103Store.setTelefono(respuesta?.datos?.importadorExportador?.telefono);
          this.tramite103Store.setCorreoElectronico(respuesta?.datos?.importadorExportador?.correoElectronico);
          this.tramite103Store.setPais(respuesta?.datos?.importadorExportador?.pais);
          this.tramite103Store.setCodigoPostal(respuesta?.datos?.importadorExportador?.codigoPostal);
          this.tramite103Store.setEstado(respuesta?.datos?.importadorExportador?.estado);
          this.tramite103Store.setColonia(respuesta?.datos?.importadorExportador?.colonia);
          this.tramite103Store.setOpcion(respuesta?.datos?.importadorExportador?.opcion);
          this.tramite103Store.setPersonaMoral(respuesta?.datos?.importadorExportador?.personaMoral);

          this.tramite103Store.setTipoDeMercancia(respuesta?.datos?.datosMercancia?.tipoDeMercancia);
          this.tramite103Store.setUsoEspecifico(respuesta?.datos?.datosMercancia?.usoEspecifico);
          this.tramite103Store.setCondicionMercancia(respuesta?.datos?.datosMercancia?.condicionMercancia);
          this.tramite103Store.setUnidadMedida(respuesta?.datos?.datosMercancia?.unidadMedida);
          this.tramite103Store.setVehiculo(respuesta?.datos?.datosMercancia?.vehiculo);
          this.tramite103Store.setAno(respuesta?.datos?.datosMercancia?.ano);
          this.tramite103Store.setCantidad(respuesta?.datos?.datosMercancia?.cantidad);
          this.tramite103Store.setMarca(respuesta?.datos?.datosMercancia?.marca);
          this.tramite103Store.setModelo(respuesta?.datos?.datosMercancia?.modelo);
          this.tramite103Store.setSerie(respuesta?.datos?.datosMercancia?.serie);
        }
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}