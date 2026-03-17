import { PasoDosComponent } from './paso-dos.component';
import { of } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let catalogosServiceMock: any;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn()
    };
    component = new PasoDosComponent(catalogosServiceMock);
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should assign catalogoDocumentos when service returns data', () => {
    const mockDocs = [{ id: 1, nombre: 'Doc1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockDocs));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('should not assign catalogoDocumentos when service returns empty array', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' }];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([{ id: 1, descripcion: 'Doc1' }]);
  });
});
