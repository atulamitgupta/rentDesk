// =============================================================
//  Auth Middleware — extracted to break circular imports
//  File : server/middleware/auth.js
// =============================================================

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }
    try {
        req.landlord = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
        next();
    } catch (e) {
        const msg = e.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
        return res.status(401).json({ success: false, message: msg });
    }
};
