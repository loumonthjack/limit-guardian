import startMonitor from "./worker";
// import startServer from "./server";

const main = async () => {
  try {
    await startMonitor();
    // await startServer();
  } catch (error) {
    console.error("Error starting services", error);
    process.exit(1);
  }
};

main();
export { Guardian } from "./guardian.class";
export type { GuardianConfig, GuardianError } from "./types";
