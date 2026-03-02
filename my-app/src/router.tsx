import { createBrowserRouter } from "react-router-dom"
import Layout from "@/pages/_layout"
import LibraryPage from "@/pages/library"
import GeneratePage from "@/pages/generate"
import MeasureDetailPage from "@/pages/measures/detail"
import FunctionDetailPage from "@/pages/functions/detail"
import PackageDetailPage from "@/pages/packages/detail"
import MeasureFormPage from "@/pages/admin/measures/form"
import FunctionFormPage from "@/pages/admin/functions/form"
import PackageFormPage from "@/pages/admin/packages/form"
import CategoriesPage from "@/pages/admin/categories"
import NotFoundPage from "@/pages/not-found"

// IMPORTANT: Do not remove or modify the code below!
// Normalize basename when hosted in Power Apps
const BASENAME = new URL(".", location.href).pathname
if (location.pathname.endsWith("/index.html")) {
  history.replaceState(null, "", BASENAME + location.search + location.hash);
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LibraryPage /> },
      { path: "measures/:id", element: <MeasureDetailPage /> },
      { path: "functions/:id", element: <FunctionDetailPage /> },
      { path: "packages/:id", element: <PackageDetailPage /> },
      { path: "generate", element: <GeneratePage /> },
      { path: "admin/measures/new", element: <MeasureFormPage /> },
      { path: "admin/measures/:id/edit", element: <MeasureFormPage /> },
      { path: "admin/functions/new", element: <FunctionFormPage /> },
      { path: "admin/functions/:id/edit", element: <FunctionFormPage /> },
      { path: "admin/packages/new", element: <PackageFormPage /> },
      { path: "admin/packages/:id/edit", element: <PackageFormPage /> },
      { path: "admin/categories", element: <CategoriesPage /> },
    ],
  },
], {
  basename: BASENAME // IMPORTANT: Set basename for proper routing when hosted in Power Apps
})
