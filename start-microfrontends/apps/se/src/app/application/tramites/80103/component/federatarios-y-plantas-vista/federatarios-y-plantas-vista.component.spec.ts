import { of } from "rxjs";
import { ComplimentosService } from "../../../../shared/services/complimentos.service";
import { FederatariosYPlantasVistaComponent } from "../../../80103/component/federatarios-y-plantas-vista/federatarios-y-plantas-vista.component";
import { Tramite80101Query } from "../../estados/tramite80101.query";
import { Tramite80101Store } from "../../estados/tramite80101.store";
import { FEDERATARIOS, FederatariosEncabezado, PLANTAS_DIPONIBLES, PLANTAS_IMMEX, PlantasImmex } from "../../../../shared/models/federatarios-y-plantas.model";
import { ComplementarPlantaState, ComplementoDePlanta, MontoDeInversion } from "../../../../shared/constantes/complementar-planta.enum";
import { Directos } from "../../../../shared/constantes/empleados.enum";
import { CapacidadInstalada } from "../../../../shared/constantes/capacidad-instalada.enum";


describe('FederatariosYPlantasVistaComponent', () => {
  let component: FederatariosYPlantasVistaComponent;
  let store: Tramite80101Store;
  let query: Tramite80101Query;
  let complimentoSvc: ComplimentosService;

  beforeEach(() => {
    store = {
      setFederatarios: jest.fn(),
      setPlantasDisponiblesTablaLista: jest.fn(),
      setPlantasImmexTablaLista: jest.fn(),
      setComplementarPlantaDatos: jest.fn(),
      setFirmantesDatos: jest.fn(),
      setMontosInversionDatos: jest.fn(),
      setEmpleadosDatos: jest.fn(),
      setFederatariosCatalogo: jest.fn(),
      setCapacidadInstaladaTableLista: jest.fn(),
    } as any;

    query = {
      selectDatosFederatarios$: of([]),
      selectDatosPlantasDisponibles$: of([]),
      selectDatosPlantasImmex$: of([]),
      selectDatosFederatariosFormulario$: of({ estadoDos: 'CDMX' }),
    } as any;

    complimentoSvc = {
      getPlantasDisponibles: jest.fn().mockReturnValue(of({ datos: [{ id: 1 }] })),
      mapApiResponseToPlantasDisponibles: jest.fn().mockReturnValue([{ id: 1 }]),
    } as any;

    component = new FederatariosYPlantasVistaComponent(store, query, complimentoSvc);
  });

  it('should initialize federatariosTablaConfiguracion correctly', () => {
    expect(component.federatariosTablaConfiguracion.TablaSeleccion).toBeDefined();
    expect(component.federatariosTablaConfiguracion.TablaEncabezado).toBe(FEDERATARIOS);
  });

  it('should initialize plantasDisponiblesTablaConfiguracion correctly', () => {
    expect(component.plantasDisponiblesTablaConfiguracion.TablaSeleccion).toBeDefined();
    expect(component.plantasDisponiblesTablaConfiguracion.TablaEncabezado).toBe(PLANTAS_DIPONIBLES);
  });

  it('should initialize plantasImmexTablaConfiguracion correctly', () => {
    expect(component.plantasImmexTablaConfiguracion.TablaSeleccion).toBeDefined();
    expect(component.plantasImmexTablaConfiguracion.TablaEncabezado).toBe(PLANTAS_IMMEX);
  });

  it('should call store.setFederatarios on setFormaDatos', () => {
    const datos = { estadoDos: 'CDMX' } as FederatariosEncabezado;
    component.setFormaDatos(datos);
    expect(store.setFederatarios).toHaveBeenCalledWith(datos);
  });

  it('should call store.setPlantasDisponiblesTablaLista on setPlantasDisponiblesDatos with valid response', () => {
    component.estadoValor = 'CDMX';
    component.setPlantasDisponiblesDatos();
    expect(complimentoSvc.getPlantasDisponibles).toHaveBeenCalled();
    expect(store.setPlantasDisponiblesTablaLista).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('should handle error in setPlantasDisponiblesDatos', () => {
    complimentoSvc.getPlantasDisponibles = jest.fn().mockReturnValue(of({}));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.estadoValor = 'CDMX';
    component.setPlantasDisponiblesDatos();
    spy.mockRestore();
  });

  it('should call store.setPlantasImmexTablaLista on setPlantasImmexDatos', () => {
    const datos = [{ 
        planta: 'Planta 1',
        calle: 'Calle 1',
        numeroExterior: '123',
        numeroInterior: '456',
        codigoPostal: '12345',
        localidad: 'Localidad 1',
        colonia: 'Colonia 1',
        delegacionMunicipio: 'Delegación 1',
        entidadFederativa: 'Entidad 1',
        pais: 'México',
        registroFederalDeContribuyentes: 'RFC123',
        domicilioDelSolicitante: 'Domicilio 1',
        razonSocial: 'Razón Social 1',
     }] as PlantasImmex[];
    component.setPlantasImmexDatos(datos);
    expect(store.setPlantasImmexTablaLista).toHaveBeenCalledWith(datos);
  });

  it('should call store.setComplementarPlantaDatos on setComplementarPlantaList', () => {
    const datos = [{ 
        PLANTA: 'Planta 1',
        PERMANECERA_MERCANCIA_PROGRAMA: 'Sí',
        TIPO_DOCUMENTO: 'Tipo 1',
        FECHA_DE_FIRMA: '2022-01-01',
        FECHA_DE_FIN_DE_VIGENCIA: '2022-12-31',
        DOCUMENTO_RESPALDO: 'Documento 1',
        FECHA_DE_FIRMA_DOCUMENTO: '2022-01-01',
        FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO: '2022-12-31',
     }] as ComplementoDePlanta[];
    component.setComplementarPlantaList(datos);
    expect(store.setComplementarPlantaDatos).toHaveBeenCalledWith(datos);
  });

  it('should call store.setFirmantesDatos on setFirmantesList', () => {
    const datos = [{ 
        rfcFirmante: 'RFC123',
  nombreRazonFirmante: 'Razón Social 1',
  tipoFirmante: 'Tipo 1',
     }] as ComplementarPlantaState[];
    component.setFirmantesList(datos);
    expect(store.setFirmantesDatos).toHaveBeenCalledWith(datos);
  });

  it('should call store.setMontosInversionDatos on setMontosInversionList', () => {
    const datos = [{ 
        PLANTA: 'Planta 1',
        TIPO: 'Tipo 1',
        CANTIDAD: '10',
        DESCRIPCION: 'Descripción 1',
        MONTO: '1000',
     }] as MontoDeInversion[];
    component.setMontosInversionList(datos);
    expect(store.setMontosInversionDatos).toHaveBeenCalledWith(datos);
  });

  it('should call store.setEmpleadosDatos on setEmpleadosList', () => {
    const datos = [{ 
        PLANTA: 'Planta 1',
        TOTAL: '100',
        DIRECTOS: '50',
        CEDULA_DE_CUOTAS: '12345',
        FECHA_DE_CEDULA: '2022-01-01',
        INDIRECTOS: '50',
        CONTRATO: 'Contrato 1',
        OBJETO_DEL_CONTRATO_DEL_SERVICIO: 'Servicio 1',
        FECHA_FIRMA: '2022-01-01',
        FECHA_FIN_VIGENCIA: '2022-12-31',
        RFC: 'RFC123',
        RAZON_SOCIAL: 'Razón Social 1',
     }] as Directos[];
    component.setEmpleadosList(datos);
    expect(store.setEmpleadosDatos).toHaveBeenCalledWith(datos);
  });

  it('should set estadoValor and call store.setFederatariosCatalogo on setDatosFederatarios', () => {
    const datos = { estadoDos: 'JALISCO' } as FederatariosEncabezado;
    component.setDatosFederatarios(datos);
    expect(component.estadoValor).toBe('JALISCO');
    expect(store.setFederatariosCatalogo).toHaveBeenCalledWith(datos);
  });

  it('should call store.setCapacidadInstaladaTableLista on obtenerCapacidadInstaladaTablaList', () => {
    const datos = [{ 
        PLANTA: 'cgdvgds vcgds',
        FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: '1234',
        UMT: 'kg',
        DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: 'Producto 1',
        TURNOS: '2',
        HORAS_POR_TURNO: '8',
        CANTIDAD_EMPLEADOS: '10',
        CANTIDAD_MAQUINARIA: '5',
        DESCRIPCION_MAQUINARIA: 'Maquinaria 1',
        CAPACIDAD_INSTALADA_MENSUAL: '1000',
        CAPACIDAD_INSTALADA_ANUAL: '12000',
        CAPACIDAD_EFECTIVAMENTE_UTILIZADA: '800',
        CALCULO_CAPACIDAD_INSTALADA: '80%',
     }] as CapacidadInstalada[];
    component.obtenerCapacidadInstaladaTablaList(datos);
    expect(store.setCapacidadInstaladaTableLista).toHaveBeenCalledWith(datos);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should initialize observables and datosFederatarios on ngOnInit', () => {
    component.ngOnInit();
    expect(component.federatariosTablaLista$).toBeDefined();
    expect(component.plantasDisponiblesTablaLista$).toBeDefined();
    expect(component.plantasImmexTablaLista$).toBeDefined();
    expect(component.datosFederatarios.estadoDos).toBe('CDMX');
  });
});