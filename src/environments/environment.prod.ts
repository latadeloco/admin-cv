import * as bcrypt from 'bcryptjs';

export const environment = {
  production: true
};

// constante URL para apuntar al servicio nodeJS
export const baseUrlApi = "http://jesusrs.site:3500/";

// constante para establecer la fuerza de encriptación (fuerza = 11)
export const salt = bcrypt.genSaltSync(11);