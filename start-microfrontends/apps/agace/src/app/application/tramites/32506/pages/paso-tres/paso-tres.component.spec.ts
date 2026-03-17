import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [
        PasoTresComponent,
        CommonModule,
        FirmaElectronicaComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [ToastrService, { provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerSpy.navigate.mockClear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "aviso-traslado/acuse" if firma is provided', () => {
    component.obtieneFirma('firma-valida');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
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
