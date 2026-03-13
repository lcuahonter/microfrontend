import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CatalogosService } from '../../service/catalogos.service';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { of, ReplaySubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockCatalogosService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockCatalogosService = {
      obtenerTablaPlantas: jest.fn().mockReturnValue(of([{ id: 1 }])),
      obtenerTablaSector: jest.fn().mockReturnValue(of([{ id: 2 }])),
      obtenerTablaMercancia: jest.fn().mockReturnValue(of([{ id: 3 }])),
      obtenerTablaProductor: jest.fn().mockReturnValue(of([{ id: 4 }])),
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'value' })),
      actualizarEstadoFormulario: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [SolicitanteComponent,HttpClientTestingModule],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false in ngOnInit', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should set esDatosRespuesta and call actualizarEstadoFormulario in guardarDatosFormularios', () => {
    component.esDatosRespuesta = false;
    component.guardarDatosFormularios();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockCatalogosService.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should set persona and domicilioFiscal in ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.persona).toBeDefined();
    expect(component.domicilioFiscal).toBeDefined();
  });

  it('should set indice in seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should complete destroyed$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});