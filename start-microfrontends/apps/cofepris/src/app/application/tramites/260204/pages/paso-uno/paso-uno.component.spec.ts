import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';

// Mocks
const mockConsultaioState = { procedureId: '260204', update: true };
const mockConsultaQuery = {
  selectConsultaioState$: of(mockConsultaioState),
};
const mockPermisoSanitarioImportacionMedicamentosService = {
  getTramiteDatos: jest.fn(() => of({})),
  actualizarEstadoFormulario: jest.fn(),
};

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent],
      providers: [
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        {
          provide: 'PermisoSanitarioImportacionMedicamentosService',
          useValue: mockPermisoSanitarioImportacionMedicamentosService,
        },
      ],
    })
      .overrideComponent(PasoUnoComponent, {
        set: {
          providers: [
            { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
            {
              provide: 'PermisoSanitarioImportacionMedicamentosService',
              useValue: mockPermisoSanitarioImportacionMedicamentosService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize indice to 2', () => {
    expect(component.indice).toBe(2);
  });

  it('should select tab and update indice', () => {
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

  it('should call guardarDatosFormulario and update esDatosRespuesta', () => {
    component.guardarDatosFormulario();
    expect(mockPermisoSanitarioImportacionMedicamentosService.getTramiteDatos).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockPermisoSanitarioImportacionMedicamentosService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
