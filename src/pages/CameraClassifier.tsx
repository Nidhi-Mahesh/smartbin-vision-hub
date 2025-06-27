import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import Header from "@/components/Header";

const BACKEND_URL = "http://localhost:5000/predict";

interface PredictionResult {
  predicted_class: string;
  biodegradability: string;
  confidence: number;
  disposal_info?: {
    biodegradable: boolean;
    recycling_info: string;
    decomposition_time: string;
  };
  all_predictions?: Array<{
    class: string;
    confidence: number;
    biodegradable: string;
  }>;
}

const CameraClassifier = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [organicLevel, setOrganicLevel] = useState<number | null>(null);

  useEffect(() => {
    const organicRef = ref(db, "/dustbin/organic_fill_percent");
    const unsubscribe = onValue(organicRef, (snapshot) => {
      setOrganicLevel(snapshot.val());
    });
    return () => unsubscribe();
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

  // Capture image and send to backend
  const captureAndClassify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, 224, 224);
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      await classifyImage(blob);
    }, "image/jpeg");
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      classifyImage(file);
    }
  };

  // Common classification function
  const classifyImage = async (imageBlob: Blob) => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", imageBlob, "image.jpg");
    
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Classification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (biodegradability: string) => {
    return biodegradability === 'Biodegradable' ? 'default' : 'destructive';
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗂️ AI Waste Classifier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Section */}
            <div className="flex flex-col items-center space-y-4">
              <video 
                ref={videoRef} 
                width={300} 
                height={300} 
                className="border rounded-lg"
                style={{ display: "block" }} 
              />
              <canvas 
                ref={canvasRef} 
                width={224} 
                height={224} 
                style={{ display: "none" }} 
              />
              
              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={startCamera} disabled={loading}>
                  📷 {cameraActive ? 'Camera Active' : 'Start Camera'}
                </Button>
                <Button 
                  onClick={captureAndClassify} 
                  disabled={loading || !cameraActive}
                >
                  {loading ? "Analyzing..." : "📸 Capture & Classify"}
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  📁 Upload Image
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Analyzing your image...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Main Result */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize text-2xl">{result.predicted_class}</span>
                  <Badge variant={getBadgeVariant(result.biodegradability)}>
                    {result.biodegradability}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Confidence */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Confidence</span>
                    <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-3" />
                </div>

                {/* Disposal Information */}
                {result.disposal_info && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">♻️ Disposal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border-l-4 border-green-500">
                        <strong className="block text-gray-700 mb-1">Recycling</strong>
                        <span className="text-sm text-gray-600">
                          {result.disposal_info.recycling_info}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                        <strong className="block text-gray-700 mb-1">Decomposition Time</strong>
                        <span className="text-sm text-gray-600">
                          {result.disposal_info.decomposition_time}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Predictions */}
            {result.all_predictions && (
              <Card>
                <CardHeader>
                  <CardTitle>📊 All Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.all_predictions.map((pred, index) => (
                      <div 
                        key={pred.class}
                        className={`flex justify-between items-center p-3 rounded-lg border ${
                          index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-medium capitalize ${index === 0 ? 'text-green-800' : 'text-gray-700'}`}>
                            {pred.class}
                          </span>
                          <Badge 
                            variant={pred.biodegradable === 'Biodegradable' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {pred.biodegradable}
                          </Badge>
                        </div>
                        <span className={`font-bold ${index === 0 ? 'text-green-800' : 'text-gray-600'}`}>
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CameraClassifier;