import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud150101Store } from '../../estados/solicitud150101.store';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';

class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: true });
}

class MockSolicitud150101Store {
  setRegistroSolicitudAnualState = jest.fn();
}

class MockSolicitudService {
  getRegistroSolicitudDatos = jest.fn(() => of({ nombre: 'Test Data' }));
}

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let solicitudService: MockSolicitudService;
  let solicitudStore: MockSolicitud150101Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        { provide: Solicitud150101Store, useClass: MockSolicitud150101Store },
        { provide: SolicitudService, useClass: MockSolicitudService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    solicitudService = TestBed.inject(SolicitudService) as any;
    solicitudStore = TestBed.inject(Solicitud150101Store) as any;

    component.solicitante = {
      obtenerTipoPersona: jest.fn(),
    } as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should set estaHabilitado when getFilaDeInformeSeleccionada is called with true', () => {
    component.getFilaDeInformeSeleccionada(true);
    expect(component.estaHabilitado).toBe(true);
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return 1 when ventasTotales and totalExportaciones are empty', () => {
    const form = new FormBuilder().group({
      ventasTotales: [''],
      totalExportaciones: [''],
    });

    component.indice = 2;
    component.datosDeComp = {
      formReporteAnnual: form,
      diferenciaTotal: jest.fn(),
    } as any;

    const result = component.validarTodosLosFormularios();
    expect(result).toBe(1);
  });

  it('should return 2 and call diferenciaTotal when ventasTotales is empty but totalExportaciones >= 0', () => {
    const form = new FormBuilder().group({
      ventasTotales: [''],
      totalExportaciones: [100],
    });

    const diffSpy = jest.fn();
    component.indice = 2;
    component.datosDeComp = { formReporteAnnual: form, diferenciaTotal: diffSpy } as any;

    const result = component.validarTodosLosFormularios();
    expect(result).toBe(2);
    expect(diffSpy).toHaveBeenCalled();
  });

  it('should return 0 when none of the conditions match', () => {
    component.indice = 0;
    const result = component.validarTodosLosFormularios();
    expect(result).toBe(0);
  });

  it('should return 3 when ventasTotales < totalExportaciones', () => {
    const form = new FormBuilder().group({
      ventasTotales: [50],
      totalExportaciones: [100],
    });

    const diffSpy = jest.fn();
    component.indice = 2;
    component.datosDeComp = { formReporteAnnual: form, diferenciaTotal: diffSpy } as any;

    const result = component.validarTodosLosFormularios();
    expect(result).toBe(3);
    expect(diffSpy).toHaveBeenCalled();
  });

    it('should return 4 when ventasTotales >= 0 and totalExportaciones is empty', () => {
    const form = new FormBuilder().group({
      ventasTotales: [100],
      totalExportaciones: [''],
    });

    component.indice = 2;
    component.datosDeComp = { formReporteAnnual: form, diferenciaTotal: jest.fn() } as any;

    const result = component.validarTodosLosFormularios();
    expect(result).toBe(4);
  });

    it('should return 5 when indice===1 and solicitudState is empty', () => {
    component.indice = 1;
    component.solicitudState = { folioPrograma: '', totalExportaciones: '' } as any;

    const result = component.validarTodosLosFormularios();
    expect(result).toBe(5);
  });
});
