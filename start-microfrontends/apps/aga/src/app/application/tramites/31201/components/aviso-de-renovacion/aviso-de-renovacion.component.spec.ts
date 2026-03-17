import { TestBed } from '@angular/core/testing';
import { AvisoDeRenovacionComponent } from './aviso-de-renovacion.component';
import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { UnicoQuery } from '../../estados/queries/unico.query';
import { UnicoStore } from '../../estados/renovacion.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('AvisoDeRenovacionComponent', () => {
  let component: AvisoDeRenovacionComponent;
  let serviceMock: any;
  let storeMock: any;
  let queryMock: any;
  let consultaioQueryMock: any;

  beforeEach(() => {
    serviceMock = {
      obtenerDatosLocalidad: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Localidad A' }])),
      getSolicitante: jest.fn().mockReturnValue(of({
        claveReferencia: 'ABC123',
        cadenaDependencia: 'CAD123',
        importePago: '1000.00'
      })),
      obtenerRadio: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Física' }]))
    };

    storeMock = {
      setfechaPago: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({
        modalidad: 'online',
        protestaVerdad: true,
        envioAviso: false,
        numeroAviso: '123456',
        numeroOperacion: 'OP789',
        banco: 'Bank A',
        llavePago: 'LLAVE123',
        fechaPago: '2024-10-10'
      })
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false
      })
    };

    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: AvisoUnicoService, useValue: serviceMock },
        { provide: UnicoStore, useValue: storeMock },
        { provide: UnicoQuery, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    });

    const fb = TestBed.inject(FormBuilder);
    const service = TestBed.inject(AvisoUnicoService);
    const store = TestBed.inject(UnicoStore);
    const query = TestBed.inject(UnicoQuery);
    const consultaioQuery = TestBed.inject(ConsultaioQuery);

    component = new AvisoDeRenovacionComponent(fb, service, store, query, consultaioQuery);
  });

  it('should initialize and set up form and states', () => {
    component.ngOnInit();

    expect(component.avisoForm).toBeDefined();
    expect(serviceMock.obtenerDatosLocalidad).toHaveBeenCalled();
    expect(serviceMock.obtenerRadio).toHaveBeenCalled();
    expect(serviceMock.getSolicitante).toHaveBeenCalled();
  });

  it('should patch form with solicitante data', () => {
    component.ngOnInit();
    expect(component.avisoForm.get('claveReferencia')?.value).toBe('ABC123');
    expect(component.avisoForm.get('cadenaDependencia')?.value).toBe('CAD123');
    expect(component.avisoForm.get('importePago')?.value).toBe('1000.00');
  });

  it('should set localidadList correctly', () => {
    component.ngOnInit();
    expect(component.localidadList).toEqual([{ id: 1, nombre: 'Localidad A' }]);
  });

  it('should update fechaPago on date change', () => {
    component.ngOnInit();
    component.onFechaCambiada('2025-01-01');
    expect(component.avisoForm.get('fechaPago')?.value).toBe('2025-01-01');
    expect(storeMock.setfechaPago).toHaveBeenCalledWith('2025-01-01');
  });

  it('should reset payment related fields', () => {
    component.ngOnInit();
    component.resetPagoDatos();
    expect(component.avisoForm.get('numeroOperacion')?.value).toBe('');
    expect(component.avisoForm.get('banco')?.value).toBe('');
    expect(component.avisoForm.get('llavePago')?.value).toBe('');
    expect(component.avisoForm.get('fechaPago')?.value).toBe('');
  });

  it('should set store values using setValoresStore', () => {
    const mockStoreFn = jest.fn();
    storeMock.setSomeValue = mockStoreFn;
    component.ngOnInit();
    component.avisoForm.get('banco')?.setValue('TestBank');
    component.setValoresStore(component.avisoForm, 'banco', 'setSomeValue' as any);
    expect(mockStoreFn).toHaveBeenCalledWith('TestBank');
  });

  it('should complete destroyed$ on destroy', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
