import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const usuarioStr = localStorage.getItem('usuario_logado');

    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.perfil?.label?.toUpperCase() === 'USER') {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
