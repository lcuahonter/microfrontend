import { PersonasNotificacionesComponent } from './personas-notificaciones.component';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { PANELS, PERSONAS_NOTIFICACIONES_TABLA } from '../../constants/personas-notificaciones-tabla.enum';

describe('PersonasNotificacionesComponent', () => {
  let component: PersonasNotificacionesComponent;
  let solicitudService: jest.Mocked<SolicitudService>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

  beforeEach(() => {
    solicitudService = {
      obtenerPersonaTablaDatos: jest.fn(() => of())
    } as any;

    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
        procedureId: null,
        parameter: null,
        department: null,
        folioTramite: null,
        isReadonly: false,
        solicitudId: null,
        modulo: null,
        folioSolicitud: null,
        tipoPersona: null,
      } as any)
    };

    component = new PersonasNotificacionesComponent(
      solicitudService,
      consultaioQueryMock as ConsultaioQuery
    );
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores predeterminados', () => {
    expect(component.configuracionTabla).toEqual(PERSONAS_NOTIFICACIONES_TABLA);
    expect(component.panels).toEqual(PANELS);
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('debería alternar el estado de un panel correctamente', () => {
    const index = 1;
    component.panels = [
      { label: 'Panel 1', isCollapsed: true },
      { label: 'Panel 2', isCollapsed: true },
      { label: 'Panel 3', isCollapsed: true }
    ];

    component.mostrar_colapsable(index);

    expect(component.panels[index].isCollapsed).toBe(false);
    component.panels.forEach((panel, i) => {
      if (i !== index) {
        expect(panel.isCollapsed).toBe(true);
      }
    });

    component.mostrar_colapsable(index);
    expect(component.panels[index].isCollapsed).toBe(true);
  });

  it('debería destruir suscripciones al destruir el componente', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería activar modo solo lectura si el estado es readonly', () => {
    const readonlyStateMock: ConsultaioState = {
      procedureId: 'PROC-002',
      parameter: 'otro',
      department: 'otroDept',
      folioTramite: 'FT-99999',
      tipoDeTramite: 'tipo2',
      estadoDeTramite: 'finalizado',
      readonly: true,
      create: false,
      update: false,
      consultaioSolicitante: null
    } as any;

    consultaioQueryMock.selectConsultaioState$ = of(readonlyStateMock);

    component = new PersonasNotificacionesComponent(
      solicitudService,
      consultaioQueryMock as ConsultaioQuery
    );

    expect(component.esFormularioSoloLectura).toBe(true);
  });
});
