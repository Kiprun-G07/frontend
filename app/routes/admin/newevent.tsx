import { use } from "react";
import { useNavigate } from "react-router";
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

export default function newEvent() {
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        apiFetch('/api/events/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_name: (e.target as any).event_name.value,
                event_date: (e.target as any).event_date.value,
                event_description: (e.target as any).event_description.value,
                event_location: (e.target as any).event_location.value,
            }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to create event');
            // alert('Event created successfully');
            navigate('/admin/events');
        })
        .catch(err => alert(err.message));
    }
    return (<div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="event_name" className="block mb-1">Event Name</label>
          <input 
            id="event_name"
            name="event_name"
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div className="mb-3">
            <label htmlFor="event_date" className="block mb-1">Event Date</label>
            <input
                id="event_date"
                name="event_date"
                type="date"
                className="w-full border border-gray-300 px-3 py-2 rounded"
            />
        </div>
        <div className="mb-3">
            <label htmlFor="event_description" className="block mb-1">Event Description</label>
            <textarea
                id="event_description"
                name="event_description"
                className="w-full border border-gray-300 px-3 py-2 rounded"
            ></textarea>
        </div>  
        <div className="mb-3">
            <label htmlFor="event_location" className="block mb-1">Event Location</label>
            <input
                id="event_location"
                name="event_location"
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded"
            />  
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Event</button>
        </form>
    </div>);
}