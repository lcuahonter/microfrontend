import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { RECIBIR_NOTIFICACIONES_CONFIGURACION } from '../../constants/solicitud.enum';
import { RecibirNotificaciones } from '../../models/solicitud.model';
import { of } from 'rxjs';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let solicitudServiceMock: jest.Mocked<SolicitudService>;

  beforeEach(() => {
    solicitudServiceMock = {
      conseguirRecibirNotificaciones: jest.fn(() =>
        of([
          {
            rfc: 'LEQI8101314S7',
            curp: 'LEQI810131HDGSXG05',
            nombre: 'MISAEL',
            apellidoPaterno: 'BARRAGAN',
            apellidoMaterno: 'RUIZ',
          },
          {
            rfc: 'MAJIth621207C95',
            curp: 'MAVL621207HDGRLS06',
            nombre: 'EUROFOODS DE MEXICO',
            apellidoPaterno: 'GONZALEZ',
            apellidoMaterno: 'PINAL',
          },
        ])
      ),
    } as unknown as jest.Mocked<SolicitudService>;

    component = new TercerosRelacionadosComponent(solicitudServiceMock);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tipoSeleccionTabla as UNDEFINED', () => {
    expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.UNDEFINED);
  });

  it('should initialize configuracionColumnas with RECIBIR_NOTIFICACIONES_CONFIGURACION', () => {
    expect(component.configuracionColumnas).toBe(
      RECIBIR_NOTIFICACIONES_CONFIGURACION
    );
  });

  it('should call conseguirRecibirNotificaciones on initialization', () => {
    const spy = jest.spyOn(component, 'conseguirRecibirNotificaciones');
    component.conseguirRecibirNotificaciones();
    expect(spy).toHaveBeenCalled();
  });

  it('should populate orecibirNotificacionesLista when conseguirRecibirNotificaciones is called', () => {
    const mockData: RecibirNotificaciones[] = [
      {
        rfc: 'LEQI8101314S7',
        curp: 'LEQI810131HDGSXG05',
        nombre: 'MISAEL',
        apellidoPaterno: 'BARRAGAN',
        apellidoMaterno: 'RUIZ',
      },
      {
        rfc: 'MAJIth621207C95',
        curp: 'MAVL621207HDGRLS06',
        nombre: 'EUROFOODS DE MEXICO',
        apellidoPaterno: 'GONZALEZ',
        apellidoMaterno: 'PINAL',
      },
    ];
    solicitudServiceMock.conseguirRecibirNotificaciones.mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (callback: (data: RecibirNotificaciones[]) => void) =>
          callback(mockData),
      }),
    } as any);

    component.conseguirRecibirNotificaciones();

    expect(component.orecibirNotificacionesLista).toEqual(mockData);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
