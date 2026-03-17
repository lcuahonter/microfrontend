import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaisDeOrigenComponent } from './pais-de-origen.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';

describe('PaisDeOrigenComponent', () => {
  let component: PaisDeOrigenComponent;
  let fixture: ComponentFixture<PaisDeOrigenComponent>;
  let formBuilder: FormBuilder;

  const MOCK_PAISES_POR_BLOQUE: Catalogo[] = [
    { id: 1, descripcion: 'País 1' },
    { id: 2, descripcion: 'País 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PaisDeOrigenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaisDeOrigenComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.paisForm = formBuilder.group({
      bloque: [''],
      campo: [''],
      usoEspecifico: [''],
      justificacionImportacionExportacion: [''],
      observaciones: [''],
    });

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el evento bloqueCambiar al llamar a enCambioDeBloque', () => {
    const EVENTO_CAMBIO = new Event('change');
    const INPUT_ELEMENT = document.createElement('input');
    INPUT_ELEMENT.value = '1';
    Object.defineProperty(EVENTO_CAMBIO, 'target', { value: INPUT_ELEMENT });

    jest.spyOn(component.bloqueCambiar, 'emit');
    component.enCambioDeBloque(EVENTO_CAMBIO);

    expect(component.bloqueCambiar.emit).toHaveBeenCalledWith(1);
  });

  it('debería emitir el evento setValoresStoreEvent al llamar a setValoresStore', () => {
    const MOCK_FORM: FormGroup = formBuilder.group({
      campo: ['valor'],
    });

    jest.spyOn(component.setValoresStoreEvent, 'emit');
    component.setValoresStore(MOCK_FORM, 'campo');

    expect(component.setValoresStoreEvent.emit).toHaveBeenCalledWith({
      form: MOCK_FORM,
      campo: 'campo',
    });
  });

  it('debería emitir el evento eventoAlHacerClicEnTodasLasCiudades al llamar a onObtenerCiudades', () => {
    jest.spyOn(component.eventoAlHacerClicEnTodasLasCiudades, 'emit');
    component.onObtenerCiudades();

    expect(component.eventoAlHacerClicEnTodasLasCiudades.emit).toHaveBeenCalled();
  });

  it('debería llamar a la función agregar del crosslistComponent al presionar el botón "Agregar"', () => {
    component.crosslistComponent = {
      agregar: jest.fn(),
      quitar: jest.fn(),
    } as unknown as any;

    component.campoDeBotones[0].funcion();
    expect(component.crosslistComponent.agregar).toHaveBeenCalledWith('');
  });

  it('debería llamar a la función agregar del crosslistComponent al presionar el botón "Agregar todos"', () => {
    component.crosslistComponent = {
      agregar: jest.fn(),
      quitar: jest.fn(),
    } as unknown as any;

    component.campoDeBotones[1].funcion();
    expect(component.crosslistComponent.agregar).toHaveBeenCalledWith('t');
  });

  it('debería llamar a la función quitar del crosslistComponent al presionar el botón "Eliminar todos"', () => {
    component.crosslistComponent = {
      agregar: jest.fn(),
      quitar: jest.fn(),
    } as unknown as any;

    component.campoDeBotones[3].funcion();
    expect(component.crosslistComponent.quitar).toHaveBeenCalledWith('t');
  });
});