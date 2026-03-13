import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite301Store } from '../../../../core/estados/tramites/tramite301.store';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solocitud301Service } from '../../services/service301.service';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;

  const mockStore = {
    setLinea: jest.fn(),
    setMonto: jest.fn(),
    setLineaCheckbox: jest.fn(),
    setPagoDerechosTabla: jest.fn()
  };

  const mockQuery = {
    selectSolicitud$: of({
      linea: 'Test Linea',
      lineaCheckbox: true,
      pagoDerechosTabla: [{ lineaDeCaptura: 'ABC123', monto: 1000 }],
    })
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({
      readonly: false,
      parameter: 'FLUJO_FUNCIONARIO_AUTORIZACION'
    })
  };

  const mockService = {
    getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
    actualizarEstadoFormulario: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PagoDeDerechosComponent],
      providers: [
        { provide: Tramite301Store, useValue: mockStore },
        { provide: Tramite301Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: Solocitud301Service, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.FormSolicitud.get('pagodederechos');
    expect(form).toBeTruthy();
    expect(form?.get('linea')?.value).toEqual('Test Linea');
    expect(form?.get('monto')?.value).toEqual('4845');
    expect(form?.get('monto')?.disabled).toBe(true);
  });


  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call store setter methods in setValoresStore()', () => {
    component.setValoresStore(component.FormSolicitud, 'pagodederechos.linea', 'setLinea');
    expect(mockStore.setLinea).toHaveBeenCalled();
  });

  it('should initialize monto field to 4845 and disable it', () => {
    const montoControl = component.FormSolicitud.get('pagodederechos.monto');
    expect(montoControl?.value).toEqual('4845');
    expect(montoControl?.disabled).toBe(true);
  });

  it('should mark form controls as touched when agregar() called with invalid form', () => {
    component.FormSolicitud.get('pagodederechos.linea')?.setValue('');
    component.agregar();
    expect(component.FormSolicitud.get('pagodederechos')?.touched).toBeTruthy();
  });

  it('should reset linea control on limpiar()', () => {
    component.FormSolicitud.get('pagodederechos.linea')?.setValue('RESET_ME');
    component.limpiar();
    expect(component.FormSolicitud.get('pagodederechos.linea')?.value).toBeNull();
  });

  it('should delete selected items from datosTabla on eliminar()', () => {
    component.listaDeFilaSeleccionada([{ lineaDeCaptura: 'ABC123', monto: 1000 }]);
    component.eliminar();
    expect(component.datosTabla.find(item => item.lineaDeCaptura === 'ABC123')).toBeUndefined();
    expect(mockStore.setPagoDerechosTabla).toHaveBeenCalled();
  });

   it('should update listaSeleccionadas on listaDeFilaSeleccionada()', () => {
    const selectedRows = [{ lineaDeCaptura: 'XYZ', monto: 500 }];
    component.listaDeFilaSeleccionada(selectedRows);
    expect(component['listaSeleccionadas']).toEqual(selectedRows);
  });

  it('should disable form in guardarDatosFormulario() if readonly is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.FormSolicitud.disabled).toBe(true);
  });

  it('should enable form in guardarDatosFormulario() if readonly is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.FormSolicitud.enabled).toBe(true);
  });

  it('should disable monto field and set default value on updateformfied()', () => {
    component.FormSolicitud.get('pagodederechos.monto')?.enable();
    component.updateformfied();
    expect(component.FormSolicitud.get('pagodederechos.monto')?.disabled).toBe(true);
    expect(component.FormSolicitud.get('pagodederechos.monto')?.value).toBe('4845');
  });

  it('should return true for isInvalid() when linea is invalid & touched', () => {
    const lineaControl = component.lineaControl;
    lineaControl?.setValue('');
    lineaControl?.markAsTouched();
    expect(component.isInvalid()).toBe(true);
  });

  it('should call destroyNotifier$ on ngOnDestroy()', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call store setter methods in setValoresStore()', () => {
    component.setValoresStore(component.FormSolicitud, 'pagodederechos.linea', 'setLinea');
    expect(mockStore.setLinea).toHaveBeenCalled();
  });
});
