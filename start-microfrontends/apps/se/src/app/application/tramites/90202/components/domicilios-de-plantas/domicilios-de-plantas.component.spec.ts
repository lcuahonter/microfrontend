import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomiciliosDePlantasComponent } from './domicilios-de-plantas.component';

describe('DomiciliosDePlantasComponent', () => {
  let component: DomiciliosDePlantasComponent;
  let fixture: ComponentFixture<DomiciliosDePlantasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DomiciliosDePlantasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomiciliosDePlantasComponent);
    component = fixture.componentInstance;
    component.domiciliosTabla = [
      {
        calle: '',
        numExterior: '',
        numInterior: '',
        codigoPostal: '',
        colonia: '',
        municipioOAlcaldia: '',
        estado: '',
        pais: '',
        registroFederalDeContribuyentes: '',
        razonSocial: '',
        domicilioFiscalDelSolicitante: '',
      }
    ];
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });
});
