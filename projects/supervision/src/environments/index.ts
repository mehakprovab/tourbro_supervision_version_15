import { isDevMode } from '@angular/core';
import * as devEnvironment from './environment';
import * as prodEnvironment from './environment.prod';
let environment;
if(isDevMode()) {
    environment = devEnvironment;
} else {
    environment = prodEnvironment;
}
export {
    environment
};
  