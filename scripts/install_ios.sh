#!/bin/bash
set -e
set -x

name=$PROJECT_NAME
podfile="ios/Podfile"
target=$name
infoPlist="ios/$name/Info.plist"

# Function to add a pod entry within the target block if it does not exist
add_pod_to_target() {
    if ! grep -q "$1" "$podfile"; then
        echo "Adding $1 to target $target in Podfile"
        # Use awk to insert the pod lines within the target block
        awk -v podline="$1" -v target="$target" '
        $0 ~ "target \x27" target "\x27 do" {print; inBlock=1; next}
        inBlock && /end/ {print podline; print; inBlock=0; next}
        {print}
        ' "$podfile" > tmpfile && mv tmpfile "$podfile"
    else
        echo "$1 already in target $target in Podfile"
    fi
}

# Enable modular headers for all pods
echo "Enabling modular headers globally in Podfile"
if ! grep -q "use_modular_headers!" "$podfile"; then
    sed -i '' '1s/^/use_modular_headers!\n/' "$podfile"
fi

# Modify the podfile within the target
add_pod_to_target "  pod 'Firebase', :modular_headers => true"
add_pod_to_target "  pod 'FirebaseCore', :modular_headers => true"
add_pod_to_target "  pod 'GoogleUtilities', :modular_headers => true"

# Ensure RNFirebaseAsStaticFramework setting is added within the target block
add_pod_to_target "\$RNFirebaseAsStaticFramework = true"

# Check and add microphone usage description in Info.plist
if grep -q "<key>NSMicrophoneUsageDescription</key>" "$infoPlist"; then
    echo "Microphone already supported in $infoPlist, nothing to do here."
else
    echo "Adding NSMicrophoneUsageDescription to $infoPlist"
    plutil -insert NSMicrophoneUsageDescription -string 'Chat needs microphone to record messages' "$infoPlist"
fi

echo "Podfile configured for target $target"
echo "Info.plist configured for microphone support"
