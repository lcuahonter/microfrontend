import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutorizarDictamenComponent } from './autorizar-dictamen.component';

describe('AutorizarDictamenComponent', () => {
  let component: AutorizarDictamenComponent;
  let fixture: ComponentFixture<AutorizarDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizarDictamenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutorizarDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});