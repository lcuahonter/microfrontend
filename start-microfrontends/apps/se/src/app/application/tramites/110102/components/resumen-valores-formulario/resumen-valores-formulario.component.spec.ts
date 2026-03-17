import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenValoresFormularioComponent } from './resumen-valores-formulario.component';

describe('ResumenValoresFormularioComponent', () => {
  let component: ResumenValoresFormularioComponent;
  let fixture: ComponentFixture<ResumenValoresFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenValoresFormularioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenValoresFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
