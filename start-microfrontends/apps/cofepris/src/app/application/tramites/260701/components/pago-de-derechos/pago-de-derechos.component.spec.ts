import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
import { of } from 'rxjs';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let certificadosLicenciasSvcMock: Partial<CertificadosLicenciasService>;
  let tramite260701StoreMock: Partial<Tramite260701Store>;
  let tramite260701QueryMock: Partial<Tramite260701Query>;

  beforeEach(async () => {
    certificadosLicenciasSvcMock = {
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Banco 1' }] })),
    };

    tramite260701StoreMock = {
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
    };

    tramite260701QueryMock = {
      selectSolicitud$: of({
        claveDeReferencia: '12345',
        cadenaDependencia: 'ABC123',
        banco: 'Banco 1',
        llaveDePago: 'ABCDEFGHIJ',
        fechaPago: '2023-01-01',
        importePago: '1000',
      } as Solicitud260701State),
    };

    await TestBed.configureTestingModule({
      imports: [PagoDeDerechosComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CertificadosLicenciasService, useValue: certificadosLicenciasSvcMock },
        { provide: Tramite260701Store, useValue: tramite260701StoreMock },
        { provide: Tramite260701Query, useValue: tramite260701QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores por defecto del estado', () => {
    expect(component.formSolicitud.value).toEqual({
      claveDeReferencia: '12345',
      cadenaDependencia: 'ABC123',
      banco: 'Banco 1',
      llaveDePago: 'ABCDEFGHIJ',
      fechaPago: '2023-01-01',
      importePago: '1000',
    });
  });

  it('debería obtener los datos de banco al inicializar', () => {
    expect(certificadosLicenciasSvcMock.getBancoDatos).toHaveBeenCalled();
    expect(component.bancoCatalogo).toEqual([{ id: 1, nombre: 'Banco 1' }]);
  });

  it('debería llamar setValoresStore al establecer un valor en el store', () => {
    const form = component.formSolicitud;
    form.get('claveDeReferencia')?.setValue('67890');
    component.setValoresStore(form, 'claveDeReferencia', 'setClaveDeReferencia');
    expect(tramite260701StoreMock.setClaveDeReferencia).toHaveBeenCalledWith('67890');
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
