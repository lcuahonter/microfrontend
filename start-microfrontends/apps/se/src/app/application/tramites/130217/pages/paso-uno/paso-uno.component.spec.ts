import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { ControlPermisosPreviosExportacionService } from '../../services/control-permisos-previos-exportacion.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockControlPermisosService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockControlPermisosService = {
      getDatosDeLaSolicitud: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
      getRegistroTomaMuestrasMercanciasData: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ControlPermisosPreviosExportacionService, useValue: mockControlPermisosService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar indice con 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe marcar esDatosRespuesta en true si update es false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('seleccionaTab debe actualizar el índice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('ngOnDestroy debe completar destroyNotifier$', () => {
    const destroyNotifier$ = new Subject<void>();
    component.destroyNotifier$ = destroyNotifier$;
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe configurar esDatosRespuesta correctamente según consultaState.update', () => {
    // Test when update is true
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(false);

    // Test when update is false  
    component.esDatosRespuesta = false; // Reset
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe asignar consultaState desde el observable', () => {
    const state = { update: false, foo: 'bar' };
    mockConsultaQuery.selectConsultaioState$ = of(state);
    component.ngOnInit();
    expect(component.consultaState).toEqual(state);
  });
});