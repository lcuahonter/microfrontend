import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { TituloComponent } from '@ng-mf/data-access-user';

describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;
  let datosSolicitudServiceMock: Partial<DatosSolicitudService>;
  let tramiteStoreMock: Partial<Tramite240123Store>;
  let locationMock: Partial<Location>;

  const FRACCIONES_CATALOGO = [
    { nombre: 'Fracción 1', id: 1 },
    { nombre: 'Fracción 2', id: 2 },
  ];

  const MONEDA_CATALOGO = [
    { nombre: 'MXN', id: 1 },
    { nombre: 'USD', id: 2 },
  ];

  beforeEach(async () => {
    datosSolicitudServiceMock = {
      obtenerFraccionesCatalogo: jest.fn().mockReturnValue(of(FRACCIONES_CATALOGO)),
      obtenerMonedaCatalogo: jest.fn().mockReturnValue(of(MONEDA_CATALOGO)),
    };

    tramiteStoreMock = {
      updateMercanciaTablaDatos: jest.fn(),
    };

    locationMock = {
      back: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CatalogoSelectComponent,
        DatosMercanciaComponent,
        DatosMercanciaContenedoraComponent,
        TituloComponent,
      ],
      providers: [
        { provide: DatosSolicitudService, useValue: datosSolicitudServiceMock },
        { provide: Tramite240123Store, useValue: tramiteStoreMock },
        { provide: Location, useValue: locationMock },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los catálogos correctamente', () => {
    component.ngOnInit();
    expect(component.fraccionesCatalogo.length).toBeGreaterThan(0);
    expect(component.monedaCatalogo.length).toBeGreaterThan(0);
  });

  it('debería inicializar el formulario con los valores por defecto', () => {
    component.ngOnInit();
    expect(component.datosMercancia.value.fraccionArancelaria).toBe('25030002');
    expect(component.datosMercancia.get('descFraccion')?.value).toBe(
      'Azufre de cualquier clase, excepto el sublimado, el precipitado y el coloidal.'
    );
    expect(component.datosMercancia.get('umt')?.value).toBe('Kilogramo');
  });

  it('debería guardar correctamente los datos de la mercancía', () => {
    component.datosMercancia.patchValue({
      fraccionArancelaria: '25030002',
      descFraccion: 'Azufre de cualquier clase, excepto el sublimado, el precipitado y el coloidal.',
      umt: 'Kilogramo',
      cantidadUMT: 10,
      valorComercial: 100,
      tipoMoneda: 'MXN',
      descripcion: 'Descripción',
    });

    component.guardar();

    expect(component.datosMercancias.length).toBeGreaterThan(0);
    expect(tramiteStoreMock.updateMercanciaTablaDatos).toHaveBeenCalledWith(component.datosMercancias);
  });

 it('debería limpiar el formulario correctamente', () => {
  component.limpiarFormulario();
  const formValue = component.datosMercancia.getRawValue(); 

  expect(formValue).toEqual({
    descripcion: null,
    fraccionArancelaria: "",
    descFraccion: null,
    umt: null,
    cantidadUMT: null,
    umc: null,
    valorComercial: null,
    tipoMoneda: "",
  });
});


  it('debería cancelar y regresar correctamente', () => {
    component.cancelar();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('debería emitir el evento cerrar al actualizar la tabla de mercancía', () => {
    jest.spyOn(component.cerrar, 'emit');
    const mercancias = [
      {
        fraccionArancelaria: '25030002',
        descripcionFraccion: 'Azufre',
        unidadMedidaTarifa: 'Kilogramo',
        cantidadUMT: 10,
        valorComercial: 100,
        tipoMoneda: 'MXN',
        descripcion: 'Descripción',
      },
    ];
    component.updateMercanciaDetalle(mercancias);
    expect(component.cerrar.emit).toHaveBeenCalled();
    expect(tramiteStoreMock.updateMercanciaTablaDatos).toHaveBeenCalledWith(mercancias);
  });

  it('debería llamar cargarDatos al crear el formulario', () => {
    const spy = jest.spyOn(component, 'cargarDatos');
    component.crearFormaulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debería agregar mercancía al array datosMercancias al guardar', () => {
    const initialLength = component.datosMercancias.length;
    component.datosMercancia.patchValue({
      fraccionArancelaria: '25030002',
      descFraccion: 'Azufre de cualquier clase, excepto el sublimado, el precipitado y el coloidal.',
      umt: 'Kilogramo',
      cantidadUMT: 5,
      valorComercial: 50,
      tipoMoneda: 'USD',
      descripcion: 'Otra descripción',
    });
    component.guardar();
    expect(component.datosMercancias.length).toBe(initialLength + 1);
  });

  it('debería resetear el formulario después de guardar', () => {
    component.datosMercancia.patchValue({
      fraccionArancelaria: '25030002',
      descFraccion: 'Azufre de cualquier clase, excepto el sublimado, el precipitado y el coloidal.',
      umt: 'Kilogramo',
      cantidadUMT: 5,
      valorComercial: 50,
      tipoMoneda: 'USD',
      descripcion: 'Otra descripción',
    });
    const resetSpy = jest.spyOn(component.datosMercancia, 'reset');
    component.guardar();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('debería cargar catálogos correctamente en cargarDatos', () => {
    component.fraccionesCatalogo = [];
    component.monedaCatalogo = [];
    component.cargarDatos();
    expect(component.fraccionesCatalogo.length).toBeGreaterThan(0);
    expect(component.monedaCatalogo.length).toBeGreaterThan(0);
  });

  it('debería crear el formulario con los valores iniciales correctos', () => {
    component.crearFormaulario();
    expect(component.datosMercancia.get('descripcion')?.value).toBe('PRUEBA QA');
    expect(component.datosMercancia.get('fraccionArancelaria')?.value).toBe('25030002');
    expect(component.datosMercancia.get('descFraccion')?.value).toBe(
      'Azufre de cualquier clase, excepto el sublimado, el precipitado y el coloidal.'
    );
    expect(component.datosMercancia.get('umt')?.value).toBe('Kilogramo');
  });

  it('debería limpiar el formulario y dejar todos los campos en null/empty string', () => {
    component.datosMercancia.patchValue({
      descripcion: 'test',
      fraccionArancelaria: 'test',
      cantidadUMT: 1,
      umc: 'test',
      valorComercial: 1,
      tipoMoneda: 'test',
    });
    component.limpiarFormulario();
    expect(component.datosMercancia.get('descripcion')?.value).toBeNull();
    expect(component.datosMercancia.get('fraccionArancelaria')?.value).toBe('');
    expect(component.datosMercancia.get('cantidadUMT')?.value).toBeNull();
    expect(component.datosMercancia.get('umc')?.value).toBeNull();
    expect(component.datosMercancia.get('valorComercial')?.value).toBeNull();
    expect(component.datosMercancia.get('tipoMoneda')?.value).toBe('');
  });

  it('debería destruir el componente y cerrar el observable', () => {
    const completeSpy = jest.spyOn(component['unsubscribe$'], 'next');
    const destroySpy = jest.spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
    expect(destroySpy).toHaveBeenCalled();
  });
});
