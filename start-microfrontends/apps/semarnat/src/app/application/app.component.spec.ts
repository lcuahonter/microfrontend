import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const FIXTURE = TestBed.createComponent(AppComponent);
    const APP = FIXTURE.componentInstance;
    expect(APP).toBeTruthy();
  });

  it(`should have as title 'vucem-3.0-frontend'`, () => {
    const FIXTURE = TestBed.createComponent(AppComponent);
    const APP = FIXTURE.componentInstance;
    expect(APP.title).toEqual('vucem-3.0-frontend');
  });

  it('should render title', () => {
    const FIXTURE = TestBed.createComponent(AppComponent);
    FIXTURE.detectChanges();
    const COMPILIED = FIXTURE.nativeElement as HTMLElement;
    expect(COMPILIED.querySelector('h1')?.textContent).toContain('Hello, vucem-3.0-frontend');
  });
});
