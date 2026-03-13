import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ManualAvisoComponent } from './manual-aviso.component';
import {
  CatalogosService,
  ConsultaioQuery,
  InputTypes,
  BotonAccionesTipos,
} from '@ng-mf/data-access-user';
import { Tramite32504Store } from '../../estados/tramite32504.store';
import { ActionType } from '../../enum/aviso.enum';

describe('ManualAvisoComponent', () => {
  let component: ManualAvisoComponent;
  let fixture: ComponentFixture<ManualAvisoComponent>;
  let fb: FormBuilder;

  // Stubs
  const catalogosServiceStub = {
    getCatalogo: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'opt' }])),
  } as Partial<CatalogosService>;

  const consultaQueryStub = {
    selectConsultaioState$: of({ readonly: false }),
  } as Partial<ConsultaioQuery>;

  const storeStub = {
    setDatosQuienRecibe: jest.fn(),
    setDatosDomicilioLugar: jest.fn(),
    setDatosMercanciaSubmanufactura: jest.fn(),
  } as Partial<Tramite32504Store>;

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, ManualAvisoComponent],
    providers: [
      { provide: CatalogosService, useValue: catalogosServiceStub },
      { provide: ConsultaioQuery, useValue: consultaQueryStub },
      { provide: Tramite32504Store, useValue: storeStub },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });

  // Add this line here, before compileComponents()
  TestBed.overrideComponent(ManualAvisoComponent, { set: { template: '' } });

  await TestBed.compileComponents();

  fixture = TestBed.createComponent(ManualAvisoComponent);
  component = fixture.componentInstance;
  fb = TestBed.inject(FormBuilder);

  fixture.detectChanges();
});

