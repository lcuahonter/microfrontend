import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo, ConfiguracionColumna,TablaSeleccion, doDeepCopy,esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatosSubcontratista, PlantasSubfabricante } from '../../../../shared/models/empresas-subfabricanta.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION, SUBFABRICANTE_SELECCIONADAS_PLANTAS_TABLA_CONFIGURACION } from '../../../../shared/constantes/plantas-subfabricante-disponibles.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { AutorizacionProgrmaNuevoService } from '../../services/autorizacion-programa-nuevo.service';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { GestionarEmpresasSubfabricantesComponent } from '../../../../shared/components/gestionar-empresas-subfabricante/gestionar-empresas-subfabricante.component';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { Tramite80102Store } from '../../estados/tramite80102.store';

/**
 * Componente para la gestión de empresas subfabricantes en el trámite 80102.
 * Permite agregar, eliminar, complementar y consultar plantas de subfabricantes, así como manejar la información del subcontratista.
 * Utiliza formularios reactivos, servicios de consulta y estado, y tablas dinámicas para la interacción con el usuario.
 *
 * @author Equipo de desarrollo VUCEM
 * @version 1.0
 */
@Component({
  selector: 'app-empresas-subfabricante',
  standalone: true,
  imports: [CommonModule,GestionarEmpresasSubfabricantesComponent],
  templateUrl: './empresas-subfabricante.component.html',
  styleUrl: './empresas-subfabricante.component.scss',
  host: { hostID: crypto.randomUUID().toString() },
})
/**
 * @component
 * @name EmpresasSubfabricanteComponent
 * @description Componente encargado de gestionar los datos de los subfabricantes en el trámite 80102.
 * Este componente permite agregar, eliminar y complementar plantas de subfabricantes, así como manejar
 * la información del subcontratista.
 *
 * @usageNotes
 * Este componente utiliza servicios de consulta (`Tramite80102Query`) y estado (`Tramite80102Store`)
 * para manejar y observar los datos relacionados con los subfabricantes. Además, implementa el ciclo de vida
 * de Angular para limpiar las suscripciones al destruirse.
 */

/**
 * Componente principal para la gestión de subfabricantes.
 * Implementa OnInit y OnDestroy para el ciclo de vida y limpieza de suscripciones.
 */
export class EmpresasSubfabricanteComponent implements OnDestroy, OnInit {


  /**
   * Formulario para los datos del subcontratista.
   * @property {FormGroup} formularioDatosSubcontratista
   */
    /**
     * Formulario reactivo para los datos del subcontratista.
     */
  formularioDatosSubcontratista!: FormGroup;


  /**
   * Lista de estados obtenida del servicio.
   * @property {Catalogo[]} estadoCatalogo
   */

    /**
     * Catálogo de estados disponibles para selección.
     */
  estadoCatalogo: Catalogo[] = [];

   /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.Add commentMore actions
   */
  @Input() formularioDeshabilitado: boolean = false;
  /**
   * Tipo de selección de la tabla.
   * @property {TablaSeleccion} tablaSeleccion
   */
    /**
     * Tipo de selección de la tabla (CHECKBOX).
     */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla de subfabricantes.
   * @property {ConfiguracionColumna<PlantasSubfabricante>[]} configuracionTabla
   */
    /**
     * Configuración de columnas para la tabla principal de subfabricantes.
     */
  configuracionTabla: ConfiguracionColumna<PlantasSubfabricante>[] =
  SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION;

  /**
   * Datos del subfabricante seleccionado.
   * @property {PlantasSubfabricante[]} datosDelSubfabricanteSeleccionado
   */
    /**
     * Datos del subfabricante actualmente seleccionado.
     */
  datosDelSubfabricanteSeleccionado: PlantasSubfabricante[] = [];

  /**
   * Agregar los datos del subfabricante seleccionado.
   * @property {PlantasSubfabricante[]} datosSubfabricanteParaSerAgregados
   */
    /**
     * Datos preparados para ser agregados como subfabricantes.
     */
  datosSubfabricanteParaSerAgregados: PlantasSubfabricante[] = [];

