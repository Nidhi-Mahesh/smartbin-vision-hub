import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import * as tmImage from "@teachablemachine/image";

const TM_LABELS = ["Banana", "Pen", "Book"];

const CameraClassifier = () => {
  const [tmModel, setTmModel] = useState<any | null>(null);
  const [tmLabel, setTmLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load Teachable Machine model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = "/tm_model/model.json";
        const metadataURL = "/tm_model/metadata.json";
        const model = await tmImage.load(modelURL, metadataURL);
        setTmModel(model);
        console.log("Teachable Machine model loaded successfully");
      } catch (error) {
        console.error("Error loading Teachable Machine model:", error);
        setError("Failed to load AI model");
      }
    };
    loadModel();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError("Camera access denied or not available");
    }
  };

  // Classify current webcam frame
  const classifyWebcam = async () => {
    if (!tmModel || !videoRef.current) return;
    setLoading(true);
    try {
      const prediction = await tmModel.predict(videoRef.current);
      const maxProbability = Math.max(...prediction);
      const classIdx = prediction.indexOf(maxProbability);
      const label = TM_LABELS[classIdx];
      setTmLabel(label);
      // Speech synthesis
      let utterance = "";
      if (label === "Banana" || label === "Book") {
        utterance = "It's organic waste, put it in the left bin.";
      } else if (label === "Pen") {
        utterance = "It's inorganic waste, put it in the right bin.";
      }
      if (utterance) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(utterance));
      }
    } catch (error) {
      console.error("Error classifying with Teachable Machine:", error);
      setError("Failed to classify with AI model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🗂️ AI Waste Classifier (Teachable Machine Only)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <video 
              ref={videoRef} 
              width={300} 
              height={300} 
              className="border rounded-lg"
              style={{ display: "block" }} 
            />
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={startCamera} disabled={loading}>
                📷 {cameraActive ? 'Camera Active' : 'Start Camera'}
              </Button>
              <Button onClick={classifyWebcam} disabled={!tmModel || !cameraActive || loading}>
                {loading ? "Analyzing..." : "Classify with Teachable Machine"}
              </Button>
            </div>
          </div>
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Teachable Machine Results */}
      {tmLabel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 AI Classification Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-blue-600">
                {tmLabel}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🗑️ Disposal Instructions</h4>
                <p className="text-blue-700">
                  {tmLabel === "Banana" || tmLabel === "Book" 
                    ? "This is organic waste. Please dispose in the organic waste bin (left bin)."
                    : "This is inorganic waste. Please dispose in the inorganic waste bin (right bin)."
                  }
                </p>
              </div>
              <div className="text-sm text-gray-600">
                AI Model: Teachable Machine (Real-time classification)
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CameraClassifier;