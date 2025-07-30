import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Debug() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [chatTest, setChatTest] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    }
    setLoading(false);
  };

  const testChat = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Тест API' }]
        })
      });
      const data = await response.json();
      setChatTest(data);
    } catch (error) {
      console.error('Chat test error:', error);
      setChatTest({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🔧 Debug Page</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchDebugInfo} disabled={loading}>
              Check Environment
            </Button>
            
            {debugInfo && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat API Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testChat} disabled={loading}>
              Test Chat API
            </Button>
            
            {chatTest && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(chatTest, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1.</strong> Деплойте на Vercel с командой: <code>npx vercel --prod</code></p>
            <p><strong>2.</strong> Проверьте что GROQ_API_KEY добавлен в Environment Variables</p>
            <p><strong>3.</strong> Используйте эту страницу для диагностики проблем</p>
            <p><strong>4.</strong> Если Key отсутствует - перезадеплойте после добавления переменной</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
