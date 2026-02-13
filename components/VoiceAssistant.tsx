
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/helpers';
import { parseVoiceTransaction } from '../services/geminiService';
import { Transaction } from '../types';

interface Props {
  onTransactionAdded: (transaction: Omit<Transaction, 'id'>) => void;
}

const VoiceAssistant: React.FC<Props> = ({ onTransactionAdded }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Ref-based state for audio context to prevent re-renders breaking logic
  const audioContextRef = useRef<{
    input: AudioContext | null;
    output: AudioContext | null;
    stream: MediaStream | null;
  }>({ input: null, output: null, stream: null });

  const stopListening = useCallback(async () => {
    if (audioContextRef.current.stream) {
      audioContextRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
    
    if (transcript.length > 5) {
      setProcessing(true);
      const parsed = await parseVoiceTransaction(transcript);
      if (parsed) {
        onTransactionAdded(parsed);
        alert(`İşlem başarıyla eklendi: ${parsed.amount} TL ${parsed.category}`);
      }
      setProcessing(false);
      setTranscript('');
    }
  }, [transcript, onTransactionAdded]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current.stream = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current.input = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);

      // This is a simplified voice capture for demo. 
      // In a real Live API scenario, we'd pipe this to ai.live.connect.
      // Here we will use Gemini to "parse" the final text.
      
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final) setTranscript(prev => prev + ' ' + final);
      };

      recognition.onend = () => {
        if (isListening) recognition.start();
      };

      recognition.start();
      setIsListening(true);

    } catch (err) {
      console.error("Mic error:", err);
      alert("Mikrofon erişimi sağlanamadı.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 ${isListening ? '' : 'hidden'}`}></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          Sesli Asistan
        </h3>
        <p className="text-indigo-100 text-sm mb-4">"Marketten 500 lira harcadım" gibi komutlar verin.</p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full transition-all transform hover:scale-105 ${isListening ? 'bg-red-500 shadow-red-500/50' : 'bg-white text-indigo-600 shadow-white/20 shadow-xl'}`}
          >
            {isListening ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            )}
          </button>
          
          <div className="flex-1">
            {isListening ? (
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                <p className="text-xs font-medium">Sizi dinliyorum...</p>
              </div>
            ) : processing ? (
              <p className="text-xs font-medium italic">İşlem analiz ediliyor...</p>
            ) : (
              <p className="text-xs opacity-70">Sesi başlatmak için tıklayın</p>
            )}
            <p className="text-sm line-clamp-1 mt-1 font-medium">{transcript || '...'}</p>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default VoiceAssistant;
