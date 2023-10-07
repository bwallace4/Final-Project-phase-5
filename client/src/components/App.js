import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import SuccessPage from './SuccessPage';
import UserList from './UserList';
import LoginForm from './LoginForm';
import CheckSession from './CheckSession';
import Logout from './Logout';
import UpdateUserForm from './UpdateUserForm'; // Import the UpdateUserForm component
import './Navbar.css'; 

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/user-list">User List</Link>
          </li>
          <li>
            <Link to="/success-page">Success Page</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/success-page" component={SuccessPage} />
        <Route path="/user-list" component={UserList} />
        <Route path="/login">
          <div>
            <LoginForm />
            <CheckSession />
          </div>
        </Route>
        <Route path="/update-user/:userId" component={UpdateUserForm} /> {/* Add this route */}
        <Route path="/" component={RegisterForm} />
      </Switch>
    </Router>
  );
}

export default App;
