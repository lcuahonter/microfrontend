import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
} from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { AutorizacionProsecStore } from '../../estados/autorizacion-prosec.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DomiciliosDePlantasTabla } from '@libs/shared/data-access-user/src/core/models/90202/expansion-de-productores.model';
// import DomiciliosTabla from '@libs/shared/theme/assets/json/90202/domicilios-de-plantas-tabla.json';
import { ProsecService } from '../../services/prosec.service';
import { FilaSectors } from '../../models/prosec.module';



/**
 * Componente que representa la sección de domicilios de plantas en el formulario.
 * Este componente incluye un formulario reactivo y una tabla dinámica para mostrar los domicilios.
 *
 * @export
 * @class DomiciliosDePlantasComponent
 */
@Component({
  selector: 'app-domicilios-de-plantas',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, ReactiveFormsModule],
  templateUrl: './domicilios-de-plantas.component.html',
  styleUrl: './domicilios-de-plantas.component.scss',
})
export class DomiciliosDePlantasComponent implements OnInit, OnDestroy {
      /**
       * Maneja la selección de sectores y actualiza el store
       * @param selectedSectors - Array de sectores seleccionados
       */
  /**
   * Maneja la selección de sectores y actualiza el store
   * @param selectedSectors - Array de sectores seleccionados
   */
  onSectorSelect(selectedSectors: FilaSectors[]): void {
    this.store.setSelectedSectorDatos(selectedSectors);
  }
    /**
     * Arreglo que contiene los datos de las plantas para guardar en el store (prosecDatos)
     */
    prosecDatos: any[] = [];
  /**
   * Un grupo de formularios que representa los domicilios de las plantas.
   * Este formulario se utiliza para capturar y validar la información de los domicilios.
   */
  public formDomiciliosDePlantas!: FormGroup;

  /**
   * Configuración de la tabla para los domicilios de plantas.
   *
   * Esta configuración define las columnas que se mostrarán en la tabla,
   * incluyendo el encabezado, la clave para acceder al valor en cada fila
   * y el orden en que se mostrarán las columnas.
   *
   * @type {ConfiguracionColumna<any>[]} configuracionTabla - Arreglo de configuraciones de columnas.
   * @property {string} encabezado - El texto que se mostrará en el encabezado de la columna.
   * @property {Function} clave - Función que recibe un elemento y devuelve el valor correspondiente a la columna.
   * @property {number} orden - El orden en que se mostrará la columna en la tabla.
   */
  public configuracionTabla: ConfiguracionColumna<DomiciliosDePlantasTabla>[] =
    [
      {
        encabezado: 'Calle',
        clave: (item: DomiciliosDePlantasTabla) => item.calle,
        orden: 1,
      },
      {
        encabezado: 'Número exterior',
        clave: (item: DomiciliosDePlantasTabla) => item.numExterior,
        orden: 2,
      },
      {
        encabezado: 'Número interior',
        clave: (item: DomiciliosDePlantasTabla) => item.numInterior,
        orden: 3,
      },
      {
        encabezado: 'Código postal',
        clave: (item: DomiciliosDePlantasTabla) => item.codigoPostal,
        orden: 4,
      },
      {
        encabezado: 'Colonia',
        clave: (item: DomiciliosDePlantasTabla) => item.colonia,
        orden: 5,
      },
      {
        encabezado: 'Municipio o alcaldía',
        clave: (item: DomiciliosDePlantasTabla) => item.municipioOAlcaldia,
        orden: 6,
      },
      {
        encabezado: 'Estado',
        clave: (item: DomiciliosDePlantasTabla) => item.estado,
        orden: 7,
      },
      {
        encabezado: 'País',
        clave: (fila: DomiciliosDePlantasTabla) => fila.pais,
        orden: 8,
      },
      {
        encabezado: 'Registro federal de contribuyentes',
        clave: (fila: DomiciliosDePlantasTabla) =>
          fila.registroFederalDeContribuyentes,
        orden: 9,
      },
      {
        encabezado: 'Razón social',
        clave: (fila: DomiciliosDePlantasTabla) => fila.razonSocial,
        orden: 10,
      },
      {
        encabezado: 'Domicilio fiscal del solicitante',
        clave: (fila: DomiciliosDePlantasTabla) =>
          fila.domicilioFiscalDelSolicitante,
        orden: 11,
      },
    ];

  /**
   * Un arreglo de objetos `DomiciliosDePlantasTabla` que representa la tabla de domicilios.
   * Inicializado con los valores de `DomiciliosTabla`.
   */
  public domiciliosTabla: DomiciliosDePlantasTabla[] = [];

  /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Bandera para determinar si el formulario es de actualización.
   * Inicialmente establecido en `false`.
   *
   * @description Esta bandera se utiliza para controlar la lógica de actualización del formulario.
   */
  private esFormularioActualizacion: boolean = false;

