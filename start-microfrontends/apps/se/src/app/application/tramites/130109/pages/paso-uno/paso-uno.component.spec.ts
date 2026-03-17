import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { VehiculosUsadosAdaptadosService } from '../../services/vehiculos-usados-adaptados.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockImportacionService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockImportacionService = {
      getDatosDeLaSolicitud: jest.fn(),
      actualizarEstadoFormulario: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    await TestBed.configureTestingModule({
      declarations: [
        PasoUnoComponent,
      ],
      imports: [        
        SolicitanteComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: VehiculosUsadosAdaptadosService, useValue: mockImportacionService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe marcar esDatosRespuesta en true si update es false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debe actualizar esDatosRespuesta y llamar actualizarEstadoFormulario', () => {
    const resp = { campo: 'valor' };
    const id_solicitud = '203020905';
    mockImportacionService.getDatosDeLaSolicitud.mockReturnValue(of(resp));
    component.guardarDatosFormulario(id_solicitud);
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockImportacionService.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  it('seleccionaTab debe actualizar el índice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('ngOnDestroy debe completar destroyNotifier$', () => {
    const destroyNotifier$ = new Subject<void>();
    (component as any).destroyNotifier$ = destroyNotifier$;
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
    it('ngOnDestroy no debe fallar si destroyNotifier$ no está definido', () => {
    (component as any).destroyNotifier$ = undefined;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
   it('ngOnInit debe suscribirse a selectConsultaioState$ y actualizar esDatosRespuesta si update es true', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(false);
  });

});