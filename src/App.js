import { useState } from 'react';
import './App.css';

const baseUrl = 'http://127.0.0.1:3000';
const appId = 'kiripostapp';
const redirectUri = 'http://localhost:3000/callback';

function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>Do you want to proceed with the authorization?</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
}

function App() {
  const [authorizationCode, setAuthorizationCode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleAuthorization = () => {
    fetch(`${baseUrl}/oauth2/authorize?appId=${appId}&scope=&redirectUri=${redirectUri}`)
    .then(resposne => resposne.json())
    .then(resposne => {
      // Create a URL object from the redirectUrl
      const url = new URL(resposne.redirectUrl);

      // Get the value of the 'code' parameter from the query string
      const code = url.searchParams.get('code');
      setAuthorizationCode(code);
    });
  }

  const handleGetAccessToken = () => {
    fetch(`${baseUrl}/oauth2/token?authorizationCode=${authorizationCode}`)
    .then(resposne => resposne.json())
    .then(resposne => {
      const { accessToken, refreshToken } = resposne;
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
    });
  }

  const handleClose = () => {
    setIsVisible(false);
  }

  return (
    <div className="App">
      {!authorizationCode && <button onClick={handleAuthorization}>Authorization</button>}
      {authorizationCode && <button onClick={handleGetAccessToken}>Get Access Token</button>}

      <Modal isOpen={isVisible} onClose={handleClose} />
    </div>
  );
}

export default App;
