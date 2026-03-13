import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { Service270301Service } from '../../services/service270301.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQueryMock: any;
  let service270301ServiceMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    service270301ServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ data: 'mock' })),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: Service270301Service, useValue: service270301ServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    // Mock ViewChild
    component.solicitante = {
      obtenerTipoPersona: jest.fn()
    } as unknown as SolicitanteComponent;
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true if update is false', () => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if update is true', async () => {
    
    await TestBed.resetTestingModule()
      .configureTestingModule({
        declarations: [DatosComponent],
        providers: [
          { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ update: true }) } },
          { provide: Service270301Service, useValue: service270301ServiceMock }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();

    const spy = jest.spyOn(DatosComponent.prototype, 'guardarDatosFormulario');
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    
    component.solicitante = {
      obtenerTipoPersona: jest.fn()
    } as unknown as SolicitanteComponent;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should set indice when seleccionaTab is called', () => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should call obtenerTipoPersona with MORAL_NACIONAL on ngAfterViewInit', () => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    component.solicitante = {
      obtenerTipoPersona: jest.fn()
    } as unknown as SolicitanteComponent;
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('guardarDatosFormulario should update esDatosRespuesta and call actualizarEstadoFormulario', () => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(service270301ServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith({ data: 'mock' });
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
