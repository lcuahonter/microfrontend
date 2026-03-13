import { FirmarSolicitudPasoDosComponent } from './firmar-solicitud-paso-dos.component';
import { Router } from '@angular/router';

jest.mock('@libs/shared/theme/assets/json/90201/acuse-tabla.json', () => ({
  __esModule: true,
  default: [
    {
      no: '1',
      documento: 'Documento de prueba',
      descargar: 'descargar.pdf',
    },
  ],
}));


describe('FirmarSolicitudPasoDosComponent', () => {
  let component: FirmarSolicitudPasoDosComponent;
  let routerMock: any;

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    component = new FirmarSolicitudPasoDosComponent(routerMock);
  });

  it('should have TEXTOS and TEXTOS2 defined', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(component.TEXTOS2).toBeDefined();
  });

  it('should have acuseTablaDatos defined', () => {
    expect(component.acuseTablaDatos).toBeDefined();
    expect(Array.isArray(component.acuseTablaDatos)).toBe(true);
  });

  it('should navigate on obtieneFirma', () => {
    component.obtieneFirma('some-firma');
    expect(routerMock.navigate).toHaveBeenCalledWith(['temporal-contenedores/acuse']);
  });

  it('should not navigate if obtieneFirma is called with empty string', () => {
    component.obtieneFirma('');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
