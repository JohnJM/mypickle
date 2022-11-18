import { getFiles, setupPrecaching, setupRouting } from 'ppreact-cli/sw/';

setupRouting();
setupPrecaching(getFiles());
