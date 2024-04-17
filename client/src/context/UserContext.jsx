import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/profile");
        setId(response.data.user.userId);
        setUsername(response.data.user.username);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUsername(null);
        setId(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, id, setId, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}
