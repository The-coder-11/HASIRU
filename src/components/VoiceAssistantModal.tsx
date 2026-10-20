import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProduceGrade, CropCategory } from '../types';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Check,
  X,
  AlertCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingPublished?: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onListingPublished,
}) => {
  const { currentUser, addProduct, currentLanguage, t } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extracted fields
  const [extractedData, setExtractedData] = useState<{
    crop: string;
    cropKannada?: string;
    category: CropCategory;
    quantity: number;
    unit: string;
    expectedPrice: number;
    district: 'Dakshina Kannada' | 'Udupi';
    village: string;
    grade: ProduceGrade;
    isOrganic: boolean;
    confidence?: number;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Sample phrases that demonstrate real Karnataka speech
  const samplePhrases = [
    {
      labelKn: 'ತೆಂಗಿನಕಾಯಿ (ಬಂಟ್ವಾಳ)',
      text: 'ನನ್ನ ಬಳಿ ಬಂಟ್ವಾಳದಲ್ಲಿ 500 ಕೆಜಿ ತಾಜಾ ತೆಂಗಿನಕಾಯಿ ಇದೆ, ಕೆಜಿಗೆ 38 ರೂಪಾಯಿ',
    },
    {
      labelKn: 'ಉತ್ತಮ ಅಡಿಕೆ (ಪುತ್ತೂರು)',
      text: 'ಪುತ್ತೂರಿನಲ್ಲಿ 200 ಕೆಜಿ ಉತ್ತಮ ಗ್ರೇಡ್ ಎ ಚಾಲಿ ಅಡಿಕೆ ಇದೆ, ದರ 450 ರೂಪಾಯಿ',
    },
    {
      labelKn: 'ಬಿಳಿ ಕಾಳುಮೆಣಸು (ಉಡುಪಿ)',
      text: 'ಉಡುಪಿಯಲ್ಲಿ 100 ಕೆಜಿ ಸಾವಯವ ಬಿಳಿ ಕಾಳುಮೆಣಸು ಲಭ್ಯವಿದೆ ದರ 680',
    },
    {
      labelEn: 'Arecanut in Bantwal',
      text: 'I have 300 kg Grade A Arecanut in Bantwal at 445 rupees per kg',
    },
  ];

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguage === 'kn' ? 'kn-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. You can select one of the sample phrases below or type.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLanguage]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg('Speech recognition is not supported in this browser. Please use the quick sample buttons below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processTranscript(transcript);
      }
    } else {
      setTranscript('');
      setExtractedData(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const processTranscript = async (text: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/voice-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, language: currentLanguage }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setExtractedData(data.data);
      } else {
        setErrorMsg('Could not extract produce details. Please try another sample.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing audio');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setTranscript(sampleText);
    processTranscript(sampleText);
  };

  const handleSpeakResponse = () => {
    if (!extractedData || !('speechSynthesis' in window)) return;
    const utteranceText =
      currentLanguage === 'kn'
        ? `${extractedData.village}ಯ ${extractedData.cropKannada || extractedData.crop}, ${extractedData.quantity} ${extractedData.unit}, ದರ ${extractedData.expectedPrice} ರೂಪಾಯಿ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.`
        : `Identified ${extractedData.quantity} ${extractedData.unit} of ${extractedData.crop} at ${extractedData.expectedPrice} rupees per ${extractedData.unit} in ${extractedData.village}.`;

    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.lang = currentLanguage === 'kn' ? 'kn-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleConfirmAndPublish = () => {
    if (!extractedData) return;

    // Pick image matching crop
    let img = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80';
    if (extractedData.crop.toLowerCase().includes('areca')) {
      img = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80';
    } else if (extractedData.crop.toLowerCase().includes('pepper')) {
      img = 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80';
    } else if (extractedData.crop.toLowerCase().includes('paddy') || extractedData.crop.toLowerCase().includes('rice')) {
      img = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
    }

    addProduct({
      farmerId: currentUser.uid,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmerVillage: extractedData.village,
      farmerDistrict: extractedData.district,
      name: `${extractedData.crop} (Direct Harvest)`,
      nameKn: extractedData.cropKannada ? `${extractedData.cropKannada} (ನೇರ ಕೊಯ್ಲು)` : extractedData.crop,
      category: extractedData.category || 'Plantation Crops',
      imageUrl: img,
      quantityAvailable: extractedData.quantity,
      unit: (extractedData.unit as any) || 'kg',
      quality: extractedData.grade || 'Grade A (Premium)',
      harvestDate: 'Today (Voice-Assisted Entry)',
      harvestFreshness: 'Freshly Harvested',
      expectedPrice: extractedData.expectedPrice,
      minimumOrderQuantity: Math.min(50, extractedData.quantity),
      district: extractedData.district,
      village: extractedData.village,
      pickupArea: `${extractedData.village} Main Road junction`,
      isOrganic: extractedData.isOrganic,
      notes: `Listed via Hasiru Sahayaka voice assistant. "${transcript}"`,
      status: 'active',
      mandiBenchmark: {
        modalPrice: extractedData.expectedPrice - 2,
        marketName: extractedData.district === 'Udupi' ? 'Udupi APMC' : 'Mangaluru APMC',
        diffPercent: 5,
      },
    });

    if (onListingPublished) onListingPublished();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#176B45] via-[#1E7D52] to-[#2D8F60] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-black shadow-xs">
              <Mic className="w-5 h-5 text-[#18352A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight font-kannada">
                {t('voiceAssistantName')} (ಹಸಿರು ಸಹಾಯಕ)
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                {t('voiceSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Microphone Interactive Center */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#F8FAF6] rounded-2xl border border-[#E2EBDD] relative overflow-hidden">
            <div className="relative mb-3">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-[#176B45]/20 animate-ping scale-150" />
              )}
              <button
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative z-10 ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#176B45] hover:bg-[#125537] text-white'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <div className="text-center space-y-1">
              <div className="text-xs font-bold text-gray-800">
                {isListening ? (
                  <span className="text-red-600 font-extrabold">{t('listeningStatus')}</span>
                ) : (
                  <span>Tap microphone & speak in Kannada or English</span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Supports Tulu/Kannada terms: ತೆಂಗಿನಕಾಯಿ, ಅಡಿಕೆ, ಮೆಣಸು, ಭತ್ತ, ಕ್ವಿಂಟಾಲ್
              </p>
            </div>
          </div>

          {/* Quick Clickable Sample Phrases for Instant Testing */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E8B94D]" />
              <span>{t('orTrySample')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePhrases.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample.text)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-[#E8F5EC] text-left text-xs transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-[#176B45] group-hover:underline font-kannada">
                    {sample.labelKn || sample.labelEn}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">
                    "{sample.text}"
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Captured Transcript */}
          {transcript && (
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">{t('transcriptLabel')}:</span>
                <button
                  onClick={() => {
                    setTranscript('');
                    setExtractedData(null);
                  }}
                  className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
              <p className="text-xs font-medium text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-kannada">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-6 flex flex-col items-center justify-center text-center text-xs text-[#176B45] space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#176B45]" />
              <span>Extracting harvest details using Hasiru AI NLP...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Structured Output Card */}
          {extractedData && (
            <div className="bg-[#E8F5EC] p-4 rounded-2xl border border-[#C4D7C8] space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B45]">
                  <CheckCircle2 className="w-4 h-4 text-[#176B45]" />
                  <span>{t('extractedFields')}</span>
                </div>
                <button
                  onClick={handleSpeakResponse}
                  className="text-xs text-[#176B45] bg-white px-2.5 py-1 rounded-lg border border-[#C4D7C8] flex items-center gap-1 hover:bg-gray-50 font-semibold cursor-pointer"
                  title="Read Aloud with Speech Synthesis"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('speakResponse')}</span>
                </button>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#C4D7C8]/70">
                <div>
                  <span className="text-[10px] text-gray-400 block">Identified Crop:</span>
                  <input
                    type="text"
                    value={extractedData.crop}
                    onChange={(e) => setExtractedData({ ...extractedData, crop: e.target.value })}
                    className="font-bold text-gray-900 border-b border-gray-200 w-full focus:outline-none focus:border-[#176B45]"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block">Quantity & Unit:</span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={extractedData.quantity}
                      onChange={(e) => setExtractedData({ ...extractedData, quantity: parseFloat(e.target.value) || 0 })}
                      className="font-bold text-gray-900 border-b border-gray-200 w-2/3 focus:outline-none focus:border-[#176B45]"
                    />
                    <span className="text-gray-500 font-bold">{extractedData.unit}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block">Expected Price:</span>
                  <div className="flex items-center gap-1 font-extrabold text-[#176B45]">
                    <span>₹</span>
                    <input
                      type="number"
                      value={extractedData.expectedPrice}
                      onChange={(e) => setExtractedData({ ...extractedData, expectedPrice: parseFloat(e.target.value) || 0 })}
                      className="font-bold text-[#176B45] border-b border-gray-200 w-full focus:outline-none focus:border-[#176B45]"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block">Location:</span>
                  <input
                    type="text"
                    value={extractedData.village}
                    onChange={(e) => setExtractedData({ ...extractedData, village: e.target.value })}
                    className="font-bold text-gray-900 border-b border-gray-200 w-full focus:outline-none focus:border-[#176B45]"
                  />
                </div>
              </div>

              {/* Publish Action */}
              <button
                onClick={handleConfirmAndPublish}
                className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-xs md:text-sm py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t('publishProduceNow')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
