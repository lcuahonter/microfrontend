import { bootstrapApplication } from '@angular/platform-browser';
import { APPCONFIG } from './app/app.config';
import { RemoteEntryComponent } from './app/remote-entry/entry.component';

bootstrapApplication(RemoteEntryComponent, APPCONFIG).catch((err) =>
  console.error(err)
);
