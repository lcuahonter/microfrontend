import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CertificadoService } from '../../services/certificado.service';
import { ConsultaioQuery, TIPO_PERSONA, SolicitanteComponent } from '@ng-mf/data-access-user';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let certificadoServiceMock: any;
  let consultaioQueryMock: any;
  let cdrMock: any;

  beforeEach(async () => {
    certificadoServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn()
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    cdrMock = { detectChanges: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, HttpClientTestingModule, SolicitanteComponent],
      providers: [
        { provide: CertificadoService, useValue: certificadoServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: ChangeDetectorRef, useValue: cdrMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false in ngOnInit', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormularios if consultaState.update is true in ngOnInit', () => {
    component.consultaState = { update: true } as any;
    jest.spyOn(component, 'guardarDatosFormularios');
    component.ngOnInit();
  });

  it('should set esDatosRespuesta and call actualizarEstadoFormulario in guardarDatosFormularios', () => {
    const resp = { test: 'value' };
    certificadoServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(resp));
    component.esDatosRespuesta = false;
    component.guardarDatosFormularios();
    expect(component.esDatosRespuesta).toBe(true);
    expect(certificadoServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  
  it('should set indice and emit miEvento in seleccionaTab', () => {
    const emitSpy = jest.spyOn(component.miEvento, 'emit');
    component.indice = 1;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should emit eventoDatosHijo and call seleccionaTab in emitirCancelacion', () => {
    const emitSpy = jest.spyOn(component.eventoDatosHijo, 'emit');
    const tabSpy = jest.spyOn(component, 'seleccionaTab');
    component.emitirCancelacion(5);
    expect(emitSpy).toHaveBeenCalledWith(5);
    expect(component.indice).toBe(3);
    expect(tabSpy).toHaveBeenCalledWith(3);
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});