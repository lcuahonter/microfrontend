import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { PasoDosComponent } from './paso-dos.component';
import { AlertComponent, AnexarDocumentosComponent, CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS, TituloComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: any;

  beforeEach(async () => {
    mockCatalogosService = {
    getCatalogo: jest.fn().mockReturnValue(of([]))
  };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [
        TituloComponent,
        AlertComponent,
        HttpClientTestingModule,
        AnexarDocumentosComponent
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

 
  it('should call `getTiposDocumentos` on `ngOnInit`', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });



  describe('getTiposDocumentos', () => {
    it('should call `catalogosServices.getCatalogo` with `CAT_TIPO_DOCUMENTO`', () => {
      mockCatalogosService.getCatalogo.mockReturnValue(of([]));
      component.getTiposDocumentos();
      expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    });

    it('should update `catalogoDocumentos` when the service returns a response with data', () => {
      const mockResponse: Catalogo[] = [
        { id: 1, descripcion: 'Documento 1' },
        { id: 2, descripcion: 'Documento 2' }
      ];
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockResponse));
      component.getTiposDocumentos();
      expect(component.catalogoDocumentos).toEqual(mockResponse);
    });

    it('should not update `catalogoDocumentos` when the service response contains no data', () => {
      const initialData: Catalogo[] = [];
      component.catalogoDocumentos = initialData;

      const mockResponse: Catalogo[] = [];
      mockCatalogosService.getCatalogo.mockReturnValue(of(mockResponse));
      component.getTiposDocumentos();

      expect(component.catalogoDocumentos).toBe(initialData);
    });

    it('should handle errors when the service call fails', () => {
  mockCatalogosService.getCatalogo.mockReturnValue(throwError(() => new Error('fail')));
  expect(() => component.getTiposDocumentos()).not.toThrow();
});
  });
});