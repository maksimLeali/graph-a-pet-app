import React, { useCallback, useEffect, useState, FC } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { debounce } from "lodash";
import { TextInput, Option as UIOption } from "@components";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import "leaflet/dist/leaflet.css";
import { $uw } from "@theme";
import { useGeolocation } from "@hooks";

// Correzione percorsi icone Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

interface NominatimResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, any>;
}

type Props = {
  onSelected: (option: UIOption | null) => void;
  changeLocationText: (value: string) => void;
  selectedLocation: UIOption | null;
};

// Centra la vista della mappa sui marker
const BoundsComponent: FC<{ positions: [number, number][] }> = ({
  positions,
}) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions as any, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

// Ricentra la mappa su coordinate dinamiche
const RecenterMap: FC<{
  lat?: number;
  lon?: number;
  zoom?: number;
}> = ({ lat, lon, zoom = 16 }) => {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) {
      map.setView([lat, lon], zoom);
    }
  }, [lat, lon, zoom, map]);
  return null;
};

export const LocationSelector: FC<Props> = React.memo(
  ({ onSelected, changeLocationText, selectedLocation }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState<string>("");
    const [options, setOptions] = useState<UIOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { coords, requestLocation } = useGeolocation({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    // Al mount chiedo permesso e coordinate
    useEffect(() => {
      requestLocation();
    }, []);

    // Debug
    useEffect(() => {
      console.log("User coords:", coords);
    }, [coords]);

    const handleChange = (v: string) => {
      setQuery(v);
      changeLocationText(v);
      onSelected(null);
      // qui potresti anche debounced fetch delle opzioni Nominatim…
    };

    const handleSelect = (opt: UIOption) => {
      onSelected(opt);
      changeLocationText(opt.label);
    };

    // Estrazione lat/lon dalle options per i marker
    const positions = options.map((opt) => {
      const [lat, lon] = opt.value.split(",").map(Number);
      return [lat, lon] as [number, number];
    });

    // Centro iniziale: primo marker o vista mondiale
    const center: [number, number] =
      positions.length > 0 ? positions[0] : [20, 0];

    // Solo per catturare click e loggare lat/lng
    const MapEvents = () => {
      useMapEvents({
        click(e) {
          console.log("Clicked at:", e.latlng);
        },
      });
      return null;
    };

    return (
      <Container>
        <SearchBar>
          <TextInput
            name="location"
            value={query}
            bgColor="light"
            onChange={(e) => handleChange(e)}
          />
        </SearchBar>

        {loading && <InfoText>{t("loading")}</InfoText>}
        {error && (
          <ErrorText>
            {t("error")}: {error}
          </ErrorText>
        )}

        {query.length > 1 && (
          <MapWrapper>
            <MapContainer
              center={center}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Ricentra su coords dell’utente appena disponibili */}
              {coords?.latitude != null && coords?.longitude != null && (
                <RecenterMap
                  lat={coords.latitude}
                  lon={coords.longitude}
                  zoom={16}
                />
              )}

              {options.map((opt) => {
                const [lat, lon] = opt.value.split(",").map(Number);
                return (
                  <Marker
                    key={opt.value}
                    position={[lat, lon]}
                    eventHandlers={{ click: () => handleSelect(opt) }}
                  >
                    <Popup>{opt.label}</Popup>
                  </Marker>
                );
              })}

              <BoundsComponent positions={positions} />
              <MapEvents />
            </MapContainer>
          </MapWrapper>
        )}
      </Container>
    );
  }
);

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: ${$uw(50)};
`;

const SearchBar = styled.div`
  padding: 8px;
  border-bottom: 1px solid #ccc;
`;

const MapWrapper = styled.div`
  flex: 1;
`;

const InfoText = styled.p`
  padding: 8px;
  font-size: 0.9rem;
`;

const ErrorText = styled(InfoText)`
  color: red;
`;
