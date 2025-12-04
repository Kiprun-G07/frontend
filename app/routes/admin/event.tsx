import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiFetch } from "~/lib/auth";

export function meta() {
    return [{ title: "Admin Event Management" }];
}

type EventType = {
    id: number;
    event_name: string;
    event_date: string;
    event_description: string;
    event_location: string;
};

export default function AdminEvent() {
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<EventType>({ id: 0, event_name: '', event_date: '', event_description: '', event_location: '' });

    const params = useParams();

    useEffect(() => {
        let mounted = true; 
        apiFetch('/api/events/' + params.id)
            .then(res => res.json())
            .then(data => { 
                if (mounted) {
                    setEvent(data); 
                    setLoading(false); 
                }
            });
        return () => { mounted = false };
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/api/events/' + event.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
            if (!res.ok) throw new Error('Failed to update event');
            alert('Event updated successfully');
        } catch (err: any) {
            alert(err?.message || 'Error updating event');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Manage Event: </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="event_name" className="block mb-1">Event Name</label>
                    <input
                        id="event_name"
                        name="event_name"
                        type="text"
                        value={event.event_name || ''}
                        onChange={(e) => setEvent({ ...event, event_name: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="event_date" className="block mb-1">Event Date</label>
                    <input
                        id="event_date"
                        name="event_date"
                        type="date"
                        value={event.event_date || ''}
                        onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="event_description" className="block mb-1">Event Description</label>
                    <textarea
                        id="event_description"
                        name="event_description"
                        value={event.event_description || ''}
                        onChange={(e) => setEvent({ ...event, event_description: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="event_location" className="block mb-1">Event Location</label>
                    <input
                        id="event_location"
                        name="event_location"
                        type="text"
                        value={event.event_location || ''}
                        onChange={(e) => setEvent({ ...event, event_location: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Update Event'}
                </button>
            </form>
        </div>
    );
}