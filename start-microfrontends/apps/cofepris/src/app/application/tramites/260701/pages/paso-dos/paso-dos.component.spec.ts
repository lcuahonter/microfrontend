import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';

import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService, TEXTOS, CATALOGOS_ID } from '@libs/shared/data-access-user/src';

jest.mock('@libs/shared/data-access-user/src', () => ({
  ...jest.requireActual('@libs/shared/data-access-user/src'),
  TEXTOS: { INSTRUCCIONES: 'Instrucciones de prueba' },
  CATALOGOS_ID: { CAT_TIPO_DOCUMENTO: 1 }
}));

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    mockCatalogosService = {
      getCatalogo: jest.fn()
    } as any;

    component = new PasoDosComponent(mockCatalogosService);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar la propiedad TEXTOS', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('debería inicializar catalogoDocumentos como array vacío', () => {
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('debería establecer catalogoDocumentos cuando getCatalogo retorna datos', () => {
    const mockDocs = [{ id: 1, descripcion: 'doc1' }];
    mockCatalogosService.getCatalogo.mockReturnValue(of(mockDocs));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('no debería establecer catalogoDocumentos cuando getCatalogo retorna array vacío', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 2, descripcion: 'doc2' }];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([{ id: 2, descripcion: 'doc2' }]);
  });

  it('debería manejar error en getCatalogo', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(throwError(() => new Error('error')));
    expect(() => component.getTiposDocumentos()).not.toThrow();
  });

  it('debería completar destroyed$ en ngOnDestroy', () => {
    const destroyed$ = (component as any).destroyed$ as Subject<void>;
    const completeSpy = jest.spyOn(destroyed$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

});
