import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import Chat from "./Chat.jsx";

export default function Routes() {
  const { username,isLoading } = useContext(UserContext);
  if (isLoading) {
    return <div>Loading...</div>;
  } 
  if (username) {
    return <Chat/>
  }

  return <RegisterAndLoginForm />;
}