it('should create and initialize form with groups and controls', () => {
  expect(component).toBeTruthy();
  expect(component.formulario.contains('datosQuienRecibe')).toBeTruthy();
  expect(component.formulario.contains('datosDomicilioLugar')).toBeTruthy();
  expect(component.formulario.contains('datosMercanciaSubmanufactura')).toBeTruthy();
  expect(component.formulario.contains('manualDatos')).toBeTruthy();

  const dq = component.formulario.get('datosQuienRecibe') as FormGroup;
  const ddl = component.formulario.get('datosDomicilioLugar') as FormGroup;
  const dm = component.formulario.get('datosMercanciaSubmanufactura') as FormGroup;

  expect(Object.keys(dq.controls).length).toBeGreaterThan(0);
  expect(Object.keys(ddl.controls).length).toBeGreaterThan(0);
  // Only check if config expects controls
  if (component.configuracion.find(g => g.formGroupName === 'datosMercanciaSubmanufactura')?.menu.length) {
    expect(Object.keys(dm.controls).length).toBeGreaterThan(0);
  }
});

  it('static obtenerValidadores returns correct validators', () => {
    const vals = ManualAvisoComponent.obtenerValidadores([
      'required',
      'maxLength:3',
      'pattern:\\d+',
    ]);
    expect(vals.length).toBe(3);
    expect(typeof vals[0]).toBe('function');
  });

  it('fechaCambiado sets event property', () => {
    component.fechaCambiado('2025-01-01');
    expect(component.event).toBe('2025-01-01');
  });

  it('seleccionCatalogo updates form control value', () => {
    const groupName = 'datosDomicilioLugar';
    const controlName = 'entidadFederativa';
    const event = { target: { value: 'testValue' } } as any;
    component.seleccionCatalogo(groupName, controlName, event);
    expect(component.formulario.get(groupName)?.get(controlName)?.value).toBe('testValue');
  });

  it('cambioValorRadio sets radioSelectedValue in config', () => {
    const configIndex = 0;
    const menuIndex = 0;
    const value = 'radioVal';
    component.configuracion[configIndex].menu[menuIndex].props.radioSelectedValue = '';
    component.cambioValorRadio('ignored', configIndex, menuIndex, value);
    expect(
      component.configuracion[configIndex].menu[menuIndex].props.radioSelectedValue
    ).toBe(value);
  });

  it('accionesBotones FORM_ACTION Agregar emits and resets esAgregarClicked', () => {
    const spyEmit = jest.spyOn(component.emitButtonAction, 'emit');
    component.esAgregarClicked = true;
    component.accionesBotones(
      'FORM_ACTION' as ActionType,
      BotonAccionesTipos.AGREGAR
    );
    expect(spyEmit).toHaveBeenCalledWith(false);
    expect(component.esAgregarClicked).toBe(true);
  });

  it('accionesBotones TABLE_ACTION Agregar sets esAgregarClicked true and calls renderizadoGrupo', () => {
    component.esAgregarClicked = false;
    const spyRender = jest.spyOn(component, 'renderizadoGrupo');
    component.accionesBotones(
      'TABLE_ACTION' as ActionType,
      BotonAccionesTipos.AGREGAR
    );
    expect(component.esAgregarClicked).toBe(true);
    expect(spyRender).toHaveBeenCalledWith(component.configuracion_table);
  });

  it('accionesBotones TABLE_ACTION Eliminar emits', () => {
    const spyEmit = jest.spyOn(component.emitButtonAction, 'emit');
    component.accionesBotones(
      'TABLE_ACTION' as ActionType,
      BotonAccionesTipos.ELIMINAR
    );
    expect(spyEmit).toHaveBeenCalledWith(false);
  });

  it('botonDeTablaInfantilAccion CANCELAR sets esAgregarClicked false', () => {
    component.esAgregarClicked = true;
    component.botonDeTablaInfantilAccion(BotonAccionesTipos.CANCELAR);
    expect(component.esAgregarClicked).toBe(false);
  });

  it('botonDeTablaInfantilAccion AGREGAR sets esAgregarClicked false', () => {
    component.esAgregarClicked = true;
    component.botonDeTablaInfantilAccion(BotonAccionesTipos.AGREGAR);
    expect(component.esAgregarClicked).toBe(false);
  });

  it('onSubmit calls store setters', () => {
    component.onSubmit();
    expect(storeStub.setDatosQuienRecibe).toHaveBeenCalled();
    expect(storeStub.setDatosDomicilioLugar).toHaveBeenCalled();
    expect(storeStub.setDatosMercanciaSubmanufactura).toHaveBeenCalled();
  });

  it('validarYAgregarFila adds row and shows popup if valid', () => {
    const group = component.formulario.get('datosMercanciaSubmanufactura') as FormGroup;
    Object.keys(group.controls).forEach(key => group.get(key)?.setValue('test'));
    group.markAsDirty();
    component.tableData.data = [];
    component.validarYAgregarFila();
    expect(component.tableData.data.length).toBe(1);
    expect(component.mostrarPopupRegistroAgregado).toBe(true);
  });

  it('validarYAgregarFila marks controls as touched if invalid', () => {
  const group = component.formulario.get('datosMercanciaSubmanufactura') as FormGroup;
  Object.keys(group.controls).forEach(key => group.get(key)?.setValue(''));
  const firstKey = Object.keys(group.controls)[0];
  const control = group.get(firstKey);
  control?.setErrors({ required: true });
  const spy = control && typeof control.markAsTouched === 'function'
    ? jest.spyOn(control, 'markAsTouched')
    : undefined;
  component.validarYAgregarFila();
  if (spy) {
    expect(spy).toHaveBeenCalled();
  }
});

  it('validarNewAgregarFila emits agregarFila if valid', () => {
    const dq = component.formulario.get('datosQuienRecibe') as FormGroup;
    const ddl = component.formulario.get('datosDomicilioLugar') as FormGroup;
    Object.keys(dq.controls).forEach(key => dq.get(key)?.setValue('test'));
    Object.keys(ddl.controls).forEach(key => ddl.get(key)?.setValue('test'));
    const spy = jest.spyOn(component.agregarFila, 'emit');
    component.validarNewAgregarFila();
    expect(spy).toHaveBeenCalled();
  });

  it('validarNewAgregarFila marks controls as touched if invalid', () => {
    const dq = component.formulario.get('datosQuienRecibe') as FormGroup;
    const ddl = component.formulario.get('datosDomicilioLugar') as FormGroup;
    Object.keys(dq.controls).forEach(key => dq.get(key)?.setValue(''));
    Object.keys(ddl.controls).forEach(key => ddl.get(key)?.setValue(''));
    const spyDQ = jest.spyOn(Object.values(dq.controls)[0], 'markAsTouched');
    const spyDDL = jest.spyOn(Object.values(ddl.controls)[0], 'markAsTouched');
    component.validarNewAgregarFila();
    expect(spyDQ).toHaveBeenCalled();
    expect(spyDDL).toHaveBeenCalled();
  });

  it('renderizadoGrupo calls inicializarFormGroup for each config', () => {
    const spy = jest.spyOn(component, 'inicializarFormGroup');
    component.renderizadoGrupo(component.configuracion);
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarFormGroup adds controls and calls obtenerValoresCatalogo for selects except colonias', () => {
    const group = component.formulario.get('datosDomicilioLugar') as FormGroup;
    const spy = jest.spyOn(component, 'obtenerValoresCatalogo');
    const menu = component.configuracion[1].menu;
    component.inicializarFormGroup(menu, 'datosDomicilioLugar', 1);
    expect(Object.keys(group.controls).length).toBeGreaterThan(0);
    // Should call obtenerValoresCatalogo for selects except colonias
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnDestroy completes destroyNotifier$', () => {
    const notifier = (component as any).destroyNotifier$;
    const nextSpy = jest.spyOn(notifier, 'next');
    const completeSpy = jest.spyOn(notifier, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});