import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { PasoTresComponent } from './paso-tres.component';
import { Router, RouterModule } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

class MockRouter {
  navigate(): void {}
}

describe('PasoTresComponent', () => {
  let fixture: ComponentFixture<PasoTresComponent>;
  let component: PasoTresComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        RouterModule,
      ],
      declarations: [PasoTresComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: MockRouter },
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a "servicios-extraordinarios/acuse" cuando se proporciona una firma válida', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    const validSignature = 'validSignature';

    component.obtieneFirma(validSignature);

    expect(routerSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería navegar cuando se proporciona una firma inválida', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    const invalidSignature = '';

    component.obtieneFirma(invalidSignature);

    expect(routerSpy).not.toHaveBeenCalled();
  });
});