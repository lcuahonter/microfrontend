import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosComponent } from './datos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitanteOctavaTemporalComponent } from '../../component/solicitante-octava-temporal/solicitante-octava-temporal.component';
import { Solicitante130102Component } from '../solicitante/solicitante.component';
import { of } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent, Solicitante130102Component],
      imports: [HttpClientTestingModule, SolicitanteOctavaTemporalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      update: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should call actualizarEstadoFormulario if getSolicitudData returns data', () => {
    const mockFormularioRegistroService = TestBed.inject<any>(component['formularioRegistroService'].constructor);
    const mockData = { foo: 'bar' };
    jest.spyOn(mockFormularioRegistroService, 'getSolicitudData').mockReturnValue(of(mockData));
    const actualizarSpy = jest.spyOn(mockFormularioRegistroService, 'actualizarEstadoFormulario');
    component.guardarDatosFormulario();
    expect(actualizarSpy).toHaveBeenCalledWith(mockData);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should set esDatosRespuesta to true if consultaState is undefined or missing update', () => {
    const mockConsultaioQuery = TestBed.inject<any>(component['consultaQuery'].constructor);
    mockConsultaioQuery.selectConsultaioState$ = of({});
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should default indice to 1 and update correctly with seleccionaTab', () => {
    expect(component.indice).toBe(1);
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });


});
