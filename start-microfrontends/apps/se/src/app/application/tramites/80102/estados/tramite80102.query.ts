/**
 * @description Clase que representa las consultas (queries) para el estado de Tramite80102.
 * Proporciona selectores para acceder a diferentes partes del estado.
 */
import { Tramite80102State, Tramite80102Store } from './tramite80102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite80102Query extends Query<Tramite80102State> {

   /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
  /**
   * @description Selector para obtener la información del registro.
   */
  selectInfoRegistro$ = this.select((state) => state.infoRegistro);

  /**
   * @description Selector para obtener los servicios.
   */
  selectServicios$ = this.select((state) => state.servicios);

  /**
   * @description Selector para obtener las empresas.
   */
  selectEmpresas$ = this.select((state) => state.empresas);

  /**
   * @description Selector para obtener la aduana de ingreso.
   */
  selectAduanaDeIngreso$ = this.select((state) => state.aduanaDeIngreso);

  /**
   * @description Selector para obtener los datos IMMEX.
   */
  selectDatosImmex$ = this.select((state) => state.datosImmex);

  /**
   * @description Selector para obtener los datos generales.
   */
  selectDatos$ = this.select((state) => state.datos);

  /**
   * @description Selector para obtener la aduana de ingreso seleccionada.
   */
  selectAduanaDeIngresoSelecion$ = this.select(
    (state) => state.aduanaDeIngresoSelecion
  );

  /**
   * @description Selector para verificar si la forma es válida.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every((value) => value === true);
  });

  /**
   * @description Selector para obtener los países de origen.
   */
  selectPaisesOrigen$ = this.select((state) => state.paisesOrigen);

  /**
   * @description Selecciona el RFC de la empresa desde el estado de la aplicación.
   * @returns Un observable que emite el valor del RFC de la empresa.
   */
  selectRfcEmpresa$ = this.select((state) => state.rfcEmpresa);

  /**
   * @description Selecciona el número del programa desde el estado de la aplicación.
   * @returns Un observable que emite el valor de `numeroPrograma` del estado.
   */
  selectNumeroPrograma$ = this.select((state) => state.numeroPrograma);

  /**
   * @description Selecciona el valor de `tiempoPrograma` del estado actual.
   * @returns Un observable que emite el valor de `tiempoPrograma`.
   */
  selectTiempoPrograma$ = this.select((state) => state.tiempoPrograma);

  /**
   * Selecciona los datos de las plantas disponibles del estado.
   */

  selectDatosFederatariosFormulario$ = this.select(
    (state) => state.datosFederatarios
  );

  /**
   * @description
   * Selecciona el estado `plantasSubfabricantesAgregar` del estado global de la aplicación.
   *
   * @returns
   * Un observable que emite los datos de `plantasSubfabricantesAgregar` desde el estado de `empressaSubFabricantePlantas`.
   */

  selectdatosEmpresaExtranjera$ = this.select((state) => {
    return state.datosEmpresaExtranjera.map((ele) => {
      return {
        ...ele,
        entidadFederativaEmpresaExt:
          state.paisesOrigen.find(
            (paise) => paise.id === Number(ele.entidadFederativaEmpresaExt)
          )?.nombre || '',
      };
    });
  });

  /**
   * @descripcion Observable que selecciona los datos de complemento del estado.
   * @tipo Observable<any>
   * @retorno Devuelve un observable que emite los datos de complemento almacenados en el estado.
   */
  selectDatosComplimento$ = this.select((state) => state.datosComplimentos);

  /**
   * Selecciona los datos de cumplimientos del estado.
   */
  selectDatosDosComplimentos$ = this.select((state) => state.datosComplimentoDos);

  /**
   * Selecciona los datos de cumplimientos del estado.
   */
  selectDatosComplimentos$ = this.select((state) => state.datosComplimento);

