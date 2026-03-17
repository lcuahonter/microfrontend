import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FraccionTabla, SectoresTabla } from '@libs/shared/data-access-user/src/core/models/90201/expansion-de-productores.model';
import {
  SolicitudSectoresYMercanciasState,
  TramiteSectoresYMercanciasStore,
} from '../../estados/stores/sectores-y-mercancias.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FRACCION } from '../../../core/enum/90102';
import { SECTORESY } from '@libs/shared/data-access-user/src';
import { SectoresMercanciasService } from '../../services/sectores-mercancias.service';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { TramiteSectoresYMercanciasQuery } from '../../estados/queries/sectores-y-mercancias.query';
import sectoresTabla from '@libs/shared/theme/assets/json/90201/sectores-tabla.json';
import fraccionTabla from '@libs/shared/theme/assets/json/90201/fraccion-tabla.json';
/**
 * Componente SectoresYMercancias que se utiliza para mostrar y gestionar los SectoresYMercancias.
 *
 * Este componente utiliza varios subcomponentes como TituloComponent, CommonModule,
 * CatalogoSelectComponent,TablaDinamicaComponent y AlertComponent para mostrar información y permitir al usuario seleccionar y agregar tratados.
 *
 * @component
 */
@Component({
  selector: 'app-sectores-y-mercancias',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    AlertComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sectores-y-mercancias.component.html',
  styleUrl: './sectores-y-mercancias.component.scss',
})
export class SectoresYMercanciasComponent implements OnInit, OnDestroy {

  /**
     * Identificador del procedimiento que se recibe como entrada desde el componente padre.
     * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
     * como catálogos o listas asociadas.
     */
    @Input() idProcedimiento!: number;
  /**
   * Una instancia de FormGroup que representa el formulario para sectores.
   * Este formulario se utiliza para gestionar y validar los datos de entrada relacionados con sectores y mercancías.
   */
  public sectoresForm!: FormGroup;

  /**
   * Lista de sectores seleccionados en la tabla.
   *
   * @type {SectoresTabla[]}
   */
  public seleccionarSectorLista: SectoresTabla | null = null;
  /**
   * Lista de fracciones seleccionadas en la tabla.
   *
   * @type {FraccionTabla[]}
   */
  public seleccionarFraccionLista: FraccionTabla | null = null;
  /**
   * Indica si un elemento está seleccionado.
   *
   * @type {boolean}
   */
  public seleccion: boolean = false;
  /**
   * Un array de objetos Catalogo que representa el catálogo de sectores.
   * Este array está inicialmente vacío y puede ser poblado con elementos Catalogo.
   */
  public sectorCatalogo: Catalogo[] = [];
  /**
   * Una propiedad pública que contiene el contenido de texto para el componente Sectores y Mercancias.
   * El contenido se importa del módulo `SECTORESY`.
   */
  public TEXTOS = SECTORESY;

  /**
   * Configuración para las columnas de la tabla.
   *
   * Este array define las columnas para una tabla, incluyendo el nombre del encabezado,
   * la clave para acceder a los datos en cada fila y el orden de las columnas.
   *
   * @type {ConfiguracionColumna<any>[]}
   *
   * @property {string} encabezado - El nombre del encabezado de la columna.
   * @property {Function} clave - Una función que toma un elemento y devuelve el valor para la columna.
   * @property {number} orden - El orden de la columna en la tabla.
   */
  public configuracionTabla: ConfiguracionColumna<SectoresTabla>[] = [
    {
      encabezado: 'Lista de sectores',
      clave: (item: SectoresTabla) => item.sectores,
      orden: 1,
    },
    {
      encabezado: 'Clave del sector',
      clave: (item: SectoresTabla) => item.claveDel,
      orden: 2,
    },
  ];

  /** Configuración para las columnas de la tabla de fracción arancelaria.
   * Este array define las columnas para una tabla, incluyendo el nombre del encabezado,
   * la clave para acceder a los datos en cada fila y el orden de las columnas.
   */
  public configuracionFraccionTabla: ConfiguracionColumna<FraccionTabla>[] = FRACCION;

  /**
   * Un array de objetos `SectoresTabla` que representa los sectores.
   */
  public sectores: SectoresTabla[] = [];

  /**
   * Un array de objetos `FraccionTabla` que representa las fracciones arancelarias.
   */
  public fraccion: FraccionTabla[] = [];
  /**
   * Representa la selección de radio del enumerado TablaSeleccion.
   * Esta propiedad se utiliza para gestionar el estado de selección del botón de radio en el componente.
   */
  public radio = TablaSeleccion.RADIO;

  /**
   * Una propiedad pública que representa el estado de la solicitud de sectores y mercancías.
   * Esta propiedad se utiliza para almacenar el estado actual de la solicitud.
   * @type {SolicitudSectoresYMercanciasState}
   */
  public solicitudState!: SolicitudSectoresYMercanciasState;

