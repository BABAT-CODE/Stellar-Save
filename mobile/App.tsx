import { StatusBar } from 'expo-status-bar';

import { AuthGate } from './src/auth/AuthGate';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <AuthGate>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthGate>
  );
}
