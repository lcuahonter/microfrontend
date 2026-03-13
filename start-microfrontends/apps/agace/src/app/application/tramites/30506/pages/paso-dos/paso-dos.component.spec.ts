import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService, CATALOGOS_ID, TEXTOS, Catalogo } from '@ng-mf/data-access-user';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
    expect(component.tiposDocumentos).toEqual([]);
    expect(component.claseAlertaInformativa).toBe('alert-info');
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('should initialize destroyed$ as ReplaySubject', () => {
    expect(component['destroyed$']).toBeDefined();
    expect(component['destroyed$']).toBeInstanceOf(Object);
  });

  describe('getTiposDocumentos', () => {
    it('should call catalogosServices.getCatalogo with correct parameter', () => {
      catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
      
      component.getTiposDocumentos();
      
      expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    });

    it('should set catalogoDocumentos when response has data', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: 'Documento 1'},
        { id: 2, descripcion: 'Documento 2'}
      ];
      catalogosServiceMock.getCatalogo.mockReturnValue(of(mockCatalogos));

      component.getTiposDocumentos();

      expect(component.catalogoDocumentos).toEqual(mockCatalogos);
      expect(component.catalogoDocumentos.length).toBe(2);
    });

    it('should not set catalogoDocumentos when response is empty', () => {
      const mockEmptyCatalogos: Catalogo[] = [];
      catalogosServiceMock.getCatalogo.mockReturnValue(of(mockEmptyCatalogos));

      component.getTiposDocumentos();

      expect(component.catalogoDocumentos).toEqual([]);
    });

    it('should handle error response gracefully', () => {
      const error = new Error('Service error');
      catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => error));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => component.getTiposDocumentos()).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should call getCatalogo only once per invocation', () => {
      catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
      
      component.getTiposDocumentos();
      
      expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledTimes(1);
    });

    it('should handle response with single document', () => {
      const mockSingleCatalogo: Catalogo[] = [
        { id: 1, descripcion: 'Único Documento'}
      ];
      catalogosServiceMock.getCatalogo.mockReturnValue(of(mockSingleCatalogo));

      component.getTiposDocumentos();

      expect(component.catalogoDocumentos).toEqual(mockSingleCatalogo);
      expect(component.catalogoDocumentos.length).toBe(1);
    });

    it('should preserve existing catalogoDocumentos when response is empty', () => {
      const initialCatalogos: Catalogo[] = [
        { id: 1, descripcion: 'Existing Document' }
      ];
      component.catalogoDocumentos = initialCatalogos;
      
      catalogosServiceMock.getCatalogo.mockReturnValue(of([]));

      component.getTiposDocumentos();

      expect(component.catalogoDocumentos).toEqual(initialCatalogos);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call destroyed$.next with true', () => {
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

    it('should complete destroyed$ observable properly', () => {
      const nextSpy = jest.spyOn(component['destroyed$'], 'next');
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledWith(true);
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Component lifecycle integration', () => {
    it('should call getTiposDocumentos during fixture.detectChanges', () => {
      catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
      const spy = jest.spyOn(component, 'getTiposDocumentos');
      
      fixture.detectChanges();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should handle successful service response during initialization', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: 'Test Document' }
      ];
      catalogosServiceMock.getCatalogo.mockReturnValue(of(mockCatalogos));
      
      fixture.detectChanges();
      
      expect(component.catalogoDocumentos).toEqual(mockCatalogos);
    });

    it('should handle service error during initialization', () => {
      const error = new Error('Initialization error');
      catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => error));
      
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(component.catalogoDocumentos).toEqual([]);
    });
  });

  describe('Component properties', () => {
    it('should inject CatalogosService correctly', () => {
      expect(component['catalogosServices']).toBe(catalogosServiceMock);
    });

    it('should have correct initial state for all properties', () => {
      expect(component.TEXTOS).toBeDefined();
      expect(component.tiposDocumentos).toEqual([]);
      expect(component.claseAlertaInformativa).toBe('alert-info');
      expect(component.catalogoDocumentos).toEqual([]);
      expect(component['destroyed$']).toBeDefined();
    });
  });
});