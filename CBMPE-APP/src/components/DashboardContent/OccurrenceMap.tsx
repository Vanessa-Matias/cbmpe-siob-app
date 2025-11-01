// src/components/DashboardContent/OccurrenceMap.tsx (Versão Leaflet/OpenStreetMap)

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // O CSS já foi importado no App.css, mas a importação aqui é boa prática

// Centro aproximado de Recife, PE
const RECIFE_CENTER: LatLngExpression = [-8.0578, -34.8820];

// Interface das Ocorrências
interface OcorrenciaMap {
    id: string;
    latitude: string | number; 
    longitude: string | number; 
    status: string;
    tipo: string;
}

interface OccurrenceMapProps {
    occurrences: OcorrenciaMap[];
}

// -----------------------------------------------------
// Funções Auxiliares
// -----------------------------------------------------

// 1. Cria um ícone de marcador personalizado (necessário para o Leaflet funcionar bem no React)
const createMarkerIcon = (status: string) => {
    let color = '#3498db'; // Azul padrão

    switch (status) {
        case 'Em andamento':
            color = '#e74c3c'; // Vermelho
            break;
        case 'Pendente':
            color = '#f1c40f'; // Amarelo
            break;
        case 'Concluída':
            color = '#2ecc71'; // Verde
            break;
        default:
            color = '#95a5a6'; // Cinza
            break;
    }

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [24, 40],
        iconAnchor: [12, 40],
        popupAnchor: [0, -35]
    });
};

// 2. Componente para ajustar o centro do mapa dinamicamente
const MapViewAdjuster: React.FC<{ occurrences: OcorrenciaMap[] }> = ({ occurrences }) => {
    const map = useMap();

    useEffect(() => {
        const validCoords: LatLngExpression[] = occurrences
            .map(occ => {
                const lat = parseFloat(String(occ.latitude));
                const lng = parseFloat(String(occ.longitude));
                return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] as LatLngExpression : null;
            })
            .filter((coord): coord is LatLngExpression => coord !== null);

        if (validCoords.length > 0) {
            // Cria um limite (bounds) para incluir todos os pontos e ajusta o mapa
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, { padding: [20, 20] });
        } else {
            // Centraliza em Recife se não houver dados
            map.setView(RECIFE_CENTER, 12);
        }
    }, [map, occurrences]);

    return null;
};

// -----------------------------------------------------
// Componente Principal
// -----------------------------------------------------

const OccurrenceMap: React.FC<OccurrenceMapProps> = ({ occurrences }) => {

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <MapContainer 
                center={RECIFE_CENTER} 
                zoom={12} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
                // Opções para garantir a estabilidade do mapa
                maxZoom={19}
                minZoom={10}
            >
                {/* Camada base do mapa (OpenStreetMap é grátis e padrão) */}
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ajusta o zoom para focar nos marcadores */}
                <MapViewAdjuster occurrences={occurrences} />

                {/* Plotagem dos Marcadores de Ocorrência */}
                {occurrences.map((occ) => {
                    const lat = parseFloat(String(occ.latitude));
                    const lng = parseFloat(String(occ.longitude));

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const position: LatLngExpression = [lat, lng];
                        return (
                            <Marker
                                key={occ.id}
                                position={position}
                                icon={createMarkerIcon(occ.status)}
                            >
                                <Popup>
                                    **Ocorrência ID: {occ.id.slice(-4)}**<br/>
                                    Tipo: {occ.tipo}<br/>
                                    Status: {occ.status}
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default OccurrenceMap;