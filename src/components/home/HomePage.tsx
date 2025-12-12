import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const testCategories = [
  { id: 'logic', name: 'Логический лабиринт', icon: 'Brain', emoji: '🧩', color: 'from-purple-500 to-pink-500', description: 'Развивай логику и критическое мышление' },
  { id: 'math', name: 'Числовые последовательности', icon: 'Calculator', emoji: '⚙️', color: 'from-blue-500 to-cyan-500', description: 'Математические загадки и паттерны' },
  { id: 'attention', name: 'Тест на внимательность', icon: 'Eye', emoji: '🎯', color: 'from-orange-500 to-yellow-500', description: 'Проверь наблюдательность' },
  { id: 'knowledge', name: 'Общие знания', icon: 'BookOpen', emoji: '📚', color: 'from-green-500 to-emerald-500', description: 'История, наука, культура' },
];

interface HomePageProps {
  userLevel: number;
  userXP: number;
  testsCompleted: number;
  onStartTest: (testId: string) => void;
}

export default function HomePage({ userLevel, userXP, testsCompleted, onStartTest }: HomePageProps) {
  const levelProgress = (userXP / 500) * 100;

  return (
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
                  onClick={() => onStartTest(category.id)}
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
  );
}
