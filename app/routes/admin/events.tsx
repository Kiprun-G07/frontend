import { use, useEffect } from "react";
import React, { useState } from "react";
import { Link } from "react-router";
import { apiFetch } from "~/lib/auth";

export function meta() {
  return [{ title: "Admin Events Management" }];
}

type Event = {
  id: number;
  event_name: string;
  event_date: string;
  event_description: string;
  event_location: string;
};

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => { 
        apiFetch('/api/events')
        .then(res => res.json())
        .then(data => setEvents(data))
        .catch(err => console.error('Failed to fetch events', err));
    }, []);

    function handleDelete(eventId: number) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        apiFetch('/api/events/' + eventId, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to delete event');
                setEvents(events.filter(event => event.id !== eventId));
            })
            .catch(err => alert(err.message));
      
    }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Events Management</h1>
      <div className="mb-4">
        <Link to="/admin/newevent" className="px-4 py-2 bg-green-600 text-white rounded">Create New Event</Link>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Event Name</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
        </thead>

        <tbody>
            {
              /* edit and delete events within the table */
              events.map((event: any) => (
                <tr key={event.id}>
                  <td className="border border-gray-300 px-4 py-2">{event.event_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(event.event_date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.event_description}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.event_location}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={'/admin/event/' + event.id} className="mr-2 mb-2 px-3 py-1 bg-blue-600 text-white rounded">Edit</Link>
                    <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(event.id)}>Delete</button>
                  </td>
                </tr>
              ))
            }
        </tbody>
      </table>
            
    </div>
  );
}