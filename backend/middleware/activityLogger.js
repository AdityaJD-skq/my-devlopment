import ActivityLog from '../models/ActivityLog.js';

/**
 * Middleware for logging user activities
 * @param {string} type - The type of activity to log
 * @param {function} detailsExtractor - Function to extract details from request
 */
export const logActivity = (type, detailsExtractor = null) => {
  return async (req, res, next) => {
    // Store the original response.json method
    const originalJson = res.json;
    
    // Override the response.json method
    res.json = function(data) {
      // Only log if user is authenticated
      if (req.user && req.user._id) {
        try {
          // Extract details if extractor function is provided
          const details = detailsExtractor ? detailsExtractor(req, data) : {};
          
          // Create new activity log
          const log = new ActivityLog({
            userId: req.user._id,
            type,
            details: {
              ...details,
              method: req.method,
              path: req.path,
              query: req.query,
              responseStatus: res.statusCode
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            performedBy: req.user._id
          });
          
          // Save log asynchronously (don't await)
          log.save().catch(err => console.error('Activity logging error:', err));
        } catch (err) {
          console.error('Error in activity logger middleware:', err);
        }
      }
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log authentication activities
 */
export const logAuthActivity = (type) => {
  return async (req, res, next) => {
    // Store userId from the request body or params
    const userId = req.body?.userId || req.params?.id;
    
    // Store the original response.json method
    const originalJson = res.json;
    
    // Override the response.json method
    res.json = function(data) {
      try {
        // Only log successful responses (status codes 2xx)
        if (res.statusCode >= 200 && res.statusCode < 300 && userId) {
          const log = new ActivityLog({
            userId,
            type,
            details: {
              method: req.method,
              path: req.path,
              responseStatus: res.statusCode
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            performedBy: req.user?._id || userId
          });
          
          // Save log asynchronously
          log.save().catch(err => console.error('Auth activity logging error:', err));
        }
      } catch (err) {
        console.error('Error in auth activity logger middleware:', err);
      }
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
}; 