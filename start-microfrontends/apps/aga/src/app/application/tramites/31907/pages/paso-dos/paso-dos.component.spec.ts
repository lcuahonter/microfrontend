import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoDosComponent } from './paso-dos.component';

describe('PasoDosComponent', () => {
  let componente: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería navegar a la ruta de acuse si se recibe una firma válida', () => {
    const firma: string = 'firma-digital';
    componente.obtieneFirma(firma);
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería navegar si la firma es una cadena vacía', () => {
    const firmaVacia: string = '';
    componente.obtieneFirma(firmaVacia);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
