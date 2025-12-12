import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testCategories = [
  { id: 'logic', name: 'Логический лабиринт', icon: 'Brain', emoji: '🧩', color: 'from-purple-500 to-pink-500', description: 'Развивай логику и критическое мышление' },
  { id: 'math', name: 'Числовые последовательности', icon: 'Calculator', emoji: '⚙️', color: 'from-blue-500 to-cyan-500', description: 'Математические загадки и паттерны' },
  { id: 'attention', name: 'Тест на внимательность', icon: 'Eye', emoji: '🎯', color: 'from-orange-500 to-yellow-500', description: 'Проверь наблюдательность' },
  { id: 'knowledge', name: 'Общие знания', icon: 'BookOpen', emoji: '📚', color: 'from-green-500 to-emerald-500', description: 'История, наука, культура' },
];

const achievements = [
  { id: 1, name: 'Первый шаг', description: 'Пройти первый тест', icon: '🎯', unlocked: true },
  { id: 2, name: 'Мастер логики', description: 'Набрать 80%+ в логическом тесте', icon: '🧠', unlocked: true },
  { id: 3, name: 'Серия побед', description: 'Пройти 5 тестов подряд', icon: '🔥', unlocked: false },
  { id: 4, name: 'Эрудит', description: 'Пройти все категории тестов', icon: '🏆', unlocked: false },
];

const logicQuestions = [
  {
    question: 'Какой предмет находится сразу после двух предметов, перед которыми ничего нет?',
    options: ['Первый', 'Второй', 'Третий', 'Четвёртый'],
    correct: 2,
  },
  {
    question: 'Если все розы - цветы, и некоторые цветы приятно пахнут, то...',
    options: ['Все розы приятно пахнут', 'Некоторые розы могут приятно пахнуть', 'Ни одна роза не пахнет', 'Все цветы - розы'],
    correct: 1,
  },
  {
    question: 'Продолжите последовательность: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correct: 1,
  },
  {
    question: 'У Маши больше яблок, чем у Пети, но меньше чем у Коли. У кого больше всего яблок?',
    options: ['У Маши', 'У Пети', 'У Коли', 'Невозможно определить'],
    correct: 2,
  },
  {
    question: 'Какая фигура лишняя: квадрат, круг, треугольник, прямоугольник?',
    options: ['Квадрат', 'Круг', 'Треугольник', 'Прямоугольник'],
    correct: 1,
  },
  {
    question: 'Если завтра будет вторник, какой день был позавчера?',
    options: ['Суббота', 'Воскресенье', 'Понедельник', 'Пятница'],
    correct: 0,
  },
  {
    question: 'Сколько месяцев в году имеют 28 дней?',
    options: ['1', '2', '11', '12'],
    correct: 3,
  },
  {
    question: 'Продолжите: AB, CD, EF, GH, ?',
    options: ['IJ', 'IK', 'JK', 'HI'],
    correct: 0,
  },
];

