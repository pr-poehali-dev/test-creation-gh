import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import HomePage from '@/components/home/HomePage';
import TestPage, { getQuestions } from '@/components/test/TestPage';
import ProfilePage from '@/components/profile/ProfilePage';
import AchievementsPage from '@/components/achievements/AchievementsPage';
import AuthModal from '@/components/auth/AuthModal';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [testComplete, setTestComplete] = useState(false);
  const [userLevel, setUserLevel] = useState(3);
  const [userXP, setUserXP] = useState(450);
  const [testsCompleted, setTestsCompleted] = useState(12);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/c33d035d-88e4-4a23-b1ab-f61e2bac0717', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', token }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setAuthToken(token);
        setUser(data.user);
        setUserLevel(data.user.level);
        setUserXP(data.user.xp);
        setTestsCompleted(data.user.tests_completed);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      localStorage.removeItem('auth_token');
    }
  };

  const handleAuthSuccess = (token: string, userData: any) => {
    setAuthToken(token);
    setUser(userData);
    setUserLevel(userData.level);
    setUserXP(userData.xp);
    setTestsCompleted(userData.tests_completed);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setAuthToken(null);
    setUser(null);
    setUserLevel(1);
    setUserXP(0);
    setTestsCompleted(0);
  };

  const startTest = (testId: string) => {
    setCurrentTest(testId);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnsweredQuestions([]);
    setTestComplete(false);
    setActiveTab('test');
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const questions = getQuestions(currentTest!);
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = isCorrect;
    setAnsweredQuestions(newAnswered);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setTestComplete(true);
      
      if (authToken) {
        saveTestResult(currentTest!, score + (isCorrect ? 1 : 0), questions.length);
      } else {
        setUserXP(userXP + 50);
        setTestsCompleted(testsCompleted + 1);
        if (userXP + 50 >= 500) {
          setUserLevel(userLevel + 1);
          setUserXP((userXP + 50) - 500);
        }
      }
    }
  };

  const saveTestResult = async (testId: string, finalScore: number, totalQuestions: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/bc1e65c5-4cb5-4736-b9a5-f53eea7535b7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken!,
        },
        body: JSON.stringify({
          action: 'save_test_result',
          test_id: testId,
          score: finalScore,
          total_questions: totalQuestions,
          xp_gained: 50,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        setUserLevel(data.user.level);
        setUserXP(data.user.xp);
        setTestsCompleted(data.user.tests_completed);
      }
    } catch (err) {
      console.error('Ошибка сохранения результата:', err);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold animate-pulse-glow">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Tesyt.Ru
                </h1>
                <p className="text-sm text-muted-foreground">Развивай свой мозг</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setActiveTab('home')}>
                <Icon name="Home" className="mr-2" size={18} />
                Главная
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                <Icon name="User" className="mr-2" size={18} />
                Профиль
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('achievements')}>
                <Icon name="Trophy" className="mr-2" size={18} />
                Достижения
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {!authToken ? (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                >
                  <Icon name="LogIn" className="mr-2" size={18} />
                  Войти
                </Button>
              ) : (
                <>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold">
                      {user?.username || 'Пользователь'} • Ур. {userLevel}
                    </p>
                    <p className="text-xs text-muted-foreground">{userXP} / 500 XP</p>
                  </div>
                  <Avatar className="border-2 border-purple-500 cursor-pointer" onClick={handleLogout} title="Выйти">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                      {user?.username?.[0]?.toUpperCase() || 'У'}{userLevel}
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="home" className="mt-0">
          <HomePage
            userLevel={userLevel}
            userXP={userXP}
            testsCompleted={testsCompleted}
            onStartTest={startTest}
            isAuthenticated={!!authToken}
            onShowAuth={() => setShowAuthModal(true)}
          />
        </TabsContent>

        <TabsContent value="test" className="mt-0">
          {currentTest && (
            <TestPage
              currentTest={currentTest}
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              score={score}
              testComplete={testComplete}
              userLevel={userLevel}
              onSelectAnswer={setSelectedAnswer}
              onHandleAnswer={handleAnswer}
              onResetTest={resetTest}
              onStartTest={startTest}
            />
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <ProfilePage
            userLevel={userLevel}
            userXP={userXP}
            testsCompleted={testsCompleted}
          />
        </TabsContent>

        <TabsContent value="achievements" className="mt-0">
          <AchievementsPage />
        </TabsContent>
      </Tabs>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-3 gap-1 p-2">
          <Button 
            variant={activeTab === 'home' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('home')}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Icon name="Home" size={20} />
            <span className="text-xs">Главная</span>
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('profile')}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Icon name="User" size={20} />
            <span className="text-xs">Профиль</span>
          </Button>
          <Button 
            variant={activeTab === 'achievements' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('achievements')}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Icon name="Trophy" size={20} />
            <span className="text-xs">Награды</span>
          </Button>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}