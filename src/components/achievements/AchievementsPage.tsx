import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const achievements = [
  { id: 1, name: 'Первый шаг', description: 'Пройти первый тест', icon: '🎯', unlocked: true },
  { id: 2, name: 'Мастер логики', description: 'Набрать 80%+ в логическом тесте', icon: '🧠', unlocked: true },
  { id: 3, name: 'Серия побед', description: 'Пройти 5 тестов подряд', icon: '🔥', unlocked: false },
  { id: 4, name: 'Эрудит', description: 'Пройти все категории тестов', icon: '🏆', unlocked: false },
];

export default function AchievementsPage() {
  return (
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
  );
}
