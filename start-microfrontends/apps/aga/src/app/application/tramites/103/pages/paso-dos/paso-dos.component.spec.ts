// La simulación debería estar antes que las importaciones.
jest.mock('@libs/shared/theme/assets/json/103/document-list.json', () => ({
  default: {
    documentosSeleccionados: [
      {
        id: 1,
        descripcion: 'Documentos que ampare el valor de la mercancía'
      },
      {
        id: 2,
        descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)'
      }
    ]
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { of, Subject, throwError } from 'rxjs';
import { CATALOGOS_ID, Catalogo } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent, AlertComponent, TituloComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  const mockCatalogos: Catalogo[] = [
    { id: 1, descripcion: 'Tipo Documento 1' },
    { id: 2, descripcion: 'Tipo Documento 2' }
  ];

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(of(mockCatalogos))
    } as unknown as jest.Mocked<CatalogosService>;

    await TestBed.configureTestingModule({
      imports: [PasoDosComponent, AnexarDocumentosComponent, AlertComponent, TituloComponent, HttpClientTestingModule],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(component.infoAlert).toBe('alert-info');
    expect(component.documentosSeleccionados).toEqual([
      {
        id: 1,
        descripcion: 'Documentos que ampare el valor de la mercancía'
      },
      {
        id: 2,
        descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)'
      }
    ]);
    expect(component.tiposDocumentos).toEqual([]);
    expect(component.catalogoDocumentos).toEqual([]);
    expect(component['destroy$']).toBeInstanceOf(Subject);
  });

  describe('ngOnInit', () => {
    it('should call getTiposDocumentos on initialization', () => {
      const getTiposDocumentosSpy = jest.spyOn(component, 'getTiposDocumentos');
      component.ngOnInit();
      expect(getTiposDocumentosSpy).toHaveBeenCalled();
    });
  });

  describe('getTiposDocumentos', () => {
    it('should set catalogoDocumentos when service returns data', () => {
      catalogosServiceMock.getCatalogo.mockReturnValue(of(mockCatalogos));
      
      component.getTiposDocumentos();
      
      expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
      expect(component.catalogoDocumentos).toEqual(mockCatalogos);
    });

    it('should not set catalogoDocumentos when service returns empty array', () => {
      catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
      
      component.getTiposDocumentos();
      
      expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
      expect(component.catalogoDocumentos).toEqual([]);
    });

    it('should handle error when service fails', () => {
      const error = new Error('Test error');
      catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => error));
      
      component.getTiposDocumentos();
      
      expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
      // La devolución de llamada de error simplemente devuelve el error, por lo que verificamos que no falle.
      expect(component.catalogoDocumentos).toEqual([]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject on ngOnDestroy', () => {
      jest.spyOn(component['destroy$'], 'next');
      jest.spyOn(component['destroy$'], 'complete');
  
      component.ngOnDestroy();
  
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();

    });

    it('should unsubscribe from observables on ngOnDestroy', () => {
      const mockSubscription = { unsubscribe: jest.fn() };
      component['destroy$'] = { next: jest.fn(), complete: jest.fn() } as any;
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalledWith();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});