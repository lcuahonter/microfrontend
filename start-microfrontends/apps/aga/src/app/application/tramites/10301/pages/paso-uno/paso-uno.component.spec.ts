import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let solicitud10301ServiceMock: any;
  let consultaQueryMock: any;
  let tramite10301StoreMock: any;

  beforeEach(() => {
    solicitud10301ServiceMock = {
      getDatosDeTrtamitelDoc: jest.fn().mockReturnValue(of({ 
        success: true,
        datos: {
          manifesto: 'test-manifesto',
          aduana: 'test-aduana',
          nombre: 'test-nombre',
          tipoMercancia: 'test-tipo',
          usoEspecifico: 'test-uso',
          marca: 'test-marca',
          modelo: 'test-modelo',
          serie: 'test-serie',
          calle: 'test-calle',
          numeroExterior: '123',
          numeroInterior: '456',
          telefono: '1234567890',
          correoElectronico: 'test@test.com',
          codigoPostal: '12345',
          estado: 'test-estado',
          colonia: 'test-colonia',
          opcion: 'test-opcion'
        }
      })),
      actualizarEstadoFormulario: jest.fn()
    };
    consultaQueryMock = {
      selectConsultaioState$: of({ update: true })
    };
    tramite10301StoreMock = {
      setManifesto: jest.fn(),
      setAduana: jest.fn(),
      setNombre: jest.fn(),
      setTipoMercancia: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setMarca: jest.fn(),
      setModelo: jest.fn(),
      setSerie: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setColonia: jest.fn(),
      setOpcion: jest.fn()
    };

    component = new PasoUnoComponent(solicitud10301ServiceMock, consultaQueryMock, tramite10301StoreMock);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = {
      update: true
    } as any;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    component = new PasoUnoComponent(solicitud10301ServiceMock, consultaQueryMock, tramite10301StoreMock);
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call getDatosDeTrtamitelDoc and update store when guardarDatosFormulario is called', () => {
    component.guardarDatosFormulario();
    
    expect(solicitud10301ServiceMock.getDatosDeTrtamitelDoc).toHaveBeenCalled();
    expect(tramite10301StoreMock.setManifesto).toHaveBeenCalledWith('test-manifesto');
    expect(tramite10301StoreMock.setNombre).toHaveBeenCalledWith('test-nombre');
    expect(tramite10301StoreMock.setTipoMercancia).toHaveBeenCalledWith('test-tipo');
  });

  it('should change indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize tipoPersona, persona, domicilioFiscal with default values', () => {
    expect(component.tipoPersona).toBeUndefined();
    expect(Array.isArray(component.persona)).toBe(true);
    expect(Array.isArray(component.domicilioFiscal)).toBe(true);
  });

  it('should set consultaState on subscription', () => {
    component.consultaState = undefined as any;
    component.ngOnInit();
    expect(component.consultaState).toBeDefined();
  });
});