import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiFetch } from "../lib/auth";
import dayjs from "dayjs";

export function meta() {
  return [{ title: "Event Details" }];
}   

export default function Event() {
    const [event, setEvent] = useState<any>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showJoinMessage, setShowJoinMessage] = useState(false);
    const [showCrewJoinMessage, setShowCrewJoinMessage] = useState(false);
    const [joinedEvent, setJoinedEvent] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);

    const [crewRole, setCrewRole] = useState("");

    const [user, setUser] = useState<any>(null);
    
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        apiFetch(`/api/events/${id}/attend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        setShowJoinMessage(true);
    }

    function handleJoinAsCrewMember(event: React.FormEvent) {
        event.preventDefault();
        apiFetch(`/api/events/${id}/join-crew`, {
            method: "POST",
            body: JSON.stringify({ role: crewRole }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        setShowCrewJoinMessage(true);
    }

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        async function load() {
            try {
                const res = await apiFetch(`/api/events/${id}`);
                const data = await res.json();
                if (!mounted) return;
                setEvent(data);

                const userRes = await apiFetch('/api/user');
                const userData = await userRes.json();
                if (!mounted) return;
                setUser(userData);

                const joinedRes = await apiFetch(`/api/events/${id}/joined`);
                const joinedData = await joinedRes.json();
                if (!mounted) return;
                setJoinedEvent(joinedData.is_either);

                setLoading(false);

            } catch (err) {
                console.error('Failed to load event', err);
                navigate('/');
            }
        }
        load();
        return () => { mounted = false };
    }, [id, navigate]);

    if (!event) return <main className="p-6">Loading event...</main>;
    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl mb-4">{event.event_name}</h1>
            <p className="mb-2 text-gray-700">{event.event_description}</p>
            <p className="text-sm text-gray-500">{dayjs(event.event_date).format('ddd, MMM D, YYYY')}</p>
            <p className="text-sm text-gray-500"><i>at</i> {event.event_location}</p>

            {!loading && joinedEvent  ? (
                <p className="mt-4 text-green-600">You have already joined this event, {user?.name || user?.email}!</p>
            ) : (
            <div>
                <div className="flex space-x-4 mt-6">
                    <form className="" onSubmit={handleSubmit}>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer">Join Event</button>  
                    </form>
                    
                    {/* tooltip showing that the event link is copied */}
                    <div className="relative">
                        <div id="tooltip" className="invisible absolute bg-black text-white text-xs rounded py-1 px-2 bottom-full mb-2">
                            Event link copied to clipboard!
                        </div>
                        <button
                            onClick={async () => {
                                await navigator.clipboard.writeText(window.location.href);
                                const tooltip = document.getElementById('tooltip');
                                if (tooltip) {
                                    tooltip.classList.remove('invisible');  
                                    setTimeout(() => {
                                        tooltip.classList.add('invisible');
                                    }, 2000);
                                }
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:cursor-pointer"
                        >
                            Share
                        </button>
                    </div>
                </div>
                

                {showJoinMessage && (
                    <p className="mt-4 text-green-600">You have successfully joined the event, {user?.name || user?.email}!</p>
                )}

                <form className="mt-6" onSubmit={handleJoinAsCrewMember}>
                    <div className="mb-6">
                    <label htmlFor="faculty" className="block mb-1">Or, join as a crew member</label>
                    <select
                        id="faculty"
                        name="faculty"
                        required
                        value={crewRole}
                        onChange={(e) => setCrewRole(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Crew Role</option>
                        <option value="Technical">Technical</option>
                        <option value="Protocol">Protocol</option>
                        <option value="Special Tasks">Special Tasks</option>
                        <option value="Multimedia">Multimedia</option>
                    </select>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:cursor-pointer">Join as Crew Member</button>

                    {showCrewJoinMessage && (
                        <p className="mt-4 text-green-600">You have successfully joined the event as a crew member!</p>
                    )}
                </form>
            </div>
            )}
        </main>
    );
}