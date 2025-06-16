const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
    console.log("Received POST at /api/predict");

    const inputData = req.body;

    // Spawn the Python process
    const pythonProcess = spawn("python3", [
        path.join(__dirname, "../models/predict.py"),
        JSON.stringify(inputData),
    ]);

    let result = "";
    let errorOutput = "";

    // Collect stdout
    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    // Collect stderr
    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error("Python stderr:", data.toString());
    });

    // On process close
    pythonProcess.on("close", (code) => {
        if (errorOutput) {
            return res
                .status(500)
                .json({ error: "Python script error", details: errorOutput });
        }

        try {
            const parsed = JSON.parse(result);
            if (parsed.error) {
                return res.status(400).json({ error: parsed.error });
            }
            res.status(200).json(parsed);
        } catch (err) {
            console.error("❌ JSON parse error:", err.message);
            return res.status(500).json({
                error: "Model response was not valid JSON",
                raw: result,
            });
        }
    });
});

module.exports = router;
