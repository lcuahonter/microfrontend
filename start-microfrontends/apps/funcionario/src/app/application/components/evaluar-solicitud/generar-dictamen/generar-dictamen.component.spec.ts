import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarDictamenComponent } from './generar-dictamen.component';

describe('GenerarDictamenComponent', () => {
  let component: GenerarDictamenComponent;
  let fixture: ComponentFixture<GenerarDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarDictamenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
