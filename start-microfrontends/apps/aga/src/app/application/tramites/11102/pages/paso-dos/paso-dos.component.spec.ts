import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  Catalogo,
  CATALOGOS_ID,
  CatalogosService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let catalogosService: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    const mockCatalogosService = {
      getCatalogo: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
      ],
      declarations: [],
      providers: [
        PasoDosComponent,
        { provide: CatalogosService, useValue: mockCatalogosService },
      ],
    });

    component = TestBed.inject(PasoDosComponent);
    catalogosService = TestBed.inject(
      CatalogosService
    ) as jest.Mocked<CatalogosService>;
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(component.infoAlert).toBe('alert-info');
    expect(component.catalogoDocumentos).toEqual([]);
    expect(component.documentosSeleccionados).toEqual([]);
  });

  describe('Initialization', () => {
    it('should call getTiposDocumentos and set documentosSeleccionados', () => {
      const mockCatalogoResponse = [
        {
          id: 1,
          descripcion: 'Documentos que ampare el valor de la mercancía',
        },
        {
          id: 2,
          descripcion:
            'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)',
        },
      ];

      jest.spyOn(component, 'getTiposDocumentos').mockImplementation(() => {
        component.catalogoDocumentos = mockCatalogoResponse;
      });

      component.ngOnInit();

      expect(component.getTiposDocumentos).toHaveBeenCalled();
      expect(component.documentosSeleccionados).toEqual([
        {
          id: 1,
          descripcion: 'Documentos que ampare el valor de la mercancía',
        },
        {
          id: 2,
          descripcion:
            'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)',
        },
      ]);
    });
  });

  describe('getTiposDocumentos', () => {
    it('should fetch catalogoDocumentos from the service', () => {
      const mockResponse = [
        { id: 1, descripcion: 'Tipo Documento 1' },
        { id: 2, descripcion: 'Tipo Documento 2' },
      ];
      catalogosService.getCatalogo.mockReturnValue(of(mockResponse));
      component.getTiposDocumentos();
      expect(catalogosService.getCatalogo).toHaveBeenCalledWith(
        CATALOGOS_ID.CAT_TIPO_DOCUMENTO
      );
      expect(component.catalogoDocumentos).toEqual(mockResponse);
    });

    it('should handle empty response gracefully', () => {
      catalogosService.getCatalogo.mockReturnValue(of([]));
      component.getTiposDocumentos();
      expect(catalogosService.getCatalogo).toHaveBeenCalledWith(
        CATALOGOS_ID.CAT_TIPO_DOCUMENTO
      );
      expect(component.catalogoDocumentos).toEqual([]);
    });
  });
});
