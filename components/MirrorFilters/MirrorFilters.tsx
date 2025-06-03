
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CameraIcon as TakePhotoIcon, TrashIcon } from '../../constants'; // Renamed to avoid conflict, imported TrashIcon
import { ProgressPhoto } from '../../types';
import { Modal } from '../common/Modal';

const backgrounds = [
  { id: 'none', name: 'Sem Fundo', style: 'bg-gray-700' },
  { id: 'gym1', name: 'Academia Moderna', style: 'bg-cover bg-center', imageUrl: 'https://picsum.photos/seed/gym1/640/480' },
  { id: 'gym2', name: 'Espelho Clássico', style: 'bg-cover bg-center', imageUrl: 'https://picsum.photos/seed/gym2/640/480' },
  { id: 'studio', name: 'Estúdio Fitness', style: 'bg-cover bg-center', imageUrl: 'https://picsum.photos/seed/studio/640/480' },
];

const MirrorFilters: React.FC = () => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);
  const [takenPhotos, setTakenPhotos] = useState<ProgressPhoto[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setupCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          setCameraError(null);
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setCameraError("Não foi possível acessar a câmera. Verifique as permissões.");
        setIsCameraActive(false);
      }
    } else {
      setCameraError("Seu navegador não suporta acesso à câmera.");
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  useEffect(() => {
    // Automatically try to setup camera on mount, or if explicitly started.
    // For this demo, let's require a button click to start.
    return () => { // Cleanup camera on unmount
      stopCamera();
    };
  }, [stopCamera]);

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      setupCamera();
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Draw background if one is selected (and it's an image)
        if (selectedBackground.imageUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous"; // For picsum or other CORS images
          img.onload = () => {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video over background
            const dataUrl = canvas.toDataURL('image/jpeg');
            setTakenPhotos(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), imageUrl: dataUrl }]);
          };
          img.onerror = () => { // Fallback if background image fails
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setTakenPhotos(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), imageUrl: dataUrl }]);
          };
          img.src = selectedBackground.imageUrl;

        } else { // No image background, just video
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setTakenPhotos(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), imageUrl: dataUrl }]);
        }
      }
    } else {
      alert("Câmera não está ativa ou pronta.");
    }
  };

  const openPreview = (imageUrl: string) => {
    setCurrentPreviewImage(imageUrl);
    setIsPreviewModalOpen(true);
  };
  
  const deletePhoto = (photoId: string) => {
    setTakenPhotos(prev => prev.filter(p => p.id !== photoId));
  };


  return (
    <Card title="Filtros de Espelho Simulado">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Camera View & Controls */}
        <div className="md:col-span-2 space-y-4">
          <div 
            className={`aspect-video rounded-lg overflow-hidden relative flex items-center justify-center 
                       ${selectedBackground.imageUrl ? '' : selectedBackground.style}`}
            style={selectedBackground.imageUrl ? { backgroundImage: `url(${selectedBackground.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-contain ${!isCameraActive || cameraError ? 'hidden' : ''} relative z-10`}></video>
            {!isCameraActive && !cameraError && <p className="text-gray-400 z-0">Câmera desligada.</p>}
            {cameraError && <p className="text-red-400 p-4 text-center z-0">{cameraError}</p>}
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas> {/* Hidden canvas for taking photos */}
          <div className="flex space-x-2">
            <Button onClick={handleToggleCamera} variant={isCameraActive ? "danger" : "primary"} className="flex-1">
              {isCameraActive ? 'Desligar Câmera' : 'Ligar Câmera'}
            </Button>
            <Button onClick={takePhoto} disabled={!isCameraActive} className="flex-1">
              <TakePhotoIcon className="w-5 h-5 mr-2" /> Tirar Foto
            </Button>
          </div>
        </div>

        {/* Right: Filters/Backgrounds & Gallery */}
        <div className="space-y-4">
          <Card title="Fundos Virtuais" className="bg-gray-750">
            <div className="space-y-2">
              {backgrounds.map(bg => (
                <Button
                  key={bg.id}
                  onClick={() => setSelectedBackground(bg)}
                  variant={selectedBackground.id === bg.id ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                >
                  {bg.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Simulação de espelho: o fundo será aplicado atrás da sua imagem ao tirar a foto.</p>
          </Card>
        </div>
      </div>
      
      {takenPhotos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-100">Galeria de Progresso Visual</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {takenPhotos.map(photo => (
              <Card key={photo.id} className="bg-gray-750 group relative">
                <img src={photo.imageUrl} alt={`Progresso ${new Date(photo.date).toLocaleDateString()}`} className="aspect-square object-cover rounded-t-lg cursor-pointer" onClick={() => openPreview(photo.imageUrl)}/>
                <div className="p-2 text-center">
                  <p className="text-xs text-gray-400">{new Date(photo.date).toLocaleDateString()}</p>
                  <Button size="sm" variant="danger" onClick={() => deletePhoto(photo.id)} className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 p-1" aria-label="Deletar foto">
                     <TrashIcon className="w-4 h-4"/>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
           <p className="text-sm text-gray-500 mt-4">Funcionalidade de "Antes e Depois" e compartilhamento social podem ser adicionadas aqui.</p>
        </div>
      )}

      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Visualizar Foto">
        {currentPreviewImage && <img src={currentPreviewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded"/>}
      </Modal>

    </Card>
  );
};

export default MirrorFilters;
