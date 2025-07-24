import React, { useState, useCallback, useEffect, FC } from "react";
import styled from "styled-components";
import {debounce} from "lodash";
import { useTranslation } from "react-i18next";

import {
  DateTimePicker,
  TextAreaInput,
  TextInput,
} from "@components";

import { $cssTRBL, $uw } from "@theme";

/**
 * Interface per i risultati di Nominatim
 */
interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Props per il componente LocationSearchInput
 */
interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  style?: React.CSSProperties;
}

/**
 * LocationSearchInput Component
 * Encapsulates location lookup via OpenStreetMap Nominatim API with debounce.
 */
export const LocationSearchInput: FC<LocationSearchInputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  style,
}) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
          {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'YourAppName/1.0 (your.email@example.com)',
            },
          }
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data: LocationResult[] = await res.json();
        setResults(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchLocations(value);
    return () => fetchLocations.cancel();
  }, [value, fetchLocations]);

  return (
    <div className="location-field" style={style}>
      <TextInput
        name="location"
        textLabel={label}
        bgColor="light"
        value={value}
        onChange={(e) => onChange(e)}
        
      />
      {loading && <p>{t("loading")}</p>}
      {error && <p style={{ color: 'red' }}>{t("error")}: {error}</p>}
      {!loading && results.length > 0 && (
        <ul>
          {results.map((loc) => (
            <li key={loc.place_id}>
              <strong>{loc.display_name}</strong> (
              {loc.lat}, {loc.lon})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
