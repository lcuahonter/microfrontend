import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EconomicoService } from '../../services/economico.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Tramite32606Store } from '../../state/Tramite32606.store';
import { ReplaySubject, of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let economicoMock: jest.Mocked<EconomicoService>;
  let routerMock: jest.Mocked<Router>;
  let consultaioQueryMock: jest.Mocked<ConsultaioQuery>;
  let tramite32606StoreMock: jest.Mocked<Tramite32606Store>;
  let fb: FormBuilder;
  let destroyed$: ReplaySubject<boolean>;

  const consultaState: ConsultaioState = {
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null
  };

  beforeEach(() => {
    economicoMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn()
    } as any;
    routerMock = { navigate: jest.fn() } as any;
    consultaioQueryMock = {
      selectConsultaioState$: of(consultaState)
    } as any;
    tramite32606StoreMock = {} as any;
    fb = new FormBuilder();
    destroyed$ = new ReplaySubject(1);

    component = new PasoUnoComponent(
      economicoMock,
      consultaioQueryMock,
    );
    component['destroyed$'] = destroyed$;
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit asigna consultaState y esDatosRespuesta', () => {
    consultaioQueryMock.selectConsultaioState$ = of({ ...consultaState, update: false });
    component.consultaioQuery = consultaioQueryMock;
    component.ngOnInit();
    expect(component.consultaState).toEqual(expect.objectContaining({ update: false }));
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormularios actualiza estado y llama actualizarEstadoFormulario', () => {
    const resp = { tipoRadio01: 'a' } as any;
    economicoMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(resp));
    component.economico = economicoMock;
    component.guardarDatosFormularios();
    expect(component.esDatosRespuesta).toBe(true);
    expect(economicoMock.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  it('seleccionaTab cambia el índice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('ngOnDestroy completa destroyed$', () => {
    const spyNext = jest.spyOn(destroyed$, 'next');
    const spyComplete = jest.spyOn(destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});