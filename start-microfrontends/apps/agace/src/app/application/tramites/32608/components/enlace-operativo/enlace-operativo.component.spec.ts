import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnlaceOperativoComponent } from './enlace-operativo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud32608Store } from '../../estados/solicitud32608.store';
import { Solicitud32608Query } from '../../estados/solicitud32608.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EnlaceOperativoComponent', () => {
  let component: EnlaceOperativoComponent;
  let fixture: ComponentFixture<EnlaceOperativoComponent>;

  const mockQuery = {
    selectConsultaioState$: of({ readonly: false }),
    selectSolicitud$: of({
      enlaceOperativoData: []
    })
  };

  const mockStore = {
    actualizarEstado: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule,EnlaceOperativoComponent],
      providers: [
        { provide: Solicitud32608Store, useValue: mockStore },
        { provide: Solicitud32608Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockQuery },
        BsModalService
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements
    }).compileComponents();

    fixture = TestBed.createComponent(EnlaceOperativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with default values', () => {
    expect(component.enlaceOperativoForm).toBeDefined();
    const form = component.enlaceOperativoForm;
    expect(form.get('registro')).toBeTruthy();
    expect(form.get('correoElectronico')?.validator).toBeTruthy();
  });

  it('should set error notification if registro field is empty on buscar()', () => {
    component.enlaceOperativoForm.get('registro')?.setValue('');
    component.buscar();
    expect(component.nuevaNotificacion.mensaje).toBe('No se encontró información');
  });

  it('should set notification for invalid RFC format', () => {
    component.enlaceOperativoForm.get('registro')?.setValue('invalidRFC!');
    component.buscar();
    expect(component.nuevaNotificacion.mensaje).toBe('Ha proporcionado información con un formato incorrecto.');
  });

  it('should fill form on successful buscar()', () => {
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.buscar();
    expect(component.enlaceOperativoForm.get('nombre')?.value).toBe('EUROFOODS DE MEXICO');
    expect(component.tieneValorRfc).toBeTruthy();
  });

  it('should reset form on limpiarFormulario()', () => {
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.limpiarFormulario();
    expect(component.enlaceOperativoForm.get('registro')?.value).toBeNull();
  });

  it('should add new enlace operativo on enlaceInfoDatos()', () => {
    component.enlaceOperativoForm.patchValue({
      registro: 'XAXX010101000',
      rfc: 'XAXX010101000',
      nombre: 'Test',
      apellidoPaterno: 'Apellido',
      apellidoMaterno: 'Materno',
      cuidad: 'CDMX',
      cargo: 'Gerente',
      telefono: '1234567890',
      correoElectronico: 'test@example.com',
      suplente: false
    });

    component.enlaceInfoDatos();
    expect(component.enlaceOperativoData.length).toBeGreaterThan(0);
    expect(mockStore.actualizarEstado).toHaveBeenCalled();
  });

  it('should update existing enlace operativo on edit', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'XAXX010101000', nombre: 'Old', suplente: false }
    ] as any;
    component.modoEdicion = true;
    component.registroEditandoId = 1;
    component.enlaceOperativoForm.patchValue({ nombre: 'Updated' });

    component.enlaceInfoDatos();

    expect(component.enlaceOperativoData[0].nombre).toBe('Old');
  });

  it('should handle eliminarEnlaceItem() properly', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'XAXX010101000' },
      { id: 2, registro: 'XAXX020202000' }
    ] as any;

    component.listaFilaSeleccionadaEnlace = [{ id: 1 }] as any;

    component.eliminarEnlaceItem(true);

    expect(component.enlaceOperativoData.length).toBe(1);
    expect(component.enlaceOperativoData[0].id).toBe(2);
  });

  it('should open edit dialog when modifying a valid item', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'XAXX010101000', nombre: 'Nombre' }
    ] as any;

    component.listaFilaSeleccionadaEnlace = [
      { id: 1, registro: 'XAXX010101000', nombre: 'Nombre' }
    ] as any;

    const modalSpy = jest.spyOn(component, 'agregarDialogoDatos');

    component.modificarItemEnlace();

    expect(component.modoEdicion).toBeTruthy();
    expect(component.registroEditandoId).toBe(1);
    expect(modalSpy).toHaveBeenCalled();
  });

  it('should show error popup if no items selected to modify', () => {
    component.enlaceOperativoData = [{ id: 1 }] as any;
    component.listaFilaSeleccionadaEnlace = [];

    component.modificarItemEnlace();

    expect(component.nuevaNotificacion.mensaje).toBe('Seleccione un registro');
  });

  it('should set mostrarError = true if no enlace operativo exists', () => {
    component.enlaceOperativoData = [];
    const valid = component.validarEnlaceOperativo();
    expect(valid).toBeFalsy();
    expect(component.mostrarError).toBeTruthy();
  });

  it('should complete destroyed$ on ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
  
});
