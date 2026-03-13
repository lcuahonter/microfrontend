import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { ExportacionMineralesDeHierroService } from '../../services/exportacion-minerales-de-hierro.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockExportacionService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    // Mock service with spies for methods used in the component
    mockExportacionService = {
      getDatosDeLaSolicitud: jest.fn(),
      actualizarEstadoFormulario: jest.fn()
    };

    // Mock query with observable for state selection
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    // Configure testing module with mocks
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ExportacionMineralesDeHierroService, useValue: mockExportacionService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit sets esDatosRespuesta to true if update is false
  it('debe marcar esDatosRespuesta en true si update es false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  // Test guardarDatosFormulario updates esDatosRespuesta and calls actualizarEstadoFormulario
  it('guardarDatosFormulario debe actualizar esDatosRespuesta y llamar actualizarEstadoFormulario', () => {
    const resp = { campo: 'valor' };
    mockExportacionService.getDatosDeLaSolicitud.mockReturnValue(of(resp));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockExportacionService.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  // Test seleccionaTab updates the tab index
  it('seleccionaTab debe actualizar el índice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  // Test ngOnDestroy completes the destroyNotifier$ subject
  it('ngOnDestroy debe completar destroyNotifier$', () => {
    const destroyNotifier$ = new Subject<void>();
    (component as any).destroyNotifier$ = destroyNotifier$;
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});