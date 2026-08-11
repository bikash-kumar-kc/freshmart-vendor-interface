// import { toast } from "sonner";
import "./App.css";

import { showToast,  } from "./toast";


function App() {
  return (
    <>
      <h1 className="text-green-500">hi, from freshmart vendor portal</h1>
      <button onClick={() => showToast.success("You found correct ui library")}>
        Click Me
      </button>
    </>
  );
}

export default App;
