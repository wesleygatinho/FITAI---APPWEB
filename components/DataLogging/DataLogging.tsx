
import React, { useState, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { UploadIcon, TrashIcon } from '../../constants';
import { CardioLogData, WeightLogData, MeasurementLogData } from '../../types';
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Bar } from 'recharts';

type LogType = 'cardio' | 'weight' | 'measurement';

// Sample data for charts
const initialCardioData: CardioLogData[] = [
  { id: 'c1', date: '2024-07-01', type: 'Esteira', distance: 5, time: 30, calories: 300 },
  { id: 'c2', date: '2024-07-03', type: 'Bicicleta', distance: 10, time: 45, calories: 400 },
  { id: 'c3', date: '2024-07-05', type: 'Esteira', distance: 5.5, time: 32, calories: 320 },
];

const initialWeightData: WeightLogData[] = [
  { id: 'w1', date: '2024-07-01', weight: 70, bmi: 22.5 },
  { id: 'w2', date: '2024-07-08', weight: 69.5, bmi: 22.3 },
  { id: 'w3', date: '2024-07-15', weight: 69, bmi: 22.1 },
];


const DataLogging: React.FC = () => {
  const [activeLogType, setActiveLogType] = useState<LogType>('cardio');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  const [cardioLogs, setCardioLogs] = useState<CardioLogData[]>(initialCardioData);
  const [weightLogs, setWeightLogs] = useState<WeightLogData[]>(initialWeightData);
  const [measurementLogs, setMeasurementLogs] = useState<MeasurementLogData[]>([]);
  
  // Form states
  const [cardioForm, setCardioForm] = useState<Partial<CardioLogData>>({ type: 'Esteira' });
  const [weightForm, setWeightForm] = useState<Partial<WeightLogData>>({});
  const [measurementForm, setMeasurementForm] = useState<Partial<MeasurementLogData>>({ type: 'Cintura' });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      setOcrResult(null); // Reset OCR result
    }
  };

  const mockOcrProcess = () => {
    if (!imageFile) {
      alert("Por favor, selecione uma imagem primeiro.");
      return;
    }
    setOcrResult("Processando OCR (Simulado)...");
    setTimeout(() => {
      let mockData = "";
      if (activeLogType === 'cardio') mockData = "Distância: 5.2 km, Tempo: 45:30, Calorias: 350";
      else if (activeLogType === 'weight') mockData = "Peso: 68.5 kg";
      setOcrResult(`Dados extraídos (Simulado): ${mockData}. Por favor, confirme e preencha o formulário.`);
    }, 1500);
  };

  const handleFormChange = <T,>(setter: React.Dispatch<React.SetStateAction<Partial<T>>>, field: keyof T, value: string | number) => {
    setter(prev => ({ ...prev, [field]: value }));
  };
  
  const addCardioLog = () => {
    if (cardioForm.date && cardioForm.type && (cardioForm.distance || cardioForm.time || cardioForm.calories)) {
      setCardioLogs(prev => [...prev, {id: Date.now().toString(), ...cardioForm} as CardioLogData]);
      setCardioForm({ type: 'Esteira' }); // Reset form
    } else alert("Preencha os campos obrigatórios do cardio.");
  };

  const addWeightLog = () => {
    if (weightForm.date && weightForm.weight) {
      // Basic BMI calculation (Height is assumed for simplicity, replace with actual user height)
      const heightMeters = 1.75; // Example height
      const bmi = parseFloat((weightForm.weight / (heightMeters * heightMeters)).toFixed(1));
      setWeightLogs(prev => [...prev, {id: Date.now().toString(), ...weightForm, bmi} as WeightLogData]);
      setWeightForm({});
    } else alert("Preencha data e peso.");
  };
  
  const addMeasurementLog = () => {
     if (measurementForm.date && measurementForm.type && measurementForm.value) {
      setMeasurementLogs(prev => [...prev, {id: Date.now().toString(), ...measurementForm} as MeasurementLogData]);
      setMeasurementForm({ type: 'Cintura' });
    } else alert("Preencha os campos obrigatórios da medição.");
  };

  const renderForm = () => {
    switch (activeLogType) {
      case 'cardio':
        return (
          <form onSubmit={(e) => { e.preventDefault(); addCardioLog(); }} className="space-y-3">
            <Input type="date" label="Data" value={cardioForm.date || ''} onChange={e => handleFormChange(setCardioForm, 'date', e.target.value)} required />
            <Select label="Tipo" value={cardioForm.type || 'Esteira'} onChange={e => handleFormChange(setCardioForm, 'type', e.target.value as CardioLogData['type'])}
              options={[ {value: 'Esteira', label: 'Esteira'}, {value: 'Bicicleta', label: 'Bicicleta'}, {value: 'Elíptico', label: 'Elíptico'}, {value: 'Outro', label: 'Outro'} ]} />
            <Input type="number" label="Distância (km)" placeholder="Ex: 5.2" value={cardioForm.distance || ''} onChange={e => handleFormChange(setCardioForm, 'distance', parseFloat(e.target.value))} />
            <Input type="number" label="Tempo (minutos)" placeholder="Ex: 45" value={cardioForm.time || ''} onChange={e => handleFormChange(setCardioForm, 'time', parseInt(e.target.value))} />
            <Input type="number" label="Calorias Queimadas" placeholder="Ex: 350" value={cardioForm.calories || ''} onChange={e => handleFormChange(setCardioForm, 'calories', parseInt(e.target.value))} />
            <Button type="submit" className="w-full">Adicionar Registro de Cardio</Button>
          </form>
        );
      case 'weight':
        return (
           <form onSubmit={(e) => { e.preventDefault(); addWeightLog(); }} className="space-y-3">
            <Input type="date" label="Data" value={weightForm.date || ''} onChange={e => handleFormChange(setWeightForm, 'date', e.target.value)} required/>
            <Input type="number" label="Peso (kg)" placeholder="Ex: 70.5" value={weightForm.weight || ''} onChange={e => handleFormChange(setWeightForm, 'weight', parseFloat(e.target.value))} step="0.1" required />
            <Button type="submit" className="w-full">Adicionar Registro de Peso</Button>
          </form>
        );
      case 'measurement':
        return (
          <form onSubmit={(e) => { e.preventDefault(); addMeasurementLog(); }} className="space-y-3">
            <Input type="date" label="Data" value={measurementForm.date || ''} onChange={e => handleFormChange(setMeasurementForm, 'date', e.target.value)} required />
            <Select label="Tipo de Medida" value={measurementForm.type || 'Cintura'} onChange={e => handleFormChange(setMeasurementForm, 'type', e.target.value as MeasurementLogData['type'])}
              options={[ {value: 'Cintura', label: 'Cintura'}, {value: 'Braço', label: 'Braço'}, {value: 'Coxa', label: 'Coxa'}, {value: 'Peito', label: 'Peito'}, {value: 'Outro', label: 'Outro'} ]} />
            <Input type="number" label="Valor (cm)" placeholder="Ex: 80.5" value={measurementForm.value || ''} onChange={e => handleFormChange(setMeasurementForm, 'value', parseFloat(e.target.value))} step="0.1" required/>
            <Button type="submit" className="w-full">Adicionar Medida</Button>
          </form>
        );
      default: return null;
    }
  };
  
  const renderChart = () => {
    switch (activeLogType) {
      case 'cardio':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cardioLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="date" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: '#E2E8F0' }}/>
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
              <Bar dataKey="distance" fill="#3b82f6" name="Distância (km)" />
              <Bar dataKey="time" fill="#8B5CF6" name="Tempo (min)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="date" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: '#E2E8F0' }}/>
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
              <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Peso (kg)" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="bmi" stroke="#10B981" name="IMC" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'measurement':
         return measurementLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={measurementLogs.filter(m => m.type === measurementForm.type)}> {/* Filter by current type for relevance */}
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="date" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: '#E2E8F0' }}/>
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" name={`Medida (${measurementForm.type}) (cm)`} />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="text-gray-400">Nenhum dado de medição para exibir. Adicione alguns registros.</p>;
      default: return null;
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Registro e Análise de Dados">
        <div className="mb-4 border-b border-gray-700">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {(['cardio', 'weight', 'measurement'] as LogType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveLogType(type)}
                className={`${
                  activeLogType === type
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {type === 'cardio' ? 'Cardio' : type === 'weight' ? 'Peso' : 'Medidas'}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Form & OCR */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Adicionar Novo Registro - {activeLogType === 'cardio' ? 'Cardio' : activeLogType === 'weight' ? 'Peso' : 'Medidas'}</h3>
            <Card title="Registro por Imagem (Simulado com OCR)" className="bg-gray-750">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Tirar foto do painel/balança:
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700"/>
                </label>
                {imageFile && <p className="text-xs text-gray-400">Arquivo selecionado: {imageFile.name}</p>}
                <Button onClick={mockOcrProcess} disabled={!imageFile} className="w-full" variant="secondary">
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Extrair Dados da Imagem (Simulado)
                </Button>
                {ocrResult && <p className="text-sm text-yellow-300 bg-yellow-900 bg-opacity-50 p-2 rounded">{ocrResult}</p>}
              </div>
            </Card>
            <Card title="Registro Manual" className="bg-gray-750">
              {renderForm()}
            </Card>
          </div>
          {/* Right: Charts */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-200">Visualização de Progresso</h3>
             <Card className="bg-gray-750">
               {renderChart()}
             </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataLogging;
    