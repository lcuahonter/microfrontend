import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarRequerimientoComponent } from './capturar-requerimiento.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { RequerimientosStates } from '../../../core/estados/requerimientos.store';
import { SolicitudRequerimientoQuery } from '../../../core/queries/requerimientos.query';

describe('CapturarRequerimientoComponent', () => {
  let component: CapturarRequerimientoComponent;
  let fixture: ComponentFixture<CapturarRequerimientoComponent>;
  let requerimientosStatesMock: any;
  let solicitudRequerimientoQueryMock: any;

  beforeEach(async () => {
    requerimientosStatesMock = {
      settipoRequerimientoValue: jest.fn(),
      setjustificacionRequerimientoValue: jest.fn()
    };
    solicitudRequerimientoQueryMock = {
      selectSolicitud$: of({
        idTipoRequerimiento: 1,
        justificacionRequerimiento: 'Test justificación'
      })
    };

    await TestBed.configureTestingModule({
      imports: [CapturarRequerimientoComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: RequerimientosStates, useValue: requerimientosStatesMock },
        { provide: SolicitudRequerimientoQuery, useValue: solicitudRequerimientoQueryMock }
      ]
    }).overrideComponent(CapturarRequerimientoComponent, {
      set: {
        providers: [
          { provide: 'RequerimientosStates', useValue: requerimientosStatesMock },
          { provide: 'SolicitudRequerimientoQuery', useValue: solicitudRequerimientoQueryMock }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarRequerimientoComponent);
    component = fixture.componentInstance;
    // Simula el estado inicial
    component.solicitudRequerimientosState = {
      idTipoRequerimiento: 1,
      justificacionRequerimiento: 'Test justificación'
    } as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente en crearFormRequerimiento', () => {
    component.solicitudRequerimientosState = {
      idTipoRequerimiento: 1,
      justificacionRequerimiento: 'Test justificación'
    } as any;
    component.crearFormRequerimiento();
    expect(component.formRequerimiento).toBeDefined();
    expect(component.formRequerimiento.get('tipoRequerimiento')?.value).toBe(1);
    expect(component.formRequerimiento.get('justificacionRequerimiento')?.value).toBe('Test justificación');
  });

  it('debe llamar a settipoRequerimientoValue al seleccionar tipo de requerimiento', () => {
    component.formRequerimiento = new FormBuilder().group({
      tipoRequerimiento: '2',
      justificacionRequerimiento: ''
    });
    component.tipoRequerimientoSeleccionado(component.formRequerimiento, 'tipoRequerimiento', 'settipoRequerimientoValue');
    expect(requerimientosStatesMock.settipoRequerimientoValue).toHaveBeenCalledWith('2');
  });

  it('debe llamar a setjustificacionRequerimientoValue al cambiar justificación', () => {
    component.formRequerimiento = new FormBuilder().group({
      tipoRequerimiento: [''],
      justificacionRequerimiento: ['Nueva justificación']
    });
    component.setValoresStore(component.formRequerimiento, 'justificacionRequerimiento', 'setjustificacionRequerimientoValue');
    expect(requerimientosStatesMock.setjustificacionRequerimientoValue).toHaveBeenCalledWith('Nueva justificación');
  });

  it('ngOnDestroy debe completar el notifier', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});