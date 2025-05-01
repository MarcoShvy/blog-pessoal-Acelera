import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  registerForm: FormGroup;
  fotoUrl: string = '';
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      usuario: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      foto: ['']
    }, { validators: this.senhasIguais });
  }

  senhasIguais(group: FormGroup) {
    return group.get('senha')?.value === group.get('confirmarSenha')?.value
      ? null : { senhasDiferentes: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;

    const dados = {
      nome: this.registerForm.value.nome,
      usuario: this.registerForm.value.usuario,
      senha: this.registerForm.value.senha,
      foto: this.fotoUrl,
      tipoUsuario: 'COMUM'
    };

    this.authService.register(dados).subscribe({
      next: () => {
        this.successMessage = 'Conta criada com sucesso! Redirecionando para login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: err => {
        console.error('Erro no registro:', err);
        this.loading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
