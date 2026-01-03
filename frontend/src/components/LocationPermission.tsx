import React, { useState } from 'react';
import { Language } from '../types';
import { Button } from './Button';
import { getCurrentLocation, isGeolocationSupported } from '../utils/location';

interface LocationPermissionProps {
  onLocationReceived: (lat: number, lng: number) => void;
  language: Language;
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
  onLocationReceived,
  language,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);

    if (!isGeolocationSupported()) {
      setError(
        language === 'hi'
          ? 'आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता'
          : 'Your browser does not support geolocation'
      );
      setLoading(false);
      return;
    }

    try {
      const location = await getCurrentLocation();
      onLocationReceived(location.lat, location.lng);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('denied')) {
        setError(
          language === 'hi'
            ? 'लोकेशन की अनुमति अस्वीकार की गई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।'
            : 'Location permission denied. Please enable in browser settings.'
        );
      } else {
        setError(
          language === 'hi'
            ? 'लोकेशन प्राप्त करने में त्रुटि। कृपया पुनः प्रयास करें।'
            : 'Error getting location. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleGetLocation}
        variant="outline"
        size="medium"
        fullWidth
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="animate-spin">⏳</span>
            <span className={language === 'hi' ? 'font-hindi' : ''}>
              {language === 'hi' ? 'लोकेशन प्राप्त कर रहे हैं...' : 'Getting location...'}
            </span>
          </span>
        ) : (
          <span className={language === 'hi' ? 'font-hindi' : ''}>
            📍 {language === 'hi' ? 'वर्तमान स्थान उपयोग करें' : 'Use Current Location'}
          </span>
        )}
      </Button>

      {error && (
        <div className={`text-sm text-red-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
          ⚠️ {error}
        </div>
      )}

      <p className={`text-xs text-gray-500 ${language === 'hi' ? 'font-hindi' : ''}`}>
        {language === 'hi'
          ? '📍 आपकी लोकेशन आस-पास के काम/मजदूर खोजने में मदद करेगी'
          : '📍 Your location helps find nearby jobs/workers'}
      </p>
    </div>
  );
};
