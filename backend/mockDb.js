// Mock database for development
const mockDb = {
  users: [],
  activityLogs: [],
  
  // User methods
  findUserById: (id) => mockDb.users.find(user => user.id === id),
  findUserByEmail: (email) => mockDb.users.find(user => user.email === email),
  createUser: (userData) => {
    const id = `user_${Date.now()}`;
    const newUser = { id, ...userData, registrationDate: new Date() };
    mockDb.users.push(newUser);
    return newUser;
  },
  updateUser: (id, updates) => {
    const userIndex = mockDb.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      mockDb.users[userIndex] = { ...mockDb.users[userIndex], ...updates };
      return mockDb.users[userIndex];
    }
    return null;
  },
  countUsers: () => mockDb.users.length,
  
  // Activity log methods
  createActivityLog: (logData) => {
    const id = `log_${Date.now()}`;
    const newLog = { id, ...logData, timestamp: new Date() };
    mockDb.activityLogs.push(newLog);
    return newLog;
  },
  findActivityLogsByUserId: (userId) => mockDb.activityLogs.filter(log => log.userId === userId),
  
  // Clear database
  clearAll: () => {
    mockDb.users = [];
    mockDb.activityLogs = [];
  }
};

export default mockDb; 