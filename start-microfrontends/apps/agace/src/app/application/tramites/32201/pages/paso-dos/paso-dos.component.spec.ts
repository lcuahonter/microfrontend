import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { of, Subject, throwError } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn(),
    } as any;

    component = new PasoDosComponent(catalogosServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for properties', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(component.tiposDocumentos).toEqual([]);
    expect(component.infoAlert).toBe('alert-info');
    expect(component.catalogoDocumentos).toEqual([]);
    expect(component.documentosSeleccionados).toEqual([]);
    expect(component.destroyNotifier$).toBeInstanceOf(Subject);
  });

  it('should log error if response is not an array', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    catalogosServiceMock.getCatalogo.mockReturnValue(of(null as any));
    component.getTiposDocumentos();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unexpected response format for tipos de documentos',
      null
    );
    consoleSpy.mockRestore();
  });

  it('should log error if observable errors', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => 'fail'));
    component.getTiposDocumentos();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error al obtener el catálogo de tipos de documentos',
      'fail'
    );
    consoleSpy.mockRestore();
  });
});
