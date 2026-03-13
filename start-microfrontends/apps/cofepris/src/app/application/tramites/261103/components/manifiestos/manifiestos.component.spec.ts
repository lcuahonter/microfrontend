import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core'; 
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ManifiestosComponent } from './manifiestos.component';
import { By } from '@angular/platform-browser';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { of, Subject } from 'rxjs';

describe('ManifiestosComponent', () => {
  let component: ManifiestosComponent;
  let fixture: ComponentFixture<ManifiestosComponent>;
  let queryMock: jest.Mocked<DatosProcedureQuery>;
  let storeMock: jest.Mocked<DatosProcedureStore>;

  beforeEach(async () => {
    queryMock = {
      selectProrroga$: of({
        aduanas: 'test',
        informacionConfidencial: 'confidential',
      }),
    } as unknown as jest.Mocked<DatosProcedureQuery>;

    storeMock = {
      establecerDatos: jest.fn(),
    } as unknown as jest.Mocked<DatosProcedureStore>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ManifiestosComponent, InputRadioComponent],
      providers: [
        FormBuilder,
        { provide: DatosProcedureQuery, useValue: queryMock },
        { provide: DatosProcedureStore, useValue: storeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifiestosComponent);
    component = fixture.componentInstance;

    component.radioOptions = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    component.declaracionEstaMarcado = true;
    component.Aduana = new FormBuilder().group({
      aduanas: [false],
      informacionConfidencial: [''],
    });

    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería enlazar el checkbox con el control del formulario', () => {
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    expect(checkbox.checked).toBe(true);
    checkbox.click();
    fixture.detectChanges();
    expect(component.Aduana.get('aduanas')?.value).toBe("test");
  });

  it('debería enlazar las opciones del radio con el componente', () => {
    const radio = fixture.debugElement.query(By.directive(InputRadioComponent)).componentInstance;
    expect(radio.radioOptions).toEqual([
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ]);
  });

it('debería llamar a setValoresStore al cambiar el radio', () => {
  const spy = jest.spyOn(component, 'setValoresStore');

  const radioComponent = fixture.debugElement.query(By.directive(InputRadioComponent));

  if (radioComponent) {
    // trigger EventEmitter manually
    radioComponent.triggerEventHandler('change', 'Option 1');

    expect(spy).toHaveBeenCalledWith(component.Aduana, 'informacionConfidencial');
  } else {
    fail('InputRadioComponent no encontrado en el template');
  }
});


  it('debería ejecutar ngOnDestroy y limpiar destroy$', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería llamar a setValoresStore y actualizar el store', () => {
  component.Aduana = new FormBuilder().group({
    aduanas: ['test'],
  });

  component.setValoresStore(component.Aduana, 'aduanas');
  expect(storeMock.establecerDatos).toHaveBeenCalledWith({ aduanas: 'test' });
});


  it('debería inicializar correctamente el formulario al ejecutar mercanciasData', () => {
    component.mercanciasData();

    expect(component.Aduana.get('aduanas')?.value).toBe('test');
    expect(component.Aduana.get('informacionConfidencial')?.value).toBe('confidential');
  });

});