const mathQuestions = [
  {
    question: 'Найдите следующее число: 2, 4, 8, 16, ?',
    options: ['24', '28', '32', '36'],
    correct: 2,
  },
  {
    question: 'Какое число пропущено: 3, 6, ?, 12, 15',
    options: ['7', '8', '9', '10'],
    correct: 2,
  },
  {
    question: 'Продолжите: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '14'],
    correct: 2,
  },
  {
    question: 'Найдите закономерность: 100, 50, 25, ?',
    options: ['10', '12.5', '15', '20'],
    correct: 1,
  },
  {
    question: '5 + 5 × 5 = ?',
    options: ['30', '50', '25', '35'],
    correct: 0,
  },
  {
    question: 'Какое число лишнее: 2, 3, 5, 7, 9, 11?',
    options: ['2', '3', '9', '11'],
    correct: 2,
  },
  {
    question: 'Если x + 5 = 12, то x = ?',
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
  {
    question: 'Квадратный корень из 144 = ?',
    options: ['10', '11', '12', '13'],
    correct: 2,
  },
];

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

  const getQuestions = (testId: string) => {
    if (testId === 'logic') return logicQuestions;
    if (testId === 'math') return mathQuestions;
    return logicQuestions;
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
      setUserXP(userXP + 50);
      setTestsCompleted(testsCompleted + 1);
      if (userXP + 50 >= 500) {
        setUserLevel(userLevel + 1);
        setUserXP((userXP + 50) - 500);
      }
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setActiveTab('home');
  };

  const questions = currentTest ? getQuestions(currentTest) : [];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const levelProgress = (userXP / 500) * 100;

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
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">Уровень {userLevel}</p>
                <p className="text-xs text-muted-foreground">{userXP} / 500 XP</p>
              </div>
              <Avatar className="border-2 border-purple-500">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                  У{userLevel}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="home" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Прокачай свой мозг! 🚀
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Развивай логику, внимание и память через увлекательные тесты. Зарабатывай XP и открывай достижения!
                </p>
              </div>

              <div className="mb-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 animate-scale-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      {userLevel}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Твой прогресс</p>
                      <p className="text-sm text-muted-foreground">Пройдено тестов: {testsCompleted}</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-base">
                    {userXP} XP
                  </Badge>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  До {userLevel + 1} уровня осталось {500 - userXP} XP
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {testCategories.map((category, index) => (
                  <Card 
                    key={category.id} 
                    className="hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-purple-300 animate-fade-in overflow-hidden group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                            <span className="text-4xl animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                              {category.emoji}
                            </span>
                            {category.name}
                          </CardTitle>
                          <CardDescription className="text-base">{category.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-sm">8 вопросов</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-semibold py-6 text-lg`}
                        onClick={() => startTest(category.id)}
                      >
                        <Icon name="Play" className="mr-2" size={20} />
                        Начать тест
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test" className="mt-0">
          {currentTest && !testComplete && (
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <Button variant="ghost" onClick={resetTest} className="mb-4">
                    <Icon name="ArrowLeft" className="mr-2" size={18} />
                    Назад к тестам
                  </Button>
                  
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Вопрос {currentQuestion + 1} из {questions.length}
                    </p>
                    <Badge variant="outline" className="text-base px-4 py-1">
                      Баллов: {score}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="animate-scale-in border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-2xl leading-relaxed">
                      {questions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className={`w-full justify-start text-left h-auto py-4 px-6 text-lg ${
                          selectedAnswer === index ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''
                        }`}
                        onClick={() => setSelectedAnswer(index)}
                      >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}

                    <Button
                      onClick={handleAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full mt-6 py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    >
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          Следующий вопрос
                          <Icon name="ArrowRight" className="ml-2" size={20} />
                        </>
                      ) : (
                        <>
                          Завершить тест
                          <Icon name="Check" className="ml-2" size={20} />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {testComplete && (
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-2xl mx-auto text-center animate-scale-in">
                <div className="mb-8">
                  <div className="text-8xl mb-4 animate-bounce-slow">
                    {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.6 ? '🎉' : '💪'}
                  </div>
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {score >= questions.length * 0.8 ? 'Отлично!' : score >= questions.length * 0.6 ? 'Хорошо!' : 'Продолжай тренироваться!'}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Ты ответил правильно на {score} из {questions.length} вопросов
                  </p>
                </div>

                <Card className="p-8 border-2 border-purple-200">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                      <p className="text-4xl font-bold text-purple-600">{Math.round((score / questions.length) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Результат</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-pink-600">+50</p>
                      <p className="text-sm text-muted-foreground">Опыта (XP)</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-blue-600">{userLevel}</p>
                      <p className="text-sm text-muted-foreground">Уровень</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={resetTest}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    >
                      <Icon name="Home" className="mr-2" size={20} />
                      К выбору тестов
                    </Button>
                    <Button 
                      onClick={() => startTest(currentTest)}
                      variant="outline"
                      className="w-full py-6 text-lg font-semibold"
                    >
                      <Icon name="RotateCcw" className="mr-2" size={20} />
                      Пройти ещё раз
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 border-2 border-purple-200 animate-fade-in">
                <div className="flex items-start gap-6 mb-8">
                  <Avatar className="w-24 h-24 border-4 border-purple-500">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold">
                      У{userLevel}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">Мой профиль</h2>
                    <p className="text-muted-foreground mb-4">Отслеживай свой прогресс и достижения</p>
                    <div className="flex gap-3">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
                        Уровень {userLevel}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2">
                        {testsCompleted} тестов пройдено
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Прогресс до уровня {userLevel + 1}</span>
                      <span className="text-muted-foreground">{userXP} / 500 XP</span>
                    </div>
                    <Progress value={levelProgress} className="h-3" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center gradient-card">
                      <Icon name="Brain" className="mx-auto mb-2 text-purple-600" size={32} />
                      <p className="text-2xl font-bold">{testsCompleted}</p>
                      <p className="text-sm text-muted-foreground">Тестов пройдено</p>
                    </Card>
                    <Card className="p-4 text-center gradient-card">
                      <Icon name="Trophy" className="mx-auto mb-2 text-pink-600" size={32} />
                      <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
                      <p className="text-sm text-muted-foreground">Достижений</p>
                    </Card>
                    <Card className="p-4 text-center gradient-card">
                      <Icon name="Star" className="mx-auto mb-2 text-blue-600" size={32} />
                      <p className="text-2xl font-bold">{userXP}</p>
                      <p className="text-sm text-muted-foreground">Всего XP</p>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 animate-fade-in">
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Достижения
                </h2>
                <p className="text-lg text-muted-foreground">
                  Открыто {achievements.filter(a => a.unlocked).length} из {achievements.length}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <Card 
                    key={achievement.id}
                    className={`p-6 border-2 transition-all duration-300 animate-fade-in ${
                      achievement.unlocked 
                        ? 'border-purple-300 bg-gradient-card' 
                        : 'opacity-50 grayscale'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl ${achievement.unlocked ? 'animate-bounce-slow' : ''}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-1">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlocked && (
                          <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Icon name="Check" className="mr-1" size={14} />
                            Открыто
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
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
    </div>
  );
}
