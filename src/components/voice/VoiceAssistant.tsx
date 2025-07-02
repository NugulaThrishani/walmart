import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceAssistantProps {
  user: any;
}

export function VoiceAssistant({ user }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('restock') || lowerCommand.includes('inventory')) {
      return 'Electronics section has 245 items in stock. Clothing department is running low with 89 items.';
    } else if (lowerCommand.includes('locate') || lowerCommand.includes('find')) {
      return 'Item located in Section A1, Aisle 3. Follow the AR navigation path on your device.';
    } else if (lowerCommand.includes('maintenance') || lowerCommand.includes('equipment')) {
      return 'Truck #1247 requires maintenance in 2 days. Conveyor belt system operating normally.';
    } else if (lowerCommand.includes('green') || lowerCommand.includes('carbon')) {
      return `You have saved ${user ? '125kg' : '0kg'} of CO2 and earned ${user ? '2,340' : '0'} green points this month.`;
    } else {
      return 'I can help you with inventory checks, item locations, maintenance schedules, and green impact tracking. What would you like to know?';
    }
  };

  const startListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResponse('');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      
      const aiResponse = handleVoiceCommand(transcript);
      setResponse(aiResponse);
      
      // Text-to-speech response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        window.speechSynthesis.speak(utterance);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setResponse('Sorry, I couldn\'t understand that. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">Voice Assistant</h3>
          <Volume2 className="w-4 h-4 text-gray-500" />
        </div>
        
        {transcript && (
          <div className="mb-2 p-2 bg-blue-50 rounded text-sm">
            <strong>You said:</strong> {transcript}
          </div>
        )}
        
        {response && (
          <div className="mb-3 p-2 bg-green-50 rounded text-sm">
            <strong>Assistant:</strong> {response}
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`p-3 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isSupported && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Voice recognition not supported
          </p>
        )}
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Try saying: "Check inventory", "Locate item", or "Green impact"
        </p>
      </div>
    </div>
  );
}