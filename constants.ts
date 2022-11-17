import path from "path";

const RATE_LIMIT_OPTIONS = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
};

const SERVER_PORT = 3001;
const STATIC_DIRECTORY = 'public';


const CONSTANTS = {
    SERVER_ONLINE_MESSAGE: `Server running on port ${SERVER_PORT}`,
    SERVER_PORT,
    STATIC_DIRECTORY,
};

export { CONSTANTS, RATE_LIMIT_OPTIONS }