  /**
   * Datos de la tabla de subfabricantes disponibles.
   * @property {PlantasSubfabricante[]} datosTablaSubfabricantesDisponibles
   */
    /**
     * Datos de la tabla de subfabricantes disponibles.
     */
  datosTablaSubfabricantesDisponibles: PlantasSubfabricante[] = [];

  /**
   * Lista de subfabricantes por eliminar.
   * @property {PlantasSubfabricante[]} listaDeSubfabricantesPorEliminar
   */
    /**
     * Lista de subfabricantes marcados para eliminar.
     */
  listaDeSubfabricantesPorEliminar: PlantasSubfabricante[] = [];

   /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  /**
   * Notificador para limpiar suscripciones al destruir el componente.
   */
   private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
    /**
     * Indica si el formulario está en modo solo lectura.
     */
  public esFormularioSoloLectura: boolean = false; 

  /**
   * Configuración de las columnas para la tabla de plantas subfabricante disponibles.
   * 
   * Esta propiedad almacena un arreglo de configuraciones de columna, 
   * que define cómo se mostrarán y gestionarán las plantas subfabricante 
   * disponibles en la tabla correspondiente del componente.
   * 
   * @type {ConfiguracionColumna<PlantasSubfabricante>[]}
   */
    /**
     * Configuración de columnas para la tabla de plantas subfabricante disponibles.
     */
  configuracionTablaDisponibles: ConfiguracionColumna<PlantasSubfabricante>[] = SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION;
  /**
   * Configuración de las columnas para la tabla de plantas subfabricantes seleccionadas.
   * 
   * Esta propiedad almacena un arreglo de configuraciones de columnas, 
   * que define cómo se mostrarán y gestionarán las plantas subfabricantes seleccionadas 
   * en la tabla correspondiente del componente.
   * 
   * @type {ConfiguracionColumna<PlantasSubfabricante>[]}
   */
    /**
     * Configuración de columnas para la tabla de plantas subfabricantes seleccionadas.
     */
  configuracionTablaSeleccionadas: ConfiguracionColumna<PlantasSubfabricante>[] = SUBFABRICANTE_SELECCIONADAS_PLANTAS_TABLA_CONFIGURACION

/**
 * Índice de la pestaña activa recibido como entrada.
 * Se utiliza para controlar la pestaña mostrada, con valor por defecto 0.
 */
/**
 * Índice de la pestaña activa recibido como entrada.
 * Se utiliza para controlar la pestaña mostrada, con valor por defecto 0.
 */
 @Input() tabIndex: number = 0;

  /**
   * Constructor de la clase EmpresasSubfabricanteComponent.
   * 
   * Inicializa los servicios y dependencias necesarias para el componente, incluyendo servicios de autorización,
   * formularios reactivos, consultas y navegación. Además, suscribe al estado de consulta para determinar si el
   * formulario debe estar en modo solo lectura y llama al método para inicializar el formulario de datos del subcontratista.
   * 
   * @param AutorizacionProgrmaNuevoServiceServicios Servicio para la autorización de nuevos programas.
   * @param fb Constructor de formularios reactivos.
   * @param query Consulta específica para el trámite 80102.
   * @param store Almacén de estado para el trámite 80102.
   * @param router Servicio de enrutamiento de Angular.
   * @param activatedRoute Información sobre la ruta activa.
   * @param consultaQuery Consulta para el estado de Consultaio.
   */
    /**
     * Constructor del componente. Inicializa servicios, dependencias y suscripciones a estados.
     */
  constructor(
    public AutorizacionProgrmaNuevoServiceServicios: AutorizacionProgrmaNuevoService,
    public fb: FormBuilder,
    public query: Tramite80102Query,
    public store: Tramite80102Store,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public consultaQuery: ConsultaioQuery,
    public _compartidaSvc: ComplimentosService
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    this.inicializarFormularioDatosSubcontratista();
  }

    /**
   * Inicializa el componente.
   * @method ngOnInit
   */
    /**
     * Inicializa el componente y carga los datos necesarios.
     */
    ngOnInit(): void {
      this.obtenerDatosDelAlmacen();
      this.obtenerListaEstado();
    }

