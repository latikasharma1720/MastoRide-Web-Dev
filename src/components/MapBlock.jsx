// src/components/MapBlock.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// —— Fort Wayne, IN ——
const FTW = { lat: 41.0793, lng: -85.1394 };
const DEFAULT_ZOOM = 12;

// A generous bounding box around Fort Wayne (lon,lat)
const FTW_BBOX = {
  left: -85.30,
  top: 41.20,
  right: -84.95,
  bottom: 40.95,
};

// Simple SVG pin marker icons (no external images)
const createPin = (color = "#2E7D32") =>
  L.divIcon({
    className: "",
    iconSize: [28, 28],
    html: `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" fill="${color}" />
        <circle cx="12" cy="10" r="3.2" fill="#fff"/>
      </svg>
    `,
  });

const pickupIcon = createPin("#1E88E5"); // blue
const dropoffIcon = createPin("#E53935"); // red

// Free endpoints (no key): Nominatim + OSRM
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OSRM = "https://router.project-osrm.org/route/v1/driving";

// Ensure queries are biased to Fort Wayne, IN
function normalizeQuery(q) {
  if (!q) return "";
  const s = q.trim();
  if (!s) return "";
  const lower = s.toLowerCase();
  const hasCity =
    lower.includes("fort wayne") ||
    lower.includes("in ") ||
    lower.endsWith(" in") ||
    lower.includes("indiana");

  // If user did not specify city/state, append it
  if (!hasCity) {
    return `${s}, Fort Wayne, Indiana`;
  }
  return s;
}

async function geocode(address) {
  const q = normalizeQuery(address);
  if (!q || q.length < 3) return null;

  // Nominatim bbox constraint (left,top,right,bottom) + bounded=1
  const { left, top, right, bottom } = FTW_BBOX;
  const url =
    `${NOMINATIM}?format=json` +
    `&q=${encodeURIComponent(q)}` +
    `&limit=1` +
    `&viewbox=${left},${top},${right},${bottom}` +
    `&bounded=1` +
    `&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      // identify your app politely
      "Accept-Language": "en",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || !data[0]) return null;

  // Extra sanity check: if result is wildly outside bbox, ignore
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (lng < left || lng > right || lat < bottom || lat > top) {
    return null;
  }

  return { lat, lng };
}

async function routeCoords(a, b) {
  const url = `${OSRM}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const coords = data?.routes?.[0]?.geometry?.coordinates;
  if (!coords) return null;
  // convert [lng,lat] -> [lat,lng]
  return coords.map(([lng, lat]) => [lat, lng]);
}

export default function MapBlock({ pickupAddress, dropoffAddress }) {
  const mapRef = useRef(null);
  const mapElRef = useRef(null);
  const markersRef = useRef({ pickup: null, dropoff: null });
  const routeRef = useRef(null);

  const [pickupPoint, setPickupPoint] = useState(null);
  const [dropoffPoint, setDropoffPoint] = useState(null);

  // Mount Leaflet map once
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;
    const map = L.map(mapElRef.current, {
      center: [FTW.lat, FTW.lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    mapRef.current = map;
  }, []);

  // Geocode when addresses change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, d] = await Promise.all([
        geocode(pickupAddress),
        geocode(dropoffAddress),
      ]);
      if (cancelled) return;
      setPickupPoint(p || null);
      setDropoffPoint(d || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [pickupAddress, dropoffAddress]);

  // Update markers + route whenever points change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers/route
    if (markersRef.current.pickup) {
      map.removeLayer(markersRef.current.pickup);
      markersRef.current.pickup = null;
    }
    if (markersRef.current.dropoff) {
      map.removeLayer(markersRef.current.dropoff);
      markersRef.current.dropoff = null;
    }
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    // Add markers if available
    if (pickupPoint) {
      markersRef.current.pickup = L.marker(
        [pickupPoint.lat, pickupPoint.lng],
        { icon: pickupIcon }
      ).addTo(map);
    }
    if (dropoffPoint) {
      markersRef.current.dropoff = L.marker(
        [dropoffPoint.lat, dropoffPoint.lng],
        { icon: dropoffIcon }
      ).addTo(map);
    }

    // Fit/route logic
    (async () => {
      if (pickupPoint && dropoffPoint) {
        const bounds = L.latLngBounds(
          [pickupPoint.lat, pickupPoint.lng],
          [dropoffPoint.lat, dropoffPoint.lng]
        );
        map.fitBounds(bounds, { padding: [40, 40] });

        const coords = await routeCoords(pickupPoint, dropoffPoint);
        if (coords && coords.length) {
          routeRef.current = L.polyline(coords, { weight: 5 }).addTo(map);
        }
      } else if (pickupPoint) {
        map.setView([pickupPoint.lat, pickupPoint.lng], 15);
      } else if (dropoffPoint) {
        map.setView([dropoffPoint.lat, dropoffPoint.lng], 15);
      } else {
        // Fallback — Fort Wayne center
        map.setView([FTW.lat, FTW.lng], DEFAULT_ZOOM);
      }
    })();
  }, [pickupPoint, dropoffPoint]);

  return (
    <div
      ref={mapElRef}
      style={{
        height: 360,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 10px 24px rgba(0,0,0,.15)",
      }}
      aria-label="Pickup and drop-off map"
    />
  );
}
