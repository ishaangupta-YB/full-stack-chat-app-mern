import axios from "axios";
import { UserContextProvider } from "./context/UserContext";
import Routes from "./components/Routes";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;
  return (
    <>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </>
  );
}

export default App;
