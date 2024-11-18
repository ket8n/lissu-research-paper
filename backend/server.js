const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Sample ontology mappings for units
const unitMappings = {
  mm: { factor: 1, dimension: "length" },
  cm: { factor: 10, dimension: "length" },
  m: { factor: 1000, dimension: "length" },
};

// Semantic Validation API
app.post("/validate", (req, res) => {
  const clientConfig = req.body.client;
  const serverConfig = req.body.server;

  const errors = [];
  const conversions = {};

  Object.keys(clientConfig).forEach((key) => {
    if (clientConfig[key].dimension !== serverConfig[key]?.dimension) {
      errors.push(`${key}: Dimension mismatch.`);
    } else if (clientConfig[key].unit !== serverConfig[key]?.unit) {
      conversions[key] = {
        from: clientConfig[key].unit,
        to: serverConfig[key].unit,
        conversionFactor:
          unitMappings[serverConfig[key].unit].factor /
          unitMappings[clientConfig[key].unit].factor,
      };
    }
  });

  res.json({ errors, conversions });
});

// Conversion API
app.post("/convert", (req, res) => {
  const { values, conversions } = req.body;

  const convertedValues = Object.keys(values).reduce((acc, key) => {
    if (conversions[key]) {
      acc[key] = values[key] * conversions[key].conversionFactor;
    } else {
      acc[key] = values[key];
    }
    return acc;
  }, {});

  res.json({ convertedValues });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
