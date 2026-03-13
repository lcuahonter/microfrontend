import { PasoDosComponent } from './paso-dos.component';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@libs/shared/data-access-user/src';
import { TramiteStore } from '@libs/shared/data-access-user/src/core/estados/tramite.store';
import { of, throwError } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let mockRouter: any;
  let mockTramiteStore: any;
  let mockTramiteFolioService: any;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockTramiteStore = { establecerTramite: jest.fn() };
    mockTramiteFolioService = { obtenerTramite: jest.fn() };

    component = new PasoDosComponent(
      mockRouter,
      mockTramiteStore,
      mockTramiteFolioService
    );
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a TramiteFolioService y navegar si se pasa una firma válida', () => {
    const mockTramite = { id: 19, descripcion: 'Test', codigo: 'X1', data: 'DATA123' };
    mockTramiteFolioService.obtenerTramite.mockReturnValue(of(mockTramite));

    component.obtieneFirma('FIRMA123');

    expect(mockTramiteFolioService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith('DATA123', 'FIRMA123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería llamar a TramiteFolioService si la firma está vacía', () => {
    component.obtieneFirma('');
    expect(mockTramiteFolioService.obtenerTramite).not.toHaveBeenCalled();
    expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('debería manejar un error en TramiteFolioService sin lanzar excepción', () => {
    const mockError = { status: 500, message: 'Error interno' };
    mockTramiteFolioService.obtenerTramite.mockReturnValue(throwError(() => mockError));

    expect(() => {
      component.obtieneFirma('FIRMA123');
    }).not.toThrow();

    expect(mockTramiteFolioService.obtenerTramite).toHaveBeenCalledWith(19);
  });

  it('debería limpiar destroy$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroy$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