  /**
   * Un Subject que se utiliza para notificar la destrucción del componente.
   * Se usa para limpiar las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor de DomiciliosDePlantasComponent.
   * Inicializa el formulario para domicilios de plantas.
   *
   * @param fb - Una instancia de FormBuilder utilizada para crear el formulario.
   */
  constructor(
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
    private prosecService: ProsecService,
    private tramiteQuery: AUtorizacionProsecQuery,
    private store: AutorizacionProsecStore
  ) {
    this.establecerFormDomiciliosDePlantas();
    // Inicializa el formulario.
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.esFormularioActualizacion = seccionState.update;
        })
      )
      .subscribe();
  }

    ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.loadDomiciliosTabla();
    this.loadRepresentacionFederal();
    this.loadActividadProductiva();
  }

  // Load table data from API
  loadDomiciliosTabla(): void {
    const PAYLOAD = {
      idSolicitud: '',
      idProgramaAutorizado: 9419
    };
    this.prosecService.obtenerEstadoTablaDatos(PAYLOAD).pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (esValidObject(response)) {
            const API_DATOS = doDeepCopy(response);
            if (API_DATOS.codigo !== "00") {
              this.domiciliosTabla = [];
              this.prosecDatos = [];
              this.store.setProsecDatos([]);
              return;
            }
            if (esValidObject(API_DATOS.datos) && Array.isArray(API_DATOS.datos.plantas)) {
              // Map API data to table view
              this.domiciliosTabla = API_DATOS.datos.plantas.map((planta: any) => ({
                calle: planta.domicilioDto?.calle,
                numExterior: planta.domicilioDto?.numExterior,
                numInterior: planta.domicilioDto?.numInterior,
                codigoPostal: planta.domicilioDto?.codigoPostal,
                colonia: planta.domicilioDto?.coloniaEntity?.nombre,
                municipioOAlcaldia: planta.domicilioDto?.delegacionMunicipio?.nombre,
                estado: planta.domicilioDto?.entidadFederativa?.cveEntidad,
                pais: planta.domicilioDto?.pais?.cvePais,
                registroFederalDeContribuyentes: planta.empresaDto?.rfc,
                razonSocial: planta.empresaDto?.razonSocial,
                domicilioFiscalDelSolicitante: planta.empresaDto?.domicilioCompleto
              }));
              // Store raw plant objects for prosecDatos
              this.prosecDatos = API_DATOS.datos.plantas;
              this.store.setProsecDatos(this.prosecDatos);
            } else {
              this.domiciliosTabla = [];
              this.prosecDatos = [];
              this.store.setProsecDatos([]);
            }
          }
        }
      });
  }

  loadRepresentacionFederal(): void {
    const ID_SOLICITUD = '';
    const ID_PROGRAMA_AUTORIZADO = '9419';
    const FECHA_PROSEC = Date.now().toString();
    this.prosecService.obtenerRepresentacionFederal(ID_SOLICITUD, ID_PROGRAMA_AUTORIZADO, FECHA_PROSEC)
      .pipe(takeUntil(this.destroyNotifier$))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((response: any) => {
        if (
          response &&
          response.datos &&
          typeof response.datos.obtenarRepresentacion === 'string'
        ) {
          const REPRESENTACION_FEDERAL = response.datos.obtenarRepresentacion;
          this.store.setRepresentacionFederal(REPRESENTACION_FEDERAL);
          this.formDomiciliosDePlantas.patchValue({
            representacionFederal: REPRESENTACION_FEDERAL
          });
        }
      });
  }

  loadActividadProductiva(): void {
    const ID_SOLICITUD = '';
    const ID_PROGRAMA_AUTORIZADO = '9419';
    this.prosecService.obtenerActividadProductiva(ID_SOLICITUD, ID_PROGRAMA_AUTORIZADO)
      .pipe(takeUntil(this.destroyNotifier$))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((response: any) => {
        if (
          response &&
          response.datos &&
          typeof response.datos.descripcionActividadProductiva === 'string'
        ) {
          const DESCRIPCION_ACTIVIDAD_PRODUCTIVA = response.datos.obtenerDescripcion;
          this.formDomiciliosDePlantas.patchValue({
            actividadProductiva: DESCRIPCION_ACTIVIDAD_PRODUCTIVA
          });
        }
      });
  }


  /**
  * @method validarFormulario
  * @description
  * Valida el formulario de domicilios de plantas. Si el formulario es válido, retorna `true`.
  * Si no es válido, marca todos los controles como tocados para mostrar los errores y retorna `false`.
  * 
  * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
  */
  validarFormulario(): boolean {
    if (!this.formDomiciliosDePlantas) { return false; }
    this.formDomiciliosDePlantas.markAllAsTouched();
    return this.formDomiciliosDePlantas.valid;
  }
  /**
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.loadDomiciliosTabla();
    this.loadRepresentacionFederal();
    this.loadActividadProductiva();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

  /**
   * Carga datos y deshabilita el formulario si es solo lectura.
   */
  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formDomiciliosDePlantas.disable();
    } else {
      this.formDomiciliosDePlantas.enable();
    }
  }

  /**
   * Inicializa el grupo de formularios para "Domicilios de Plantas" con valores predeterminados y campos deshabilitados.
   *
   * El grupo de formularios contiene los siguientes controles:
   * - `representacionFederal`: Un control de formulario deshabilitado con una cadena vacía como valor predeterminado.
   * - `actividadProductiva`: Un control de formulario deshabilitado con una cadena vacía como valor predeterminado.
   */
  public establecerFormDomiciliosDePlantas(): void {
    this.formDomiciliosDePlantas = this.fb.group({
      representacionFederal: [{ value: '', disabled: true }],
      actividadProductiva: [{ value: '', disabled: true }],
    });
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Limpia las suscripciones y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
