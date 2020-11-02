// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as bcrypt from 'bcryptjs';

export const environment = {
  production: false
};

// constante URL para apuntar al servicio nodeJS
export const baseUrlApi = "http://192.168.1.96:3500/";

// constante para establecer la fuerza de encriptación (fuerza = 11)
export const salt = bcrypt.genSaltSync(11);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
