import React, {
    FC,
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    CircleMarker,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { debounce } from "lodash";
import { TextInput, Option as UIOption } from "@components";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import "leaflet/dist/leaflet.css";
import { $cssTRBL, $uw } from "@theme";
import { useGeolocation } from "@hooks";
import { IonButton } from "@ionic/react";

// Configure Leaflet icons once
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type Location = {
    coordinates: { latitude: number; longitude: number };
    label: string;
};

// Recenter helper for dynamic center/zoom
const RecenterMap: FC<{ center: [number, number]; zoom: number }> = ({
    center,
    zoom,
}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
};

function useNominatimSearch(query: string) {
    const [options, setOptions] = useState<UIOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaces = useCallback(
        debounce(async (q: string) => {
            if (q.length < 2) {
                setOptions([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
                        q
                    )}`,
                    {
                        headers: {
                            "Accept-Language": "it",
                            "User-Agent":
                                "GraphAPet/1.0 (xmaksimlealix@gmail.com)",
                        },
                    }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as Array<{
                    display_name: string;
                    lat: string;
                    lon: string;
                }>;
                setOptions(
                    data.map((d) => ({
                        label: d.display_name,
                        value: `${d.lat},${d.lon}`,
                        fullItem: d,
                    }))
                );
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        fetchPlaces(query);
        return () => fetchPlaces.cancel();
    }, [query, fetchPlaces]);

    return { options, loading, error };
}

const MapEvents: FC<{
    onSelect: (data: Location | null) => void;
}> = ({ onSelect }) => {
    const map = useMapEvents({
        click: async ({ latlng }) => {
            try {
                const url = new URL(
                    "https://nominatim.openstreetmap.org/reverse"
                );
                url.searchParams.set("format", "json");
                url.searchParams.set("addressdetails", "1");
                url.searchParams.set("lat", latlng.lat.toString());
                url.searchParams.set("lon", latlng.lng.toString());

                const res = await fetch(url.toString(), {
                    headers: {
                        "Accept-Language": "it",
                        "User-Agent": "GraphAPet/1.0 (xmaksimlealix@gmail.com)",
                    },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const { address } = data;
                const city =
                    address.city || address.town || address.village || "—";
                const province = address.county || address.state || "—";
                const road = address.road;
                L.popup()
                    .setLatLng(latlng)
                    .setContent(
                        `<strong>${province}</strong><br/>${city} - ${road}`
                    )
                    .openOn(map);
                console.log(data);
                onSelect({
                    coordinates: {
                        latitude: latlng.lat,
                        longitude: latlng.lng,
                    },
                    label: `${province} ${city} - ${road}`,
                });
            } catch (err) {
                console.error("Reverse geocode failed:", err);
            }
        },
    });
    return null;
};

interface Props {
    onSelected: (opt: Location | null) => void;
    changeLocationText: (text: string) => void;
    onCancel: () => void;
    selectedLocation: Location | null;
}

export const LocationSelector: FC<Props> = React.memo(
    ({ onSelected, changeLocationText, onCancel, selectedLocation }) => {
        const { t } = useTranslation();
        const [selected, setSelected] = useState<Location | null>(
            selectedLocation
        );
        const [initPosition, setInitPosition] = useState<{
            latitude: number | null;
            longitude: number | null;
        } | null>(
            selectedLocation?.coordinates
                ? {
                      latitude: selectedLocation.coordinates.latitude,
                      longitude: selectedLocation.coordinates.longitude,
                  }
                : null
        );
        const [query, setQuery] = useState(selectedLocation?.label ?? "");
        const { options: searchOptions } = useNominatimSearch(query);
        const {
            coords,
            requestLocation,
            loading: geoLoading,
            error: geoError,
        } = useGeolocation({
            timeout: 10000,
        });

        const [mapZoom, setMapZoom] = useState<number>(10);
        const [showLocationWarning, setShowLocationWarning] = useState(false);

        useEffect(() => {
            requestLocation();
        }, []);

        // Check if we're in a secure context for geolocation
        const isSecureContext =
            window.isSecureContext ||
            window.location.protocol === "https:" ||
            window.location.hostname === "localhost";

        useEffect(() => {
            if (!isSecureContext) {
                setShowLocationWarning(true);
                console.warn(
                    "Geolocation requires HTTPS or localhost. Current protocol:",
                    window.location.protocol
                );
            }
        }, [isSecureContext]);

        // Center on geolocation when available
        useEffect(() => {
            console.log("Geolocation result:", coords, "Error:", geoError);

            if (geoError) {
                console.warn("Geolocation failed:", geoError);
                // Only set fallback position if we don't have any position yet
                if (!initPosition) {
                    setInitPosition({
                        latitude: 45.538353,
                        longitude: 10.219192,
                    });
                }
                return;
            }

            if (coords?.latitude && coords?.longitude) {
                console.log("Setting position from geolocation:", coords);
                setMapZoom(16);
                setInitPosition(coords);
            } else if (!initPosition) {
                // Set fallback only if we have no position and no coords
                setInitPosition({ latitude: 45.538353, longitude: 10.219192 });
            }
        }, [coords, geoError]);

        const options = useMemo(() => {
            const locOpts =
                initPosition && coords?.latitude && coords?.longitude
                    ? [
                          {
                              label: t("current_location", "Current Location"),
                              value: `${initPosition.latitude},${initPosition.longitude}`,
                              fullItem: null,
                          },
                      ]
                    : [];
            return [...locOpts, ...searchOptions];
        }, [initPosition, coords, searchOptions, t]);

        const mapCenter = useMemo((): [number, number] => {
            // Priority: selected location > user's geolocation > fallback
            if (selected?.coordinates) {
                return [
                    selected.coordinates.latitude,
                    selected.coordinates.longitude,
                ];
            }
            if (initPosition?.latitude && initPosition?.longitude) {
                return [initPosition.latitude, initPosition.longitude];
            }
            // Fallback to Northern Italy (Brescia area)
            return [45.538353, 10.219192];
        }, [selected, initPosition]);

        const handleChange = useCallback(
            (val: string) => {
                setQuery(val);
            },
            [onSelected]
        );

        return (
            <Container>
                <TextInput
                    name="location"
                    value={query}
                    bgColor="light"
                    onChange={handleChange}
                />

                {showLocationWarning && (
                    <InfoText style={{ color: "#ff6b35" }}>
                        {t(
                            "geolocation_https_warning",
                            "Location access requires HTTPS or localhost. Please use the search or click on the map to select a location."
                        )}
                    </InfoText>
                )}

                {geoError && !showLocationWarning && (
                    <ErrorText>
                        {t(
                            "geolocation_error",
                            "Unable to access your location. Please search for your location or click on the map."
                        )}
                    </ErrorText>
                )}

                <MapWrapper>
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <RecenterMap center={mapCenter} zoom={mapZoom} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {coords?.latitude && coords?.longitude && (
                            <>
                                <CircleMarker
                                    center={[coords.latitude, coords.longitude]}
                                    radius={14}
                                    pathOptions={{ fillOpacity: 0 }}
                                />
                                <CircleMarker
                                    center={[coords.latitude, coords.longitude]}
                                    radius={6}
                                    pathOptions={{ fillOpacity: 1 }}
                                />
                            </>
                        )}
                        {selected && (
                            <CircleMarker
                                center={[
                                    selected.coordinates.latitude,
                                    selected.coordinates.longitude,
                                ]}
                                radius={6}
                                pathOptions={{ fillOpacity: 1 }}
                                eventHandlers={{
                                    mouseover: (event) =>
                                        event.target.openPopup(),
                                }}
                            />
                        )}
                        <MapEvents
                            onSelect={(data) => {
                                console.log("data", data);
                                setQuery(data?.label ?? "");
                                setSelected(data);
                            }}
                        />
                    </MapContainer>
                </MapWrapper>
                <Actions>
                    <IonButton
                        fill="outline"
                        color="danger"
                        onClick={() => onCancel()}
                    >
                        {t("actions.cancel")}
                    </IonButton>
                    <IonButton
                        disabled={!selected}
                        color="primary"
                        onClick={() => {
                            onSelected(selected);
                        }}
                    >
                        {t("actions.confirm")}
                    </IonButton>
                </Actions>
            </Container>
        );
    }
);

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    height: min(${$uw(50)}, 80dvh);
    padding: ${$cssTRBL(0, 1, 1)};
`;

const MapWrapper = styled.div`
    flex: 1;
    margin-bottom: ${$uw(2)};
`;

const InfoText = styled.p`
    padding: 8px;
    font-size: 0.9rem;
`;

const ErrorText = styled(InfoText)`
    color: red;
`;

const Actions = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;
