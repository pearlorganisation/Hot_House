// -----------------------------------------------Imports------------------------------------------------
import "./App.css";
import { RouterProvider} from "react-router-dom";
import {Toaster} from "sonner"
import { appRouter } from "./routes/routes";
// ------------------------------------------------------------------------------------------------------

function App() {
  return (
    <><Toaster richColors
    containerClassName="overflow-auto"/>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