     /**
   * Obtiene los datos del almacén y los asigna al formulario de información de registro.
   * Se suscribe al observable `infoRegisterEstado$` para obtener los datos, y cuando se reciben,
   * se actualiza la propiedad `infoRegistro` y se establece el valor del formulario `formularioInfoRegistro`.
   *
   * @method obtenerDatosDelAlmacen
   */
    /**
     * Obtiene los datos del almacén y los asigna al formulario de información de registro.
     */
  obtenerDatosDelAlmacen(): void {

    this.query.datosSubcontratistaEstado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosSubcontratista) => {
        this.formularioDatosSubcontratista.setValue(datosSubcontratista);
        this.store.setFormValida({
          esDatosSubcontratistaValido: this.formularioDatosSubcontratista.valid,
        });
      });

      this.query.plantasBuscadas$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasBuscadas)=>{
        if(plantasBuscadas.length>0){
          this.datosTablaSubfabricantesDisponibles=plantasBuscadas;
        }
      })



    this.query.plantasSubfabricantesAgregar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasSubfabricantesAgregar) => {
        if (plantasSubfabricantesAgregar.length > 0) {
          this.datosSubfabricanteParaSerAgregados =
            plantasSubfabricantesAgregar;
        }
        else{
          this.datosSubfabricanteParaSerAgregados =[];
        }
      });

  }


  /**
   * Actualiza el estado seleccionado en los datos del subcontratista y lo guarda en el store.
   *
   * Este método recibe un objeto `estadoSeleccionado` de tipo `Catalogo`, y actualiza la propiedad `estado`
   * de `datosSubcontratista` con el ID del estado seleccionado. Luego, se utiliza el método `setDatosContr`
   * del store para almacenar los datos actualizados del subcontratista.
   *
   * @method enEstadoSeleccionado
   * @param {Catalogo} estadoSeleccionado - Objeto que contiene el estado seleccionado, con su propiedad `id`.
   */
    /**
     * Actualiza el estado seleccionado en los datos del subcontratista y lo guarda en el store.
     */
  enEstadoSeleccionado(estadoSeleccionado: Catalogo): void {
    this.formularioDatosSubcontratista.patchValue({
      rfc: this.formularioDatosSubcontratista.get('rfc')?.value,
      estado: estadoSeleccionado.clave,
    })
    this.store.setDatosSubcontratista(this.formularioDatosSubcontratista.value);
  }

  /**
   * Obtiene el valor del RFC del formulario de datos del subcontratista y lo guarda en el store.
   *
   * Este método recupera el valor del campo `rfc` desde el formulario `formularioDatosSubcontratista`,
   * luego actualiza la propiedad `rfc` en los datos del subcontratista (`datosSubcontratista`) con el valor obtenido.
   * Finalmente, almacena los datos actualizados del subcontratista en el store utilizando el método `setDatosContr`.
   *
   * @method obtenerRFC
   */
    /**
     * Actualiza el RFC del subcontratista y lo guarda en el store.
     */
  alCambiarRFC(datosSubcontratista:DatosSubcontratista): void {
    if(datosSubcontratista){
    this.store.setDatosSubcontratista(datosSubcontratista);
    }
  }

   /**
   * Inicializa el formulario de datos del subcontratista con los datos obtenidos o con valores vacíos si no hay datos disponibles.
   * @method inicializarFormularioDatosSubcontratista
   */
  /**
   * Inicializa el formulario de datos del subcontratista.
   */
   inicializarFormularioDatosSubcontratista(): void {
    this.formularioDatosSubcontratista = this.fb.group({
      rfc: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

    /**
   * Obtiene la lista de estados desde el servicio y actualiza la propiedad estadoCatalogo.
   * @method obtenerListaEstado
   */
    /**
     * Obtiene la lista de estados desde el servicio y actualiza la propiedad estadoCatalogo.
     */
    obtenerListaEstado(): void {
      this.AutorizacionProgrmaNuevoServiceServicios
        .obtenerListaEstado()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response) {
            this.estadoCatalogo = response.data;
          }
        });
    }

    /**
   * Obtiene la lista de subfabricantes disponibles desde el servicio y actualiza las cabeceras y datos de la tabla correspondiente.
   * @method obtenerSubfabricantesDisponibles
   */
    /**
     * Obtiene la lista de subfabricantes disponibles desde el servicio y actualiza las cabeceras y datos de la tabla correspondiente.
     */
  obtenerSubfabricantesDisponibles(): void {
    const PAYLOAD = {
        "rfcEmpresaSubManufacturera": this.formularioDatosSubcontratista.get('rfc')?.value,
        "entidadFederativa": this.formularioDatosSubcontratista.get('estado')?.value,
        "idPrograma": null
      }
    this._compartidaSvc
      .getSubfabricantesDisponibles(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
          if(esValidObject(response)) {
             const API_DATOS = doDeepCopy(response);
            if(esValidArray(API_DATOS.datos)) {
              const RESPONSE:PlantasSubfabricante[] = this._compartidaSvc.mapApiResponseToPlantasSubfabricante(API_DATOS.datos);
              this.store.setPlantasBuscadas(RESPONSE);
            } 
          }
      });
  }

    /**
   * Obtiene el registro seleccionado de la tabla de subfabricantes disponibles.
   * @method obtenerRegistroSeleccionado
   * @param {SubfabricanteDireccionModelo[]} event - Evento con los datos del registro seleccionado.
   */
    /**
     * Obtiene el registro seleccionado de la tabla de subfabricantes disponibles.
     */
    obtenerRegistroSeleccionado(event: PlantasSubfabricante[]): void {
      if (event.length > 0) {
        this.datosDelSubfabricanteSeleccionado = event;
      } 
    }

    /**
   * Realiza una búsqueda de subfabricantes disponibles.
   * @method realizarBusqueda
   */
    /**
     * Realiza una búsqueda de subfabricantes disponibles.
     */
  realizarBusqueda(): void {
    if (
      this.formularioDatosSubcontratista.get('rfc')?.value !== '' &&
      this.formularioDatosSubcontratista.get('estado')?.value !== ''
    ) {
      this.obtenerSubfabricantesDisponibles();
      this.store.setFormValida({submanufacturas: true})
    }
  }

  /**
   * Agrega plantas a la lista de subfabricantes seleccionados.
   * @method agregarPlantas
   */
    /**
     * Agrega plantas a la lista de subfabricantes seleccionados.
     */
  agregarPlantas(plantasPorAgrupar:PlantasSubfabricante[]): void {
    if(plantasPorAgrupar){
    this.store.setPlantasSubfabricantesAgregar(
      plantasPorAgrupar
    );
  }
  }

   /**
   * Obtiene los datos del subfabricante por eliminar.
   * @method datosDelSubfabricantePorEliminar
   * @param {PlantasSubfabricante[]} event - Evento con los datos del subfabricante por eliminar.
   */
  /**
   * Obtiene los datos del subfabricante por eliminar.
   */
   datosDelSubfabricantePorEliminar(
    event: PlantasSubfabricante[]
  ): void {
    this.listaDeSubfabricantesPorEliminar = event;
  }

    /**
   * Elimina las plantas de subfabricantes de la lista de subfabricantes a eliminar.
   *
   * Este método actualiza el store con la lista de subfabricantes a eliminar mediante el método
   * `setPlantasSubfabricantesEliminar`, pasando como parámetro la propiedad `listaDeSubfabricantesPorEliminar`.
   *
   * @method eliminarPlantas
   */
    /**
     * Elimina las plantas de subfabricantes de la lista de subfabricantes a eliminar.
     */
    eliminarPlantas(plantasPorEliminar:PlantasSubfabricante[]): void {
      if(plantasPorEliminar){
      this.store.eliminarPlantas(plantasPorEliminar);
      }
    }

    /**
     * Complementa las plantas seleccionadas y actualiza el estado.
     */
    complementarPlantas(complementarPlantas:PlantasSubfabricante[]):void{
      if(complementarPlantas){
        this.store.setPlantasPorCompletar(complementarPlantas);
      }
      if (this.tabIndex) {
        this.store.setindicePrevioRuta(this.tabIndex);
    }
    }
  
    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
     * @method ngOnDestroy
     */
    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }

}
