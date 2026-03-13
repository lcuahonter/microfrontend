import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroSocioAccionistaComponent } from './registro-socio-accionista.component';
import { provideHttpClient } from '@angular/common/http';

describe('RegistroSocioAccionistaComponent', () => {
  let component: RegistroSocioAccionistaComponent;
  let fixture: ComponentFixture<RegistroSocioAccionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSocioAccionistaComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSocioAccionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
