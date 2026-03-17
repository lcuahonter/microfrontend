import { DatosRepLegalDonatarioComponent } from './datos-rep-legal-donatario.component';
import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';

describe('DatosRepLegalDonatarioComponent', () => {
  let component: DatosRepLegalDonatarioComponent;
  let mockDonacionesExtranjerasService: any;
  let mockTramite10303Store: any;
  let mockTramite10303Query: any;
  let mockToastr: any;

  beforeEach(() => {
    mockDonacionesExtranjerasService = {
      getPaises: jest.fn().mockReturnValue(of({ data: [] })),
      buscarContribuyente: jest.fn().mockReturnValue(of({}))
    };
    mockTramite10303Store = {
      setCvePaisRepLegalDonatario: jest.fn()
    };
    mockTramite10303Query = {
      selectSeccionState$: of({ rfcRepLegalDonatario: 'XYZ123', nombreRepLegalDonatario: 'Jane Doe' })
    };
    mockToastr = {
      error: jest.fn(),
      success: jest.fn()
    };

    component = new DatosRepLegalDonatarioComponent(
      mockDonacionesExtranjerasService,
      new FormBuilder(),
      mockTramite10303Store,
      mockTramite10303Query,
      mockToastr
    );

    component.datosRepLegalDonatarioForm = new FormBuilder().group({
      rfcRepLegalDonatario: [''],
      nombreRepLegalDonatario: [''],
      calleRepLegalDonatario: [''],
      numExteriorRepLegalDonatario: [''],
      numInteriorRepLegalDonatario: [''],
      cvePaisRepLegalDonatario: [''],
      codigoPostalRepLegalDonatario: [''],
      estadoRepLegalDonatario: [''],
      coloniaRepLegalDonatario: [''],
      correoElectronicoRepLegalDonatario: [''],
      telefonoRepLegalDonatario: ['']
    });

    (component as any).destruirNotificador$ = new Subject();
  });

  it('should create the form on initialization', () => {
    component.ngOnInit();
    expect(component.datosRepLegalDonatarioForm).toBeDefined();
  });

  it('should initialize catalogues', () => {
    mockDonacionesExtranjerasService.getPaises.mockReturnValue(of({ data: [{ id: 1, nombre: 'India' }] }));
    component.inicializaCatalogos();
    expect(mockDonacionesExtranjerasService.getPaises).toHaveBeenCalled();
  });

  it('should set the selected country in store', () => {
    component.datosRepLegalDonatarioForm.patchValue({ cvePaisRepLegalDonatario: 'IN' });
    component.paisSeleccion();
    expect(mockTramite10303Store.setCvePaisRepLegalDonatario).toHaveBeenCalledWith('IN');
  });

  it('should reset the form', () => {
    const RESET_SPY = jest.spyOn(component.datosRepLegalDonatarioForm, 'reset');
    component.restablecerFormulario();
    expect(RESET_SPY).toHaveBeenCalled();
  });

  it('should fetch contributor and update the form', () => {
    const MOCK_DATA = { data: [{ rfc: 'XYZ123', nombre: 'Jane', apellidoPaterno: 'Doe', apellidoMaterno: '', calle: 'Park Avenue', numeroExterior: '10' }] };
    mockDonacionesExtranjerasService.buscarContribuyente.mockReturnValue(of(MOCK_DATA));

    component.buscarContribuyenteRfc(2, 'XYZ123');
    expect(mockDonacionesExtranjerasService.buscarContribuyente).toHaveBeenCalledWith('XYZ123');
  });

  it('should handle contributor not found scenario', () => {
    component.ngOnInit();
    mockDonacionesExtranjerasService.buscarContribuyente.mockReturnValue(of({ data: [null] }));
    component.buscarContribuyenteRfc(1, 'XYZ123');
    expect(mockToastr.error).toHaveBeenCalledWith('Valor erronio');
  });

  it('should call all store setters when a contributor is found', () => {
    mockTramite10303Store.setNombreRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCalleRepLegalDonatario = jest.fn();
    mockTramite10303Store.setNumExteriorRepLegalDonatario = jest.fn();
    mockTramite10303Store.setNumInteriorRepLegalDonatario = jest.fn();
    mockTramite10303Store.setEstadoRepLegalDonatario = jest.fn();
    mockTramite10303Store.setColoniaRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCodigoPostalRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCvePaisRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCorreoElectronicoRepLegalDonatario = jest.fn();
    mockTramite10303Store.setTelefonoRepLegalDonatario = jest.fn();

    const MOCK_CONTRIBUYENTE = {
      rfc: 'XYZ123',
      razonSocial: 'ABC Corp',
      nombre: 'Jane',
      apellidoPaterno: 'Doe',
      apellidoMaterno: '',
      calle: 'Park Avenue',
      numeroExterior: '10',
      numeroInterior: '2A',
      estado: 'Tamil Nadu',
      colonia: 'Downtown',
      codigoPostal: '123456',
      pais: 'India',
      correoElectronico: 'jane.doe@example.com',
      telefono: '9876543210'
    };

    component.construirRLdonatario(MOCK_CONTRIBUYENTE, true);

    expect(mockTramite10303Store.setNombreRepLegalDonatario).toHaveBeenCalledWith('Jane Doe ');
    expect(mockTramite10303Store.setCalleRepLegalDonatario).toHaveBeenCalledWith('Park Avenue');
    expect(mockTramite10303Store.setNumExteriorRepLegalDonatario).toHaveBeenCalledWith('10');
    expect(mockTramite10303Store.setNumInteriorRepLegalDonatario).toHaveBeenCalledWith('2A');
    expect(mockTramite10303Store.setEstadoRepLegalDonatario).toHaveBeenCalledWith('Tamil Nadu');
    expect(mockTramite10303Store.setColoniaRepLegalDonatario).toHaveBeenCalledWith('Downtown');
    expect(mockTramite10303Store.setCodigoPostalRepLegalDonatario).toHaveBeenCalledWith('123456');
    expect(mockTramite10303Store.setCvePaisRepLegalDonatario).toHaveBeenCalledWith('India');
    expect(mockTramite10303Store.setCorreoElectronicoRepLegalDonatario).toHaveBeenCalledWith('jane.doe@example.com');
    expect(mockTramite10303Store.setTelefonoRepLegalDonatario).toHaveBeenCalledWith('9876543210');
  });

  it('should not call store setters if contributor is not found', () => {
    mockTramite10303Store.setNombreRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCalleRepLegalDonatario = jest.fn();
    mockTramite10303Store.setNumExteriorRepLegalDonatario = jest.fn();
    mockTramite10303Store.setNumInteriorRepLegalDonatario = jest.fn();
    mockTramite10303Store.setEstadoRepLegalDonatario = jest.fn();
    mockTramite10303Store.setColoniaRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCodigoPostalRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCvePaisRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCorreoElectronicoRepLegalDonatario = jest.fn();
    mockTramite10303Store.setTelefonoRepLegalDonatario = jest.fn();

    const RESET_SPY = jest.spyOn(component.datosRepLegalDonatarioForm, 'reset');
    component.construirRLdonatario(null as any, false);

    expect(RESET_SPY).toHaveBeenCalled();
    expect(mockTramite10303Store.setNombreRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setCalleRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setNumExteriorRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setNumInteriorRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setEstadoRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setColoniaRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setCodigoPostalRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setCvePaisRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setCorreoElectronicoRepLegalDonatario).not.toHaveBeenCalled();
    expect(mockTramite10303Store.setTelefonoRepLegalDonatario).not.toHaveBeenCalled();
  });

  it('should use razonSocial if RFC length is 12', () => {
    mockTramite10303Store.setNombreRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCalleRepLegalDonatario = jest.fn();
    mockTramite10303Store.setNumExteriorRepLegalDonatario = jest.fn();
    mockTramite10303Store.setNumInteriorRepLegalDonatario = jest.fn();
    mockTramite10303Store.setEstadoRepLegalDonatario = jest.fn();
    mockTramite10303Store.setColoniaRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCodigoPostalRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCvePaisRepLegalDonatario = jest.fn();
    mockTramite10303Store.setCorreoElectronicoRepLegalDonatario = jest.fn();
    mockTramite10303Store.setTelefonoRepLegalDonatario = jest.fn();

    const MOCK_CONTRIBUYENTE = {
      rfc: 'RFC123456789',
      razonSocial: 'Empresa S.A.',
      nombre: 'Nombre',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
      calle: 'Calle',
      numeroExterior: '1',
      numeroInterior: '2',
      estado: 'Estado',
      colonia: 'Colonia',
      codigoPostal: '00000',
      pais: 'MX',
      correoElectronico: 'correo@empresa.com',
      telefono: '5555555555'
    };

    component.construirRLdonatario(MOCK_CONTRIBUYENTE, true);

    expect(mockTramite10303Store.setNombreRepLegalDonatario).toHaveBeenCalledWith('Empresa S.A.');
  });

  it('should call setValoresStore with correct arguments', () => {
    mockTramite10303Store.setNombreRepLegalDonatario = jest.fn();
    component.datosRepLegalDonatarioForm.patchValue({ nombreRepLegalDonatario: 'Test Name' });
    component.setValoresStore(component.datosRepLegalDonatarioForm, 'nombreRepLegalDonatario', 'setNombreRepLegalDonatario');
    expect(mockTramite10303Store.setNombreRepLegalDonatario).toHaveBeenCalledWith('Test Name');
  });

  it('should not throw if setValoresStore is called with a non-existing field', () => {
    mockTramite10303Store.setNombreRepLegalDonatario = jest.fn();
    expect(() => {
      component.setValoresStore(component.datosRepLegalDonatarioForm, 'nonExistingField', 'setNombreRepLegalDonatario');
    }).not.toThrow();
  });

  it('should reset form if contributor is not found', () => {
    const RESET_SPY = jest.spyOn(component.datosRepLegalDonatarioForm, 'reset');
    component.construirRLdonatario(null as any, false);
    expect(RESET_SPY).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const DESTROY_SPY = jest.spyOn((component as any).destruirNotificador$, 'next');
    const COMPLETE_SPY = jest.spyOn((component as any).destruirNotificador$, 'complete');

    component.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});