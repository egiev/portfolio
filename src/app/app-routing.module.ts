import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadChildren: () =>
      import("./modules/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./modules/projects/projects.module").then(
        (m) => m.ProjectsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
