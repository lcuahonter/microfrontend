import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ExpedicionCertificadoService } from '../../services/expedicion-certificado.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQueryMock: any;
  let expedicionServiceMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false, readonly: false }),
    };
    expedicionServiceMock = {
      getExpedienteCertificado: jest.fn().mockReturnValue(of({ campo: 'valor' })),
      setDatosFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ExpedicionCertificadoService, useValue: expedicionServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esDatosRespuesta en true si consultaState.update es false en ngOnInit', () => {
    component.consultaState = { update: false, readonly: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe establecer esDatosRespuesta en true y llamar a setDatosFormulario en guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(expedicionServiceMock.setDatosFormulario).toHaveBeenCalledWith({ campo: 'valor' });
  });

  it('debe establecer el índice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
