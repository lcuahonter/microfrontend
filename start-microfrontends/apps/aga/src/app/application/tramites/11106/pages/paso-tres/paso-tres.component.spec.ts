import { TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PasoTresComponent, 
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: []
    }).compileComponents();

    const fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "temporal-contenedores/acuse" when obtieneFirma is called with a valid signature', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const validSignature = 'valid-signature';

    component.obtieneFirma(validSignature);

    expect(navigateSpy).toHaveBeenCalledWith(['temporal-contenedores/acuse']);
  });

  it('should not navigate when obtieneFirma is called with an empty signature', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const emptySignature = '';

    component.obtieneFirma(emptySignature);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
