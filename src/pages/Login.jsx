const Login = () => {
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8080/login/oauth2/code/google";
  };

  const loginWithGitHub = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={loginWithGoogle}>Login with Google</button>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
    </div>
  );
};

export default Login;
