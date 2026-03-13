import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ManifiestoComponent } from './manifiesto.component';
import { Tramite630103Store } from '../../estados/tramite630103.store';
import { Tramite630103Query } from '../../estados/tramite630103.query';

describe('ManifiestoComponent', () => {
  let componente: ManifiestoComponent;
  let fixture: ComponentFixture<ManifiestoComponent>;
  let storeMock: jest.Mocked<Tramite630103Store>;
  let queryMock: jest.Mocked<Tramite630103Query>;

  beforeEach(async () => {
    storeMock = {
      setTramite630103State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630103Store>;

    queryMock = {
      selectTramite630103State$: of({
        declaracion: 'Declaración de prueba',
      }),
    } as unknown as jest.Mocked<Tramite630103Query>;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, ManifiestoComponent],
      providers: [
        { provide: Tramite630103Store, useValue: storeMock },
        { provide: Tramite630103Query, useValue: queryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifiestoComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario con valores predeterminados', () => {
    expect(componente.manifiestoFormulario.value).toEqual({
      declaracion: 'Declaración de prueba',
    });
  });

  it('debería actualizar la declaración en el formulario y el store cuando se llama a setValorStore', () => {
    const nuevoValor = 'Nueva declaración';
    componente.manifiestoFormulario.patchValue({ declaracion: nuevoValor });

    componente.setValorStore(componente.manifiestoFormulario, 'declaracion');

    expect(storeMock.setTramite630103State).toHaveBeenCalledWith('declaracion', nuevoValor);
  });

  it('debería obtener el estado del store y establecer estadoSeleccionado', () => {
    componente.getValorStore();
    expect(componente.estadoSeleccionado).toEqual({
      declaracion: 'Declaración de prueba',
    });
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroyedSpy = jest.spyOn(componente['destroyed$'], 'next');
    const completeSpy = jest.spyOn(componente['destroyed$'], 'complete');

    componente.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    componente.esFormularioSoloLectura = true;
    componente.inizializarFormulario();
    const disableSpy = jest.spyOn(componente.manifiestoFormulario, 'disable');
    componente.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
    componente.esFormularioSoloLectura = false;
    componente.inizializarFormulario();
    const enableSpy = jest.spyOn(componente.manifiestoFormulario, 'enable');
    componente.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });
});