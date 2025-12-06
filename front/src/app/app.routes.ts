import { Routes } from '@angular/router';
// Importa do arquivo 'dashboard.ts' (sem sufixo no import)
import { DashboardComponent } from './pages/dashboard/dashboard'; 

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        title: 'Gestor Financeiro'
    }
];