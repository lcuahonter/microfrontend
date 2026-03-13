/* eslint-disable @typescript-eslint/naming-convention */
import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
];
