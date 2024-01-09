#!/bin/bash
set -e
set -x

rootGradleFile="android/build.gradle"
appGradleFile="android/app/build.gradle"
nl=$'\n'

# Function to update compileSdkVersion
update_compileSdkVersion() {
    sed -i "s/compileSdkVersion = [0-9]*/compileSdkVersion = 33/" "$rootGradleFile"
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

# Update compileSdkVersion
update_compileSdkVersion

# Add resolutionStrategy in the app build.gradle
add_appResolutionStrategy

echo "compileSdkVersion updated in $rootGradleFile"
echo "compileSdkVersion updated in $gradleFile"
