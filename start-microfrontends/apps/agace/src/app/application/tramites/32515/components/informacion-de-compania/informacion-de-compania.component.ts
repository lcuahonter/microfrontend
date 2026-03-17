import { Catalogo, ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InformationGeneralSolicitanteState, Tramite32515Store } from '../../estados/tramite32515.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { INFORMACION_DE_COMPANIA } from '../../constantes/modificacion-aviso-seguro-global.enum';
import { InformationGeneralSolicitanteService } from '../../services/information-general-solicitante.service';
import { Tramite32515Query } from '../../estados/tramite32515.query';

@Component({
  selector: 'app-informacion-de-compania',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent],
  providers: [InformationGeneralSolicitanteService],
  templateUrl: './informacion-de-compania.component.html',
  styleUrl: './informacion-de-compania.component.scss',
})
export class InformacionDeCompaniaComponent implements OnInit, OnDestroy {

  /** Datos de configuración para el formulario dinámico */
  public informacionDeCompaniaFormData = INFORMACION_DE_COMPANIA;

  /** Estado general de la información del solicitante */
  public informationGeneralState!: InformationGeneralSolicitanteState;

  /**
   * Catálogo de entidades federativas para llenar el campo correspondiente
   */
  public entidadFederativaData: Catalogo[] = [];

  /**
   * Catálogo de municipios/demarcaciones territoriales
   */
  public municipioData: Catalogo[] = [];

  /**
   * Catálogo de colonias
   */
  public coloniaData: Catalogo[] = [];

  /** Subject utilizado para destruir suscripciones activas al destruir el componente */
  private destroy$ = new Subject<void>();
/**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;

  /** Formulario principal que contiene subformularios */
  public forma: FormGroup = new FormGroup({
    /** Subformulario para campos relacionados con la compañía */
    ninoFormGroup: new FormGroup({})
  });

  /**
   * Constructor del componente
   * @param informationGeneralService Servicio para obtener catálogos de dirección
   * @param tramiteStore32515 Store para actualizar datos del estado
   * @param tramiteQuery32515 Query para acceder al estado actual
   * @param consultaQuery Query para acceder al estado de consulta
   */
  constructor(
    private informationGeneralService: InformationGeneralSolicitanteService,
    public tramiteStore32515: Tramite32515Store,
    public tramiteQuery32515: Tramite32515Query,
    public consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Getter para obtener el grupo de formularios del niño
   * @returns FormGroup de ninoFormGroup
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Maneja el evento de cambio de valor de un campo en el formulario dinámico
   * @param event Objeto con el campo y su nuevo valor
   */
  establecerCambioDeValor(event: { campo: string; valor: string }): void {
    if (event) {
      this.cambioEnValoresStore(event.campo, event.valor);
    }
  }

  /**
   * Establece el nuevo valor de un campo en el store
   * @param campo Campo modificado
   * @param value Nuevo valor asignado
   */
  public cambioEnValoresStore(campo: string, value: unknown): void {
    this.tramiteStore32515.establecerDatos(campo, value);
  }

  /**
   * Hook de inicialización del componente
   * Se suscribe al estado y obtiene los catálogos necesarios para los selects
   */
  ngOnInit(): void {
    this.tramiteQuery32515.select$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.informationGeneralState = seccionState as InformationGeneralSolicitanteState;
        })
      )
      .subscribe();
        this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {          
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.obtenerEntidadFederativa();
    this.obtenerMunicipio();
    this.obtenerColonia();
  }

  /**
   * Obtiene el catálogo de entidades federativas y lo asigna a las opciones del formulario
   */
  public obtenerEntidadFederativa(): void {
    this.informationGeneralService.getEntidadFederativa()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.entidadFederativaData = data;

        const ENTIDAD_FEDERATIVA_DATA = this.informacionDeCompaniaFormData.find((datos: ModeloDeFormaDinamica) => datos.campo === 'entidadFederativa') as ModeloDeFormaDinamica;
        if (ENTIDAD_FEDERATIVA_DATA && !ENTIDAD_FEDERATIVA_DATA.opciones) {
          ENTIDAD_FEDERATIVA_DATA.opciones = this.entidadFederativaData.map(item => ({
            descripcion: item.descripcion,
            id: item.id,
          }));
        }
      });
  }

  /**
   * Obtiene el catálogo de municipios (demarcaciones) y lo asigna al formulario
   */
  public obtenerMunicipio(): void {
    this.informationGeneralService.getMunicipio()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.municipioData = data;

        const MUNICIPIO_FIELD = this.informacionDeCompaniaFormData.find((datos: ModeloDeFormaDinamica) => datos.campo === 'municipioDemarcacionTerritorial') as ModeloDeFormaDinamica;
        if (MUNICIPIO_FIELD && !MUNICIPIO_FIELD.opciones) {
          MUNICIPIO_FIELD.opciones = this.municipioData.map(item => ({
            descripcion: item.descripcion,
            id: item.id,
          }));
        }
      });
  }

  /**
   * Obtiene el catálogo de colonias y lo asigna a las opciones del formulario
   */
  public obtenerColonia(): void {
    this.informationGeneralService.getColonia()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.coloniaData = data;

        const COLONIA_DATA = this.informacionDeCompaniaFormData.find((datos: ModeloDeFormaDinamica) => datos.campo === 'colonia') as ModeloDeFormaDinamica;
        if (COLONIA_DATA && !COLONIA_DATA.opciones) {
          COLONIA_DATA.opciones = this.coloniaData.map(item => ({
            descripcion: item.descripcion,
            id: item.id,
          }));
        }
      });
  }

  /**
   * Hook que se ejecuta al destruir el componente
   * Libera recursos y cancela las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
