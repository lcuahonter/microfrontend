import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Subscription } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { PasoTresComponent } from './paso-tres.component';
import { TramiteStore } from '../../../../estados/tramite.store';
import { TramiteFolioService } from '@ng-mf/data-access-user';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: any;
  let mockTramiteFolioService: any;
  let mockTramiteStore: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    };

    mockTramiteFolioService = {
      obtenerTramite: jest.fn(),
    };

    mockTramiteStore = {
      establecerTramite: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TramiteFolioService, useValue: mockTramiteFolioService },
        { provide: TramiteStore, useValue: mockTramiteStore },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona in obtenerTipoPersona', () => {
    component.tipoPersona = 0;
    component.obtenerTipoPersona(2);
    expect(component.tipoPersona).toBe(2);
  });

  describe('obtieneFirma', () => {
    it('should call obtenerTramite, establecerTramite, and navigate when FIRMA is valid', () => {
      const mockTramite = { data: { id: 1, name: 'Test Tramite' } };
      mockTramiteFolioService.obtenerTramite.mockReturnValue(of(mockTramite));
      const firma = 'mockFirma';
      component.obtieneFirma(firma);
      expect(mockTramiteFolioService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(
        mockTramite.data,
        firma
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        'servicios-extraordinarios/acuse',
      ]);
    });

    it('should handle errors when obtenerTramite fails', () => {
      mockTramiteFolioService.obtenerTramite.mockReturnValue(
        throwError(() => new Error('Service Error'))
      );
      const firma = 'mockFirma';
      expect(() => component.obtieneFirma(firma)).not.toThrow();
      expect(mockTramiteFolioService.obtenerTramite).toHaveBeenCalledWith(19);
    });

    it('should not call obtenerTramite if FIRMA is empty', () => {
      const firma = '';
      component.obtieneFirma(firma);
      expect(mockTramiteFolioService.obtenerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should unsubscribe obtienerTramiteSubscriber on ngOnDestroy', () => {
    const unsubscribeSpy = jest.fn();
    component.obtienerTramiteSubscriber = { unsubscribe: unsubscribeSpy } as unknown as Subscription;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should not throw if obtienerTramiteSubscriber is undefined on ngOnDestroy', () => {
    component.obtienerTramiteSubscriber = undefined as any;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});