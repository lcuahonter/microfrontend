import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PeruCertificadoService } from '../../../110205/services/peru-certificado.service';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';

describe('CertificadoOrigenComponent', () => {
  let component: CertificadoOrigenComponent;
  let fixture: ComponentFixture<CertificadoOrigenComponent>;
  let tramite110217StoreMock: any;
  let tramite110217QueryMock: any;
  let consultaioQueryMock: any;
  let peruCertificadoServiceMock: any;
  let seccionLibQueryMock: any;

  beforeEach(async () => {
    tramite110217StoreMock = {
      setFormCertificadoGenric: jest.fn(),
      setEstado: jest.fn(),
      setBloque: jest.fn(),
      setFormMercancia: jest.fn(),
      setmercanciaTabla: jest.fn(),
      setDisponsiblesDatos: jest.fn(),
      setFormValida: jest.fn(),
      setFormValidity: jest.fn()
    };

    tramite110217QueryMock = {
      formCertificado$: of({ testField: 'value' }),
      selectSolicitud$: of({
        formCertificado: { entidadFederativa: 105, bloque: 'ARG' },
        mercanciaTabla: [{ id: 1, name: 'Mercancia1' }],
        disponiblesDatos: [{ id: 2, name: 'Mercancia2' }]
      }),
      select: jest.fn().mockReturnValue(of({}))
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    peruCertificadoServiceMock = {
      obtenerEstados: jest.fn().mockReturnValue(of({ datos: [] })),
      obtenerMunicipios: jest.fn().mockReturnValue(of({ datos: [] })),
      obtenerMercancias: jest.fn().mockReturnValue(of({ datos: [] })),
    };

    seccionLibQueryMock = {
      select: jest.fn().mockReturnValue(of({})),
      selectSeccionState$: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        CertificadoOrigenComponent
      ],
      providers: [
        provideHttpClient(),
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        FormBuilder,
        { provide: Tramite110217Store, useValue: tramite110217StoreMock },
        { provide: Tramite110217Query, useValue: tramite110217QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: PeruCertificadoService, useValue: peruCertificadoServiceMock },
        { provide: SeccionLibQuery, useValue: seccionLibQueryMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoOrigenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables on ngOnInit', () => {
    component.ngOnInit();
    expect(component['certificadoState']).toBeTruthy();
    expect(component.datosTabla$.length).toBeGreaterThan(0);
    expect(component.datosTablaUno$.length).toBeGreaterThan(0);
  });

  it('should call store.setFormCertificadoGenric in setValoresStore', () => {
    const spy = jest.spyOn(tramite110217StoreMock, 'setFormCertificadoGenric');
    component.setValoresStore({
      formGroupName: 'testForm',
      campo: 'campo1',
      valor: 'valor1',
      storeStateName: 'state1'
    });
    expect(spy).toHaveBeenCalledWith({ campo1: 'valor1' });
  });

  it('should call store.setEstado when tipoEstadoSeleccion is called', () => {
    const estado = { id: 1, descripcion: 'Estado 1', clave: '1' };
    component.tipoEstadoSeleccion(estado);
    expect(tramite110217StoreMock.setEstado).toHaveBeenCalledWith(estado);
  });

  it('should call store.setBloque when tipoSeleccion is called', () => {
    const estado = { id: 1, descripcion: 'Bloque 1', clave: '1' };
    component.tipoSeleccion(estado);
    expect(tramite110217StoreMock.setBloque).toHaveBeenCalledWith('Bloque 1');
  });

  it('should call setmercanciaTabla in emitmercaniasDatos', () => {
    const spy = jest.spyOn(tramite110217StoreMock, 'setmercanciaTabla');
    const mercancia = { id: 1, nombre: 'Mercancia' } as any;
    component.emitmercaniasDatos(mercancia);
    expect(spy).toHaveBeenCalledWith([mercancia]);
  });

  it('should call store methods in setFormValida', () => {
    component.setFormValida(true);
    expect(tramite110217StoreMock.setFormValida).toHaveBeenCalledWith({ certificado: true });
    expect(tramite110217StoreMock.setFormValidity).toHaveBeenCalledWith('certificadoOrigen', true);
  });

  it('should update datosTabla$ on guardarClicado', () => {
    const evento = [{ id: 1, nombre: 'Nuevo' }] as any;
    component.guardarClicado(evento);
    expect(component.datosTabla$).toEqual(evento);
  });

  it('should validate formulario correctly', () => {
    component.certificadoDeOrigen = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarFormulario()).toBe(true);
    component.certificadoDeOrigen = { validarFormularios: jest.fn().mockReturnValue(false) } as any;
    expect(component.validarFormulario()).toBe(false);
    component.certificadoDeOrigen = undefined as any;
    expect(component.validarFormulario()).toBe(false);
  });

  it('should call store.setDisponsiblesDatos with mapped data when conseguirDisponiblesDatos is called', () => {
    const mockResponse = {
      datos: [
        {
          fraccionArancelaria: '1234',
          nombreTecnico: 'Tecnico A',
          nombreComercial: 'Comercial A',
          numeroRegistroProducto: '5678',
          fechaExpedicion: '2024-01-01',
          fechaVencimiento: '2024-12-31',
        },
      ],
    };
    const obtenerSpy = jest.spyOn(
      component['certificadosOrigenService'],
      'obtenerMercanciasDisponibles'
    ).mockReturnValue(of(mockResponse));
    const storeSpy = jest.spyOn(tramite110217StoreMock, 'setDisponsiblesDatos');
    component['certificadoState'] = {
      formCertificado: { entidadFederativa: 105, bloque: 'ARG' },
    } as any;
    component.conseguirDisponiblesDatos();
    expect(obtenerSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalledWith([
      {
        fraccionArancelaria: '1234',
        nombreTecnico: 'Tecnico A',
        nombreComercial: 'Comercial A',
        numeroDeRegistrodeProductos: '5678',
        fechaExpedicion: '2024-01-01',
        fechaVencimiento: '2024-12-31',
      },
    ]);
  });

  it('should handle conseguirDisponiblesDatos gracefully when response has no datos', () => {
    const obtenerSpy = jest.spyOn(
      component['certificadosOrigenService'],
      'obtenerMercanciasDisponibles'
    ).mockReturnValue(of({}));
    const storeSpy = jest.spyOn(tramite110217StoreMock, 'setDisponsiblesDatos');
    component['certificadoState'] = {
      formCertificado: { entidadFederativa: 105, bloque: 'ARG' },
    } as any;
    component.conseguirDisponiblesDatos();
    expect(obtenerSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalledWith([]);
  });

  it('should handle tipoSeleccion and tipoEstadoSeleccion independently', () => {
    const estado = { id: 2, descripcion: 'Test Estado', clave: 'X1' };
    component.tipoEstadoSeleccion(estado);
    expect(tramite110217StoreMock.setEstado).toHaveBeenCalledWith(estado);
    component.tipoSeleccion(estado);
    expect(tramite110217StoreMock.setBloque).toHaveBeenCalledWith('Test Estado');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
