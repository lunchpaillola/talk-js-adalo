#!/bin/bash
set -e
set -x

rootGradleFile="android/build.gradle"
appGradleFile="android/app/build.gradle"
nl=$'\n'
androidManifestFile="android/app/src/main/AndroidManifest.xml"


# Function to update compileSdkVersion
update_compileSdkVersion() {
    sed -i "s/compileSdkVersion = [0-9]*/compileSdkVersion = 34/" "$rootGradleFile"
}

# Function to add resolutionStrategy in the app build.gradle
add_appResolutionStrategy() {
     resolutionStrategyLine="configurations.all {\\ \\${nl}  resolutionStrategy.force 'androidx.work:work-runtime:2.7.0'\\${nl}}\\${nl}"

    # Check if the line already exists
    if ! grep -q "resolutionStrategy.force 'androidx.work:work-runtime:2.7.0'" "$appGradleFile"; then
        # Insert the resolutionStrategy line after dependencies block
        sed -i "/android {/a \\
         $resolutionStrategyLine" "$appGradleFile"
    fi
}

# Function to add permissions in AndroidManifest.xml
add_permissions() {
    # Check if permissions already exist
    if ! grep -q "android.permission.MODIFY_AUDIO_SETTINGS" "$androidManifestFile"; then
        echo "Adding permissions to AndroidManifest.xml"
        sed -i "/android.permission.INTERNET/a\\
    <uses-permission android:name=\"android.permission.MODIFY_AUDIO_SETTINGS\"/>\\
    <uses-permission android:name=\"android.permission.RECORD_AUDIO\"/>" "$androidManifestFile"
    else
        echo "Permissions already exist in AndroidManifest.xml"
    fi
}

# Update compileSdkVersion
update_compileSdkVersion

# Add resolutionStrategy in the app build.gradle
add_appResolutionStrategy

# Add permissions in AndroidManifest.xml
add_permissions

echo "compileSdkVersion updated in $rootGradleFile"
echo "compileSdkVersion updated in $gradleFile"
echo "Permissions updated in $androidManifestFile"
