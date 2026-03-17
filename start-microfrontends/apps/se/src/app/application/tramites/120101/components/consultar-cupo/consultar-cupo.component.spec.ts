import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConsultarCupoComponent } from './consultar-cupo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { InstrumentoCupoTPLForm } from '../../../120201/models/cupos.model';
import { of } from 'rxjs';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';

describe('ConsultarCupoComponent', () => {
  let component: ConsultarCupoComponent;
  let fixture: ComponentFixture<ConsultarCupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarCupoComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarCupoComponent);
    component = fixture.componentInstance;

    component.consultaState = {
      readonly: false,
    } as any;
    
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer "mostrar" en true para "descripcion" cuando fraccionArancelaria tiene un valor', () => {
    component.forma = new FormGroup({
      ninoFormGroup: new FormGroup({
        fraccionArancelaria: new FormControl('12345')
      })
    });
    component.consultarCupoFormData = [
      { campo: 'descripcion', mostrar: false, labelNombre: '', clase: '', tipoInput: '', desactivado: false },
      { campo: 'otroCampo', mostrar: false, labelNombre: '', clase: '', tipoInput: '', desactivado: false }
    ];
    component.mostrarCampoDeDescripcion();
    const descripcionField = component.consultarCupoFormData.find(f => f.campo === 'descripcion');
    expect(descripcionField?.mostrar).toBe(true);
  });

  it('no debería cambiar "mostrar" si fraccionArancelaria está vacío', () => {
    component.forma = new FormGroup({
      ninoFormGroup: new FormGroup({
        fraccionArancelaria: new FormControl('')
      })
    });
    component.consultarCupoFormData = [
      { campo: 'descripcion', mostrar: false, labelNombre: '', clase: '', tipoInput: '', desactivado: false }
    ];
    component.mostrarCampoDeDescripcion();
    expect(component.consultarCupoFormData[0].mostrar).toBe(false);
  });

  it('debería llamar al store y al servicio con los valores correctos', () => {
    const event = { campo: 'descripcion', valor: 'valor1' };
    const setDynamicFieldValueSpy = jest.spyOn(component['tramite120101Store'], 'setDynamicFieldValue');
    const setFormValueSpy = jest.spyOn(component['servicioDeFormularioService'], 'setFormValue');
    component.establecerCambioDeValor(event);
    expect(setDynamicFieldValueSpy).toHaveBeenCalledWith('descripcion', 'valor1');
    expect(setFormValueSpy).toHaveBeenCalledWith('consultarCupoForm', { descripcion: 'valor1' });
  });

  it('debería no hacer nada si el evento es nulo', () => {
    const setDynamicFieldValueSpy = jest.spyOn(component['tramite120101Store'], 'setDynamicFieldValue');
    const setFormValueSpy = jest.spyOn(component['servicioDeFormularioService'], 'setFormValue');
  
    component.establecerCambioDeValor(null as any);
  
    expect(setDynamicFieldValueSpy).not.toHaveBeenCalled();
    expect(setFormValueSpy).not.toHaveBeenCalled();
  });

  it('no debería hacer nada si el evento es nulo', () => {
    const setDynamicFieldValueSpy = jest.spyOn(component['tramite120101Store'], 'setDynamicFieldValue');
    const setFormValueSpy = jest.spyOn(component['servicioDeFormularioService'], 'setFormValue');
    component.establecerCambioDeValor(null as any);
    expect(setDynamicFieldValueSpy).not.toHaveBeenCalled();
    expect(setFormValueSpy).not.toHaveBeenCalled();
  });

  it('no debería llamar al servicio ni actualizar el store si el formulario es inválido', () => {
    component.ninoFormGroup.setErrors({ invalid: true });
    const mostrarSpy = jest.spyOn(component, 'mostrarCampoDeDescripcion');
    const serviceSpy = jest.spyOn(component['solicitudDeRegistroTplService'], 'obtenerTablaDatos');
    const storeSpy = jest.spyOn(component['tramite120101Store'], 'setDynamicFieldValue');
    component.buscar();
    expect(mostrarSpy).not.toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
    expect(storeSpy).not.toHaveBeenCalled();
  });

  it('debería completar destroy$ al destruir', () => {
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería obtener datos de países y actualizar las opciones del campo pais', fakeAsync(() => {
    const mockPaisData = [
      { id: 1, descripcion: 'Mexico' },
      { id: 2, descripcion: 'USA' },
    ];
    jest.spyOn(component['solicitudDeRegistroTplService'], 'getPaisData')
      .mockReturnValue(of(mockPaisData));
    component.consultarCupoFormData = [
      {
        campo: 'pais',
      } as ModeloDeFormaDinamica,
    ];
    component.obtenerPaisDatos();
    tick();
    expect(component.consultarCupoFormData[0].opciones).toEqual([
      { descripcion: 'Mexico', id: 1 },
      { descripcion: 'USA', id: 2 },
    ]);
  }));

  it('debería obtener datos de clasificación y actualizar las opciones del campo clasificacion', fakeAsync(() => {
    const mockClasificacionData = [
      { id: 1, descripcion: 'Regimen 1' },
      { id: 2, descripcion: 'Regimen 2' },
    ];
    jest.spyOn(component['solicitudDeRegistroTplService'], 'getClasificacionRegimenData')
      .mockReturnValue(of(mockClasificacionData));
    component.consultarCupoFormData = [
      {
        campo: 'clasificacion',
      } as ModeloDeFormaDinamica,
    ];
    component.obtenerClasificacionRegimenDatos();
    tick();
    expect(component.consultarCupoFormData[0].opciones).toEqual([
      { descripcion: 'Regimen 1', id: 1 },
      { descripcion: 'Regimen 2', id: 2 },
    ]);
  }));

  it('debería emitir el evento cuando se llama a controladorDeClicsArchivo', () => {
  const spy = jest.spyOn(component.emitirFilaClicControlador, 'emit');
  const mockRow = {
    id: 1,
    cveTratado: 'MX-USA',
    categoriaTextil: 'CT-1',
  } as InstrumentoCupoTPLForm;
  component.controladorDeClicsArchivo(mockRow);
  expect(spy).toHaveBeenCalledWith(mockRow);
});

  it('debería obtener datos de la tabla, actualizar cuerpoTabla y el store, y emitir la fila si es de solo lectura', fakeAsync(() => {
  const mockTabla = [{
    id: 1,
    cveTratado: 'MX',
    cveRegimenClasificacion: 'R1',
    cvePaisDestino: 'USA',
    fraccionArancelaria: '123456',
    categoriaTextilDescripcion: 'Textil A',
    productoDescripcion: 'Producto A',
    subProductoClasificacion: 'Sub',
    fechaInicioVigencia: '2024-01-01',
    fechaFinVigencia: '2024-12-31',
    montoDisponible: '100',
    categoriaTextil: 'CT',
    asignacionMecanismo: 'Manual',
    unidad: 'Kg',
    conversionFactor: 1.0,
  }];

  component.consultaState.readonly = true;

  jest.spyOn(component['solicitudDeRegistroTplService'], 'obtenerTablaDatos')
    .mockReturnValue(of({
      code: 200,
      message: 'Success',
      data: mockTabla
    }));

  const storeSpy = jest.spyOn(component['tramite120101Store'], 'setDynamicFieldValue');
  const emitSpy = jest.spyOn(component.emitirFilaClicControlador, 'emit');

  component.obtenerTablaDatos();
  tick();

  expect(component.cuerpoTabla.length).toBe(1);
  expect(storeSpy).toHaveBeenCalledWith('cuerpoTabla', component.cuerpoTabla);
  expect(emitSpy).toHaveBeenCalledWith(mockTabla[0]);
}));

it('debería suscribirse a selectSolicitudDeRegistroTpl$, actualizar cuerpoTabla y registrar el formulario en init', fakeAsync(() => {
  const mockState = {
    cuerpoTabla: [
      { id: 1, categoriaTextilDescripcion: 'Textil A' } as InstrumentoCupoTPLForm
    ]
  } as any;

  component['tramite120101Query'].selectSolicitudDeRegistroTpl$ = of(mockState) as any;
  const registerSpy = jest.spyOn(component['servicioDeFormularioService'], 'registerForm');
  component.ngOnInit();
  tick();

  expect(component.cuerpoTabla.length).toBe(1);
  expect(component.cuerpoTabla[0].categoriaTextilDescripcion).toBe('Textil A');
  expect(registerSpy).toHaveBeenCalledWith('consultarCupoForm', component.ninoFormGroup);
}));




});
