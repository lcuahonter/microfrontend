import { SectoresYMercanciasComponent } from './sectores-y-mercancias.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('SectoresYMercanciasComponent', () => {
  let component: SectoresYMercanciasComponent;
  let expansionDeProductoresServiceMock: any;
  let tramite90201StoreMock: any;
  let tramite90201QueryMock: any;
  let consultaioQueryMock: any;
  let fb: FormBuilder;

  beforeEach(() => {
    expansionDeProductoresServiceMock = {
      getSectorCatalog: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Sector1' }] }))
    };
    tramite90201StoreMock = {
      setSector: jest.fn(),
      setFraccion: jest.fn()
    };
    tramite90201QueryMock = {
      selectSolicitud$: of({
        sector: 'SectorX',
        fraccion: '12345678'
      })
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };
    fb = new FormBuilder();
    component = new SectoresYMercanciasComponent(
      expansionDeProductoresServiceMock,
      fb,
      tramite90201StoreMock,
      tramite90201QueryMock,
      consultaioQueryMock
    );
    component.solicitudState = {
      sector: 'SectorX',
      fraccion: '12345678'
    } as any;
  });

  it('should initialize sectoresForm with correct values on establecerFormSectores', () => {
    component.establecerFormSectores();
    expect(component.sectoresForm).toBeDefined();
    expect(component.sectoresForm.get('sector')?.value).toBe('SectorX');
    expect(component.sectoresForm.get('fraccion')?.value).toBe('12345678');
  });

  it('should disable form when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.establecerFormSectores();
    expect(component.sectoresForm.disabled).toBe(true);
  });

  it('should enable form when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.establecerFormSectores();
    component.esFormularioSoloLectura = false;
    expect(component.sectoresForm.enabled).toBe(true);
  });

  it('should call store method in setValoresStore', () => {
    component.establecerFormSectores();
    component.sectoresForm.get('sector')?.setValue('SectorY');
    component.setValoresStore(component.sectoresForm, 'sector', 'setSector');
    expect(tramite90201StoreMock.setSector).toHaveBeenCalledWith('SectorY');
  });

  it('should set sectorCatalogo on inicializaCatalogos', () => {
    component.sectorCatalogo = [];
    component['inicializaCatalogos']();
    expect(component.sectorCatalogo).toEqual([{ id: 1, nombre: 'Sector1' }]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set seleccion to true when sectorSeleccion is called', () => {
    component.seleccion = false;
    component.sectorSeleccion();
    expect(component.seleccion).toBe(true);
  });

  it('should push event to seleccionadoDatos when seleccionDeFilaDeTabla is called', () => {
    const event = { claveDel: 'A', sectores: 'B' } as any;
    component.seleccionadoDatos = [];
    component.seleccionDeFilaDeTabla(event);
    expect(component.seleccionadoDatos[0]).toBe(event);
  });

  it('should remove sector from sectores when eliminarPedimento is called with borrar=true', () => {
    const sector = { claveDel: 'A', sectores: 'B' } as any;
    component.sectores = [sector];
    component.seleccionadoDatos = [sector];
    component.eliminarPedimento(true);
    expect(component.sectores.length).toBe(0);
  });

  it('should not remove sector from sectores when eliminarPedimento is called with borrar=false', () => {
    const sector = { claveDel: 'A', sectores: 'B' } as any;
    component.sectores = [sector];
    component.seleccionadoDatos = [sector];
    component.eliminarPedimento(false);
    expect(component.sectores.length).toBe(1);
  });

  it('should set nuevaNotificacion with correct values on eliminarSector', () => {
    component.eliminarSector();
    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Está seguro que desea eliminar el sector seleccionado?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    });
  });

  it('should set eliminarMercanciaNotificacion with correct values on eliminarMercancia', () => {
    component.eliminarMercancia();
    expect(component.eliminarMercanciaNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seleccione la fraccion que desea eliminar.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
  });

  it('should clear fraccion value in sectoresForm when mercancia is called with borrar=true', () => {
    component.establecerFormSectores();
    component.sectoresForm.get('fraccion')?.setValue('12345678');
    component.mercancia(true);
    expect(component.sectoresForm.get('fraccion')?.value).toBe('');
  });

  it('should not clear fraccion value in sectoresForm when mercancia is called with borrar=false', () => {
    component.establecerFormSectores();
    component.sectoresForm.get('fraccion')?.setValue('12345678');
    component.mercancia(false);
    expect(component.sectoresForm.get('fraccion')?.value).toBe('12345678');
  });

  it('should call inicializaCatalogos and inicializarConsulta on ngOnInit', () => {
    const catalogosSpy = jest.spyOn<any, any>(component as any, 'inicializaCatalogos');
    const consultaSpy = jest.spyOn(component, 'inicializarConsulta');
    component.ngOnInit();
    expect(catalogosSpy).toHaveBeenCalled();
    expect(consultaSpy).toHaveBeenCalled();
  });

  it('should set esFormularioSoloLectura in inicializarConsulta', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarConsulta();
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should set solicitudState in inicializarFormulario', () => {
    component.solicitudState = undefined as any;
    component.inicializarFormulario();
    expect(component.solicitudState).toEqual({
      sector: 'SectorX',
      fraccion: '12345678'
    });
  });
});
