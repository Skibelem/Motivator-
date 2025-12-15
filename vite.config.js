import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
   server: {
     //Crucial step to bypass CORS policy during development
    proxy: {
      '/api-quotes': {
        target: 'https://zenquotes.io/api/random', // The external API target
        changeOrigin: true, // Changes the origin header to match the target URL
        rewrite: (path) => path.replace(/^\/api-quotes/, ''), // Removes the custom prefix
        secure: true, // Use SSL/TLS
      },
    },
  },
  base: './',
});




// vite.config.js
//import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
//export default defineConfig({
  //plugins: [react()],
  //server: {
    // Crucial step to bypass CORS policy during development
    //proxy: {
      //'/api-quotes': {
        //target: 'https://zenquotes.io/api/random', // The external API target
        //changeOrigin: true, // Changes the origin header to match the target URL
        //rewrite: (path) => path.replace(/^\/api-quotes/, ''), // Removes the custom prefix
        //secure: true, // Use SSL/TLS
      //},
    //},
  //},
//});