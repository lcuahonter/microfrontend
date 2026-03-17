import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { ConsultaioQuery, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosParaMovilizacionComponent } from '../../components/datos-para-movilizacion/datos-para-movilizacion.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { CommonModule } from '@angular/common';
import { TercerospageComponent } from '../../components/tercerospage/tercerospage.component';

@Injectable()
class ServicioMockImportacionDeAcuicultura {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let componente: { ngOnDestroy: () => void; seleccionaTab: (arg0: {}) => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; importacionDeAcuiculturaService: { getAcuiculturaData?: any; actualizarEstadoFormulario?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolicitanteComponent, TercerospageComponent, ReactiveFormsModule, DatosDeLaSolicitudComponent, DatosParaMovilizacionComponent, PagoDeDerechosComponent, CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ImportacionDeAcuiculturaService, useClass: ServicioMockImportacionDeAcuicultura },
        ConsultaioQuery
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    componente = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    componente.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('debería ejecutar #constructor()', async () => {
    expect(componente).toBeTruthy();
  });

  it('debería ejecutar #seleccionaTab()', async () => {
    componente.seleccionaTab({});
  });

  it('debería ejecutar #ngOnInit()', async () => {
    componente.consultaQuery = componente.consultaQuery || {};
    componente.consultaQuery.selectConsultaioState$ = observableOf({
      update: {}
    });
    componente.guardarDatosFormulario = jest.fn();
    // expect(componente.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('debería ejecutar #guardarDatosFormulario()', async () => {
    componente.importacionDeAcuiculturaService = componente.importacionDeAcuiculturaService || {};
    componente.importacionDeAcuiculturaService.getAcuiculturaData = jest.fn().mockReturnValue(observableOf({}));
    componente.importacionDeAcuiculturaService.actualizarEstadoFormulario = jest.fn();
    componente.guardarDatosFormulario();
    // expect(componente.importacionDeAcuiculturaService.getAcuiculturaData).toHaveBeenCalled();
    // expect(componente.importacionDeAcuiculturaService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

});
