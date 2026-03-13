import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaAccionistaExtranjeroFisicaComponent } from './consulta-accionista-extranjero-fisica.component';
import { provideHttpClient } from '@angular/common/http';

describe('ConsultaAccionistaExtranjeroFisicaComponent', () => {
  let component: ConsultaAccionistaExtranjeroFisicaComponent;
  let fixture: ComponentFixture<ConsultaAccionistaExtranjeroFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaAccionistaExtranjeroFisicaComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(
      ConsultaAccionistaExtranjeroFisicaComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
