import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaAccionistaExtranjeroMoralComponent } from './consulta-accionista-extranjero-moral.component';
import { provideHttpClient } from '@angular/common/http';

describe('ConsultaAccionistaExtranjeroMoralComponent', () => {
  let component: ConsultaAccionistaExtranjeroMoralComponent;
  let fixture: ComponentFixture<ConsultaAccionistaExtranjeroMoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaAccionistaExtranjeroMoralComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(
      ConsultaAccionistaExtranjeroMoralComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