  /**
   * Un Subject que se utiliza para notificar la destrucción del componente.
   * Este Subject se utiliza para liberar recursos y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

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
   * Constructor del componente SectoresYMercanciasComponent.
   *
   * @param servicio - Servicio para manejar la expansión de productores.
   * @param fb - Instancia de FormBuilder para crear formularios reactivos.
   */
  constructor(
    private servicio: SectoresMercanciasService,
    private fb: FormBuilder,
    private tramiteSectoresYMercanciasStore: TramiteSectoresYMercanciasStore,
    private tramiteSectoresYMercanciasQuery: TramiteSectoresYMercanciasQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
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

  /**
   * Gancho de ciclo de vida que se llama después de que se inicializan las propiedades enlazadas a datos de una directiva.
   * Inicializa los catálogos llamando al método `inicializaCatalogos`.
   */
  ngOnInit(): void {
    this.tramiteSectoresYMercanciasQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.inicializaCatalogos();
    this.establecerFormSectores();

    this.inicializarEstadoFormulario();
    if (this.esFormularioActualizacion) {
      this.sectores = sectoresTabla;
      this.fraccion = fraccionTabla;
    }
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos y deshabilita el formulario si es solo lectura.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.sectoresForm.disable();
    } else {
      this.sectoresForm.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
  inicializarFormulario(): void {
    this.tramiteSectoresYMercanciasQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.establecerFormSectores();
  }

  /** Agrega una nueva fracción arancelaria a la lista de fracciones.
   * Este método obtiene el valor del campo 'fraccion' del formulario y, si no está vacío o solo contiene espacios en blanco,
   * asigna una lista predefinida de fracciones a la propiedad `fraccion`.
   * Actualmente, la lista de fracciones se obtiene de un archivo JSON importado.
   */
  public agregarFraccion(): void {
    const FRACCION = this.sectoresForm.get('fraccion')?.value;
    if(FRACCION && FRACCION.trim() !== '') {
      this.fraccion = fraccionTabla;
    }
  }

  /**
   * Inicializa el `sectoresForm` con valores predeterminados y validadores.
   *
   * El formulario contiene los siguientes controles:
   * - `sector`: Un control de cadena inicializado con una cadena vacía.
   * - `fraccion`: Un control de cadena inicializado con una cadena vacía y un validador de longitud máxima de 8 caracteres.
   */
  public establecerFormSectores(): void {
    this.sectoresForm = this.fb.group({
      sector: [this.solicitudState?.sector],
      fraccion: [this.solicitudState?.fraccion, Validators.maxLength(8)],
    });
  }

  /**
   * Inicializa los datos del catálogo obteniendo el catálogo de sectores del servicio.
   * Los datos obtenidos se asignan a la propiedad `sectorCatalogo`.
   *
   * Este método utiliza operadores de RxJS para manejar la obtención de datos asíncronos y
   * su transformación.
   *
   * @private
   */
 private inicializaCatalogos(): void {
  if (this.idProcedimiento) {
    this.servicio.getSectorCatalog(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.sectorCatalogo = (response.datos ?? []).map(item => ({
          ...item,
          descripcion: `${item.clave}-${item.descripcion}`
        }));
      });
  }
}
  /**
   * Agrega un nuevo sector a la lista de sectores si el campo de sector no está vacío.
   * Este método obtiene el valor del campo 'sector' del formulario y, si no está vacío o solo contiene espacios en blanco,
   * asigna una lista predefinida de sectores a la propiedad `sectores`.
   * Actualmente, la lista de sectores se obtiene de un archivo JSON importado.
   */
  public agregarSector(): void {
    const SECTOR = this.sectoresForm.get('sector')?.value;
    if(SECTOR && SECTOR.trim() !== '') {
      this.sectores = sectoresTabla;
    }
  }

  
  /** Guarda la selección de número de empleados hecha por el usuario.*/
  seleccionarSector(evento: SectoresTabla): void {
    this.seleccionarSectorLista = evento;
  }

   
  /** Guarda la selección de número de empleados hecha por el usuario.*/
  seleccionarFraccion(evento: FraccionTabla): void {
    this.seleccionarFraccionLista = evento;
  }

  /**
   * Elimina los sectores seleccionados de la lista de sectores.
   * Este método elimina los sectores que están en la lista `seleccionarSectorLista`
   * de la lista `sectores` y luego limpia la lista `seleccionarSectorLista`.
   * @returns {void}
   */
  public eliminarSector(): void {
    if(this.seleccionarSectorLista) {
      const sectoresAEliminar = [this.seleccionarSectorLista.claveDel];
      this.sectores = this.sectores.filter(sector => !sectoresAEliminar.includes(sector.claveDel));
      this.seleccionarSectorLista = null;
    }
  }

  /**
   * Elimina las fracciones seleccionadas de la lista de fracciones.
   * Este método elimina las fracciones que están en la lista `seleccionarFraccionLista`
   * de la lista `fraccion` y luego limpia la lista `seleccionarFraccionLista`.
   * @returns {void}
   */
  public eliminarFraccion(): void {
    if(this.seleccionarFraccionLista) {
      const fraccionesAEliminar = [this.seleccionarFraccionLista.fraccion];
      this.fraccion = this.fraccion.filter(fraccion => !fraccionesAEliminar.includes(fraccion.fraccion));
      this.seleccionarFraccionLista = null;
    }
  }

  /**
   * Establece la propiedad `seleccion` a `true`.
   * Este método se utiliza para indicar que se ha seleccionado un sector.
   */
  public sectorSeleccion(): void {
    this.seleccion = true;
  }

  /**
   * Establece la propiedad `seleccion` a `false`.
   * Este método se utiliza para indicar que no se ha seleccionado un sector.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Establece los valores del formulario en el store.
   * Este método se utiliza para actualizar los valores del formulario en el store.
   * @param form
   * @param campo
   * @param metodoNombre
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof TramiteSectoresYMercanciasStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.tramiteSectoresYMercanciasStore[metodoNombre] as (
        value: string | undefined
      ) => void
    )(VALOR);
  }
}