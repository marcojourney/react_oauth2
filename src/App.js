import { useState } from 'react';
import './App.css';

const baseUrl = 'http://127.0.0.1:3000';
const appId = 'kiripostapp';
const redirectUri = 'http://localhost:3000/callback';

function App() {
  // Set a cookie accessible across all subdomains of example.com
  document.cookie = "mycookie=myvalue; domain=vercel.app; path=/;";

  const [authorizationCode, setAuthorizationCode] = useState(null);
  const [users, setUsers] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const handleAuthorization = () => {
    fetch(`${baseUrl}/oauth2/authorize?appId=${appId}&scope=&redirectUri=${redirectUri}`)
    .then(resposne => resposne.json())
    .then(resposne => {
      const url = new URL(resposne.redirectUrl);

      const code = url.searchParams.get('code');
      setAuthorizationCode(code);
    });
  }

  const handleGetAccessToken = () => {
    fetch(`${baseUrl}/oauth2/token?authorizationCode=${authorizationCode}`)
    .then(resposne => resposne.json())
    .then(resposne => {
      const { accessToken, refreshToken } = resposne;
      setAccessToken(accessToken);
    });
  }

  const fetchUsers = () => {
    fetch(`${baseUrl}/users`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(resposne => resposne.json())
    .then(resposne => {
      if (resposne) {
        setUsers(resposne);
        console.log('Users:', resposne);
      }
    })
  }

  return (
    <div className="App">
      {!authorizationCode && <button onClick={handleAuthorization}>Authorization</button>}
      {authorizationCode && <button onClick={handleGetAccessToken}>Get Access Token</button>}
      <button onClick={fetchUsers}>Get Users</button>
    </div>
  );
}

export default App;
