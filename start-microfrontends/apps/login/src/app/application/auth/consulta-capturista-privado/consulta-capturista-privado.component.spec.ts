import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaCapturistaPrivadoComponent } from './consulta-capturista-privado.component';

describe('ConsultaCapturistaPrivadoComponent', () => {
  let component: ConsultaCapturistaPrivadoComponent;
  let fixture: ComponentFixture<ConsultaCapturistaPrivadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaCapturistaPrivadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaCapturistaPrivadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
