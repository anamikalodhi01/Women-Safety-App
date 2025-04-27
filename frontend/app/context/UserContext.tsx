// UserContext.ts
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the type for the user
interface User {
  name: string;
}

// Create the context with the proper type
const UserContext = createContext<User | undefined>(undefined);

// A provider to wrap your app
export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({ name: "User" });

  // Simulate fetching user data (e.g., from API or local storage)
  useEffect(() => {
    const fetchUserData = async () => {
      // Replace this with your API call logic
      const fetchedUser = { name: "John Doe" };  // Example static data
      setUser(fetchedUser);
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = (): User => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
