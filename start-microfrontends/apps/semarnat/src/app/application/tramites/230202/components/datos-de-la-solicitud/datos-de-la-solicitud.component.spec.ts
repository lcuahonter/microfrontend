import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { PhytosanitaryReexportacionService } from '../../services/phytosanitary-reexportacion.service';
import { provideHttpClient } from '@angular/common/http';
import { DatosSolicitud } from '../../models/datos-tramite.model';
import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDeLaSolicitudComponent],
      providers: [PhytosanitaryReexportacionService, provideHttpClient()], // Add any necessary providers here
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cerrarModal and close the modal', () => {
    const closeModalElement = document.createElement('button');
    jest.spyOn(closeModalElement, 'click');
    component.closeModal = { nativeElement: closeModalElement } as ElementRef;

    component.cerrarModal();

    expect(closeModalElement.click).toHaveBeenCalled();
  });

  it('should initialize the form in inicializarFormulario', () => {
    component.solicitudState = {
      numeroDeCertificado: '123',
      aduana: 'Test Aduana',
      pais: 'Test Pais',
      entidades: 'Test Entidades',
      descripcionProducto: 'Test Producto',
      unidadDeMedida: 'Test Unidad',
      lungarDeEntrada: 'Test Lugar',
      medioDeTransporte: 'Test Transporte',
      numeroYDescripcion: 'Test Descripcion',
      codigoPostal: '12345',
      estado: 'Test Estado',
      calle: 'Test Calle',
      numeroExterior: '123',
      numeroInterior: '456',
      colonia: 'Test Colonia',
      fraccionArancelaria: 'Test Fraccion',
      descripcionFraccionArancelaria: 'Test Descripcion Fraccion',
      cantidad: 10,
      cantidadLetra: 'Diez',
      genero: 'Test Genero',
      especie: 'Test Especie',
      nombreComun: 'Test Nombre Comun',
    } as any;

    component.inicializarFormulario();

    expect(component.solicitudForm).toBeDefined();
    expect(component.agregarMercanciasForm).toBeDefined();
    expect(
      component.solicitudForm.get('reexportacionForm.numeroDeCertificado')
        ?.value
    ).toBe('123');
  });

  it('should update selectedRows in onSelectedRowsChange', () => {
    const mockSelectedRows = [{ id: 1 }, { id: 2 }] as DatosSolicitud[];

    component.onSelectedRowsChange(mockSelectedRows);

    expect(component.selectedRows).toEqual([1, 2]);
  });

  it('should not update selectedRows if onSelectedRowsChange is called with empty array', () => {
    component.selectedRows = [1, 2];
    component.onSelectedRowsChange([]);
    expect(component.selectedRows).toEqual([]);
  });

  it('should not add to datosSolicitud if agregarSolicitud response is not success', () => {
    const mockResponse = {
      success: false,
      datos: { id: 2, fraccionArancelaria: '5678' },
    };
    const mockServiceMethod = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (callback: (response: any) => void) => callback(mockResponse),
      }),
    });
    component.phytosanitaryReexportacionService.agregarSolicitud = mockServiceMethod as any;
    component.datosSolicitud = [];
    const mockStoreMethod = jest.fn();
    component.store.setDatosSolicitud = mockStoreMethod as any;
    const mockCerrarModal = jest.fn();
    component.cerrarModal = mockCerrarModal;

    component.agregarSolicitud();

    expect(component.datosSolicitud.length).toBe(0);
    expect(mockStoreMethod).not.toHaveBeenCalled();
    expect(mockCerrarModal).not.toHaveBeenCalled();
  });

  it('should handle cerrarModal when closeModal is undefined', () => {
    component.closeModal = undefined as any;
    expect(() => component.cerrarModal()).not.toThrow();
  });

  it('should initialize forms on ngOnInit', () => {
    const spyInit = jest.spyOn(component, 'inicializarFormulario');
    component.ngOnInit();
    expect(spyInit).toHaveBeenCalled();
    expect(component.solicitudForm).toBeInstanceOf(FormGroup);
    expect(component.agregarMercanciasForm).toBeInstanceOf(FormGroup);
  });

  it('should disable forms when soloLectura is true', () => {
    component.soloLectura = true;
    component.updateEstadoFormulario();
    expect(component.solicitudForm.disabled).toBe(true);
    expect(component.agregarMercanciasForm.disabled).toBe(true);
  });

  it('should enable forms when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarFormulario();
    component.solicitudForm.disable();
    component.agregarMercanciasForm.disable();
    component.updateEstadoFormulario();
    expect(component.solicitudForm.enabled).toBe(true);
    expect(component.agregarMercanciasForm.enabled).toBe(true);
  });

  it('should call setNumeroDeCertificado on numeroDeCertificadoSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setNumeroDeCertificado');
    component.solicitudForm.get('reexportacionForm.numeroDeCertificado')?.setValue('CERT123');
    component.numeroDeCertificadoSeleccion();
    expect(spy).toHaveBeenCalledWith('CERT123');
  });

  it('should call setAduana on aduanaSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setAduana');
    component.solicitudForm.get('reexportacionForm.aduana')?.setValue('ADUANA1');
    component.aduanaSeleccion();
    expect(spy).toHaveBeenCalledWith('ADUANA1');
  });

  it('should call setPais on paisSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setPais');
    component.solicitudForm.get('reexportacionForm.pais')?.setValue('PAIS1');
    component.paisSeleccion();
    expect(spy).toHaveBeenCalledWith('PAIS1');
  });

  it('should call setEntidades on entidadesSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setEntidades');
    component.solicitudForm.get('reexportacionForm.entidades')?.setValue('ENT1');
    component.entidadesSeleccion();
    expect(spy).toHaveBeenCalledWith('ENT1');
  });

  it('should call setDescripcionProducto on descripcionProductoSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setDescripcionProducto');
    component.solicitudForm.get('reexportacionForm.descripcionProducto')?.setValue('PROD1');
    component.descripcionProductoSeleccion();
    expect(spy).toHaveBeenCalledWith('PROD1');
  });

  it('should call setFraccionArancelaria on fraccionArancelariaSeleccion', () => {
    component.inicializarFormulario();
    if (!component.solicitudForm.get('datosMercancia')) {
      component.solicitudForm.addControl('datosMercancia', component.fb.group({ fraccionArancelaria: ['FRAC1'] }));
    }
    const spy = jest.spyOn(component.store, 'setFraccionArancelaria');
    component.solicitudForm.get('datosMercancia.fraccionArancelaria')?.setValue('FRAC1');
    component.fraccionArancelariaSeleccion();
    expect(spy).toHaveBeenCalledWith('FRAC1');
  });

  it('should call setGenero on generoSeleccion', () => {
    component.inicializarFormulario();
    if (!component.solicitudForm.get('datosMercancia')) {
      component.solicitudForm.addControl('datosMercancia', component.fb.group({ genero: ['GEN1'] }));
    }
    const spy = jest.spyOn(component.store, 'setGenero');
    component.solicitudForm.get('datosMercancia.genero')?.setValue('GEN1');
    component.generoSeleccion();
    expect(spy).toHaveBeenCalledWith('GEN1');
  });

  it('should call setEspecie on especieSeleccion', () => {
    component.inicializarFormulario();
    if (!component.solicitudForm.get('datosMercancia')) {
      component.solicitudForm.addControl('datosMercancia', component.fb.group({ especie: ['ESP1'] }));
    }
    const spy = jest.spyOn(component.store, 'setEspecie');
    component.solicitudForm.get('datosMercancia.especie')?.setValue('ESP1');
    component.especieSeleccion();
    expect(spy).toHaveBeenCalledWith('ESP1');
  });

  it('should call setNombreComun on nombreComunSeleccion', () => {
    component.inicializarFormulario();
    if (!component.solicitudForm.get('datosMercancia')) {
      component.solicitudForm.addControl('datosMercancia', component.fb.group({ nombreComun: ['NOM1'] }));
    }
    const spy = jest.spyOn(component.store, 'setNombreComun');
    component.solicitudForm.get('datosMercancia.nombreComun')?.setValue('NOM1');
    component.nombreComunSeleccion();
    expect(spy).toHaveBeenCalledWith('NOM1');
  });

  it('should call setUnidadDeMedida on unidadDeMedidaSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setUnidadDeMedida');
    component.solicitudForm.get('reexportacionForm.unidadDeMedida')?.setValue('UM1');
    component.unidadDeMedidaSeleccion();
    expect(spy).toHaveBeenCalledWith('UM1');
  });

  it('should call setMedioDeTransporte on medioDeTransporteSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setMedioDeTransporte');
    component.solicitudForm.get('reexportacionForm.medioDeTransporte')?.setValue('MEDIO1');
    component.medioDeTransporteSeleccion();
    expect(spy).toHaveBeenCalledWith('MEDIO1');
  });

  it('should call setEstado on estadoSeleccion', () => {
    component.inicializarFormulario();
    const spy = jest.spyOn(component.store, 'setEstado');
    component.solicitudForm.get('reexportacionForm.estado')?.setValue('EST1');
    component.estadoSeleccion();
    expect(spy).toHaveBeenCalledWith('EST1');
  });

  it('should update crosslist property on changeCrosslist', () => {
    // Mock QueryList<CrosslistComponent>
    component.crossList = {
      reset: jest.fn(),
      notifyOnChanges: jest.fn(),
      toArray: () => [],
      map: () => [],
      filter: () => [],
      find: () => undefined,
      reduce: () => undefined,
      forEach: () => {},
      some: () => false,
      first: undefined,
      last: undefined,
      length: 0,
      changes: { subscribe: jest.fn() }
    } as any;

    component.changeCrosslist([]);
    expect(component.crossList).toBeDefined();
  });

  it('should add a detalle to datosDetalle and call store.setDatosDetalle on agregarDetalle', () => {
    component.datosDetalle = [];
    const detalle: DatosSolicitud = {
      id: 1,
      fraccionArancelaria: '1234',
      cantidad: 5,
      cantidadLetra: 'cinco',
      descripcion: 'detalle test'
    } as any;
    // Mock service response
    const mockResponse = { success: true, datos: { ...detalle } };
    component.phytosanitaryReexportacionService.agregarDetalle = jest.fn().mockReturnValue({
      pipe: () => ({
        subscribe: (cb: any) => cb(mockResponse)
      })
    }) as any;
    const storeSpy = jest.spyOn(component.store, 'setDatosDetalle');
    component.agregarDetalle();
    expect(component.datosDetalle.length).toBe(1);
    expect(storeSpy).toHaveBeenCalledWith(component.datosDetalle);
  });

  it('should remove selected detalles from datosDetalle and call store.setDatosDetalle on eliminarDetalle', () => {
    component.datosDetalle = [
      { id: 1 } as any,
      { id: 2 } as any
    ];
    component.selectedRowsDetalle = [1];
    const storeSpy = jest.spyOn(component.store, 'setDatosDetalle');
    component.eliminarDetalle();
    expect(component.datosDetalle).toEqual([{ id: 2 }]);
    expect(storeSpy).toHaveBeenCalledWith([{ id: 2 }]);
    expect(component.selectedRowsDetalle).toEqual([]);
  });

  it('should remove selected solicitudes from datosSolicitud and call store.setDatosSolicitud on eliminar', () => {
    component.datosSolicitud = [
      { id: 1 } as any,
      { id: 2 } as any
    ];
    component.selectedRows = [1];
    const storeSpy = jest.spyOn(component.store, 'setDatosSolicitud');
    component.eliminar();
    expect(component.datosSolicitud).toEqual([{ id: 2 }]);
    expect(storeSpy).toHaveBeenCalledWith([{ id: 2 }]);
    expect(component.selectedRows).toEqual([]);
  });

});
