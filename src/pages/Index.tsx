import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я AI ассистент на базе Google Gemini. Как дела? Чем могу помочь?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateGoogleAI = async (userMessage: string): Promise<string> => {
    // Заглушка для Google AI Gemini API
    // В реальном проекте здесь будет вызов: 
    // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {...})
    
    const intelligentResponses = [
      `Понимаю ваш вопрос про "${userMessage}". Это интересная тема для обсуждения. Могу предложить несколько подходов к решению...`,
      `Отличный вопрос! По поводу "${userMessage}" могу сказать, что это требует комплексного анализа. Давайте разберём детально...`,
      `Спасибо за вопрос про "${userMessage}". На основе моих знаний могу предложить следующие варианты решения...`,
      `Интересная задача! Касательно "${userMessage}" - это действительно важная тема. Вот мой взгляд на ситуацию...`,
      `Хороший момент для размышлений про "${userMessage}". Позвольте поделиться аналитикой по этой теме...`,
    ];
    
    // Имитация времени обработки Google AI
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return intelligentResponses[Math.floor(Math.random() * intelligentResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await simulateGoogleAI(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте ещё раз.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Чат-бот</h1>
              <p className="text-sm text-gray-500">На базе Google Gemini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 animate-fade-in ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                {message.isUser ? (
                  <AvatarFallback className="bg-gray-200">
                    <Icon name="User" size={16} />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500">
                    <Icon name="Bot" size={16} className="text-white" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <Card className={`max-w-[70%] p-4 ${
                message.isUser
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-white shadow-sm border'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-primary-foreground/70' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </Card>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500">
                  <Icon name="Bot" size={16} className="text-white" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white shadow-sm border">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="min-h-[48px] resize-none rounded-2xl border-2 border-gray-200 focus:border-primary transition-colors"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Features showcase */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Быстрые ответы</h3>
                <p className="text-sm text-gray-500">Мгновенная обработка</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="Brain" size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Google AI</h3>
                <p className="text-sm text-gray-500">Технология Gemini</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Умный анализ</h3>
                <p className="text-sm text-gray-500">Понимает контекст</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;