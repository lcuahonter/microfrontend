import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { of, throwError } from 'rxjs';
import { CatalogosService } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  const catalogoMock = [
    { id: 1, descripcion: 'Documento A' },
    { id: 2, descripcion: 'Documento B' },
  ];

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn(),
    } as unknown as jest.Mocked<CatalogosService>;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a getTiposDocumentos al inicializar', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('debería cargar correctamente los tipos de documentos', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of(catalogoMock));

    component.getTiposDocumentos();

    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual(catalogoMock);
  });

  it('no debería asignar documentos si el catálogo está vacío', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('debería manejar errores correctamente al obtener tipos de documentos', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(
      throwError(() => new Error('Error de red'))
    );
    component.getTiposDocumentos();
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalled();
  });

  it('debería completar destroy$ al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
