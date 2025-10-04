import React, { useState } from "react";
import Form from "./components/Form";

import { Route, Routes } from "react-router-dom";

import Preview from "./components/Preview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}

export default App;
