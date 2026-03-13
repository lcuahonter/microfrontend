import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(() => of()),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FirmaElectronicaComponent,
        PasoTresComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [{ provide: Router, useValue: routerSpy }, ToastrService],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should navigate to "temporal-contenedores/acuse" if firma is provided', () => {
      component.obtieneFirma('firma-valida');
      expect(routerSpy.navigate).toHaveBeenCalledWith([
        'temporal-contenedores/acuse',
      ]);
    });

    it('should not navigate if firma is empty', () => {
      component.obtieneFirma('');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate if firma is undefined', () => {
      component.obtieneFirma(undefined as any);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate if firma is null', () => {
      component.obtieneFirma(null as any);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
});
