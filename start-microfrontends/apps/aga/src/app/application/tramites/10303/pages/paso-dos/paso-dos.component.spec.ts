import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PasoDosComponent } from './paso-dos.component';
import { AlertComponent, AnexarDocumentosComponent, CATALOGOS_ID, Catalogo, CatalogoResponse, CatalogosService, TEXTOS, TituloComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: any;

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn().mockReturnValue(of({ data: [] }))
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize `TEXTOS` with the imported `TEXTOS`', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('should set `infoAlert` to "alert-info"', () => {
    expect(component.infoAlert).toBe('alert-info');
  });

  it('should call `getTiposDocumentos` on `ngOnInit`', () => {
    const SPY = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(SPY).toHaveBeenCalled();
  });

  it('should initialize `documentosSeleccionados` with default values on `ngOnInit`', () => {
    const EXPECTED_VALUES: Catalogo[] = [
      { id: 1, descripcion: 'Documentos que ampare el valor de la mercancía' },
      { id: 2, descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)' }
    ];
    expect(component.documentosSeleccionados).toEqual(EXPECTED_VALUES);
  });

  describe('getTiposDocumentos', () => {
    it('should call `catalogosServices.getCatalogo` with `CAT_TIPO_DOCUMENTO`', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of([]));
      component.getTiposDocumentos();
      expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    });

    it('should update `catalogoDocumentos` when the service returns a response with data', () => {
      const MOCK_RESPONSE: Catalogo[] = [
        { id: 1, descripcion: 'Documento 1' },
        { id: 2, descripcion: 'Documento 2' }
      ];
      mockCatalogosService.getCatalogo.mockReturnValue(of(MOCK_RESPONSE));
      component.getTiposDocumentos();
      expect(component.catalogoDocumentos).toEqual(MOCK_RESPONSE);
    });

    it('should not update `catalogoDocumentos` when the service response contains no data', () => {
      const INITIAL_DATA: Catalogo[] = [];
      component.catalogoDocumentos = INITIAL_DATA;

      const MOCK_RESPONSE: CatalogoResponse[] = [];
      mockCatalogosService.getCatalogo.mockReturnValue(of(MOCK_RESPONSE));
      component.getTiposDocumentos();

      expect(component.catalogoDocumentos).toBe(INITIAL_DATA);
    });
  });
});