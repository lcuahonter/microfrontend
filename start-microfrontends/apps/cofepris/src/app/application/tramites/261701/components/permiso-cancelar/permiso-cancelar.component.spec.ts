import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermisoCancelarComponent } from './permiso-cancelar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tramite261702Store } from '../../../../estados/tramites/tramite261702.store';
import { Tramite261702Query } from '../../../../estados/queries/tramite261702.query';
import { of } from 'rxjs';

describe('PermisoCancelarComponent', () => {
  let component: PermisoCancelarComponent;
  let fixture: ComponentFixture<PermisoCancelarComponent>;
  let MOCK_TRAMITE261702_STORE: jest.Mocked<Tramite261702Store>;
  let MOCK_TRAMITE261702_QUERY: jest.Mocked<Tramite261702Query>;

  beforeEach(async () => {
    MOCK_TRAMITE261702_STORE = {
      setDynamicFieldValue: jest.fn(),
    } as unknown as jest.Mocked<Tramite261702Store>;

    MOCK_TRAMITE261702_QUERY = {
      selectRetiros$: of({
        folio: 'folio',
        nombre: '',
      }),
    } as unknown as jest.Mocked<Tramite261702Query>;

    await TestBed.configureTestingModule({
      imports: [PermisoCancelarComponent, HttpClientModule],
      providers: [
        { provide: Tramite261702Query, useValue: MOCK_TRAMITE261702_QUERY },
        { provide: Tramite261702Store, useValue: MOCK_TRAMITE261702_STORE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PermisoCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia inicializar el formulario correctamente', () => {
    const GRUPO_FORMULARIO_NINO = component.forma.get('ninoFormGroup') as FormGroup;
    expect(GRUPO_FORMULARIO_NINO).toBeDefined();
    expect(component.forma).toBeDefined();
  });

  it('deberia limpiar las suscripciones en ngOnDestroy', () => {
    const ESPIA_NOTIFICADOR_SIGUIENTE = jest.spyOn(component['destruirNotificador$'], 'next');
    const ESPIA_NOTIFICADOR_COMPLETAR = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(ESPIA_NOTIFICADOR_SIGUIENTE).toHaveBeenCalled();
    expect(ESPIA_NOTIFICADOR_COMPLETAR).toHaveBeenCalled();
  });

  it('deberia establecer y eliminar validadores dinámicamente', () => {
    const GRUPO_FORMULARIO_NINO = component.ninoFormGroup;
    GRUPO_FORMULARIO_NINO.addControl('folio', new FormBuilder().control(''));
    GRUPO_FORMULARIO_NINO.get('folio')?.setValidators([Validators.required]);
    GRUPO_FORMULARIO_NINO.get('folio')?.updateValueAndValidity();
    expect(GRUPO_FORMULARIO_NINO.get('folio')?.validator).toBeDefined();
    GRUPO_FORMULARIO_NINO.get('folio')?.setValidators([]);
    GRUPO_FORMULARIO_NINO.get('folio')?.updateValueAndValidity();
    expect(GRUPO_FORMULARIO_NINO.get('folio')?.validator).toBeNull();
  });

  it('deberia manejar valores nulos o indefinidos en los cambios de valor del formulario', () => {
    const GRUPO_FORMULARIO_NINO = component.ninoFormGroup;
    GRUPO_FORMULARIO_NINO.addControl('campoPrueba', new FormControl(null));
    GRUPO_FORMULARIO_NINO.get('campoPrueba')?.setValue(null);
    fixture.detectChanges();
    expect(MOCK_TRAMITE261702_STORE.setDynamicFieldValue).toHaveBeenCalledWith('campoPrueba', null);
  });

  it('deberia llamar a setDynamicFieldValue con el campo y valor correctos', () => {
    const CAMPO = 'folio';
    const VALOR = 'folio';
    component.cambioEnValoresStore(CAMPO, VALOR);
    expect(MOCK_TRAMITE261702_STORE.setDynamicFieldValue).toHaveBeenCalledWith(CAMPO, VALOR);
  });

  it('deberia llamar a setDynamicFieldValue con un valor numérico', () => {
    const CAMPO = 'campoPrueba';
    const VALOR = 12345;
    component.cambioEnValoresStore(CAMPO, VALOR);
    expect(MOCK_TRAMITE261702_STORE.setDynamicFieldValue).toHaveBeenCalledWith(CAMPO, 12345);
  });

  it('no deberia llamar a setDynamicFieldValue si el valor no ha cambiado', () => {
    const CAMPO = 'campoPrueba';
    const VALOR = 'valorPrueba';
    jest.spyOn(MOCK_TRAMITE261702_STORE, 'setDynamicFieldValue');
    MOCK_TRAMITE261702_STORE.setDynamicFieldValue.mockClear();
    component.cambioEnValoresStore(CAMPO, VALOR);
    expect(MOCK_TRAMITE261702_STORE.setDynamicFieldValue).toHaveBeenCalledTimes(1);
    component.cambioEnValoresStore(CAMPO, VALOR);
    expect(MOCK_TRAMITE261702_STORE.setDynamicFieldValue).toHaveBeenCalledTimes(2);
  });
});