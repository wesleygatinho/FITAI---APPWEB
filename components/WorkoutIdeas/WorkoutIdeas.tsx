
import React, { useState, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { generateFitnessTip, generateWorkoutIdea } from '../../services/geminiService';
import { GroundingChunk } from '../../types';

const WorkoutIdeas: React.FC = () => {
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(false);
  const [isLoadingIdea, setIsLoadingIdea] = useState<boolean>(false);
  const [fitnessTip, setFitnessTip] = useState<string | null>(null);
  const [workoutIdea, setWorkoutIdea] = useState<string | null>(null);
  const [ideaPrompt, setIdeaPrompt] = useState<string>("Sugira um treino rápido de 15 minutos para fazer em casa sem equipamentos.");
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);

  const fetchFitnessTip = useCallback(async () => {
    setIsLoadingTip(true);
    setFitnessTip(null);
    const tip = await generateFitnessTip();
    setFitnessTip(tip);
    setIsLoadingTip(false);
  }, []);

  const fetchWorkoutIdea = useCallback(async () => {
    if (!ideaPrompt.trim()) {
      alert("Por favor, insira uma descrição para a ideia de treino.");
      return;
    }
    setIsLoadingIdea(true);
    setWorkoutIdea(null);
    setGroundingChunks([]);
    const result = await generateWorkoutIdea(ideaPrompt);
    if (result) {
      setWorkoutIdea(result.text);
      if (result.groundingMetadata?.groundingChunks) {
        setGroundingChunks(result.groundingMetadata.groundingChunks);
      }
    } else {
      setWorkoutIdea("Não foi possível gerar uma ideia de treino.");
    }
    setIsLoadingIdea(false);
  }, [ideaPrompt]);


  return (
    <div className="space-y-6">
      <Card title="Ideias e Dicas Fitness com IA">
        <div className="space-y-4">
          <Button onClick={fetchFitnessTip} isLoading={isLoadingTip} className="w-full md:w-auto">
            Obter Dica Fitness do Dia
          </Button>
          {fitnessTip && (
            <Card title="Sua Dica Fitness:" className="bg-gray-750">
              <p className="text-lg text-primary-300 italic">{fitnessTip}</p>
            </Card>
          )}
        </div>
      </Card>

      <Card title="Gerador de Ideias de Treino">
        <div className="space-y-4">
          <Input
            label="Descreva o tipo de treino que você procura:"
            type="text"
            value={ideaPrompt}
            onChange={(e) => setIdeaPrompt(e.target.value)}
            placeholder="Ex: treino de força para pernas, 3 vezes por semana"
          />
          <Button onClick={fetchWorkoutIdea} isLoading={isLoadingIdea} className="w-full md:w-auto">
            Gerar Ideia de Treino
          </Button>
          {isLoadingIdea && <p className="text-primary-400">A IA está pensando no seu treino...</p>}
          {workoutIdea && !isLoadingIdea && (
            <Card title="Sua Ideia de Treino:" className="bg-gray-750">
              <pre className="whitespace-pre-wrap text-gray-200 font-sans text-sm leading-relaxed">{workoutIdea}</pre>
              {groundingChunks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">Fontes (Google Search Grounding):</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {groundingChunks.map((chunk, index) => (
                       (chunk.web || chunk.retrievedContext) && (
                        <li key={index} className="text-xs text-blue-400 hover:text-blue-300">
                          <a href={(chunk.web?.uri || chunk.retrievedContext?.uri)} target="_blank" rel="noopener noreferrer">
                            {(chunk.web?.title || chunk.retrievedContext?.title || chunk.web?.uri || chunk.retrievedContext?.uri)}
                          </a>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </div>
      </Card>
       <p className="text-xs text-gray-500 text-center mt-4">
         Lembre-se: As sugestões da IA são para inspiração. Consulte um profissional de educação física antes de iniciar qualquer novo programa de exercícios.
       </p>
    </div>
  );
};

export default WorkoutIdeas;
    