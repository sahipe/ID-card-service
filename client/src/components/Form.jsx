import React, { useState, useRef, useEffect } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import DataFromExcel from "./DataFromExcel";

const VisitingCardForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    etccode: "",
    aadharNumber: "",
    photoUrl: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [dataFromExcel, setDataFromExcel] = useState([]);

  const cardRefsLeft = useRef([]);
  const cardRefsRight = useRef([]);

  const [photoUrls, setPhotoUrls] = useState({});

  useEffect(() => {
    if (dataFromExcel.length > 0) {
      const obj = dataFromExcel[0];
      setFormData((prev) => ({
        ...prev,
        ...obj,
      }));
    }
  }, [dataFromExcel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleDownloadPDFs = async () => {
    setIsDownloading(true);
    try {
      for (let i = 0; i < dataFromExcel.length; i++) {
        const leftNode = cardRefsLeft.current[i];
        const rightNode = cardRefsRight.current[i];
        if (!leftNode || !rightNode) continue;

        const leftDataUrl = await toJpeg(leftNode, {
          quality: 1,
          pixelRatio: 3,
        });
        const rightDataUrl = await toJpeg(rightNode, {
          quality: 1,
          pixelRatio: 3,
        });

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const leftImgProps = pdf.getImageProperties(leftDataUrl);
        const leftRatio = Math.min(
          pdfWidth / leftImgProps.width,
          pdfHeight / leftImgProps.height
        );
        pdf.addImage(
          leftDataUrl,
          "JPEG",
          (pdfWidth - leftImgProps.width * leftRatio) / 2,
          0,
          leftImgProps.width * leftRatio,
          leftImgProps.height * leftRatio
        );

        pdf.addPage();
        const rightImgProps = pdf.getImageProperties(rightDataUrl);
        const rightRatio = Math.min(
          pdfWidth / rightImgProps.width,
          pdfHeight / rightImgProps.height
        );
        pdf.addImage(
          rightDataUrl,
          "JPEG",
          (pdfWidth - rightImgProps.width * rightRatio) / 2,
          0,
          rightImgProps.width * rightRatio,
          rightImgProps.height * rightRatio
        );

        const fileName = `ID_card_${dataFromExcel[i].name || i + 1}.pdf`;
        pdf.save(fileName);
      }
    } catch (error) {
      console.error("Error generating PDFs:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        ID Card Generator
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-xl grid gap-6 mb-8"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            ETC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="etccode"
            required
            value={formData.etccode}
            onChange={handleChange}
            placeholder="Enter ETC Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Aadhar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aadharNumber"
            required
            value={formData.aadharNumber}
            onChange={handleChange}
            placeholder="Enter full Aadhar number"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
        >
          {isSubmitting ? "Submitting..." : "Generate Card"}
        </button>
      </form>

      <div className="flex justify-center mb-12">
        <DataFromExcel setDataFromExcel={setDataFromExcel} />
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Card Preview
        </h2>

        {dataFromExcel.map((obj, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-6 justify-center items-start flex-wrap"
          >
            {/* LEFT CARD */}
            <div
              ref={(el) => (cardRefsLeft.current[index] = el)}
              className="bg-white p-4 w-[300px] aspect-[5/7] flex flex-col items-center relative shadow-md"
            >
              {/* 👇 Auto-switch logo from Excel */}
              <img
                src={
                  obj.logo?.toLowerCase() === "beemaa"
                    ? "/beema.png"
                    : obj.logo?.toLowerCase() === "fsc"
                    ? "/fsc.png"
                    : "/spekctrum.png"
                }
                alt="Company Logo"
                className={` object-cover ${
                  obj.logo?.toLowerCase() === "beemaa"
                    ? "h-12 mb-4"
                    : obj.logo?.toLowerCase() === "fsc"
                    ? "h-13 mb-4"
                    : "h-13 mb-4"
                }`}
              />

              <input
                type="file"
                accept="image/*"
                id={`file-input-${index}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setPhotoUrls((prev) => ({
                      ...prev,
                      [index]: url,
                    }));
                  }
                }}
              />

              <label
                htmlFor={`file-input-${index}`}
                className="w-32 h-40 bg-[#0076bd] rounded-md overflow-hidden mb-4 cursor-pointer flex items-center justify-center"
              >
                {photoUrls[index] ? (
                  <img
                    src={photoUrls[index]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-sm">Click to Upload</div>
                )}
              </label>

              <h3 className="text-lg font-semibold">{obj.name || "Name"}</h3>
              <p className="text-sm mt-1 text-blue-600 font-semibold">
                ETC CODE: <span>{obj.etc || "N/A"}</span>
              </p>

              <img
                src="/signature.png"
                alt="Signature"
                className="h-20 w-auto object-contain absolute bottom-4 right-6"
              />

              <p className="absolute bottom-3 right-4 text-sm text-black">
                Issuing Authority
              </p>
            </div>

            {/* RIGHT CARD */}
            <div
              ref={(el) => (cardRefsRight.current[index] = el)}
              className="bg-white p-4 w-[300px] aspect-[5/7] flex flex-col justify-between shadow-md"
            >
              <div className="text-black text-base space-y-2">
                <p>
                  Aadhar Number:{" "}
                  <span className="font-bold">xxxx-xxxx-{obj.aadhar}</span>
                </p>
                <p>
                  Emergency Contact:{" "}
                  <span className="font-bold">7669993101</span>
                </p>
                <p>
                  Customer Care: <span className="font-bold">011-41446615</span>
                </p>
                <p>
                  Email: <span className="font-bold">hr@spektrum.com</span>
                </p>
              </div>

              <div className="text-center text-black mt-4 text-sm">
                <p>This card is issued for Identification purposes only</p>
                <p className="font-semibold mt-5">
                  THIS CARD IS THE PROPERTY OF
                  <br />
                  SPECTRUM INSURANCE BROKING (P) LTD.
                </p>
                <p>SPECTRUM FINTECH PRIVATE LIMITED</p>
                <p className="mt-2">
                  If found, please return to:
                  <br />
                  Unit No. 502, 5th Floor, Plot Number 5, Time House Tower,
                  Wazirpur Community Centre, WIA, Delhi - 110052.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <button
          onClick={handleDownloadPDFs}
          disabled={isDownloading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-200"
        >
          {isDownloading ? "Processing..." : "Download all cards as PDFs"}
        </button>
      </div>
    </div>
  );
};

export default VisitingCardForm;
