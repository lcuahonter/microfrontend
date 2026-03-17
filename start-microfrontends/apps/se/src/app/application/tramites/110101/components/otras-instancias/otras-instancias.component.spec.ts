import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtrasInstanciasComponent } from './otras-instancias.component';

describe('OtrasInstanciasComponent', () => {
  let component: OtrasInstanciasComponent;
  let fixture: ComponentFixture<OtrasInstanciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtrasInstanciasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OtrasInstanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
