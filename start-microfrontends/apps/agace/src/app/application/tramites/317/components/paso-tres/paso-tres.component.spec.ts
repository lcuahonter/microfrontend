import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { ToastrModule } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent,ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate if FIRMA is an empty string', () => {
    component.obtieneFirma('');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate if FIRMA is undefined', () => {
    component.obtieneFirma(undefined as any);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
