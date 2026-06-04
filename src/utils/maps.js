import { Linking, Platform } from 'react-native';

export function openGoogleMaps(latitude, longitude, label) {
  const encoded = encodeURIComponent(label);

  const url = Platform.select({
    ios: `maps:0,0?q=${encoded}@${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encoded})`,
  });

  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      );
    }
  });
}
