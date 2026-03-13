import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesYProvedoresComponent } from './clientes-y-provedores.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, Subject, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import {
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('ClientesYProvedoresComponent', () => {
  let component: ClientesYProvedoresComponent;
  let fixture: ComponentFixture<ClientesYProvedoresComponent>;
  let cancelacionGarantiaServiceMock: jest.Mocked<CancelacionGarantiaService>;

  beforeEach(async () => {
    cancelacionGarantiaServiceMock = {
      getRequisitosRadioData: jest.fn().mockReturnValue(of([])),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ClientesYProvedoresComponent,
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        InputRadioComponent,
        TituloComponent,
      ],
      providers: [
        {
          provide: CancelacionGarantiaService,
          useValue: cancelacionGarantiaServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesYProvedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set radioDatos with valid response array', () => {
    const response = [
      { value: 1, label: 'Cliente' },
      { value: 2, label: 'Proveedor' },
    ];
    cancelacionGarantiaServiceMock.getRequisitosRadioData.mockReturnValue(
      of(response)
    );
    component.obtenerRadioDatos();
    expect(
      cancelacionGarantiaServiceMock.getRequisitosRadioData
    ).toHaveBeenCalled();
    expect(component.radioDatos).toEqual(response);
  });

  it('should set radioDatos to empty array when response is empty', () => {
    cancelacionGarantiaServiceMock.getRequisitosRadioData.mockReturnValue(
      of([])
    );
    component.obtenerRadioDatos();
    expect(component.radioDatos).toEqual([]);
  });

  it('should call obtenerRadioDatos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'obtenerRadioDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
