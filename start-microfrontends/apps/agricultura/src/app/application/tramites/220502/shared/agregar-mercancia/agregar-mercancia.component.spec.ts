import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AgregarMercanciaComponent } from './agregar-mercancia.component';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { Solicitud220502Store } from '../../estados/tramites220502.store';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarMercanciaComponent', () => {
  let component: AgregarMercanciaComponent;
  let fixture: ComponentFixture<AgregarMercanciaComponent>;
  let solicitudQueryMock: any;
  let solicitudStoreMock: any;

  beforeEach(async () => {
    solicitudQueryMock = {
      selectSolicitud$: of({
        fraccionArancelaria: '1234',
        descripcionFraccion: 'Test Description',
        nico: '5678',
        descripcion: 'Test Mercancia',
        unidaddeMedidaDeUMT: 'kg',
        cantidadTotalUMT: '100',
        saldoPendiente: '50',
        saldoACapturar: '10',
      }),
    };

    solicitudStoreMock = {
      setSaldoACapturar: jest.fn(()=> of()),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        AgregarMercanciaComponent,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: Solicitud220502Query, useValue: solicitudQueryMock },
        { provide: Solicitud220502Store, useValue: solicitudStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarMercanciaComponent);
    component = fixture.componentInstance;
    component.mercanciasDatos = [
      {
        fraccionArancelaria: '1234',
        descripcionFraccion: 'Test Description',
        nico: '5678',
        descripcion: 'Test Mercancia',
        unidaddeMedidaDeUMT: 'kg',
        cantidadTotalUMT: '100',
        saldoPendiente: '50',
        saldoACapturar: '10',
        id: 1,
      } as any,
    ];
    component.crearFormulario();
    component.agregarMercanciaForm.get('saldoACapturar')?.setValue('10');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form in crearFormulario', () => {
    component.crearFormulario();
    expect(component.agregarMercanciaForm).toBeDefined();
    expect(
      component.agregarMercanciaForm.get('fraccionArancelaria')?.value
    ).toBe('1234');
    expect(
      component.agregarMercanciaForm.get('descripcionFraccion')?.value
    ).toBe('Test Description');
  });

  it('should patch form values when selectSolicitud$ emits', () => {
    expect(component.agregarMercanciaForm.get('saldoACapturar')?.value).toBe(
      '10'
    );
  });

  it('should call setSaldoACapturar when setSaldoACapturar is triggered', () => {
    const event = { target: { value: '20' } } as any;
    component.setSaldoACapturar(event);
    expect(solicitudStoreMock.setSaldoACapturar).toHaveBeenCalledWith('20');
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should emit actualizarMercancia with form value and reset form if valid', () => {
    const spy = jest.spyOn(component.actualizarMercancia, 'emit');
    component.aceptar();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        fraccionArancelaria: '1234',
        descripcionFraccion: 'Test Description',
        nico: '5678',
        descripcion: 'Test Mercancia',
        unidaddeMedidaDeUMT: 'kg',
        cantidadTotalUMT: '100',
        saldoPendiente: 90,
        saldoACapturar: '10',
        id: 1,
      })
    );
    expect(component.agregarMercanciaForm.pristine).toBeTruthy();
  });

  it('should not emit if form is invalid', () => {
    const spy = jest.spyOn(component.actualizarMercancia, 'emit');
    component.agregarMercanciaForm.get('saldoACapturar')?.setValue('');
    component.aceptar();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should show modal and not emit if saldoACapturar > cantidadTotalUMT', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.agregarMercanciaForm.get('saldoACapturar')?.setValue('200');
    component.aceptar();
    expect(abrirModalSpy).toHaveBeenCalledWith(
      'La cantidad solicita es mayor al saldo pendiente. Favor de verificar.'
    );
    expect(component.pedimentos.length).toBe(1);
  });

  it('cerrarModal should emit undefined', () => {
    const spy = jest.spyOn(component.actualizarMercancia, 'emit');
    component.cerrarModal();
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('abrirModal should set nuevaNotificacion and elementoParaEliminar', () => {
    component.abrirModal('Test mensaje', 2);
    expect(component.nuevaNotificacion).toEqual(
      expect.objectContaining({
        mensaje: 'Test mensaje',
        tipoNotificacion: 'alert',
        categoria: 'danger',
      })
    );
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('eliminarPedimento should remove item if borrar is true', () => {
    component.pedimentos = [{ pedimento: 1 }, { pedimento: 2 }] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(1);
    expect(component.pedimentos[0].pedimento).toBe(1);
  });

  it('eliminarPedimento should not remove item if borrar is false', () => {
    component.pedimentos = [{ pedimento: 1 }, { pedimento: 2 }] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(2);
  });
});
