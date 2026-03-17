import { FormBuilder, FormGroup } from "@angular/forms";
import { AgenteAduanalComponent } from './agente-aduanal.component';

describe('AgenteAduanalComponent', () => {
  let component: AgenteAduanalComponent;
  let esquemaDeCertificacionSvc: any;
  let tramite32612Store: any;
  let tramite32612Query: any;
  let fb: FormBuilder;
  let tramiteStore: any;
  let tramiteQuery: any;
  let consultaioQuery: any;

  beforeEach(() => {
    esquemaDeCertificacionSvc = {
      getIndiqueCatalogo: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb: any) => cb.next({ data: [{ id: 1, nombre: 'Test' }] }))
      })
    };
    tramite32612Store = { setDynamicFieldValue: jest.fn() };
    tramite32612Query = { selectSolicitude$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    tramiteStore = { setNumeroPatente: jest.fn(), setNumeroRegistro: jest.fn() };
    tramiteQuery = { selectSolicitudeDos$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    consultaioQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }
    };
    fb = new FormBuilder();

    component = new AgenteAduanalComponent(
      esquemaDeCertificacionSvc,
      tramite32612Store,
      tramite32612Query,
      fb,
      tramiteStore,
      tramiteQuery,
      consultaioQuery
    );
    component.solicitudeDosState = {
      numeroPatente: '123',
      numeroRegistro: '456',
      nombreAgenteAduanal: 'Agente',
      numeroTrabajadoresIMSS: 10,
      numeroTrabajadoresContratistas: 5,
      serviciosAdicionales: 'Servicio',
      indique: 'Indique'
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize indiqueCatalogo on getIndiqueCatalogoDatos', () => {
    component.getIndiqueCatalogoDatos();
    expect(component.indiqueCatalogo).toEqual([{ id: 1, nombre: 'Test' }]);
  });

  it('should create agente form with correct values', () => {
    component.crearAgenteForm();
    expect(component.formaAgente.value.numeroPatente).toBe('123');
    expect(component.formaAgente.value.numeroRegistro).toBe('456');
    expect(component.formaAgente.value.nombreAgenteAduanal).toBe('Agente');
  });

  it('should call setDynamicFieldValue on emitirCambioDeValor', () => {
    component.emitirCambioDeValor({ campo: 'testCampo', valor: 'testValor' });
    expect(tramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should call tramiteStore method in setValoresStore', () => {
    component.formaAgente = fb.group({ test: ['value'] });
    component.setValoresStore(component.formaAgente, 'test', 'setNumeroPatente');
    expect(tramiteStore.setNumeroPatente).toHaveBeenCalledWith('value');
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.crearAgenteForm();
    component.guardarDatosFormulario();
    expect(component.formaAgente.disabled).toBe(true);
  });

  it('should enable form when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.crearAgenteForm();
    component.guardarDatosFormulario();
    expect(component.formaAgente.enabled).toBe(true);
  });

  it('should update comercialCertificadoDatos in seleccionarDatos', () => {
    component.comercialCertificadoDatos = [{ campo: 'pagina', mostrar: false } as any];
    component.forma = fb.group({
      comercialCertificadoFormGroup: fb.group({ paginaElectronica: ['Si'] })
    });
    component.seleccionarDatos([{ campo: 'pagina', control: 'paginaElectronica' }]);
    expect(component.comercialCertificadoDatos[0].mostrar).toBe(true);
  });

  it('should update clasificacionDatos in seleccionarDatos', () => {
    component.clasificacionDatos = [{ campo: 'proporcionada', mostrar: false } as any];
    component.forma = fb.group({
      clasificacionFormGroup: fb.group({ proporcionada: ['Si'] })
    });
    component.seleccionarDatos([{ campo: 'proporcionada', control: 'proporcionada' }]);
    expect(component.clasificacionDatos[0].mostrar).toBe(true);
  });

  it('should call agregar and quitar on crossList buttons', () => {
    const agregarMock = jest.fn();
    const quitarMock = jest.fn();
    component.crossList = {
      toArray: () => [{ agregar: agregarMock, quitar: quitarMock }]
    } as any;
    component.aduanasEntradaBotons[0].funcion();
    expect(agregarMock).toHaveBeenCalledWith('');
    component.aduanasEntradaBotons[1].funcion();
    expect(agregarMock).toHaveBeenCalledWith('t');
    component.aduanasEntradaBotons[2].funcion();
    expect(quitarMock).toHaveBeenCalledWith('');
    component.aduanasEntradaBotons[3].funcion();
    expect(quitarMock).toHaveBeenCalledWith('t');
  });

  it('should return pagoDeDerechosFormGroup from forma', () => {
  const pagoDeDerechosFormGroup = component.forma.get('pagoDeDerechosFormGroup');
  expect(component.pagoDeDerechosFormGroup).toBe(pagoDeDerechosFormGroup);
  expect(component.pagoDeDerechosFormGroup).toBeInstanceOf(FormGroup);
});

it('should allow setting and getting values in pagoDeDerechosFormGroup', () => {
  (component.forma.get('pagoDeDerechosFormGroup') as FormGroup)?.addControl('testField', fb.control('testValue'));
  expect(component.pagoDeDerechosFormGroup.get('testField')?.value).toBe('testValue');
});

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});