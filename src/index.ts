import startMonitor from "./interfaces/worker";
// import startServer from "./interfaces/server";

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
export { Guardian } from "./main/guardian.class";
export type { GuardianConfig, GuardianError } from "./main/types";
