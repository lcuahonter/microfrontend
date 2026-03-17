import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados.contenedora';
import { Subject } from 'rxjs';

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let consultaQueryMock: any;
  let tramite260302QueryMock: any;
  let cdrMock: any;
  let selectConsultaioState$: Subject<any>;

  beforeEach(() => {
    selectConsultaioState$ = new Subject();
    consultaQueryMock = { selectConsultaioState$: selectConsultaioState$ };
    tramite260302QueryMock = {};
    cdrMock = { detectChanges: jest.fn() };
    component = new TercerosRelacionadosContenedoraComponent(
      consultaQueryMock,
      tramite260302QueryMock,
      cdrMock
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for permisoDefinitivoTitulo, idProcedimiento, esFormularioSoloLectura', () => {
    expect(Array.isArray(component.permisoDefinitivoTitulo)).toBe(true);
    expect(Array.isArray(component.idProcedimiento)).toBe(true);
    expect(component.esFormularioSoloLectura).toBe(false);
  });


  it('should update esFormularioSoloLectura and consultaState on subscription', async () => {
    const state = { readonly: true, test: 'value' };
    selectConsultaioState$.next(state);
    await Promise.resolve();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.consultaState).toBe(state);
    expect(cdrMock.detectChanges).toHaveBeenCalled();
  });

  it('should handle multiple subscription updates', async () => {
    const state1 = { readonly: false };
    const state2 = { readonly: true };
    selectConsultaioState$.next(state1);
    await Promise.resolve();
    expect(component.esFormularioSoloLectura).toBe(false);
    selectConsultaioState$.next(state2);
    await Promise.resolve();
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('should handle ngOnDestroy called multiple times gracefully', () => {
    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should allow consultaState to be undefined initially', () => {
    expect(component.consultaState).toBeUndefined();
    selectConsultaioState$.next({ readonly: false });
    expect(component.consultaState).toEqual({ readonly: false });
  });

  it('should clean up subscription on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
