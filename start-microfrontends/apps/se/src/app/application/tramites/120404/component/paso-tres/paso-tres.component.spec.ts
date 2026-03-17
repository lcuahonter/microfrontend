import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(), 
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule,PasoTresComponent,HttpClientModule,ToastrModule.forRoot()],
      providers: [{ provide: Router, useValue: mockRouter },ToastrService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a router.navigate cuando obtieneFirma es ejecutado con una firma válida', () => {
    const mockFirma = 'ValidSignature';

    component.obtieneFirma(mockFirma);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debe navegar si la firma está vacía', () => {
    component.obtieneFirma('');

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
