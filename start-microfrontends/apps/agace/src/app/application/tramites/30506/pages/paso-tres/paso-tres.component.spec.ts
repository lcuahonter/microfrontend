import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { TramiteFolioService, TramiteStore, FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;
  let tramiteFolioServiceMock: any;
  let tramiteStoreMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    };

    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: { folio: '123' } }))
    };

    tramiteStoreMock = {
      establecerTramite: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('obtenerTipoPersona', () => {
    it('should set tipoPersona when obtenerTipoPersona is called', () => {
      const tipo = 1;
      component.obtenerTipoPersona(tipo);
      expect(component.tipoPersona).toBe(tipo);
    });

    it('should set tipoPersona to different values', () => {
      component.obtenerTipoPersona(2);
      expect(component.tipoPersona).toBe(2);
      
      component.obtenerTipoPersona(3);
      expect(component.tipoPersona).toBe(3);
    });
  });

  describe('obtieneFirma', () => {
    it('should call TramiteFolioService, TramiteStore, and navigate when FIRMA is provided', () => {
      const firma = 'firma-digital';
      
      component.obtieneFirma(firma);
      
      expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
      expect(tramiteStoreMock.establecerTramite).toHaveBeenCalledWith({ folio: '123' }, firma);
      expect(routerMock.navigate).toHaveBeenCalledWith(['pago/registro-solicitud/acuse']);
    });

    it('should not call services when FIRMA is empty', () => {
      const firma = '';
      
      component.obtieneFirma(firma);
      
      expect(tramiteFolioServiceMock.obtenerTramite).not.toHaveBeenCalled();
      expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not call services when FIRMA is null', () => {
      const firma = null as any;
      
      component.obtieneFirma(firma);
      
      expect(tramiteFolioServiceMock.obtenerTramite).not.toHaveBeenCalled();
      expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not call services when FIRMA is undefined', () => {
      const firma = undefined as any;
      
      component.obtieneFirma(firma);
      
      expect(tramiteFolioServiceMock.obtenerTramite).not.toHaveBeenCalled();
      expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should handle error from obtenerTramite service', () => {
      const firma = 'firma-digital';
      const error = new Error('Service error');
      tramiteFolioServiceMock.obtenerTramite.mockReturnValue(throwError(() => error));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      component.obtieneFirma(firma);
      
      expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
      expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should call obtenerTramite with correct parameter', () => {
      const firma = 'test-firma';
      
      component.obtieneFirma(firma);
      
      expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
      expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed$ observable in ngOnDestroy', () => {
      const nextSpy = jest.spyOn(component['destroyed$'], 'next');
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledWith(true);
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should call destroyed$.next with true value', () => {
      const nextSpy = jest.spyOn(component['destroyed$'], 'next');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledWith(true);
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it('should call destroyed$.complete', () => {
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(completeSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component initialization', () => {
    it('should initialize destroyed$ as ReplaySubject', () => {
      expect(component['destroyed$']).toBeDefined();
      expect(component['destroyed$']).toBeInstanceOf(Object);
    });

    it('should inject Router service', () => {
      expect(component['router']).toBe(routerMock);
    });

    it('should inject TramiteFolioService', () => {
      expect(component['serviciosExtraordinariosServices']).toBe(tramiteFolioServiceMock);
    });

    it('should inject TramiteStore', () => {
      expect(component['tramiteStore']).toBe(tramiteStoreMock);
    });
  });
});