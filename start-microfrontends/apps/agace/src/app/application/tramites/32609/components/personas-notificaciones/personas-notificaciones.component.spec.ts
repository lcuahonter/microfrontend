import { PersonasNotificacionesComponent } from './personas-notificaciones.component';
import { OeaTextilRegistroService } from '../../services/oea-textil-registro.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { PERSONAS_NOTIFICACIONES_TABLA, PANELS_PRINCIPALES } from '../../enums/oea-textil-registro.enum';

describe('PersonasNotificacionesComponent', () => {
  let component: PersonasNotificacionesComponent;
  let solicitudDeRegistroInvocarServiceMock: jest.Mocked<OeaTextilRegistroService>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

  beforeEach(() => {
    solicitudDeRegistroInvocarServiceMock = {
      obtenerPersonaTablaDatos: jest.fn()
    } as any;

    const consultaioStateMock: ConsultaioState = {
      procedureId: 'PROC-001',
      parameter: 'param',
      department: 'dept',
      folioTramite: 'FT-12345',
      tipoDeTramite: 'tipo1',
      estadoDeTramite: 'activo',
      readonly: false,
      create: true,
      update: true,
      consultaioSolicitante: null
    };

    consultaioQueryMock = {
      selectConsultaioState$: of(consultaioStateMock)
    };

    component = new PersonasNotificacionesComponent(
      solicitudDeRegistroInvocarServiceMock,
      consultaioQueryMock as ConsultaioQuery
    );
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores predeterminados', () => {
    expect(component.configuracionTabla).toEqual(PERSONAS_NOTIFICACIONES_TABLA);
    expect(component.panels).toEqual(PANELS_PRINCIPALES);
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
    };

    consultaioQueryMock.selectConsultaioState$ = of(readonlyStateMock);

    component = new PersonasNotificacionesComponent(
      solicitudDeRegistroInvocarServiceMock,
      consultaioQueryMock as ConsultaioQuery
    );

    expect(component.esFormularioSoloLectura).toBe(true);
  });
});
