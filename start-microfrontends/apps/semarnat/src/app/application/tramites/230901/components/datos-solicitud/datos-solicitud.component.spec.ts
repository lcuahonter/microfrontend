import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { AutorizacionesDeVidaSilvestreService } from '../../services/autorizaciones-de-vida-silvestre.service';
import { Tramite230901Store } from '../../estados/store/tramite230901.store';
import { Tramite230901Query } from '../../estados/query/tramite230901.query';
import { CatalogoSelectComponent, CrosslistComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { MercanciaConfiguracionItem } from '../../enum/mercancia-tabla.enum';

describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;
  let tramite230901StoreMock: any;
  let tramite230901QueryMock: any;
  let autorizacionesDeVidaSilvestreServiceMock: any;

  beforeEach(async () => {
    tramite230901StoreMock = {
      setTipoDeMovimiento: jest.fn(),
      setTipoDeRegimen: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
      establecerDatos: jest.fn(),
    };

    tramite230901QueryMock = {
      selectSolicitud$: of({
        tipoDeMovimiento: '1',
        tipoDeRegimen: 'A',
        mercanciaTablaDatos: [],
      }),
    };

    autorizacionesDeVidaSilvestreServiceMock = {
      inicializaDatosSolicitudDatosCatalogos: jest.fn(),
      inicializaMercanciaDatosCatalogos: jest.fn(),
      fraccionArancelaria: [{ descripcion: 'Fracción 1' }],
      clasificacionTaxonomica: [{ descripcion: 'Clasificación 1' }],
      nombreCientifico: [{ descripcion: 'Nombre Científico 1' }],
      nombreComun: [{ descripcion: 'Nombre Común 1' }],
      unidadMedida: [{ descripcion: 'Unidad 1' }],
      paisOrigen: [{ descripcion: 'País Origen 1' }],
      paisProcedencia: [{ descripcion: 'País Procedencia 1' }],
    };

    await TestBed.configureTestingModule({
      declarations: [DatosSolicitudComponent],
      imports: [ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent, CrosslistComponent],
      providers: [
        { provide: Tramite230901Store, useValue: tramite230901StoreMock },
        { provide: Tramite230901Query, useValue: tramite230901QueryMock },
        { provide: AutorizacionesDeVidaSilvestreService, useValue: autorizacionesDeVidaSilvestreServiceMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call inicializaDatosSolicitudDatosCatalogos on ngOnInit', () => {
    component.ngOnInit();
    expect(autorizacionesDeVidaSilvestreServiceMock.inicializaDatosSolicitudDatosCatalogos).toHaveBeenCalled();
  });


  it('should create formularioMercancia with default values', () => {
    component.crearNuevoFormularioMercancia();
    expect(component.formularioMercancia).toBeDefined();
    expect(component.formularioMercancia.get('fraccionArancelaria')?.value).toBe('');
    expect(component.formularioMercancia.get('descripcion')?.value).toBe('');
  });

  it('should toggle showDatosMercanciaModal when alternarModalMercancia is called', () => {
    component.mostrarModalDatosMercancia = false;
    component.alternarModalMercancia();
    expect(component.mostrarModalDatosMercancia).toBeTruthy();

    component.alternarModalMercancia();
    expect(component.mostrarModalDatosMercancia).toBeFalsy();
  });

  it('should validate esControlInvalido for invalid form controls', () => {
    component.crearNuevoFormularioMercancia();
    component.formularioMercancia.get('descripcion')?.markAsTouched();
    expect(component.esControlInvalido('descripcion')).toBeTruthy();
  });

  it('should add a new row to tablaDatos on enviarFormularioMercancia', () => {
    component.crearNuevoFormularioMercancia();
    component.formularioMercancia.get('fraccionArancelaria')?.setValue(0);
    component.formularioMercancia.get('descripcion')?.setValue('Descripción');
    component.formularioMercancia.get('clasificacionTaxonomica')?.setValue(1);
    component.formularioMercancia.get('nombreCientifico')?.setValue(1);
    component.formularioMercancia.get('nombreComun')?.setValue(1);
    component.formularioMercancia.get('unidadMedida')?.setValue(1);
    component.formularioMercancia.get('paisOrigen')?.setValue(1);
    component.formularioMercancia.get('paisProcedencia')?.setValue(1);
    component.formularioMercancia.get('marca')?.setValue('Marca');
    component.formularioMercancia.get('cantidad')?.setValue(10);

    component.enviarFormularioMercancia();
    expect(component.datosTablaMercancia.length).toBe(1); 
    expect(tramite230901StoreMock.setMercanciaTablaDatos).toHaveBeenCalled();
  });

  it('should handle fila seleccionada', () => {
    const mockRow: MercanciaConfiguracionItem = {
      id: 123,
      fraccionArancelaria: '12345678',
      fraccionDescripcion: 'desc 12345678',
      otraFraccion: false,
      descripcion: 'Descripción de la mercancía',
      rendimientoProducto: 'Rendimiento del producto',
      clasificacionTaxonomica: 'Clasificación taxonómica',
      nombreCientifico: 'Nombre científico',
      nombreComun: 'Nombre común',
      marca: 'Marca de la mercancía',
      cantidad: '10',
      unidadMedida: 'Unidad de medida',
      paisOrigen: 'País de origen',
      paisProcedencia: 'País de procedencia',
    };
    component.manejarFilaSeleccionada([mockRow]);
    expect(component.filaSeleccionadaMercancia).toEqual(mockRow);
  });

  it('should update filaSeleccionada with the latest data from tablaDatos', () => {
    component.datosTablaMercancia = [
      {
        id: 1, descripcion: 'Item 1',
        fraccionArancelaria: '',
        otraFraccion: false,
        clasificacionTaxonomica: '',
        rendimientoProducto: '',
        nombreCientifico: '',
        nombreComun: '',
        marca: '',
        cantidad: '',
        unidadMedida: '',
        paisOrigen: '',
        paisProcedencia: '',
        fraccionDescripcion: ''
      },
    ];
    component.filaSeleccionadaMercancia = { 
      id: 1, 
      descripcion: 'Updated Item',
      fraccionArancelaria: '',
      fraccionDescripcion: '',
      otraFraccion: false,
      clasificacionTaxonomica: '',
      rendimientoProducto: '',
      nombreCientifico: '',
      nombreComun: '',
      marca: '',
      cantidad: '',
      unidadMedida: '',
      paisOrigen: '',
      paisProcedencia: ''
    };
    component.manejarFilaSeleccionada([component.datosTablaMercancia[0]]);
    component.actualizarFilaSeleccionada();
    expect(component.filaSeleccionadaMercancia.descripcion).toBe('Item 1');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['notificadorDestruccion$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should confirm deletion when confirmEliminarMercanciaItem is called', () => {
    component.listaFilaSeleccionadaMercancia = [{ id: 1, descripcion: 'Item 1',
      fraccionArancelaria: '',
      otraFraccion: false,
      clasificacionTaxonomica: '',
      rendimientoProducto: '',
      nombreCientifico: '',
      nombreComun: '',
      marca: '',
      cantidad: '',
      unidadMedida: '',
      paisOrigen: '',
      paisProcedencia: '',
      fraccionDescripcion: ''}];
    const abrirEliminarPopupSpy = jest.spyOn(component, 'abrirElimninarConfirmationopup');
    component.confirmEliminarMercanciaItem();
    expect(abrirEliminarPopupSpy).toHaveBeenCalled();
  });

  it('should not confirm deletion if no items are selected', () => {
    component.listaFilaSeleccionadaMercancia = [];
    const abrirEliminarPopupSpy = jest.spyOn(component, 'abrirElimninarConfirmationopup');
    component.confirmEliminarMercanciaItem();
    expect(abrirEliminarPopupSpy).not.toHaveBeenCalled();
  });

  it('should delete selected items when eliminarMercanciaItem is called', () => {
    component.datosTablaMercancia = [
      { 
        id: 1, 
        descripcion: 'Item 1',
        fraccionArancelaria: '',
        fraccionDescripcion: '',
        otraFraccion: false,
        clasificacionTaxonomica: '',
        rendimientoProducto: '',
        nombreCientifico: '',
        nombreComun: '',
        marca: '',
        cantidad: '',
        unidadMedida: '',
        paisOrigen: '',
        paisProcedencia: ''
      },
      { 
        id: 2, 
        descripcion: 'Item 2',
        fraccionArancelaria: '',
        fraccionDescripcion: '',
        otraFraccion: false,
        clasificacionTaxonomica: '',
        rendimientoProducto: '',
        nombreCientifico: '',
        nombreComun: '',
        marca: '',
        cantidad: '',
        unidadMedida: '',
        paisOrigen: '',
        paisProcedencia: ''
      },
    ];
    component.listaFilaSeleccionadaMercancia = [{
      id: 1,
      fraccionArancelaria: '',
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
      paisProcedencia: ''
    }];
    component.eliminarMercanciaItem();
    expect(component.datosTablaMercancia.length).toBe(1);
    expect(component.datosTablaMercancia[0].id).toBe(2);
    expect(tramite230901StoreMock.setMercanciaTablaDatos).toHaveBeenCalled();
  });
});