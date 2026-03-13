import { Tramite80101State, Tramite80101Store } from './tramite80101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
/**
 * Clase que extiende de Query para manejar el estado de Tramite80101.
 */
export class Tramite80101Query extends Query<Tramite80101State> {

   /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona los datos de los fedatarios del estado.
   */
  selectEstadosOpciones$ = this.select(
    (state) => state.estadosOpciones
  );

  /**
   * Selecciona la información de registro del estado.
   */
  selectInfoRegistro$ = this.select((state) => state.infoRegistro);

  /**
   * Selecciona los servicios del estado.
   */
  selectServicios$ = this.select((state) => state.servicios);

  /**
   * Selecciona las empresas del estado.
   */
  selectEmpresas$ = this.select((state) => state.empresas);

  /**
   * Selecciona la aduana de ingreso del estado.
   */
  selectAduanaDeIngreso$ = this.select((state) => state.aduanaDeIngreso);

  /**
   * Selecciona los datos IMMEX del estado.
   */
  selectDatosImmex$ = this.select((state) => state.datosImmex);

  /**
   * Selecciona los datos generales del estado.
   */
  selectDatos$ = this.select((state) => state.datos);

  /**
   * Selecciona la aduana de ingreso seleccionada del estado.
   */
  selectAduanaDeIngresoSelecion$ = this.select(
    (state) => state.aduanaDeIngresoSelecion
  );

  /**
   * Verifica si el formulario es válido basado en el estado.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every((value) => value === true);
  });

  /**
   * Selecciona los países de origen del estado.
   */
  selectPaisesOrigen$ = this.select((state) => state.paisesOrigen);

  /**
   * Selecciona el RFC de la empresa del estado.
   */
  selectRfcEmpresa$ = this.select((state) => state.rfcEmpresa);

  /**
   * Selecciona el número de programa del estado.
   */
  selectNumeroPrograma$ = this.select((state) => state.numeroPrograma);

  /**
   * Selecciona el tiempo del programa del estado.
   */
  selectTiempoPrograma$ = this.select((state) => state.tiempoPrograma);

  /**
   * Selecciona los datos de la empresa extranjera y los mapea con el nombre de la entidad federativa.
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
   * Selecciona los datos de cumplimientos del estado.
   */
  selectDatosComplimento$ = this.select((state) => state.datosComplimentos);

  /**
   * Selecciona los datos del subcontratista del estado.
   */
  datosSubcontratistaEstado$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.datosSubcontratista;
  });

  /**
   * Selecciona las plantas subfabricantes para agregar del estado.
   */
  plantasSubfabricantesAgregar$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.plantasSubfabricantesAgregar;
  });

  /**
   * Selecciona las plantas buscadas del estado.
   */
  plantasBuscadas$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.plantasBuscadas;
  });

  /**
   * Selecciona las plantas por completar del estado.
   */
  plantasPorCompletar$ = this.select((state) => {
    return state.empressaSubFabricantePlantas.plantasPorCompletar;
  });

  /**
   * Selecciona la lista de la tabla del Anexo Dos del estado.
   */
  anexoDosTableLista$ = this.select((state) => {
    return state.annexoDosTres.anexoDosTablaLista;
  });

  /**
   * Selecciona la lista de la tabla del Anexo Tres del estado.
   */
  anexoTresTablaLista$ = this.select((state) => {
    return state.annexoDosTres.anexoTresTablaLista;
  });

  /**
   * Selecciona el índice previo de la ruta del estado.
   */
  indicePrevioRuta$ = this.select((state) => {
    return state.indicePrevioRuta;
  });

  /**
   * Selecciona los datos de la tabla de cumplimientos del estado.
   */
  selectTablaDatosComplimentos$ = this.select(
    (state) => state.tablaDatosComplimentos
  );

  /**
   * Selecciona los datos de la tabla de cumplimientos extranjeros del estado.
   */
  selectTablaDatosComplimentosExtranjera$ = this.select(
    (state) => state.tablaDatosComplimentosExtranjera
  );

  /**
   * Selecciona los datos para importar en la tabla del Anexo Uno del estado.
   */
  selectImportarTablsDatos$ = this.select(
    (state) => state.annexoUno.importarDatosTabla
  );

  /**
   * Selecciona los datos para exportar en la tabla del Anexo Uno del estado.
   */
  selectExportarTablsDatos$ = this.select(
    (state) => state.annexoUno.exportarDatosTabla
  );

  /**
   * Selecciona los datos de las plantas disponibles del estado.
   */

  selectDatosFederatariosFormulario$ = this.select(
    (state) => state.datosFederatarios
  );

  /**
   * Selecciona los datos para navegar en el Anexo Uno del estado.
   */
  selectDatosParaNavegar$ = this.select(
    (state) => state.annexoUno.datosParaNavegar
  );

  /**
   * Selecciona los datos de los fedatarios del estado.
   */
  selectDatosFederatarios$ = this.select(
    (state) => state.tablaDatosFederatarios
  );

  /**
   * Selecciona los datos de los fedatarios para el formulario del estado.
   */
  selectDatosPlantasImmex$ = this.select((state) => {
    return state.plantasImmexTablaLista;
  });

  /** 
   * Selecciona los datos de las plantas disponibles del estado.
   */
  selectDatosPlantasDisponibles$ = this.select((state) => {
    return state.plantasDisponiblesTablaLista;
  });

  /**
  * Observable selector for retrieving the entire state.
  */
  allStoreData$ = this.select((state) => state);

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
   * Constructor de la clase Tramite80101Query.
   * @param store - El store que contiene el estado de Tramite80101.
   */
  constructor(protected override store: Tramite80101Store) {
    super(store);
  }
}

