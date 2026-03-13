import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TramitesAsociadosComponent } from './tramites-asociados.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConsultaService } from '../../service/consulta.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('TramitesAsociadosComponent', () => {
  let component: TramitesAsociadosComponent;
  let fixture: ComponentFixture<TramitesAsociadosComponent>;
  let consultaServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    consultaServiceMock = {
      obtenerTablaTramites: jest.fn().mockReturnValue(of([
        { folioTramite: '123', tipoTramite: 'Tipo1', estatus: 'Activo', fechaRegistro: '2024-01-01' }
      ])),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,TramitesAsociadosComponent],
      providers: [
        { provide: ConsultaService, useValue: consultaServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TramitesAsociadosComponent);
    component = fixture.componentInstance;
    const fb = TestBed.inject(FormBuilder);
    component.tramitesForm = fb.group({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerTablaTramites and set datosDestinatario', () => {
    component.obtenerTablaTramites();
    expect(consultaServiceMock.obtenerTablaTramites).toHaveBeenCalled();
    expect(component.datosDestinatario.length).toBeGreaterThan(0);
  });

  it('should disable form in guardarDatosFormulario if soloLectura', () => {
    component.soloLectura = true;
    const disableSpy = jest.spyOn(component.tramitesForm, 'disable');
    component.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable form in guardarDatosFormulario if not soloLectura', () => {
    component.soloLectura = false;
    const enableSpy = jest.spyOn(component.tramitesForm, 'enable');
    component.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario in inicializarEstadoFormulario if soloLectura', () => {
    component.soloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call guardarDatosFormulario in inicializarEstadoFormulario if not soloLectura', () => {
    component.soloLectura = false;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should complete destroyed$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});