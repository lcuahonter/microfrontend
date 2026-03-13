import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoDeAvisoComponent } from './tipo-de-aviso.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DestruccionStore } from '../../estados/Tramite32509.store';
import { DestruccionQuery } from '../../estados/Tramite32509.query';
import { SeccionLibStore, SeccionLibQuery, TituloComponent, InputRadioComponent, InputFechaComponent } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { provideHttpClient } from '@angular/common/http';

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let fixture: ComponentFixture<TipoDeAvisoComponent>;
  let mockDestruccionStore: Partial<DestruccionStore>;
  let mockDestruccionQuery: Partial<DestruccionQuery>;
  let mockSeccionLibStore: Partial<SeccionLibStore>;
  let mockSeccionLibQuery: Partial<SeccionLibQuery>;

  beforeEach(async () => {
    mockDestruccionStore = {
      setTipoDeAviso: jest.fn(),
    };
    mockDestruccionQuery = {
      selectDestruccion$: of({
        tipoDeAviso: '',
        nombre: '',
        rfc: '',
        entidadFederativa: '',
        alcaldiaMunicipo: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        codigoPostal: '',
        cartaCupo: '',
        numeraDeAcuse: '',
        destruccionMercancia: '',
        merccanciaEntidadFederativa: '',
        merccanciaAlcaldiaMunicipo: '',
        merccanciaColonia: '',
        merccanciaCalle: '',
        merccanciaNumeroExterior: '',
        merccanciaNumeroInterior: '',
        merccanciaCodigoPostal: '',
        destruir: '',
        tarifa: '',
        destruccionEntidadFederativa: '',
        destruccionAlcaldiaMunicipo: '',
        destruccionColonia: '',
        destruccionCalle: '',
        destruccionNumeroExterior: '',
        destruccionNumeroInterior: '',
        destruccionCodigoPostal: '',
        destruccionHora: '',
        desturccionProceso: '',
        casofortuito: '',
        donoMercancia: '',
        condicionesMateriales: '',
        caboDestruccionFecha: '',
      }),
    };
    mockSeccionLibStore = {
      establecerSeccion: jest.fn(),
    };
    mockSeccionLibQuery = {
      selectSeccionState$: of({
        seccion: [true, false], 
        formaValida: [true], 
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, AlertComponent, InputFechaComponent, TituloComponent, InputRadioComponent, CommonModule, TipoDeAvisoComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: DestruccionStore, useValue: mockDestruccionStore },
        { provide: DestruccionQuery, useValue: mockDestruccionQuery },
        { provide: SeccionLibStore, useValue: mockSeccionLibStore },
        { provide: SeccionLibQuery, useValue: mockSeccionLibQuery },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the form value when cambioFecha is called', () => {
    const newDate = '2023-10-01';
    component.cambioFecha(newDate);
    expect(component.avisoForm.get('caboDestruccionFecha')?.value).toBe(newDate);
    expect(component.DestruccionFecha).toBe(newDate);
  });

  it('should update avisoValor when avisoValorRadio is called', () => {
    const controlName = 'tipoDeAviso';
    const value = 'new_value';
    component.avisoValorRadio(controlName, value);
    expect(component.avisoForm.get(controlName)?.value).toBe(value);
    expect(component.avisoValor).toBe(value);
  });

  it('should handle file selection in onCambioDeArchivo', () => {
    const mockFile = new File(['content'], 'test-file.txt', { type: 'text/plain' });
    const event = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    component.onCambioDeArchivo(event);
    expect(component.archivoMedicamentos).toBe(mockFile);
    expect(component.etiquetaDeArchivo).toBe('test-file.txt');
  });

  it('should reset etiquetaDeArchivo if no file is selected', () => {
    const event = {
      target: {
        files: [],
      },
    } as unknown as Event;
  
    component.onCambioDeArchivo(event);
    expect(component.archivoMedicamentos).toBeNull();
    expect(component.etiquetaDeArchivo).toBe('Sin archivo seleccionados'); // Use the correct default value
  });

  it('should call store method when setValoresStore is invoked', () => {
    const form = component.avisoForm;
    form.patchValue({ tipoDeAviso: 'test_value' });
    component.setValoresStore(form, 'tipoDeAviso', 'setTipoDeAviso');
    expect(mockDestruccionStore.setTipoDeAviso).toHaveBeenCalledWith('test_value');
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});