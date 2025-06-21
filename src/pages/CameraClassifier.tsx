
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const CameraClassifier = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{label: string, confidence: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<Array<{
    id: number;
    image: string;
    label: string;
    confidence: number;
    timestamp: string;
    feedback?: 'correct' | 'incorrect';
  }>>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        classifyImage(imageData);
      }
    }
  };

  const classifyImage = async (imageData: string) => {
    setIsLoading(true);
    setPrediction(null);
    
    // Simulate ML model prediction
    setTimeout(() => {
      const labels = ['Biodegradable', 'Non-Biodegradable'];
      const randomLabel = labels[Math.floor(Math.random() * labels.length)];
      const confidence = 0.75 + Math.random() * 0.25;
      
      const newPrediction = {
        label: randomLabel,
        confidence: confidence
      };
      
      setPrediction(newPrediction);
      setIsLoading(false);

      // Add to history
      const historyEntry = {
        id: Date.now(),
        image: imageData,
        label: randomLabel,
        confidence: confidence,
        timestamp: new Date().toISOString()
      };
      
      setPredictionHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

      toast({
        title: "Classification Complete",
        description: `Predicted: ${randomLabel} (${Math.round(confidence * 100)}% confidence)`,
      });
    }, 2000);
  };

  const provideFeedback = (id: number, feedback: 'correct' | 'incorrect') => {
    setPredictionHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, feedback } : item
      )
    );
    
    toast({
      title: "Feedback Recorded",
      description: `Thank you for helping improve our model!`,
    });
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setPrediction(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Waste Classifier 📷</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use your camera to classify waste as biodegradable or non-biodegradable using our 
            machine learning model. Point your camera at any waste item and get instant results!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="text-blue-600" size={20} />
                <span>Camera Feed</span>
              </CardTitle>
              <CardDescription>Capture waste items for AI classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!cameraActive ? (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 mb-4">Camera not active</p>
                      <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                        Start Camera
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full aspect-video bg-black rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center pointer-events-none">
                      <div className="text-white text-center bg-black/50 p-2 rounded">
                        <p className="text-sm">Position waste item in frame</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="flex space-x-2">
                  {cameraActive ? (
                    <>
                      <Button onClick={captureImage} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Camera size={16} className="mr-2" />
                        Capture & Classify
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Stop Camera
                      </Button>
                    </>
                  ) : (
                    <Button onClick={startCamera} className="w-full">
                      <Camera size={16} className="mr-2" />
                      Start Camera
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Classification Results</span>
                {isLoading && <Loader2 className="animate-spin text-blue-600" size={20} />}
              </CardTitle>
              <CardDescription>AI prediction results and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capturedImage && (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={capturedImage} 
                        alt="Captured waste item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {isLoading && (
                      <Alert>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertDescription>
                          Analyzing image with AI model... This may take a moment.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {prediction && !isLoading && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <Badge 
                            className={`text-lg py-2 px-4 ${
                              prediction.label === 'Biodegradable' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {prediction.label}
                          </Badge>
                          <p className="text-2xl font-bold mt-2">
                            {Math.round(prediction.confidence * 100)}% Confidence
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => provideFeedback(Date.now(), 'correct')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Correct
                          </Button>
                          <Button 
                            onClick={() => provideFeedback(Date.now(), 'incorrect')}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle size={16} className="mr-2" />
                            Incorrect
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button onClick={retakePhoto} variant="outline" className="w-full">
                      <RefreshCw size={16} className="mr-2" />
                      Take Another Photo
                    </Button>
                  </div>
                )}
                
                {!capturedImage && !isLoading && (
                  <div className="text-center py-8">
                    <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Capture an image to see AI classification results</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction History */}
        {predictionHistory.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Classifications</CardTitle>
              <CardDescription>Your recent AI predictions and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictionHistory.slice(0, 6).map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 space-y-2">
                    <img 
                      src={item.image} 
                      alt="Previous classification"
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={`text-xs ${
                          item.label === 'Biodegradable' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {item.label}
                      </Badge>
                      <span className="text-xs font-medium">{Math.round(item.confidence * 100)}%</span>
                    </div>
                    {item.feedback && (
                      <div className="flex items-center space-x-1">
                        {item.feedback === 'correct' ? (
                          <CheckCircle className="text-green-600" size={14} />
                        ) : (
                          <XCircle className="text-red-600" size={14} />
                        )}
                        <span className="text-xs text-gray-600">
                          Marked as {item.feedback}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CameraClassifier;
