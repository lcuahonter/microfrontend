import { DatosRepLegalRecibirDonacionComponent } from './datos-rep-legal-recibir-donacion.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('DatosRepLegalRecibirDonacionComponent', () => {
  let component: DatosRepLegalRecibirDonacionComponent;
  let mockDonacionesExtranjerasService: any;
  let mockTramite10303Store: any;
  let mockTramite10303Query: any;
  let mockToastr: any;

  beforeEach(() => {
    mockDonacionesExtranjerasService = {
      getPaises: jest.fn().mockReturnValue(of({ data: [] })),
      buscarContribuyente: jest.fn(),
    };
    mockTramite10303Store = {
      setCvePaisRepLegalAutorizado: jest.fn(),
      setNombreRepLegalAutorizado: jest.fn(),
      setCalleRepLegalAutorizado: jest.fn(),
      setNumExteriorRepLegalAutorizado: jest.fn(),
      setNumInteriorRepLegalAutorizado: jest.fn(),
      setEstadoRepLegalAutorizado: jest.fn(),
      setColoniaRepLegalAutorizado: jest.fn(),
      setCodigoPostalRepLegalAutorizado: jest.fn(),
      setCorreoElectronicoRepLegalAutorizado: jest.fn(),
      setTelefonoRepLegalAutorizado: jest.fn()
    };
    mockTramite10303Query = {
      selectSeccionState$: of({
        rfcRepLegalAutorizado: 'ABC123',
        nombreRepLegalAutorizado: 'Jane Smith',
      }),
    };
    mockToastr = {
      error: jest.fn().mockReturnValue(
        of(new Error('Valor erronio'))
      )
    };

    component = new DatosRepLegalRecibirDonacionComponent(
      mockDonacionesExtranjerasService,
      new FormBuilder(),
      mockTramite10303Store,
      mockTramite10303Query,
      mockToastr
    );
  });

  it('should create the form during initialization', () => {
    component.ngOnInit();
    expect(component.datosRepLegalRecibirDonacionForm).toBeDefined();
  });

  it('should initialize catalogs', () => {
    mockDonacionesExtranjerasService.getPaises.mockReturnValue(
      of({ data: [{ id: 1, nombre: 'India' }] })
    );
    component.inicializaCatalogos();
    expect(mockDonacionesExtranjerasService.getPaises).toHaveBeenCalled();
  });

  it('should set the selected country in the store', () => {
    component.datosRepLegalRecibirDonacionForm = new FormBuilder().group({
      cvePaisRepLegalAutorizado: ['IN'],
    });
    component.paisSeleccion();
    expect(
      mockTramite10303Store.setCvePaisRepLegalAutorizado
    ).toHaveBeenCalledWith('IN');
  });

  it('should reset the form', () => {
    component.datosRepLegalRecibirDonacionForm = new FormBuilder().group({});
    const RESET_SPY = jest.spyOn(
      component.datosRepLegalRecibirDonacionForm,
      'reset'
    );
    component.restablecerFormulario();
    expect(RESET_SPY).toHaveBeenCalled();
  });

  it('should fetch contributor and update form when found', () => {
    const MOCK_DATA = {
      data: [
        {
          rfc: 'ABC123',
          nombre: 'Jane',
          apellidoPaterno: 'Smith',
          apellidoMaterno: '',
          calle: 'Park Street',
          numeroExterior: '10',
          estado: 'Tamil Nadu',
          colonia: 'Central',
          codigoPostal: '600001',
          pais: 'India',
          correoElectronico: 'jane.smith@example.com',
          telefono: '9876543210',
        },
      ],
    };

    mockDonacionesExtranjerasService.buscarContribuyente.mockReturnValue(
      of(MOCK_DATA)
    );

    component.buscarContribuyenteRfc(3, 'ABC123');
    expect(mockDonacionesExtranjerasService.buscarContribuyente).toHaveBeenCalledWith(
      'ABC123'
    );
  });

  it('should handle error when contributor is not found', () => {
    mockDonacionesExtranjerasService.buscarContribuyente.mockReturnValue(
      of({ data: [null] })
    );
    component.buscarContribuyenteRfc(1, 'ABC123');
    expect(mockToastr.error).toHaveBeenCalledWith('Valor erronio');
  });

  it('should patch form values when contributor is found', () => {
    component.datosRepLegalRecibirDonacionForm = new FormBuilder().group({
      rfcRepLegalAutorizado: [null],
      nombreRepLegalAutorizado: [''],
      calleRepLegalAutorizado: [''],
      numExteriorRepLegalAutorizado: [''],
      numInteriorRepLegalAutorizado: [''],
      estadoRepLegalAutorizado: [''],
      coloniaRepLegalAutorizado: [''],
      codigoPostalRepLegalAutorizado: [''],
      cvePaisRepLegalAutorizado: [''],
      correoElectronicoRepLegalAutorizado: [''],
      telefonoRepLegalAutorizado: ['']
    });

    const MOCK_CONTRIBUTOR = {
      rfc: 'ABC123',
      nombre: 'Jane',
      apellidoPaterno: 'Smith',
      apellidoMaterno: '',
      calle: 'Park Street',
      numeroExterior: '10',
      numeroInterior: '2B',
      estado: 'Test',
      colonia: 'Test',
      codigoPostal: '600001',
      pais: 'India',
      correoElectronico: 'jane.smith@example.com',
      telefono: '9876543210',
    };

    component.construirRepLegalAutorizado(MOCK_CONTRIBUTOR, true);
    expect(component.datosRepLegalRecibirDonacionForm.value).toEqual({
      rfcRepLegalAutorizado: null,
      nombreRepLegalAutorizado: 'Jane Smith ',
      calleRepLegalAutorizado: 'Park Street',
      numExteriorRepLegalAutorizado: '10',
      numInteriorRepLegalAutorizado: '2B',
      cvePaisRepLegalAutorizado: 'India',
      codigoPostalRepLegalAutorizado: '600001',
      estadoRepLegalAutorizado: 'Test',
      coloniaRepLegalAutorizado: 'Test',
      correoElectronicoRepLegalAutorizado: 'jane.smith@example.com',
      telefonoRepLegalAutorizado: '9876543210',
    });
  });

  it('should reset form if contributor is not found', () => {
    component.ngOnInit();

    const RESET_SPY = jest.spyOn(
      component.datosRepLegalRecibirDonacionForm,
      'reset'
    );
    component.construirRepLegalAutorizado(null as any, false);
    expect(RESET_SPY).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const DESTROY_SPY = jest.spyOn(
      (component as any).destruirNotificador$,
      'next'
    );
    const COMPLETE_SPY = jest.spyOn(
      (component as any).destruirNotificador$,
      'complete'
    );

    component.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});