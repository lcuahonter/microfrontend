import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: any;

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener el catálogo de documentos correctamente', () => {
    const mockDocs = [{ id: 1, nombre: 'Doc1' }];
    mockCatalogosService.getCatalogo.mockReturnValue(of(mockDocs));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('no debe asignar documentos si la respuesta está vacía', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('debe manejar errores al obtener el catálogo', () => {
  mockCatalogosService.getCatalogo.mockReturnValue(throwError(() => new Error('Error')));
  // No debe lanzar excepción ni modificar catalogoDocumentos
  component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' }];
  component.getTiposDocumentos();
  expect(component.catalogoDocumentos).toEqual([{ id: 1, descripcion: 'Doc1' }]);
});
});