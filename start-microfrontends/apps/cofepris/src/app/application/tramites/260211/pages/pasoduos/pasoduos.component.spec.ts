import { PasoduosComponent } from './pasoduos.component';
import { CATALOGOS_ID, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { of, throwError, Subject } from 'rxjs';

describe('PasoduosComponent', () => {
  let component: PasoduosComponent;
  let catalogosServiceMock: any;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn()
    };
    component = new PasoduosComponent(catalogosServiceMock);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener TEXTOS definido', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('debe llenar catalogoDocumentos cuando getTiposDocumentos retorna datos', () => {
    const mockDocs = [{ id: 1, descripcion: 'Doc 1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockDocs));
    component.getTiposDocumentos();
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('no debe actualizar catalogoDocumentos si la respuesta está vacía', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc 1' }];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([{ id: 1, descripcion: 'Doc 1' }]);
  });

  it('debe manejar el error en getTiposDocumentos sin lanzar excepción', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => new Error('error')));
    expect(() => component.getTiposDocumentos()).not.toThrow();
  });

  it('debe completar destroyed$ al llamar ngOnDestroy', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});