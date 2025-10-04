import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";

const DataFromExcel = ({ setDataFromExcel }) => {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData);
      setDataFromExcel(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4 text-center flex items-center gap-5">
      {/* <label>
        Upload Excel file:
        <input
          type="file"
          accept=".xlsx, .xls"
          className="border border-blue-500 p-2 rounded ml-2"
          onChange={handleFileUpload}
        />
      </label> */}

      <label className="block mb-1  text-xl">Upload Excel file :</label>
      <div className="relative">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white text-sm text-gray-700 shadow-sm
               file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600
               hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
      </div>

      {/* {data.length > 0 && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-left">
          {JSON.stringify(data, null, 2)}
        </pre>
      )} */}
    </div>
  );
};

export default DataFromExcel;
