import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { of, throwError } from 'rxjs';
import { CATALOGOS_ID, Catalogo } from '@libs/shared/data-access-user/src';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn(),
    } as unknown as jest.Mocked<CatalogosService>;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Suppress errors for custom elements
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar la propiedad TEXTOS correctamente', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('debería inicializar la propiedad infoAlert correctamente', () => {
    expect(component.infoAlert).toBe('alert-info');
  });

  it('debería obtener el catálogo de tipos de documentos y asignarlo a catalogoDocumentos', () => {
    const MOCK_CATALOGO_DOCUMENTOS: Catalogo[] = [
      { id: 1, descripcion: 'Documento 1' },
      { id: 2, descripcion: 'Documento 2' },
    ];

    mockCatalogosService.getCatalogo.mockReturnValue(of(MOCK_CATALOGO_DOCUMENTOS));

    component.getTiposDocumentos();

    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.catalogoDocumentos).toEqual(MOCK_CATALOGO_DOCUMENTOS);
  });

  it('debería manejar errores al obtener el catálogo de tipos de documentos', () => {
    const ERROR_MESSAGE = 'Error al obtener el catálogo';
    mockCatalogosService.getCatalogo.mockReturnValue(throwError(() => new Error(ERROR_MESSAGE)));

    component.getTiposDocumentos();

    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.catalogoDocumentos).toEqual([]);
  });

});
