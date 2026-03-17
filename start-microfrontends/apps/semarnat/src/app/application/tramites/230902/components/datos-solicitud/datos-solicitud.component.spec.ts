import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosSolicitudComponent } from './datos-solicitud.component';

import { PermisoCitesService } from '../../services/permiso-cites.service';
import { Tramite230902Store } from '../../estados/tramite230902.store';
import { Tramite230902Query } from '../../estados/tramite230902.query';
import { CatalogoSelectComponent, CrosslistComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';

describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;
  let permisoCitesServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    permisoCitesServiceMock = {
      inicializaDatosSolicitudDatosCatalogos: jest.fn(),
      inicializaMercanciaDatosCatalogos: jest.fn(),
      loadTablaDatos: jest.fn().mockReturnValue(of([])),
      fraccionArancelaria: [{ id: '1', descripcion: '0101.21.01' }],
      fraccionArancelariaDescripcion: [{ id: '1', descripcion: 'Caballos pura sangre' }],
      clasificacionTaxonomica: [{ descripcion: 'Mamífero' }],
      nombreCientifico: [{ descripcion: 'Equus ferus caballus' }],
      nombreComun: [{ descripcion: 'Caballo' }],
      unidadMedida: [{ descripcion: 'Cabeza' }],
      paisOrigen: [{ descripcion: 'México' }],
      paisProcedencia: [{ descripcion: 'México' }],
    };

    tramiteStoreMock = {
      establecerDatos: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        tipodeMovimiento: '1',
        tipoRegimen: 'A',
        mercanciaTablaDatos: []
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosSolicitudComponent],
      imports: [ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent, CrosslistComponent],
      providers: [
        FormBuilder,
        { provide: PermisoCitesService, useValue: permisoCitesServiceMock },
        { provide: Tramite230902Store, useValue: tramiteStoreMock },
        { provide: Tramite230902Query, useValue: tramiteQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar formSolicitud con valores del estado', () => {
    expect(component.formSolicitud.get('tipodeMovimiento')?.value).toBe('1');
    expect(component.formSolicitud.get('tipoRegimen')?.value).toBe('A');
  });

  it('debería alternar la visibilidad del modal', () => {
    component.showDatosMercanciaModal = false;
    component.alternarVisibilidadModalMercancia();
    expect(component.showDatosMercanciaModal).toBe(true);
  });

  it('debería crear un formulario de mercancía vacío', () => {
    component.crearNuevoFormularioMercancia();
    expect(component.formMercancia).toBeDefined();
    expect(component.formMercancia.valid).toBe(false);
  });

  it('no debería agregar mercancía si el formulario es inválido', () => {
    component.crearNuevoFormularioMercancia();
    component.enviarFormularioMercancia();
    expect(component.tablaDatos.length).toBe(0);
  });

  it('debería agregar una mercancía si el formulario es válido', () => {
    component.crearNuevoFormularioMercancia();
    component.formMercancia.patchValue({
      fraccionArancelaria: '1',
      descripcion: 'Caballo reproductor',
      clasificacionTaxonomica: '1',
      nombreCientifico: '1',
      nombreComun: '1',
      marca: 'No aplica',
      cantidad: '2',
      unidadMedida: '1',
      paisOrigen: '1',
      paisProcedencia: '1',
    });
    component.enviarFormularioMercancia();
    expect(component.tablaDatos.length).toBe(1);
  });

  it('debería manejar la selección y habilitar modificación', () => {
    const row = {
      id: 1,
      fraccionArancelaria: '0101.21.01',
      fraccionDescripcion: '',
      otraFraccion: false,
      descripcion: 'Animal',
      rendimientoProducto: '',
      clasificacionTaxonomica: 'Mamífero',
      nombreCientifico: 'Equus ferus caballus',
      nombreComun: 'Caballo',
      marca: 'MarcaX',
      cantidad: '1',
      unidadMedida: 'Cabeza',
      paisOrigen: 'México',
      paisProcedencia: 'México',
    };
    component.tablaDatos = [row];
    component.hadleFilaSeleccionada([row]);
    expect(component.enableModficarBoton).toBe(true);
    expect(component.enableEliminarBoton).toBe(true);
  });

  it('debería modificar una mercancía seleccionada', () => {
    const row = {
      id: 1,
      fraccionArancelaria: '0101.21.01',
      fraccionDescripcion: '',
      otraFraccion: false,
      descripcion: 'Animal',
      rendimientoProducto: '',
      clasificacionTaxonomica: 'Mamífero',
      nombreCientifico: 'Equus ferus caballus',
      nombreComun: 'Caballo',
      marca: 'MarcaX',
      cantidad: '1',
      unidadMedida: 'Cabeza',
      paisOrigen: 'México',
      paisProcedencia: 'México',
    };
    component.tablaDatos = [row];
    component.listaFilaSeleccionadaMercancia = [row];
    component.filaSeleccionada = row;
    component.modficarMercanciaItem();
    expect(component.formMercancia).toBeDefined();
    expect(component.esOperacionDeActualizacion).toBe(true);
  });

  it('debería eliminar mercancías seleccionadas', () => {
    const row = {
      id: 1,
      fraccionArancelaria: '0101.21.01',
      fraccionDescripcion: '',
      otraFraccion: false,
      descripcion: '',
      rendimientoProducto: '',
      clasificacionTaxonomica: '',
      nombreCientifico: '',
      nombreComun: '',
      marca: '',
      cantidad: '',
      unidadMedida: '',
      paisOrigen: '',
      paisProcedencia: '',
    };
    component.tablaDatos = [row];
    component.listaFilaSeleccionadaMercancia = [row];
    component.eliminarMercanciaItem(true);
    expect(component.tablaDatos.length).toBe(0);
  });

  it('debería actualizar el valor en el store desde el formulario', () => {
    component.formSolicitud.get('tipoRegimen')?.setValue('B');
    component.setValoresStore(component.formSolicitud, 'tipoRegimen');
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({ tipoRegimen: 'B' });
  });

  // Nuevos tests en español

  it('debería deshabilitar los botones si no hay selección', () => {
    component.hadleFilaSeleccionada([]);
    expect(component.enableModficarBoton).toBe(false);
    expect(component.enableEliminarBoton).toBe(false);
  });

  it('debería alternar el popup de selección múltiple', () => {
    component.enableModficarBoton = true;
    component.abrirMultipleSeleccionPopup();
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    component.cerrarMultipleSeleccionPopup();
    expect(component.multipleSeleccionPopupAbierto).toBe(false);
  });

  it('debería abrir y cerrar el popup de confirmación de eliminación', () => {
    component.abrirElimninarConfirmationopup();
    expect(component.confirmEliminarPopupAbierto).toBe(true);
    component.cerrarEliminarConfirmationPopup();
    expect(component.confirmEliminarPopupAbierto).toBe(false);
  });

  it('debería no abrir el popup de confirmación si no hay selección', () => {
    component.listaFilaSeleccionadaMercancia = [];
    component.abrirElimninarConfirmationopup = jest.fn();
    component.confirmEliminarMercanciaItem();
    expect(component.abrirElimninarConfirmationopup).not.toHaveBeenCalled();
  });

  it('debería abrir el popup de confirmación si hay selección', () => {
    component.listaFilaSeleccionadaMercancia = [{ id: 1 } as any];
    component.abrirElimninarConfirmationopup = jest.fn();
    component.confirmEliminarMercanciaItem();
    expect(component.abrirElimninarConfirmationopup).toHaveBeenCalled();
  });

  it('debería manejar el cambio de otra fracción', () => {
    component.crearNuevoFormularioMercancia();
    component.formMercancia.get('otraFraccion')?.setValue(true);
    component.manejarCambioOtraFraccion();
    expect(component.otraFraccionSeleccionada).toBe(true);
    component.formMercancia.get('otraFraccion')?.setValue(false);
    component.manejarCambioOtraFraccion();
    expect(component.otraFraccionSeleccionada).toBe(false);
  });

  it('debería manejar el cambio de fracción arancelaria', () => {
    component.crearNuevoFormularioMercancia();
    // El evento contiene el id de la fracción arancelaria seleccionada (que viene como descripcion del dropdown)
    // El método busca en fraccionArancelariaDescripcion usando Number() para hacer la comparación
    const event = { descripcion: '1' };
    component.manejarCambioFraccionArancelaria(event as any);
    expect(component.formMercancia.get('fraccionDescripcion')?.value).toBe('Caballos pura sangre');
  });

  it('debería validar si un control es inválido', () => {
    component.crearNuevoFormularioMercancia();
    const control = component.formMercancia.get('descripcion');
    control?.markAsTouched();
    expect(component.esInvalido('descripcion')).toBe(true);
  });

  it('debería alternar el modal de mercancía desde mostrarformMercanciaModal', () => {
    component.showDatosMercanciaModal = false;
    component.mostrarformMercanciaModal();
    expect(component.showDatosMercanciaModal).toBe(true);
    expect(component.esOperacionDeActualizacion).toBe(false);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const spy = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const spy2 = jest.spyOn<any, any>(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});

