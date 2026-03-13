import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService, CATALOGOS_ID, Catalogo, TEXTOS } from '@ng-mf/data-access-user';
import { DOCUMENTOS_SELECCIONADOS } from '../../enums/exencionDeImpuestos.enum';
import { of, Subject } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Descripción de Doc1' }])),
    } as any;

    component = new PasoDosComponent(catalogosServiceMock);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTOS and infoAlert', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
    expect(component.infoAlert).toBe('alert-info');
  });

  it('should call getTiposDocumentos and set documentosSeleccionados on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.documentosSeleccionados).toBe(DOCUMENTOS_SELECCIONADOS);
  });

  it('should set catalogoDocumentos when getTiposDocumentos receives data', () => {
    const mockDocs: Catalogo[] = [{ id: 1, descripcion: 'Descripción de Doc1' } as Catalogo];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockDocs));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockDocs);
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
  });

  it('should not set catalogoDocumentos if response is empty', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Descripción de Doc1' } as Catalogo];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([{ id: 1, descripcion: 'Descripción de Doc1' }]);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    const nextSpy = jest.spyOn((component as any).destroy$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});