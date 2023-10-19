import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyListComponent } from "./components/my-list/my-list.component";

const routes: Routes = [
    {
        path: '',
        component: MyListComponent,
        data: { breadcrumb: 'my-library' },
    },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class MyLibraryRoutingModule {}
