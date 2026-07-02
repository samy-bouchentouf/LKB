import { exec } from "child_process";

export const runRag = (message) => {
  return new Promise((resolve, reject) => {
    exec(`python operators/run/run_rag.py "${message}"`, (error, stdout, stderr) => {

      // afficher erreur réelle
      if (error) {
        console.error("ERROR:", error);
        reject(error.message);
        return;
      }

      // afficher erreurs Python
      if (stderr) {
        console.error("STDERR:", stderr);
      }

      // afficher sortie Python
      console.log("STDOUT:", stdout);

      resolve(stdout);
    });
  });
};