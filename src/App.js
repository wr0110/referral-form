import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import ReferralForm from "./pages/referral-form/referral-form.component";
import SuccessForm from "./pages/success-form/success-form.component";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReferralForm />} />
          <Route path="/submitSuccess" element={<SuccessForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
