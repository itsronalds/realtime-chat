import Public from './components/Public';
import Private from './components/Private';
import { useAuthContext } from './contexts/AuthContext';

const App = () => {
  const { isAuth } = useAuthContext();

  return isAuth === true ? <Private /> : <Public />;
};

export default App;
