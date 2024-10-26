'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl, { Map } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'

// Replace with your actual Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN'

// Define types for traffic and alert data
type TrafficData = {
    id: number
    location: [number, number]
    density: 'highx' | 'medium' | 'low'
}

type AlertType = {
    id: number
    message: string
    severity: 'high' | 'medium'
}

export default function Dashboard() {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const map = useRef<Map | null>(null)
    const [lng] = useState<number>(9.7068)
    const [lat] = useState<number>(4.0511)
    const [zoom] = useState<number>(12)
    const [trafficData, setTrafficData] = useState<TrafficData[]>([])
    const [alerts, setAlerts] = useState<AlertType[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (map.current) return // initialize map only once

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current as HTMLElement,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom,
            })

            // Simulate receiving traffic data
            const mockTrafficData: TrafficData[] = [
                { id: 1, location: [9.7068, 4.0511], density: 'high' },
                { id: 2, location: [9.7168, 4.0611], density: 'medium' },
                { id: 3, location: [9.7268, 4.0711], density: 'low' },
                { id: 3, location: [9.7269, 4.0811], density: 'low' },
            ]
            ²(mockTrafficData)

            // Simulate receiving alerts
            const mockAlerts: AlertType[] = [
                { id: 1, message: "Congestion detected at Carrefour Ndokoti", severity: "high" },
                { id: 2, message: "Moderate traffic on Axe Lourd", severity: "medium" },
            ]
            setAlerts(mockAlerts)
        } catch (err) {
            console.error("Error initializing map:", err)
            setError("An error occurred while initializing the map.")
        }
    }, [lng, lat, zoom])

    useEffect(() => {
        if (!map.current || trafficData.length === 0) return

        try {
            trafficData.forEach((point) => {
                const el = document.createElement('div')
                el.className = 'marker'
                el.style.backgroundColor = point.density === 'high' ? 'red' : point.density === 'medium' ? 'orange' : 'green'
                el.style.width = '20px'
                el.style.height = '20px'
                el.style.borderRadius = '50%'

                new mapboxgl.Marker(el)
                    .setLngLat(point.location)
                    .addTo(map.current as Map)
            })
        } catch (err) {
            console.error("Error adding markers:", err)
            setError("An error occurred while adding traffic markers.")
        }
    }, [trafficData])

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Traffic Optimization Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Douala Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div ref={mapContainer} className="map-container" style={{ height: '400px' }} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts and Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.map((alert) => (
                            <Alert key={alert.id} className="mb-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Traffic Alert</AlertTitle>
                                <AlertDescription>{alert.message}</AlertDescription>
                                <Badge variant={alert.severity === 'high' ? 'destructive' : 'default'} className="mt-2">
                                    {alert.severity === 'high' ? <AlertTriangle className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    {alert.severity === 'high' ? 'Critical' : 'Moderate'}
                                </Badge>
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
