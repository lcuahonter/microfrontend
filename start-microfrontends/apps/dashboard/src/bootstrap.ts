import { APPCONFIG } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';


bootstrapApplication(AppComponent, APPCONFIG).catch((err) =>
  console.error(err)
);
