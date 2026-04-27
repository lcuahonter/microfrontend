import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { TramitesListComponent } from './tramites-list.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Tramite } from '../../../core/models/tramite.model';

const MOCK_TRAMITES: Tramite[] = [
  { id: 1, clave: 'VUCEM-001', nombre: 'Pedimento de Importación', activo: true },
  { id: 2, clave: 'VUCEM-002', nombre: 'Pedimento de Exportación', activo: true },
];

const mockApi = {
  getCatalogoTramites: jest.fn(),
};

describe('TramitesListComponent', () => {
  let component: TramitesListComponent;
  let fixture: ComponentFixture<TramitesListComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApi.getCatalogoTramites.mockReturnValue(of(MOCK_TRAMITES));

    await TestBed.configureTestingModule({
      imports: [TramitesListComponent],
      providers: [
        provideRouter([]),
        { provide: UsuariosApiService, useValue: mockApi },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TramitesListComponent);
    component = fixture.componentInstance;
  });

  // 1. Creación del componente
  it('debería crear el componente correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // 10. Estado inicial: cargando true, filtro '', seleccionados vacío
  // (verificado antes de detectChanges para evitar que ngOnInit lo modifique)
  it('debe tener el estado inicial correcto antes de ngOnInit', () => {
    // Recreamos sin llamar a detectChanges para capturar el estado puro
    const freshFixture = TestBed.createComponent(TramitesListComponent);
    const freshComponent = freshFixture.componentInstance;

    expect(freshComponent.cargando()).toBe(true);
    expect(freshComponent.filtro()).toBe('');
    expect(freshComponent.seleccionados().size).toBe(0);
    expect(freshComponent.tramites()).toEqual([]);
  });

  // 2. ngOnInit carga tramites y cargando=false
  it('debería cargar los trámites y poner cargando en false al inicializar', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockApi.getCatalogoTramites).toHaveBeenCalled();
    expect(component.tramites()).toEqual(MOCK_TRAMITES);
    expect(component.cargando()).toBe(false);
  }));

  // 3. tramitesFiltrados retorna todos cuando filtro vacío
  it('debería retornar todos los trámites cuando el filtro está vacío', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const resultado = component.tramitesFiltrados();

    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(MOCK_TRAMITES);
  }));

  // 4. tramitesFiltrados filtra por nombre
  it('debería filtrar los trámites por nombre correctamente', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtro.set('importación');
    const resultado = component.tramitesFiltrados();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Pedimento de Importación');
  }));

  // 5. tramitesFiltrados filtra por clave
  it('debería filtrar los trámites por clave correctamente', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtro.set('VUCEM-002');
    const resultado = component.tramitesFiltrados();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].clave).toBe('VUCEM-002');
  }));

  // 6. setFiltro actualiza la señal filtro
  it('debería actualizar la señal filtro al recibir un evento de input', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const mockEvent = {
      target: { value: 'exportación' } as HTMLInputElement,
    } as unknown as Event;

    component.setFiltro(mockEvent);

    expect(component.filtro()).toBe('exportación');
  }));

  // 7. toggleTramite con checked=true agrega id a seleccionados
  it('debería agregar el id del trámite a seleccionados cuando se marca el checkbox', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const mockEvent = {
      target: { checked: true } as HTMLInputElement,
    } as unknown as Event;

    component.toggleTramite(1, mockEvent);

    expect(component.seleccionados().has(1)).toBe(true);
  }));

  // 8. toggleTramite con checked=false elimina id de seleccionados
  it('debería eliminar el id del trámite de seleccionados cuando se desmarca el checkbox', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Primero agregamos el trámite
    const addEvent = {
      target: { checked: true } as HTMLInputElement,
    } as unknown as Event;
    component.toggleTramite(1, addEvent);
    expect(component.seleccionados().has(1)).toBe(true);

    // Luego lo eliminamos
    const removeEvent = {
      target: { checked: false } as HTMLInputElement,
    } as unknown as Event;
    component.toggleTramite(1, removeEvent);

    expect(component.seleccionados().has(1)).toBe(false);
  }));

  // 9. toggleTramite emite seleccionCambiada con ids correctos
  it('debería emitir seleccionCambiada con el arreglo de ids seleccionados', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const emitSpy = jest.spyOn(component.seleccionCambiada, 'emit');

    const eventTramite1 = {
      target: { checked: true } as HTMLInputElement,
    } as unknown as Event;
    component.toggleTramite(1, eventTramite1);

    const eventTramite2 = {
      target: { checked: true } as HTMLInputElement,
    } as unknown as Event;
    component.toggleTramite(2, eventTramite2);

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenLastCalledWith(expect.arrayContaining([1, 2]));
  }));

  // 11. tramitesFiltrados devuelve vacío si el filtro no coincide con nada
  it('debería retornar un arreglo vacío cuando el filtro no coincide con ningún trámite', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtro.set('tramite inexistente xyz');
    const resultado = component.tramitesFiltrados();

    expect(resultado).toHaveLength(0);
  }));

  // 12. tramitesFiltrados es insensible a mayúsculas y minúsculas
  it('debería filtrar de forma insensible a mayúsculas y minúsculas', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.filtro.set('IMPORTACIÓN');
    const resultado = component.tramitesFiltrados();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(1);
  }));

  // 13. Múltiples selecciones funcionan correctamente
  it('debería gestionar múltiples selecciones y desselecciones correctamente', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const addEvent = (id: number) => ({
      target: { checked: true } as unknown as HTMLInputElement,
    } as unknown as Event);
    const removeEvent = (id: number) => ({
      target: { checked: false } as unknown as HTMLInputElement,
    } as unknown as Event);

    component.toggleTramite(1, addEvent(1));
    component.toggleTramite(2, addEvent(2));
    expect(component.seleccionados().size).toBe(2);

    component.toggleTramite(1, removeEvent(1));
    expect(component.seleccionados().size).toBe(1);
    expect(component.seleccionados().has(2)).toBe(true);
    expect(component.seleccionados().has(1)).toBe(false);
  }));
});
