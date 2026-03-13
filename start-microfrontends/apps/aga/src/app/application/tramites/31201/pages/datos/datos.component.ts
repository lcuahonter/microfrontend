import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { AvisoDeRenovacionComponent } from '../../components/aviso-de-renovacion/aviso-de-renovacion.component';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { UnicoStore } from '../../estados/renovacion.store';

/**
 * @component
 * @name DatosComponent
 * @description
 * Componente que maneja la visualización y navegación entre los subtítulos, 
 * controlando el índice del subtítulo seleccionado y obteniendo datos desde el store o servicio.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html'
})
export class DatosComponent implements OnInit, OnDestroy {
  /**
   * @property {number} indice
   * @description
   * Almacena el índice del subtítulo actualmente seleccionado.
   */
  indice: number = 1;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description
   * Datos de consulta del trámite almacenados en el estado global.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} esDatosRespuesta
   * @description
   * Bandera que indica si los datos ya fueron obtenidos y se deben mostrar directamente.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Subject para cancelar suscripciones automáticamente al destruir el componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {AvisoDeRenovacionComponent} avisoDeRenovacionComponent
   * @description
   * Referencia al componente de aviso de renovación para acceder a su validación.
   */
  @ViewChild(AvisoDeRenovacionComponent) avisoDeRenovacionComponent!: AvisoDeRenovacionComponent;

  /**
   * @constructor
   * @param service Servicio que maneja la obtención de datos relacionados al aviso.
   * @param consultaioQuery Consulta reactiva al estado del trámite.
   * @param unicoStore Store de estado donde se guardan los datos de la consulta.
   */
  constructor(
    private service: AvisoUnicoService,
    private consultaioQuery: ConsultaioQuery,
    private unicoStore: UnicoStore
  ) {}

  /**
   * @method
   * @name ngOnInit
   * @description
   * Ciclo de vida del componente. Se ejecuta al inicializar. 
   * Suscribe al estado de datos de consulta y decide si hacer la petición al servicio.
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

    if (this.consultaDatos?.update) {
      this.fetchGetDatosConsulta();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * @method
   * @name seleccionaTab
   * @description
   * Establece el índice del subtítulo seleccionado.
   * @param {number} i Índice del subtítulo que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method
   * @name validarFormularios
   * @description
   * Valida todos los formularios del componente datos.
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  public validarFormularios(): boolean {
    let todosValidos = true;
    
    // Validar según el subtítulo/tab activo
    if (this.indice === 1) {
      // Validar formulario de solicitante (tab 1)
      // Aquí puedes agregar validación específica del componente solicitante
      // Por ahora asumimos que es válido
    } else if (this.indice === 2) {
      // Validar formulario de aviso de renovación (tab 2)
      if (this.avisoDeRenovacionComponent && this.esDatosRespuesta) {
        todosValidos = this.avisoDeRenovacionComponent.validarFormulario();
      }
    }
    
    return todosValidos;
  }

  /**
   * @method
   * @name fetchGetDatosConsulta
   * @description
   * Obtiene los datos del trámite desde el servicio y actualiza el estado global (`store`) si la respuesta es exitosa.
   */
  public fetchGetDatosConsulta(): void {
    this.service
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;
          this.unicoStore.setmapTipoTramite(respuesta?.datos?.mapTipoTramite);
          this.unicoStore.setmapDeclaracionSolicitud(respuesta?.datos?.mapDeclaracionSolicitud);
          this.unicoStore.setenvioAviso(respuesta?.datos?.envioAviso);
          this.unicoStore.setnumeroAviso(respuesta?.datos?.numeroAviso);
          this.unicoStore.setclaveReferencia(respuesta?.datos?.claveReferencia);
          this.unicoStore.setnumeroOperacion(respuesta?.datos?.numeroOperacion);
          this.unicoStore.setcadenaDependencia(respuesta?.datos?.cadenaDependencia);
          this.unicoStore.setbanco(respuesta?.datos?.banco);
          this.unicoStore.setllavePago(respuesta?.datos?.llavePago);
          this.unicoStore.setfechaPago(respuesta?.datos?.fechaPago);
          this.unicoStore.setimportePago(respuesta?.datos?.importePago);
        }
      });
  }

  /**
   * @method
   * @name ngOnDestroy
   * @description
   * Ciclo de vida del componente. Se ejecuta al destruir.
   * Finaliza las suscripciones activas para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
