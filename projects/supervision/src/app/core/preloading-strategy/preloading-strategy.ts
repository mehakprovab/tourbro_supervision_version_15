import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';

export class AppPreloadingStrategy implements PreloadingStrategy {
   preload(route: Route, load: () => Observable<any>): Observable<any | null> {
      const loadRoute = (delay) => delay ? timer(150).pipe(_ => load()) : load();
      return route.data && route.data.preload ? loadRoute(route.data.delay) : of(null);
   }
}
