
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { EXERCISES } from '../../constants';
import { Exercise } from '../../types';

const LiveMonitoring: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(EXERCISES[0]);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [reps, setReps] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0); // in seconds
  const [feedbackMessage, setFeedbackMessage] = useState<string>("Prepare-se para começar!");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerIntervalRef = useRef<number | null>(null); // Changed NodeJS.Timeout to number

  const exerciseOptions = EXERCISES.map(ex => ({ value: ex.id, label: ex.name }));

  const setupCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraError(null);
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setCameraError("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    } else {
      setCameraError("Seu navegador não suporta acesso à câmera.");
    }
  }, []);

  useEffect(() => {
    if (isWorkoutActive) {
      setupCamera();
    } else {
      // Stop camera when workout is not active
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    // Cleanup function to stop camera when component unmounts or workout stops
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorkoutActive]); // Rerun only when isWorkoutActive changes


  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exercise = EXERCISES.find(ex => ex.id === e.target.value);
    setSelectedExercise(exercise || null);
    setFeedbackMessage(exercise?.instructions || "Selecione um exercício.");
  };

  const toggleWorkout = () => {
    setIsWorkoutActive(prev => !prev);
    if (!isWorkoutActive) {
      // Starting workout
      setReps(0);
      setTimer(0);
      setFeedbackMessage(selectedExercise?.instructions || "Comece o exercício!");
      if (selectedExercise?.id === 'plank') { // Example for timed exercise
        timerIntervalRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
      }
    } else {
      // Stopping workout
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setFeedbackMessage("Treino Pausado. Bom trabalho!");
    }
  };
  
  // Mock rep increment for demo
  const handleIncrementRep = () => {
    if(isWorkoutActive && selectedExercise?.id !== 'plank') {
      setReps(r => r + 1);
      setFeedbackMessage("Boa! Continue assim!");
       // Simulate AI feedback
      if ((reps + 1) % 5 === 0) {
         setFeedbackMessage("Mantenha a postura correta!");
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card title="Monitoramento de Exercícios ao Vivo (Simulado)">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Camera and Controls */}
        <div className="space-y-4">
          <Select
            label="Selecione o Exercício"
            options={exerciseOptions}
            value={selectedExercise?.id || ''}
            onChange={handleExerciseChange}
            disabled={isWorkoutActive}
          />
          <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {cameraError && <p className="text-red-400 p-4 text-center">{cameraError}</p>}
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraError ? 'hidden' : ''}`}></video>
            {!isWorkoutActive && !cameraError && <p className="text-gray-400">Câmera desligada. Inicie o treino para ativar.</p>}
          </div>
          <Button onClick={toggleWorkout} className="w-full" variant={isWorkoutActive ? 'danger' : 'primary'}>
            {isWorkoutActive ? 'Parar Treino' : 'Iniciar Treino'}
          </Button>
           {isWorkoutActive && selectedExercise?.id !== 'plank' && (
             <Button onClick={handleIncrementRep} className="w-full mt-2" variant="secondary">Adicionar Rep (Simulado)</Button>
           )}
        </div>

        {/* Right Column: Stats and Feedback */}
        <div className="space-y-4">
          <Card title="Estatísticas do Exercício" className="bg-gray-750"> {/* Custom bg if needed or use default */}
            <div className="space-y-3">
              <p className="text-lg"><span className="font-semibold">Exercício:</span> {selectedExercise?.name || 'N/A'}</p>
              {selectedExercise?.id === 'plank' ? (
                <p className="text-3xl font-bold text-primary-400">{formatTime(timer)}</p>
              ) : (
                <p className="text-3xl font-bold text-primary-400">{reps} <span className="text-xl font-normal text-gray-300">repetições</span></p>
              )}
              { /* Display timer for all exercises, but only auto-increment for plank for now */ }
              <p className="text-sm text-gray-400">Tempo Decorrido: {formatTime(timer)}</p>
            </div>
          </Card>
          <Card title="Feedback da IA (Simulado)" className="bg-gray-750">
            <p className="text-gray-200 min-h-[60px]">{feedbackMessage}</p>
            <div className="mt-4">
                <h4 className="font-semibold text-gray-300 mb-1">Instruções do Exercício:</h4>
                <p className="text-sm text-gray-400">{selectedExercise?.instructions || "Nenhuma instrução disponível."}</p>
            </div>
          </Card>
          <Card title="Progresso (Placeholder)" className="bg-gray-750">
            <p className="text-gray-400 text-sm">Gráficos de progresso da técnica e performance aparecerão aqui.</p>
            {/* Placeholder for charts */}
            <div className="h-32 bg-gray-700 rounded mt-2 flex items-center justify-center text-gray-500">Chart Placeholder</div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default LiveMonitoring;
