import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCapturistaPrivadoComponent } from './registro-capturista-privado.component';
import { provideHttpClient } from '@angular/common/http';

describe('RegistroCapturistaPrivadoComponent', () => {
  let component: RegistroCapturistaPrivadoComponent;
  let fixture: ComponentFixture<RegistroCapturistaPrivadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroCapturistaPrivadoComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroCapturistaPrivadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
