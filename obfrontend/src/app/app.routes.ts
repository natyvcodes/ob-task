import { Routes } from '@angular/router';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path: 'My-Tasks', component: MyTasksComponent}
];
