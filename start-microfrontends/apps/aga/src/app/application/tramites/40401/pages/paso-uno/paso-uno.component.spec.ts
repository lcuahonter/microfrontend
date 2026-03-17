import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of as observableOf, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PasoUnoComponent } from './paso-uno.component';
import { RegistroCaatAereoService } from '../../services/RegistroCaatAereoController.service';
import { Tramite40401Store } from '../../../../core/estados/tramites/tramite40401.store';
import { Tramite40401Query } from '../../../../core/queries/tramite40401.query';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { CaatAereoData } from '../../models/certi-registro.model';
import { Store } from '@datorama/akita';

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;
  let mockRegistroService: jest.Mocked<RegistroCaatAereoService>;
  let mockStore: jest.Mocked<Tramite40401Store>;
  let mockQuery: jest.Mocked<Tramite40401Query>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;

  const mockCaatAereoData: CaatAereoData = {
    TipoDeCaatAereo: 'Aéreo Comercial',
    DodigoDeTransportacion: 'AER001',
    EmpresaDeTransportacion: 'Transportes Aéreos SA'
  };

  beforeEach(() => {

    mockRegistroService = {
      obtenerCAATAereoData: jest.fn().mockReturnValue(observableOf(mockCaatAereoData))
    } as any;

    mockStore = {
      setPestanaActiva: jest.fn(),
      setPais: jest.fn(),
      setCodigo: jest.fn(),
      setTransportacion: jest.fn()
    } as any;

    mockQuery = {
      selectSolicitud$: observableOf({
        pestanaActiva: 1,
        pais: '',
        codigo: '',
        transportacion: ''
      })
    } as any;

    mockConsultaQuery = {
      selectConsultaioState$: observableOf({
        update: true,
        readonly: true
      })
    } as any;

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, PasoUnoComponent],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: RegistroCaatAereoService, useValue: mockRegistroService },
        { provide: Tramite40401Store, useValue: mockStore },
        { provide: Tramite40401Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should run #constructor()', () => {
    expect(component).toBeTruthy();
    expect(component.indice).toBe(1);
  });

  describe('#seleccionaTab', () => {
    it('should update indice and call store.setPestanaActiva', () => {
      
      const tabIndex = 2;

      component.seleccionaTab(tabIndex);

      expect(component.indice).toBe(tabIndex);
      expect(mockStore.setPestanaActiva).toHaveBeenCalledWith(tabIndex);
    });

    it('should handle zero index', () => {
      
      const tabIndex = 0;

      component.seleccionaTab(tabIndex);

      expect(component.indice).toBe(tabIndex);
      expect(mockStore.setPestanaActiva).toHaveBeenCalledWith(tabIndex);
    });
  });

  describe('#guardarDatosFormulario', () => {
    it('should load CAAT Aereo data and update store', () => {
      component.guardarDatosFormulario();

      expect(mockRegistroService.obtenerCAATAereoData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockStore.setPais).toHaveBeenCalledWith(mockCaatAereoData.TipoDeCaatAereo);
      expect(mockStore.setCodigo).toHaveBeenCalledWith(mockCaatAereoData.DodigoDeTransportacion);
      expect(mockStore.setTransportacion).toHaveBeenCalledWith(mockCaatAereoData.EmpresaDeTransportacion);
    });

    it('should handle service errors gracefully', () => {
      
      mockRegistroService.obtenerCAATAereoData.mockReturnValue(
        new Observable(subscriber => subscriber.error('Service error'))
      );

      expect(() => component.guardarDatosFormulario()).not.toThrow();
    });
  });

  describe('#ngOnInit', () => {
    it('should initialize component and subscribe to queries', () => {
  
      component.ngOnInit();

      expect(component.tramiteState).toBeDefined();
      expect(component.consultaDatos).toBeDefined();
    });

    it('should call guardarDatosFormulario when consultaDatos.update is true', () => {

      const readonlyState = { readonly: true, update: true } as unknown as ConsultaioState;
      mockConsultaQuery.select = jest.fn().mockReturnValue(of(readonlyState));

      const testComponent = new PasoUnoComponent(
        mockStore,
        mockQuery,
        mockConsultaQuery,
        mockRegistroService
      );
      
      const spy = jest.spyOn(testComponent, 'guardarDatosFormulario');

      testComponent.ngOnInit();

      expect(testComponent.consultaDatos.update).toBe(true);
      expect(testComponent.consultaDatos.readonly).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('should set esDatosRespuesta to true when consultaDatos.update is false', () => {
      
      mockConsultaQuery.selectConsultaioState$ = observableOf({
        update: false,
        readonly: false
      } as unknown as ConsultaioState);

      component.ngOnInit();

      expect(component.esDatosRespuesta).toBe(true);
    });
  });

  describe('#obtenerTipoPersona', () => {
    it('should handle when solicitante is undefined', () => {
      
      component.solicitante = undefined as any;

      expect(() => component.obtenerTipoPersona()).not.toThrow();
    });
  });

  describe('#ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

});