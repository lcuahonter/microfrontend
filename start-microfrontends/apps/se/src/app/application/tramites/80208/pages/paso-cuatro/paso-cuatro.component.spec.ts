import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { PasoCuatroComponent } from './paso-cuatro.component';
import { TestBed } from '@angular/core/testing';


describe('PasoCuatroComponent', () => {
  let fixture;
  let component!: PasoCuatroComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ToastrModule],
      declarations: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).overrideComponent(PasoCuatroComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoCuatroComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });
});