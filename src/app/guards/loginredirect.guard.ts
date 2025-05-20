import { CanActivateFn, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loginredirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const tokenExpired = authService.isTokenExpired();

  if (!tokenExpired) {
    const usuarioStr = localStorage.getItem('usuario_logado');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);

      // Permitir admin acessar login
      if (
        usuario.perfil.label.toLowerCase() === 'adm' &&
        route.routeConfig?.path === 'login'
      ) {
        return true;
      }

      if (
        usuario.perfil.label.toLowerCase() === 'user' &&
        route.routeConfig?.path === 'loginadmin'
      ) {
        return true;
      }

      // Permitir user acessar loginadmin (opcional)
      if (
        usuario.perfil.label.toLowerCase() === 'user' &&
        route.routeConfig?.path === 'loginadmin'
      ) {
        return true;
      }

      // Redirecionar conforme perfil
      if (usuario.perfil.label.toLowerCase() === 'adm') {
        setTimeout(() => router.navigate(['/admin/home']));
      } else {
        setTimeout(() => router.navigate(['/placasdevideo']));
      }
      return false;

    }
  }

  // Se não estiver logado ou token expirado, deixa acessar a rota de login
  return true;
};
