import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard } from "./core/guards/authentication.guard";
import { ContentLayoutComponent } from "./layout/content-layout/content-layout.component";
import { NotFoundComponent } from "./modules/not-found/not-found.component";
import { environment } from "@environments/environment";

const routes: Routes = [
  {
    path: "",
    component: ContentLayoutComponent,
    //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: "",
        redirectTo: "resources",
        pathMatch: "full",
      },
      {
        //This is the redirect from the keycloak login
        path: environment.keycloakConfig.redirectUri + "resources",
        redirectTo: "resources",
        pathMatch: "full",
      },
      {
        path: "resources",
        loadChildren: () =>
          import("@modules/marketplace/marketplace.module").then(
            (m) => m.MarketplaceModule
          ),
      },
      {
        path: "Bookmarks",
        loadChildren: () =>
          import("@modules/my-library/my-library.module").then(
            (m) => m.MyLibraryModule
          ),
      },
      {
        path: "about",
        loadChildren: () =>
          import("@modules/about/about.module").then((m) => m.AboutModule),
      },
      {
        path: "my-bookmarks",
        loadChildren: () =>
          import("@modules/shopping-cart/shopping-cart.module").then(
            (m) => m.ShoppingCartModule
          ),
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
