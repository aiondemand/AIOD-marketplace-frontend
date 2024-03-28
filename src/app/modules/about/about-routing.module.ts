import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./components/about/about.component";

const routes: Routes = [
    {
        path: '',
        component: AboutComponent,
        data: { breadcrumb: '' },
    },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class AboutRoutingModule {}
