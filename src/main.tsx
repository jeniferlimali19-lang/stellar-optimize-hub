import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { optimizer } from "./lib/optimizer";

// Reativa as funções salvas assim que o app abre (ficam ligadas sempre).
optimizer.start();

createRoot(document.getElementById("root")!).render(<App />);

