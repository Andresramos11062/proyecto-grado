import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = '';
  password = '';
  mostrarPassword = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    if (!this.usuario || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }
      this.authService.login(this.usuario, this.password).subscribe({
      next: (res:any) => {
        this.authService.guardarToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err:any) => {
        this.error = err.error.mensaje || 'Error al iniciar sesión';
      }
    });
  }
}