import { BrowserRouter as Router, Route } from 'react-router-dom';
import DesktopChat from './Desktop/Chat/Chat';

const Private = () => {
  return (
    <Router>
      <Route path="/feed">
        <DesktopChat />
      </Route>
    </Router>
  );
};

export default Private;
