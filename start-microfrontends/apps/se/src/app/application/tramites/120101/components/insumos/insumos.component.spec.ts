import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsumosComponent } from './insumos.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
import { Tramite120101Query } from '../../../../estados/queries/tramite120101.query';

describe('InsumosComponent', () => {
  let component: InsumosComponent;
  let fixture: ComponentFixture<InsumosComponent>;
  let solicitudDeRegistroTplServiceMock: any;
  let servicioDeFormularioServiceMock: any;
  let tramite120101StoreMock: any;
  let tramite120101QueryMock: any;

  beforeEach(async () => {
    solicitudDeRegistroTplServiceMock = {
      obtenerDatosTablaInsumos: jest.fn().mockReturnValue(of([])),
      obtenerDatosFraccionArancelaria: jest.fn().mockReturnValue(of([])),
      obtenerDatosEstados: jest.fn().mockReturnValue(of([])),
      obtenerTablaInsumos: jest.fn().mockReturnValue(of([])),
      establecerTablaInsumos: jest.fn()
    };

    servicioDeFormularioServiceMock = {
      registerForm: jest.fn(),
      setFormValue: jest.fn(),
      establecerTablaInsumos: jest.fn(),
      obtenerTablaInsumos: jest.fn().mockReturnValue([]),
    };

    tramite120101StoreMock = {
      setDynamicFieldValue: jest.fn(),
    };

    tramite120101QueryMock = {
      selectSolicitudDeRegistroTpl$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InsumosComponent],
      providers: [
        { provide: SolicitudDeRegistroTplService, useValue: solicitudDeRegistroTplServiceMock },
        { provide: ServicioDeFormularioService, useValue: servicioDeFormularioServiceMock },
        { provide: Tramite120101Store, useValue: tramite120101StoreMock },
        { provide: Tramite120101Query, useValue: tramite120101QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InsumosComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a setDynamicFieldValue y setFormValue cuando se llama a establecerCambioDeValor', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };

    component.establecerCambioDeValor(event);

    expect(tramite120101StoreMock.setDynamicFieldValue).toHaveBeenCalledWith(event.campo, event.valor);
    expect(servicioDeFormularioServiceMock.setFormValue).toHaveBeenCalledWith('insumosForm', {
      [event.campo]: event.valor,
    });
  });

  it('no debería hacer nada si establecerCambioDeValor se llama con null', () => {
    const setDynamicFieldValueSpy = jest.spyOn(tramite120101StoreMock, 'setDynamicFieldValue');
    const setFormValueSpy = jest.spyOn(servicioDeFormularioServiceMock, 'setFormValue');

    component.establecerCambioDeValor(null as any);

    expect(setDynamicFieldValueSpy).not.toHaveBeenCalled();
    expect(setFormValueSpy).not.toHaveBeenCalled();
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe actualizar tablaInsumos cuando se llama a obtenerDatosTablaInsumos', () => {
    const insumos = [{ DescripcionDelInsumo: 'Test Insumo', FraccionArancelaria: '1234', PaisDeOrigen: 'MX' }];
    solicitudDeRegistroTplServiceMock.obtenerDatosTablaInsumos.mockReturnValue(of(insumos));

    component.obtenerDatosTablaInsumos();

    expect(component.tablaInsumos).toEqual(insumos);
  });

  it('debería poblar opciones en insumosFormData para el campo descfraccion', () => {
  const data = [{ id: 1, descripcion: 'Test Desc' }];
  solicitudDeRegistroTplServiceMock.obtenerDatosFraccionArancelaria.mockReturnValue(of(data));

  const targetField = component.insumosFormData.find((f) => f.campo === 'descfraccion');
  targetField!.opciones = undefined;

  component.obtenerDatosFraccionArancelaria();

  expect(targetField!.opciones).toEqual([{ id: 1, descripcion: 'Test Desc' }]);
});



it('debería poblar opciones en insumosFormData para el campo Pais', () => {
  const data = [{ id: 2, descripcion: 'Mexico' }];
  solicitudDeRegistroTplServiceMock.obtenerDatosEstados.mockReturnValue(of(data));

  const targetField = component.insumosFormData.find((f) => f.campo === 'Pais');
  targetField!.opciones = undefined;

  component.obtenerDatosEstados();

  expect(targetField!.opciones).toEqual([{ id: 2, descripcion: 'Mexico' }]);
});

it('debería agregar un insumo y llamar a establecerTablaInsumos si el formulario es válido', () => {
  const establecerTablaSpy = jest.spyOn(solicitudDeRegistroTplServiceMock, 'establecerTablaInsumos');

  const mockGroup = new FormGroup({
    descripcionInsumo: new FormControl('desc'),
    fraccion: new FormControl('123'),
    Pais: new FormControl('MX'),
  });

  component.forma = new FormGroup({
    ninoFormGroup: mockGroup,
  });

  component.agregarInsumo();

  expect(component.tablaInsumos.length).toBe(1);
  expect(component.tablaInsumos[0]).toEqual({
    DescripcionDelInsumo: 'desc',
    FraccionArancelaria: '123',
    PaisDeOrigen: 'MX',
  });
  expect(establecerTablaSpy).toHaveBeenCalledWith(component.tablaInsumos);
});



});