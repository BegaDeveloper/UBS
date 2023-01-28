import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ActivationComponent } from './components/activation/activation.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PasswordConfigResolver } from './resolvers/password-config.resolver';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
    {
        path: 'main',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule),
    },
    { path: 'login', component: LoginComponent },
    { path: 'activate', component: ActivationComponent, resolve: { passwordConfig: PasswordConfigResolver } },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'reset-password', component: ResetPasswordComponent, resolve: { passwordConfig: PasswordConfigResolver } },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'change-password', component: ChangePasswordComponent, resolve: { passwordConfig: PasswordConfigResolver } },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
