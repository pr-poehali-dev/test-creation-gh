import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface TestPageProps {
  currentTest: string;
  currentQuestion: number;
  selectedAnswer: number | null;
  score: number;
  testComplete: boolean;
  userLevel: number;
  onSelectAnswer: (index: number) => void;
  onHandleAnswer: () => void;
  onResetTest: () => void;
  onStartTest: (testId: string) => void;
}

export function getQuestions(testId: string) {
  if (testId === 'logic') return logicQuestions;
  if (testId === 'math') return mathQuestions;
  return logicQuestions;
}

export default function TestPage({
  currentTest,
  currentQuestion,
  selectedAnswer,
  score,
  testComplete,
  userLevel,
  onSelectAnswer,
  onHandleAnswer,
  onResetTest,
  onStartTest,
}: TestPageProps) {
  const questions = getQuestions(currentTest);
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (testComplete) {
    return (
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
                onClick={onResetTest}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                <Icon name="Home" className="mr-2" size={20} />
                К выбору тестов
              </Button>
              <Button 
                onClick={() => onStartTest(currentTest)}
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onResetTest} className="mb-4">
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
                onClick={() => onSelectAnswer(index)}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}

            <Button
              onClick={onHandleAnswer}
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
  );
}
