import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { BanksComponent } from './components/banks/banks.component';
import { BankComponent } from './components/banks/bank/bank.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UserActionComponent } from './components/user-view/user-action/user-action.component';
import { LoanTypesComponent } from './components/loan-types/loan-types.component';
import { LoanTypeComponent } from './components/loan-types/loan-type/loan-type.component';
import { HolidaysComponent } from './components/holidays/holidays.component';
import { HolidayComponent } from './components/holidays/holiday/holiday.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MessageComponent } from './components/messages/message/message.component';
import { RefinanceTableViewComponent } from './components/refinance-table-view/refinance-table-view.component';
import { RefinanceComponent } from './components/refinance/refinance.component';
import { RefinanceResolver } from '../../resolvers/refinance.resolver';
import { RequestLoanResolver } from '../../resolvers/request-loan.resolver';
import { ApplicationComponent } from './components/application/application.component';
import { AppActionComponent } from './components/application/app-action/app-action.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: '', redirectTo: '/main/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            //Banks
            { path: 'banks', component: BanksComponent },
            { path: 'add-bank', component: BankComponent },
            { path: 'edit-bank/:id', component: BankComponent },
            { path: 'requests', component: RefinanceComponent },
            { path: 'requests/:id', component: RefinanceComponent, resolve: { requestLoans: RequestLoanResolver } },
            //Users
            { path: 'users', component: UserViewComponent },
            { path: 'add-user', component: UserActionComponent },
            { path: 'edit-user/:id', component: UserActionComponent },
            //Loan types
            { path: 'loan-types', component: LoanTypesComponent },
            { path: 'add-loan', component: LoanTypeComponent },
            { path: 'edit-loan/:id', component: LoanTypeComponent },
            //Holidays
            { path: 'holidays', component: HolidaysComponent },
            { path: 'add-holiday', component: HolidayComponent },
            { path: 'edit-holiday/:id', component: HolidayComponent },
            //Messages
            { path: 'messages', component: MessagesComponent },
            { path: 'add-message', component: MessageComponent },
            { path: 'edit-message/:id', component: MessageComponent },
            //Application
            { path: 'applications', component: ApplicationComponent },
            { path: 'add-application', component: AppActionComponent },
            { path: 'edit-application/:id', component: AppActionComponent },
            //Refinance table
            { path: 'refinance-table', component: RefinanceTableViewComponent, resolve: { statuses: RefinanceResolver } },
            //Reports
            { path: 'reports', component: ReportsComponent },
            //Akcija za subskripcije
            { path: 'subscribe', component: SubscribeComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule {}

export const routingLinks = [
    HomeComponent,
    BanksComponent,
    BankComponent,
    DashboardComponent,
    UserViewComponent,
    UserActionComponent,
    LoanTypesComponent,
    LoanTypeComponent,
    HolidaysComponent,
    HolidayComponent,
    MessagesComponent,
    MessageComponent,
    RefinanceTableViewComponent,
    RefinanceComponent,
    ApplicationComponent,
    AppActionComponent,
    ReportsComponent,
    SubscribeComponent,
];
