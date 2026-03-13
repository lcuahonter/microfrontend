import { PantallasComponent } from './pantallas.component';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let catalogosServicesMock: any;

  beforeEach(() => {
    catalogosServicesMock = {
      getCatalogo: jest.fn()
    };
    component = new PantallasComponent(catalogosServicesMock);
    // Mock wizardComponent with spies for navigation methods
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
  });

  it('should set indice and call wizardComponent.siguiente on getValorIndice with accion "cont"', () => {
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should set indice and call wizardComponent.atras on getValorIndice with accion not "cont"', () => {
    component.getValorIndice({ accion: 'back', valor: 3 });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not change indice or call navigation if valor is out of range', () => {
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should set catalogoDocumentos on getTiposDocumentos success', () => {
    const mockDocs = [{ id: 1, nombre: 'Doc1' }];
    catalogosServicesMock.getCatalogo.mockReturnValue({
      subscribe: (handlers: any) => handlers.next(mockDocs)
    });
    component.catalogoDocumentos = [];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('should not set catalogoDocumentos if response is empty', () => {
    catalogosServicesMock.getCatalogo.mockReturnValue({
      subscribe: (handlers: any) => handlers.next([])
    });
    component.catalogoDocumentos = [];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('should handle error in getTiposDocumentos', () => {
    catalogosServicesMock.getCatalogo.mockReturnValue({
      subscribe: (handlers: any) => handlers.error(new Error('fail'))
    });
    expect(() => component.getTiposDocumentos()).not.toThrow();
  });
});
