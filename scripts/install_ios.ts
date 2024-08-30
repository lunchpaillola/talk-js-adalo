import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

// Get environment variables
const projectPath = Deno.env.get("ADALO_APP_PROJECT_PATH") || "";
const projectName = Deno.env.get("ADALO_APP_PROJECT_NAME") || "";

if (!projectPath || !projectName) {
  throw new Error(
    "Environment variables ADALO_APP_PROJECT_PATH and ADALO_APP_PROJECT_NAME must be set"
  );
}

// Function to execute the `plutil` command
const runPlutilCommand = async (args: string[]) => {
  const td = new TextDecoder();
  const options = { args };
  const proc = await new Deno.Command("plutil", options).output();

  const out = td.decode(proc.stdout).trim();
  const err = td.decode(proc.stderr).trim();

  console.log("stdout:  ", out);
  if (err) {
    console.error("stderr:  ", err);
  }

  if (!proc.success) {
    throw new Error(`plutil failed with exit code ${proc.code}`);
  }
};

// Function to enable modular headers globally in the Podfile
async function enableModularHeaders(podfilePath: string) {
  let podfileContent = await Deno.readTextFile(podfilePath);

  if (!podfileContent.includes("use_modular_headers!")) {
    podfileContent = `use_modular_headers!\n${podfileContent}`;
    await Deno.writeTextFile(podfilePath, podfileContent.trim() + "\n");
    console.log("Enabled modular headers globally in Podfile");
  } else {
    console.log("Modular headers already enabled in Podfile");
  }
}

// Function to add a pod entry within the target block if it does not exist
async function addPodToTarget(podfilePath: string, podLine: string) {
  let podfileContent = await Deno.readTextFile(podfilePath);

  if (!podfileContent.includes(podLine)) {
    const targetBlockRegex = new RegExp(
      `target '${projectName}' do([\\s\\S]*?)end`,
      "m"
    );

    const updatedContent = podfileContent.replace(
      targetBlockRegex,
      (match, p1) => {
        return `target '${projectName}' do${p1}\n  ${podLine}\nend`;
      }
    );

    await Deno.writeTextFile(podfilePath, updatedContent.trim() + "\n");
    console.log(`Added ${podLine} to target ${projectName} in Podfile`);
  } else {
    console.log(
      `${podLine} already exists in target ${projectName} in Podfile`
    );
  }
}

// Function to check and add microphone usage description in Info.plist
async function addMicrophoneUsageDescription(infoPlistPath: string) {
  const td = new TextDecoder();
  const proc = await new Deno.Command("plutil", {
    args: ["-p", infoPlistPath],
  }).output();

  const plistContent = td.decode(proc.stdout);

  if (!plistContent.includes("NSMicrophoneUsageDescription")) {
    await runPlutilCommand([
      "-insert",
      "NSMicrophoneUsageDescription",
      "-string",
      "Chat needs microphone to record messages",
      infoPlistPath,
    ]);
    console.log("Added NSMicrophoneUsageDescription to Info.plist");
  } else {
    console.log("NSMicrophoneUsageDescription already exists in Info.plist");
  }
}

// Paths
const podfilePath = join(projectPath, "ios", "Podfile");
const infoPlistPath = join(projectPath, "ios", projectName, "Info.plist");

// Execute the functions
await enableModularHeaders(podfilePath);
await addPodToTarget(podfilePath, "  pod 'Firebase', :modular_headers => true");
await addPodToTarget(
  podfilePath,
  "  pod 'FirebaseCore', :modular_headers => true"
);
await addPodToTarget(
  podfilePath,
  "  pod 'GoogleUtilities', :modular_headers => true"
);
await addPodToTarget(podfilePath, "$RNFirebaseAsStaticFramework = true");
await addMicrophoneUsageDescription(infoPlistPath);

console.log(`Podfile configured for target ${projectName}`);
console.log(`Info.plist configured for microphone support`);
