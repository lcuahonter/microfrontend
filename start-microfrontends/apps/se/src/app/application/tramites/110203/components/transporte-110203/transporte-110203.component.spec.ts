jest.mock('@libs/shared/theme/assets/json/110203/mediocatalogo.json', () => ({
  __esModule: true,
  default: {
    placeholder: {
      nombre: 'Nombre',
      primer: 'Primer apellido',
      segundo: 'Segundo apellido',
      // Add others as needed based on the model
    }
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Transporte110203Component } from './transporte-110203.component';
import { Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Transporte110203Component', () => {
  let component: Transporte110203Component;
  let fixture: ComponentFixture<Transporte110203Component>;
  let tramite110203Store: Tramite110203Store;

  
  const mockSolicitudState = {
    medio: 'Terrestre', 
  };

  const tramite110203StoreMock = {
    setMedio: jest.fn(),

  };

  const tramite110203QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule,ReactiveFormsModule, FormsModule,Transporte110203Component],
      providers: [
        FormBuilder,
        { provide: Tramite110203Store, useValue: tramite110203StoreMock },
        { provide: Tramite110203Query, useValue: tramite110203QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Transporte110203Component);
    component = fixture.componentInstance;
    tramite110203Store = TestBed.inject(Tramite110203Store);
    fixture.detectChanges(); 
  });

  it('should create the form with initial values', () => {
    expect(component.transporteForm).toBeTruthy();
    expect(component.transporteForm.controls['medio'].value).toBe('Terrestre');
  });

  it('should call tramite110203Store.setMedio with correct value from the form', () => {
  
    component.transporteForm.controls['medio'].setValue('Aereo');

   
    component.setValoresStore(component.transporteForm, 'medio', 'setMedio');

   
    expect(tramite110203Store.setMedio).toHaveBeenCalledWith('Aereo');
  });

  it('should initialize the form correctly when ngOnInit is called', () => {
 
    component.ngOnInit();
    expect(component.transporteForm.get('medio')?.value).toBe('Terrestre');
  });

  it('should call the store methods when the form value changes', () => {
   
    component.transporteForm.controls['medio'].setValue('Maritimo');

  
    component.setValoresStore(component.transporteForm, 'medio', 'setMedio');

    
    expect(tramite110203Store.setMedio).toHaveBeenCalledWith('Maritimo');
  });
});
