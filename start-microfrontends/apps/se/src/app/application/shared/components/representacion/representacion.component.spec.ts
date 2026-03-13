import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentacionComponent } from './representacion.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';

describe('RepresentacionComponent', () => {
  let component: RepresentacionComponent;
  let fixture: ComponentFixture<RepresentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RepresentacionComponent, // Import the standalone component here
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentacionComponent);
    component = fixture.componentInstance;
    component.frmRepresentacionForm = new FormGroup({
      entidad: new FormControl(''),
      representacion: new FormControl(''), 
      pais: new FormControl('', Validators.required) 
    });
    component.setValoresStoreEvent = new EventEmitter();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe devolver verdadero si el control no es válido', () => {
    component.frmRepresentacionForm.controls['pais'].setValue(''); // Set control to invalid state
    component.frmRepresentacionForm.controls['pais'].markAsTouched();
    expect(component.frmRepresentacionForm.controls['pais'].invalid).toBeTruthy(); // Add assertion to check if control is invalid
  });
});