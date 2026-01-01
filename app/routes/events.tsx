import { useAuth } from "../lib/auth-context";
import { apiFetch } from "../lib/auth";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs"
import { Link } from "react-router";

export function meta() {
  return [{ title: "Events" }];
}

export default function Events() {
    const { user, loading, setUser } = useAuth(); 
    const [events, setEvents] = useState<any[]>([]);
    
    useEffect(() => {
        apiFetch('/api/events').then(async (res) => {
          if (res.ok) {
            const events = await res.json();
            setEvents(events);
          }
        }).catch((err) => {
          console.error('Failed to fetch user profile', err);
        });
    }, []);

    if (events.length > 0){ 
        return (
            <main className="px-15 py-12">
                {/* <section className="max-w-3xl mx-auto">
                    
                    <div className="mt-8">
                    Logged in as {user.name ?? user.email}
                    </div>
                </section> */}
                <div className="main-content grid grid-cols-3 gap-5 justify-center pb-12 ">
                    {/* <div className="content-card h-full  flex-1 flex-grow">
                    <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
                    <div className="text-xl font-medium">{events[0].event_name}</div>
                    <div className="font-medium text-gray-600 mb-6">{dayjs(events[0].event_date).format('ddd, MMM D, YYYY')}</div>

                    <div className="font-medium text-gray-600">{events[0].event_description}</div>

                    <div className="w-full h-50 bg-amber-100 my-6">

                    </div>

                    <div className="font-medium">6 hours</div>
                    </div>
                    <div className="content-card h-full  flex-1 flex-grow">
                    <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
                    <div className="text-xl font-medium">{events[1].event_name}</div>
                    <div className="font-medium text-gray-600 mb-6">{dayjs(events[1].event_date).format('ddd, MMM D, YYYY')}</div>

                    <div className="font-medium text-gray-600">{events[1].event_description}</div>

                    <div className="w-full h-50 bg-amber-100 my-6">

                    </div>

                    <div className="font-medium">6 hours</div>
                    </div>
                    <div className="content-card h-full  flex-1 flex-grow">
                    <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
                    <div className="text-xl font-medium">{events[2].event_name}</div>
                    <div className="font-medium text-gray-600 mb-6">{dayjs(events[2].event_date).format('ddd, MMM D, YYYY')}</div>

                    <div className="font-medium text-gray-600">{events[2].event_description}</div>

                    <div className="w-full h-50 bg-amber-100 my-6">

                    </div>

                    <div className="font-medium">6 hours</div>
                    </div> */}
                    {events.map((event) => (
                      <Link to={`/event/${event.id}`} className="content-card h-full item-card flex-1 flex-grow">
                        <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
                        <div className="text-xl font-medium">{event.event_name}</div>
                        <div className="font-medium text-gray-600 mb-6">{dayjs(event.event_date).format('ddd, MMM D, YYYY')}</div>

                        <div className="font-medium text-gray-600">{event.event_description}</div>

                        <div className="w-full min-h-50 bg-amber-100 my-6">
                          {event.event_image_url && (
                            <img src={event.event_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="font-medium">6 hours</div>
                      </Link>
                    ))}
                </div>
            </main>
        );
    } else {
        return <main className="p-6">Loading...</main>;
    }
}