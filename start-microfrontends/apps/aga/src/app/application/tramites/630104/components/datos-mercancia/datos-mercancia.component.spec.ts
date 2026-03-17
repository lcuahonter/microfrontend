import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { DatosMercanciaComponent } from './datos-mercancia.component';
import { Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';

describe('DatosMercanciaComponent', () => {
  let componente: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let mockStore: jest.Mocked<Tramite630104Store>;
  let mockQuery: jest.Mocked<Tramite630104Query>;

  beforeEach(async () => {
    mockStore = {
      setTramite630104State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630104Store>;

    mockQuery = {
      selectTramite630104State$: of({
        descripcionMercancia: 'Mercancía de prueba',
        motivo: 'Motivo de prueba',
        listaMercancia: 'Lista de prueba',
      }),
    } as unknown as jest.Mocked<Tramite630104Query>;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, DatosMercanciaComponent],
      providers: [
        { provide: Tramite630104Store, useValue: mockStore },
        { provide: Tramite630104Query, useValue: mockQuery },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosMercanciaComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario con valores por defecto', () => {
    componente.inicializarFormulario();
    expect(componente.datosMercancia.value).toEqual({
      
    });
  });

  it('debería obtener el estado del store y asignarlo a estadoSeleccionado', () => {
    componente.getValorStore();
    expect(componente.estadoSeleccionado).toEqual({
      descripcionMercancia: 'Mercancía de prueba',
      motivo: 'Motivo de prueba',
      listaMercancia: 'Lista de prueba',
    });
  });

  it('debería llamar a setTramite630104State al ejecutar establecerCambioDeValor', () => {
    const evento = { campo: 'descripcionMercancia', valor: 'Nueva descripción' };
    componente.establecerCambioDeValor(evento);

    expect(mockStore.setTramite630104State).toHaveBeenCalledWith(
      evento.campo,
      evento.valor
    );
  });

  it('debería limpiar las suscripciones al ejecutar ngOnDestroy', () => {
    const spyDestroyed = jest.spyOn(componente['destroyed$'], 'next');
    const spyComplete = jest.spyOn(componente['destroyed$'], 'complete');

    componente.ngOnDestroy();

    expect(spyDestroyed).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
