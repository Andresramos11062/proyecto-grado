
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export  class RegistroComponent {
usuario = '';
  password = '';
  mostrarPassword = false;
  error = '';

   constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  registrarUsuario() {
    if (!this.usuario || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.authService.registro(this.usuario, this.password).subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.error = err.error.mensaje || 'Error al registrarse';
      }
    });
  }
}
