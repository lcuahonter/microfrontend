import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarRequerimientoComponent } from './Verificar-Requerimiento.component';

describe('VerificarRequerimientoComponent', () => {
  let component: VerificarRequerimientoComponent;
  let fixture: ComponentFixture<VerificarRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarRequerimientoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificarRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});