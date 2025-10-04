import React from "react";
import { useLocation } from "react-router-dom";

// Utility to convert query params into an object
function useQueryParams() {
  const { search } = useLocation();
  return React.useMemo(() => {
    const params = new URLSearchParams(search);
    const data = {};
    for (let [key, value] of params.entries()) {
      data[key] = value;
    }
    return data;
  }, [search]);
}

const Preview = () => {
  const data = useQueryParams();

  return (
    <div
      style={{
        width: "3.5in",
        height: "2in",
        padding: "0.125in",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <VisitingCard data={data} />
    </div>
  );
};

export default Preview;