/**
   * Selecciona los datos de cumplimientos del estado.
   */
  selectDatosComplimentosDos$ = this.select((state) => state.datosComplimentoDos);

  /**
   * Selector observable para obtener la propiedad `datosAnexoTress` del estado de la aplicación.
   * 
   * @returns Un observable que emite el valor actual de `datosAnexoTress` desde el estado.
   */
  selectDatosAnexoTres$ = this.select((state) => state.datosAnexoTress);

  /**
   * Selector observable para obtener la propiedad `datosAnexoTress` del estado de la aplicación.
   * 
   * @returns Un observable que emite el valor actual de `datosAnexoTress` desde el estado.
   */
  selectDatosAnexoTressDos$ = this.select((state) => state.datosAnexoTressDos);

  /**
   * @property {Observable<any>} datosSubcontratistaEstado$
   * @description Observable que selecciona y emite los datos del subcontratista desde el estado de la aplicación.
   * @returns Los datos del subcontratista asociados a las plantas del subfabricante.
   */
  datosSubcontratistaEstado$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.datosSubcontratista;
  });

  /**
   * @description Selecciona el estado de las plantas subfabricantes para agregar.
   * @returns Un observable que emite el estado actual de `plantasSubfabricantesAgregar`.
   */
  plantasSubfabricantesAgregar$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.plantasSubfabricantesAgregar;
  });

  /**
   * @property {Observable<any>} plantasBuscadas$
   * @description Observable que selecciona el estado de las plantas buscadas
   * asociadas a la empresa sub-fabricante. Este observable se utiliza para
   * obtener los datos de las plantas buscadas desde el estado global de la aplicación.
   * @returns {Observable<any>} Un observable que emite los datos de las plantas buscadas.
   */
  plantasBuscadas$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.plantasBuscadas;
  });

  /**
   * @property {Observable<any>} plantasPorCompletar$
   * @description Observable que selecciona las plantas pendientes por completar
   * desde el estado de la aplicación. Este observable se utiliza para rastrear
   * las plantas asociadas a la empresa sub-fabricante que aún no han sido completadas.
   * @returns {Observable<any>} Un observable que emite el estado actual de las plantas
   * por completar.
   */
  plantasPorCompletar$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.plantasPorCompletar;
  });

  /**
   * @description Observable que selecciona la lista de la tabla "Anexo Dos" del estado de la aplicación.
   * @returns Un observable que emite los datos de la lista de la tabla "Anexo Dos".
   */
  anexoDosTableLista$ = this.select((state) => {
    return state.annexoDosTres.anexoDosTablaLista;
  });

  /**
   * @description Observable que selecciona la lista de la tabla "Anexo Tres" del estado de la aplicación.
   * @returns Un observable que emite la lista de elementos de la tabla "Anexo Tres".
   */
  anexoTresTablaLista$ = this.select((state) => {
    return state.annexoDosTres.anexoTresTablaLista;
  });

  /**
   * @property {Observable<any>} indicePrevioRuta$
   * @description Observable que selecciona el índice previo de la ruta desde el estado de la aplicación.
   * Este observable se utiliza para rastrear el índice de la ruta anterior en el flujo de navegación.
   * @returns {Observable<any>} Un observable que emite el valor del índice previo de la ruta.
   */
  indicePrevioRuta$ = this.select((state) => {
    return state.indicePrevioRuta;
  });

  /**
   * @description Observable que selecciona el estado de `tablaDatosComplimentos` desde el store.
   * @returns Un observable que emite los datos de la tabla de complementos.
   */
  selectTablaDatosComplimentos$ = this.select(
    (state) => state.tablaDatosComplimentos
  );

  /**
   * @description Selecciona el estado `tablaDatosComplimentosExtranjera` desde el store.
   * Este observable proporciona los datos relacionados con los cumplimientos extranjeros.
   *
   * @type {Observable<any>} Observable que emite los datos de la tabla de cumplimientos extranjeros.
   */
  selectTablaDatosComplimentosExtranjera$ = this.select(
    (state) => state.tablaDatosComplimentosExtranjera
  );

  /**
   * @description Selecciona el estado de la propiedad `importarDatosTabla` dentro de `annexoUno`.
   * Este observable se utiliza para obtener los datos relacionados con la importación de tablas.
   *
   * @returns Un observable que emite el valor actual de `importarDatosTabla`.
   */
  selectImportarTablsDatos$ = this.select(
    (state) => state.annexoUno.importarDatosTabla
  );

  /**
   * @description Selecciona el estado de `exportarDatosTabla` desde el estado de `annexoUno`.
   * Este observable se utiliza para obtener los datos de exportación de la tabla en el contexto del trámite 80102.
   *
   * @returns Un observable que emite el estado actual de `exportarDatosTabla`.
   */
  selectExportarTablsDatos$ = this.select(
    (state) => state.annexoUno.exportarDatosTabla
  );

  /**
   * @description Selector que obtiene los datos necesarios para la navegación desde el estado `annexoUno`.
   * Este observable se utiliza para acceder a la información relacionada con la navegación dentro del flujo del trámite 80102.
   *
   * @type {Observable<any>} Observable que emite los datos para navegar.
   */
  selectDatosParaNavegar$ = this.select(
    (state) => state.annexoUno.datosParaNavegar
  );

  /**
   * @description Selector que obtiene los datos de los fedatarios desde el estado `tablaDatosFederatarios`.
   * Este observable se utiliza para acceder a la información de los fedatarios en el contexto del trámite 80102.
   *
   * @type {Observable<any>} Observable que emite los datos de los fedatarios.
   */
  selectDatosFederatarios$ = this.select(
    (state) => state.tablaDatosFederatarios
  );

  /**
   * Observable que selecciona la lista de plantas disponibles desde el estado.
   * 
   * @returns Un observable que emite la lista de plantas disponibles para la tabla.
   */
  selectPlantasDisponiblesTablaLista$ = this.select(
    (state) => state.plantasDisponiblesTablaLista
  );
  
  /**
   * Observable que selecciona la lista de plantas IMMEX desde el estado de la aplicación.
   * 
   * @returns Un observable que emite la lista de plantas IMMEX almacenada en el estado.
   */
  selectplantasImmexTablaLista$ = this.select(
    (state) => state.plantasImmexTablaLista
  );
/**
   * Selecciona el tiempo del programa del estado.
   */
  selectProyectoImmexTablaLista$ = this.select((state) => state.proyectoImmexTablaLista);
  /**
 * Observable selector for retrieving the entire state.
 */
allStoreData$ = this.select((state) => state);

  /**
   * @description Constructor de la clase `Tramite80102Query`.
   * Inicializa la clase base `Query` con el store proporcionado.
   *
   * @param {Tramite80102Store} store - El store que contiene el estado del trámite 80102.
   */
  constructor(protected override store: Tramite80102Store) {
    super(store);
  }
}
