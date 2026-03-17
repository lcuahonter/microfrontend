import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    // Creamos un mock del servicio Router
    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    // Creamos una instancia del componente con el Router simulado
    component = new PasoTresComponent(mockRouter);
  });

  it('debería navegar a la página de acuse si se recibe una firma válida', () => {
    const firmaValida = 'firma123';

    component.obtieneFirma(firmaValida);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería navegar si la firma está vacía', () => {
    const firmaInvalida = '';

    component.obtieneFirma(firmaInvalida);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});