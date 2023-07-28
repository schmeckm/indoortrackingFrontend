import React from 'react';
import GoogleLogin from './GoogleLogin';

const LoginPage = () => {
  return (
    <div>
      <h2>Login</h2>
      {/* Your login form here */}
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      {/* Google Sign-In button */}
      <GoogleLogin />
    </div>
  );
};

export default LoginPage;

