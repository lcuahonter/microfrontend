import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { DatosdelasolicitudComponent } from '../../../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let certificadosLicenciasSvc: CertificadosLicenciasService;
  let consultaQuery: ConsultaioQuery;
  let solicitud260703Query: Solicitud260702Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CertificadosLicenciasService, useValue: {
            getConsultaDatos: jest.fn().mockReturnValue(of({ datos: 'ok' })),
            actualizarEstadoFormulario: jest.fn(),
            getRepresentLegalaConsulta: jest.fn().mockReturnValue(of({ representante: 'ok' })),
            actualizarRepresentLegala: jest.fn()
        }},
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ update: false }) } },
        { provide: Solicitud260702Query, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    certificadosLicenciasSvc = TestBed.inject(CertificadosLicenciasService);
    consultaQuery = TestBed.inject(ConsultaioQuery);
    solicitud260703Query = TestBed.inject(Solicitud260702Query);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado correctamente en ngOnInit y no llamar guardarDatosFormulario si update es false', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.consultaState).toBeDefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('debería llamar guardarDatosFormulario si update es true en ngOnInit', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería cambiar el índice al seleccionar una pestaña', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debería llamar a los servicios y actualizar el estado en guardarDatosFormulario', () => {
    const spyActualizar = jest.spyOn(certificadosLicenciasSvc, 'actualizarEstadoFormulario');
    const spyActualizarRep = jest.spyOn(certificadosLicenciasSvc, 'actualizarRepresentLegala');
    component.guardarDatosFormulario();
    expect(certificadosLicenciasSvc.getConsultaDatos).toHaveBeenCalled();
    expect(certificadosLicenciasSvc.getRepresentLegalaConsulta).toHaveBeenCalled();
    expect(spyActualizar).toHaveBeenCalled();
    expect(spyActualizarRep).toHaveBeenCalled();
  });

  it('debería validar los formularios correctamente', () => {
    component.datosdelasolicitudComponent = { validarFormularios: () => true } as any;
    expect(component.validarFormularios()).toBe(true);

    component.datosdelasolicitudComponent = { validarFormularios: () => false } as any;
    expect(component.validarFormularios()).toBe(false);

    component.datosdelasolicitudComponent = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });
});