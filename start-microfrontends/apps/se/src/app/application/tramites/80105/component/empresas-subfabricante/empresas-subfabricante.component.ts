import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo, ConfiguracionColumna,TablaSeleccion, doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';


import { DatosSubcontratista, PlantasSubfabricante } from '../../../../shared/models/empresas-subfabricanta.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmpresasSubfabricantesComponent } from '../../../../shared/components/empresas-subfabricante/empresas-subfabricante.component';
import { NuevoProgramaIndustrialService } from '../../services/modalidad-terciarización.service';
import { SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION } from '../../../../shared/constantes/plantas-subfabricante-disponibles.enum';
import { SUBFABRICANTE_SELECCIONADAS_PLANTAS_TABLA_CONFIGURACION } from '../../../../shared/constantes/plantas-subfabricante-disponibles.enum';
import { Subject } from 'rxjs';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { takeUntil } from 'rxjs';


/**
 * Componente para gestionar las empresas subfabricantes.
 * Este componente permite realizar operaciones como agregar, eliminar y complementar plantas subfabricantes,
 * así como manejar la selección de registros en tablas y gestionar formularios relacionados con los datos del subcontratista.
 *
 * @class EmpresasSubfabricanteComponent
 * @implements {OnDestroy, OnInit}
 * @selector app-empresas-subfabricante
 * @standalone true
 * @imports [CommonModule, EmpresasSubfabricantesComponent]
 * @templateUrl ./empresas-subfabricante.component.html
 * @styleUrl ./empresas-subfabricante.component.scss
 * @host { hostID: crypto.randomUUID().toString() }
 */
@Component({
  selector: 'app-empresas-subfabricante',
  standalone: true,
  imports: [CommonModule, EmpresasSubfabricantesComponent],
  templateUrl: './empresas-subfabricante.component.html',
  styleUrl: './empresas-subfabricante.component.scss',
  host: { hostID: crypto.randomUUID().toString() },
})
export class EmpresasSubfabricanteComponent implements OnDestroy, OnInit {

  /**
   * Índice de la pestaña actualmente seleccionada.
   * Este valor se utiliza para determinar qué pestaña está activa.
   * 
   * @type {number}
   * @default 0
   */
  @Input() tabIndex: number = 0;

  /**
   * Formulario para los datos del subcontratista.
   * @property {FormGroup} formularioDatosSubcontratista
   */
  formularioDatosSubcontratista!: FormGroup;


  /**
   * Lista de estados obtenida del servicio.
   * @property {Catalogo[]} estadoCatalogo
   */

  estadoCatalogo: Catalogo[] = [];

  /**
   * Tipo de selección de la tabla.
   * @property {TablaSeleccion} tablaSeleccion
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla de subfabricantes.
   * @property {ConfiguracionColumna<PlantasSubfabricante>[]} configuracionTabla
   */
  configuracionTabla: ConfiguracionColumna<PlantasSubfabricante>[] =
    SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION;

  /**
   * Datos del subfabricante seleccionado.
   * @property {PlantasSubfabricante[]} datosDelSubfabricanteSeleccionado
   */
  datosDelSubfabricanteSeleccionado: PlantasSubfabricante[] = [];

  /**
   * Agregar los datos del subfabricante seleccionado.
   * @property {PlantasSubfabricante[]} datosSubfabricanteParaSerAgregados
   */
  datosSubfabricanteParaSerAgregados: PlantasSubfabricante[] = [];

  /**
   * Datos de la tabla de subfabricantes disponibles.
   * @property {PlantasSubfabricante[]} datosTablaSubfabricantesDisponibles
   */
  datosTablaSubfabricantesDisponibles: PlantasSubfabricante[] = [];

  /**
   * Lista de subfabricantes por eliminar.
   * @property {PlantasSubfabricante[]} listaDeSubfabricantesPorEliminar
   */
  listaDeSubfabricantesPorEliminar: PlantasSubfabricante[] = [];

  /**
  * Notificador utilizado para manejar la destrucción o desuscripción de observables.
  * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
  *
  * @property {Subject<void>} destroyNotifier$
  */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si existe un error relacionado con el RFC.
   * Se establece en `true` cuando el RFC ingresado no es válido.
   */
  rfcError: boolean = false;

  configuracionTablaDisponibles: ConfiguracionColumna<PlantasSubfabricante>[] = SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION;
  configuracionTablaSeleccionadas: ConfiguracionColumna<PlantasSubfabricante>[] = SUBFABRICANTE_SELECCIONADAS_PLANTAS_TABLA_CONFIGURACION

  constructor(private nuevoProgramaIndustrialService: NuevoProgramaIndustrialService,
    private fb: FormBuilder,
    public query: Tramite80101Query,
    private store: Tramite80101Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _compartidaSvc: ComplimentosService
  ) {
    this.inicializarFormularioDatosSubcontratista();
  }

  /**
 * Inicializa el componente.
 * @method ngOnInit
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
      .subscribe((plantasBuscadas) => {
        if (plantasBuscadas.length > 0) {
          this.datosTablaSubfabricantesDisponibles = plantasBuscadas;
        }
      })

    this.query.plantasSubfabricantesAgregar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasSubfabricantesAgregar) => {
        if (plantasSubfabricantesAgregar.length > 0) {
          this.datosSubfabricanteParaSerAgregados =
            plantasSubfabricantesAgregar;
        }
        else {
          this.datosSubfabricanteParaSerAgregados = [];
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
  alCambiarRFC(datosSubcontratista: DatosSubcontratista): void {
    if (datosSubcontratista) {
      this.store.setDatosSubcontratista(datosSubcontratista);
    }
  }

  /**
  * Inicializa el formulario de datos del subcontratista con los datos obtenidos o con valores vacíos si no hay datos disponibles.
  * @method inicializarFormularioDatosSubcontratista
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
  obtenerListaEstado(): void {
    this.nuevoProgramaIndustrialService
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
  obtenerSubfabricantesDisponibles(): void {
    this.rfcError=false;
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
      },(err) => { 
        if(err.error.codigo==="01"){
         this.rfcError=true;
        }
         
      }
    
    );
  }

  /**
 * Obtiene el registro seleccionado de la tabla de subfabricantes disponibles.
 * @method obtenerRegistroSeleccionado
 * @param {SubfabricanteDireccionModelo[]} event - Evento con los datos del registro seleccionado.
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
  realizarBusqueda(): void {
    if (
      this.formularioDatosSubcontratista.get('rfc')?.value !== '' &&
      this.formularioDatosSubcontratista.get('estado')?.value !== ''
    ) {
      this.obtenerSubfabricantesDisponibles();
    }
  }

  /**
   * Agrega plantas a la lista de subfabricantes seleccionados.
   * @method agregarPlantas
   */
  agregarPlantas(plantasPorAgrupar: PlantasSubfabricante[]): void {
    if (plantasPorAgrupar) {
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
  eliminarPlantas(plantasPorEliminar: PlantasSubfabricante[]): void {
    if (plantasPorEliminar) {
      this.store.eliminarPlantas(plantasPorEliminar);
    }
  }

  complementarPlantas(complementarPlantas: PlantasSubfabricante[]): void {
    if (complementarPlantas) {
      this.store.setPlantasPorCompletar(complementarPlantas);
    }
    if (this.tabIndex) {
      this.store.setindicePrevioRuta(this.tabIndex);
    }
    this.router.navigate(['../complementar-plantas'], { relativeTo: this.activatedRoute });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
