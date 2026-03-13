import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PasoDosComponent } from './paso-dos.component';
import { Catalogo, CatalogosService } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: any;
  let mockToastrService: any;

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn(() => of([])),
    };
  
    mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    };
  
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PasoDosComponent], 
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
        { provide: ToastrService, useValue: mockToastrService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize `TEXTOS` with the imported `TEXTOS`', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('should set `claseAlertaInformativa` to "alert-info"', () => {
    expect(component.claseAlertaInformativa).toBe('alert-info');
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
      expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(
        CATALOGOS_ID.CAT_TIPO_DOCUMENTO
      );
    });

    it('should update `catalogoDocumentos` when the service returns a response with data', () => {
      const mockResponse = [
        { id: 1, descripcion: 'Documento 1' },
        { id: 2, descripcion: 'Documento 2' },
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
  });
});
