import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignUp from './SignUp/SignUp';
import LogIn from './LogIn/LogIn';

const Public = () => (
  <div className="center">
    {
      <Router>
        <Switch>
          <Route path="/" exact>
            <LogIn />
          </Route>

          <Route path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </Router>
    }
  </div>
);

export default Public;
