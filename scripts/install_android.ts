import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { ensureDir, exists } from "https://deno.land/std@0.224.0/fs/mod.ts";

// Define paths to relevant files
const projectPath = Deno.env.get("ADALO_APP_PROJECT_PATH");
if (!projectPath) {
  throw new Error("ADALO_APP_PROJECT_PATH environment variable is not set");
}

const rootGradleFile = join(projectPath, "android/build.gradle");
const appGradleFile = join(projectPath, "android/app/build.gradle");
const androidManifestFile = join(
  projectPath,
  "android/app/src/main/AndroidManifest.xml"
);

// Ensure the directories exist
await ensureDir(join(projectPath, "android/app/src/main"));

// Function to create an empty file if it does not exist
async function createEmptyFile(filePath: string): Promise<void> {
  if (!(await exists(filePath))) {
    await Deno.writeTextFile(filePath, "");
    console.log(`Created empty file at: ${filePath}`);
  }
}

// Create necessary empty files if they do not exist
await createEmptyFile(rootGradleFile);
await createEmptyFile(appGradleFile);
await createEmptyFile(androidManifestFile);

// Function to update compileSdkVersion
async function updateCompileSdkVersion(): Promise<void> {
  let rootGradleContent = await Deno.readTextFile(rootGradleFile);
  rootGradleContent = rootGradleContent.replace(
    /compileSdkVersion = \d+/,
    "compileSdkVersion = 34"
  );
  await Deno.writeTextFile(rootGradleFile, rootGradleContent);
  console.log(`compileSdkVersion updated in ${rootGradleFile}`);
}

// Function to add resolutionStrategy in the app build.gradle
async function addAppResolutionStrategy(): Promise<void> {
  const resolutionStrategyLine = `
    configurations.all {
      resolutionStrategy.force 'androidx.work:work-runtime:2.7.0'
    }\n`;
  let appGradleContent = await Deno.readTextFile(appGradleFile);

  if (
    !appGradleContent.includes(
      "resolutionStrategy.force 'androidx.work:work-runtime:2.7.0'"
    )
  ) {
    appGradleContent = appGradleContent.replace(
      /android {\n/,
      `android {\n${resolutionStrategyLine}`
    );
    await Deno.writeTextFile(appGradleFile, appGradleContent);
    console.log(`Resolution strategy added to ${appGradleFile}`);
  } else {
    console.log(`Resolution strategy already exists in ${appGradleFile}`);
  }
}

// Function to add permissions in AndroidManifest.xml
async function addPermissions(): Promise<void> {
  let androidManifestContent = await Deno.readTextFile(androidManifestFile);
  if (
    !androidManifestContent.includes("android.permission.MODIFY_AUDIO_SETTINGS")
  ) {
    console.log("Adding permissions to AndroidManifest.xml");
    androidManifestContent = androidManifestContent.replace(
      /<uses-permission android:name="android.permission.INTERNET" \/>/,
      `$&\n<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n<uses-permission android:name="android.permission.RECORD_AUDIO" />`
    );
    await Deno.writeTextFile(androidManifestFile, androidManifestContent);
    console.log(`Permissions updated in ${androidManifestFile}`);
  } else {
    console.log("Permissions already exist in AndroidManifest.xml");
  }
}

// Execute the functions
await updateCompileSdkVersion();
await addAppResolutionStrategy();
await addPermissions();

console.log("Android configuration updated successfully.");
