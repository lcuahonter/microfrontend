import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService, CATALOGOS_ID, TEXTOS, Catalogo } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA } from '@angular/core';

jest.mock('@libs/shared/theme/assets/json/32515/document-list.json', () => ({
  __esModule: true,
  default: {
    documentosSeleccionados: [
      { id: 1, nombre: 'Documento 1' },
      { id: 2, nombre: 'Documento 2' }
    ]
  }
}));

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  const mockCatalogData: Catalogo[] = [
    { id: 1, descripcion: 'Documento Tipo 1' },
    { id: 2, descripcion: 'Documento Tipo 2' }
  ];

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PasoDosComponent],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialización del Componente', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades correctamente', () => {
      expect(component.TEXTOS).toBe(TEXTOS);
      expect(component.tiposDocumentos).toEqual([]);
      expect(component.infoAlert).toBe('alert-info');
      expect(component.catalogoDocumentos).toEqual([]);
      expect(component.documentosSeleccionados).toEqual([
        { id: 1, nombre: 'Documento 1' },
        { id: 2, nombre: 'Documento 2' }
      ]);
    });

    it('debería tener el subject destroy$ inicializado', () => {
      expect(component['destroy$']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      // Resetear llamadas de espías previas
      jest.clearAllMocks();
    });

    it('debería llamar getTiposDocumentos al inicializar', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      const getTiposDocumentosSpy = jest.spyOn(component, 'getTiposDocumentos');
      
      component.ngOnInit();
      
      expect(getTiposDocumentosSpy).toHaveBeenCalledTimes(1);
      expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    });

    it('debería establecer catalogoDocumentos cuando ngOnInit es ejecutado exitosamente', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      
      component.ngOnInit();
      
      expect(component.catalogoDocumentos).toEqual(mockCatalogData);
    });

    it('debería manejar errores durante ngOnInit sin lanzar excepciones', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockCatalogosService.getCatalogo.mockReturnValue(
        throwError(() => new Error('Error de inicialización'))
      );
      
      expect(() => component.ngOnInit()).not.toThrow();
      expect(component.catalogoDocumentos).toEqual([]);
      consoleErrorSpy.mockRestore();
    });

    it('debería inicializar todas las propiedades antes de llamar getTiposDocumentos', () => {
      const getTiposDocumentosSpy = jest.spyOn(component, 'getTiposDocumentos');
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      
      component.ngOnInit();
      
      expect(component.TEXTOS).toBeDefined();
      expect(component.infoAlert).toBe('alert-info');
      expect(component.documentosSeleccionados).toBeDefined();
      expect(getTiposDocumentosSpy).toHaveBeenCalled();
    });

    it('debería completar el flujo de inicialización sin memory leaks', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      
      component.ngOnInit();
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(component.catalogoDocumentos).toEqual(mockCatalogData);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería llamar next y complete en el subject destroy$', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTiposDocumentos', () => {
    it('debería llamar catalogosServices.getCatalogo con el parámetro correcto', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      
      component.getTiposDocumentos();
      
      expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(
        CATALOGOS_ID.CAT_TIPO_DOCUMENTO
      );
    });

    it('debería establecer catalogoDocumentos cuando el servicio retorna datos', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      
      component.getTiposDocumentos();
      
      expect(component.catalogoDocumentos).toEqual(mockCatalogData);
    });

    it('no debería actualizar catalogoDocumentos cuando el servicio retorna un array vacío', () => {
      const initialCatalogo = [{ id: 99, descripcion: 'Initial', valor: 'INIT' }];
      component.catalogoDocumentos = initialCatalogo;
      mockCatalogosService.getCatalogo.mockReturnValue(of([]));
      
      component.getTiposDocumentos();
      
      expect(component.catalogoDocumentos).toEqual(initialCatalogo);
    });

    it('debería manejar errores del servicio de manera elegante', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockCatalogosService.getCatalogo.mockReturnValue(
        throwError(() => new Error('Error del servicio'))
      );
      
      expect(() => component.getTiposDocumentos()).not.toThrow();
      
      consoleErrorSpy.mockRestore();
    });

    it('debería desuscribirse cuando el componente es destruido', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      const unsubscribeSpy = jest.spyOn(component['destroy$'], 'next');
      
      component.getTiposDocumentos();
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Pruebas de Integración', () => {
    it('debería completar el ciclo de vida completo sin errores', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      
      expect(() => {
        component.ngOnInit();
        fixture.detectChanges();
        component.ngOnDestroy();
      }).not.toThrow();
      
      expect(component.catalogoDocumentos).toEqual(mockCatalogData);
    });

    it('debería manejar múltiples llamadas a getTiposDocumentos', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogData));
      
      component.getTiposDocumentos();
      component.getTiposDocumentos();
      component.getTiposDocumentos();
      
      expect(mockCatalogosService.getCatalogo).toHaveBeenCalledTimes(3);
      expect(component.catalogoDocumentos).toEqual(mockCatalogData);
    });
  });

  describe('Propiedades del Componente', () => {
    it('debería mantener la referencia de TEXTOS', () => {
      expect(component.TEXTOS).toBe(TEXTOS);
    });

    it('debería tener la clase de alerta inicial correcta', () => {
      expect(component.infoAlert).toBe('alert-info');
    });

    it('debería inicializar los arrays como vacíos', () => {
      expect(component.tiposDocumentos).toHaveLength(0);
      expect(component.catalogoDocumentos).toHaveLength(0);
    });
  });

  describe('Manejo de Errores', () => {
    it('no debería lanzar excepción cuando el servicio falla', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(
        throwError(() => new Error('Error de red'))
      );
      
      expect(() => component.getTiposDocumentos()).not.toThrow();
    });

    it('debería mantener el estado del componente cuando el servicio falla', () => {
      const initialState = [...component.catalogoDocumentos];
      mockCatalogosService.getCatalogo.mockReturnValue(
        throwError(() => new Error('Error del servicio'))
      );
      
      component.getTiposDocumentos();
      
      expect(component.catalogoDocumentos).toEqual(initialState);
    });
  });
});