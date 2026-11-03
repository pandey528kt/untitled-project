import { Tabs } from 'expo-router';
import { House } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
