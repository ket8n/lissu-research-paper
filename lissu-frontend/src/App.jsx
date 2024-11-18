import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [clientConfig, setClientConfig] = useState({});
  const [serverConfig, setServerConfig] = useState({});
  const [validationResult, setValidationResult] = useState(null);
  const [values, setValues] = useState({});
  const [convertedValues, setConvertedValues] = useState(null);

  const validate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/validate", {
        client: clientConfig,
        server: serverConfig,
      });
      setValidationResult(response.data);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const convert = async () => {
    if (validationResult?.conversions) {
      try {
        const response = await axios.post("http://localhost:5000/convert", {
          values,
          conversions: validationResult.conversions,
        });
        setConvertedValues(response.data.convertedValues);
      } catch (error) {
        console.error("Conversion error:", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>LISSU Demonstration</h1>

      <h2>Client Configuration</h2>
      <textarea
        placeholder="Enter client configuration JSON
{
  'X': {'unit': '',  'dimension': ''}
} "
        rows="5"
        cols="50"
        onChange={(e) => setClientConfig(JSON.parse(e.target.value))}
        style={{ marginBottom: "20px", width: "100%" }}
      />

      <h2>Server Configuration</h2>
      <textarea
        placeholder="Enter server configuration JSON
{
  'X': {'unit': '',  'dimension': ''}
} "
        rows="5"
        cols="50"
        onChange={(e) => setServerConfig(JSON.parse(e.target.value))}
        style={{ marginBottom: "20px", width: "100%" }}
      />

      <button
        onClick={validate}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Validate
      </button>

      {validationResult && (
        <div>
          <h2>Validation Results</h2>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {JSON.stringify(validationResult, null, 2)}
          </pre>

          <h2>Values</h2>
          <textarea
            placeholder="Enter values JSON"
            rows="5"
            cols="50"
            onChange={(e) => setValues(JSON.parse(e.target.value))}
            style={{ marginBottom: "20px", width: "100%" }}
          />

          <button
            onClick={convert}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Convert
          </button>
        </div>
      )}

      {convertedValues && (
        <div>
          <h2>Converted Values</h2>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {JSON.stringify(convertedValues, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;
