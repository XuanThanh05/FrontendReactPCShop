import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from "./routes/AppRoutes";

function App() {
  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  
  if (!googleClientId) {
    return <AppRoutes />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;