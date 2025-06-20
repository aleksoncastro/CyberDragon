import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Usuario } from "../../../models/usuario.model";
import { UsuarioService } from "../../../services/usuario.service";
import { inject } from "@angular/core";

export const usuarioResolver: ResolveFn<Usuario> = () => {
    return inject(UsuarioService).findByMe();
  };
  