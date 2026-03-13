import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { SolicitudService } from '../../services/solicitud.service';
import { RecibirNotificaciones } from '../../models/solicitud.model';
import {
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let solicitudService: SolicitudService;

  const mockRecibirNotificaciones: RecibirNotificaciones[] = [
    {
      rfc: 'GODE561231GR8',
      curp: 'GODE561231HDFRRN04',
      nombre: 'Juan',
      apellidoPaterno: 'Gómez',
      apellidoMaterno: 'Delgado',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        TituloComponent,
        TablaDinamicaComponent,
        TercerosRelacionadosComponent,
      ],
      providers: [SolicitudService],
    });

    solicitudService = TestBed.inject(SolicitudService);
    jest
      .spyOn(solicitudService, 'conseguirRecibirNotificaciones')
      .mockReturnValue(of(mockRecibirNotificaciones));

    component = new TercerosRelacionadosComponent(solicitudService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.tipoSeleccionTabla).toBe('undefined');
    expect(component.configuracionColumnas.length).toBe(5);
    expect(component.orecibirNotificacionesLista).toEqual([
      {
        rfc: 'GODE561231GR8',
        curp: 'GODE561231HDFRRN04',
        nombre: 'Juan',
        apellidoPaterno: 'Gómez',
        apellidoMaterno: 'Delgado',
      },
    ]);
  });

  it('should fetch recibirNotificaciones on initialization', () => {
    component.conseguirRecibirNotificaciones();
    expect(solicitudService.conseguirRecibirNotificaciones).toHaveBeenCalled();
    expect(component.orecibirNotificacionesLista).toEqual(
      mockRecibirNotificaciones
    );
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest
      .spyOn(component['destroy$'], 'next')
      .mockImplementation();
    const completeSpy = jest
      .spyOn(component['destroy$'], 'complete')
      .mockImplementation();

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
