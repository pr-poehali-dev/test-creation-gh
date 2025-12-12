import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const achievements = [
  { id: 1, name: 'Первый шаг', description: 'Пройти первый тест', icon: '🎯', unlocked: true },
  { id: 2, name: 'Мастер логики', description: 'Набрать 80%+ в логическом тесте', icon: '🧠', unlocked: true },
  { id: 3, name: 'Серия побед', description: 'Пройти 5 тестов подряд', icon: '🔥', unlocked: false },
  { id: 4, name: 'Эрудит', description: 'Пройти все категории тестов', icon: '🏆', unlocked: false },
];

interface ProfilePageProps {
  userLevel: number;
  userXP: number;
  testsCompleted: number;
}

export default function ProfilePage({ userLevel, userXP, testsCompleted }: ProfilePageProps) {
  const levelProgress = (userXP / 500) * 100;

  return (
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
  );
}
