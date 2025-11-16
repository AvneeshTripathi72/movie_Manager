const fs = require('fs');
const path = require('path');

// Create logs directory in frontend folder if it doesn't exist
const logsDir = path.join(__dirname, '../../frontend/logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log user activity to frontend logs folder
 * @param {Object} activity - Activity object containing user info and actions
 */
const logActivity = (activity) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      ...activity
    };

    // Create daily log file
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFileName = `activity_${date}.json`;
    const logFilePath = path.join(logsDir, logFileName);

    // Read existing logs or create new array
    let logs = [];
    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, 'utf-8');
      logs = JSON.parse(fileContent);
    }

    // Add new activity
    logs.push(logEntry);

    // Write back to file
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

    // Also create a summary log file
    createActivitySummary();

    return logEntry;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Create a summary of all activities
 */
const createActivitySummary = () => {
  try {
    const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('activity_'));
    const summary = {
      totalLogsGenerated: logFiles.length,
      lastUpdated: new Date().toISOString(),
      logFiles: logFiles,
      stats: {
        totalActivities: 0,
        userActions: {},
        actionTypes: {}
      }
    };

    let totalActivities = 0;
    const userActions = {};
    const actionTypes = {};

    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const activities = JSON.parse(content);

      totalActivities += activities.length;

      activities.forEach(activity => {
        // Count actions by user
        if (activity.userId) {
          userActions[activity.userId] = (userActions[activity.userId] || 0) + 1;
        }

        // Count actions by type
        if (activity.action) {
          actionTypes[activity.action] = (actionTypes[activity.action] || 0) + 1;
        }
      });
    });

    summary.stats.totalActivities = totalActivities;
    summary.stats.userActions = userActions;
    summary.stats.actionTypes = actionTypes;

    const summaryPath = path.join(logsDir, 'activity_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  } catch (error) {
    console.error('Error creating activity summary:', error);
  }
};

/**
 * Get all activities for a specific user
 * @param {String} userId - User ID to filter by
 */
const getUserActivities = (userId) => {
  try {
    const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('activity_'));
    const userActivities = [];

    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const activities = JSON.parse(content);
      const filtered = activities.filter(activity => activity.userId === userId);
      userActivities.push(...filtered);
    });

    return userActivities;
  } catch (error) {
    console.error('Error getting user activities:', error);
    return [];
  }
};

/**
 * Get activities of a specific type
 * @param {String} action - Action type to filter by
 */
const getActivitiesByAction = (action) => {
  try {
    const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('activity_'));
    const filteredActivities = [];

    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const activities = JSON.parse(content);
      const filtered = activities.filter(activity => activity.action === action);
      filteredActivities.push(...filtered);
    });

    return filteredActivities;
  } catch (error) {
    console.error('Error getting activities by action:', error);
    return [];
  }
};

/**
 * Get all activities for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 */
const getActivitiesByDateRange = (startDate, endDate) => {
  try {
    const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('activity_'));
    const activities = [];

    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileActivities = JSON.parse(content);
      
      const filtered = fileActivities.filter(activity => {
        const actTime = new Date(activity.timestamp);
        return actTime >= startDate && actTime <= endDate;
      });
      
      activities.push(...filtered);
    });

    return activities;
  } catch (error) {
    console.error('Error getting activities by date range:', error);
    return [];
  }
};

module.exports = {
  logActivity,
  getUserActivities,
  getActivitiesByAction,
  getActivitiesByDateRange,
  createActivitySummary
};
