/**
 * CHALLENGE:
 * Implement the Singleton pattern in the class below.
 * Currently, it creates a new instance every time, which is wrong!
 */
export class DatabaseConnection {
  // TODO: Add a private static variable to hold the instance
  
  // TODO: Make the constructor private
  constructor() {
    console.log("Connected to DB"); 
  }

  public static getInstance(): DatabaseConnection {
    // TODO: Implement the logic to return the existing instance if it exists, 
    // or create it if it doesn't.
    
    return new DatabaseConnection(); // <-- FIX THIS LINE
  }
}
